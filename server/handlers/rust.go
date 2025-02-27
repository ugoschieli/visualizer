package handlers

import (
	"bytes"
	"context"
	"encoding/base64"
	"os"
	"visualizer-server/app"
	"visualizer-server/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Body struct {
	Src string `json:"src"`
}

func RustHandler(c *gin.Context) {
	a := app.GetApp()
	ctx := context.Background()
	var rust Body

	err := c.ShouldBindBodyWithJSON(&rust)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	u := uuid.New().String()
	path := a.WorkDir + "/rust/" + u
	err = os.MkdirAll(path, 0700)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	decoded, err := utils.B64Decode(rust.Src)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	err = os.WriteFile(path+"/lib.rs", decoded, 0644)
	if err != nil {
		panic(err)
	}

	// tree := a.RustParser.Parse(decoded, nil)
	// defer tree.Close()

	// path := "/Users/ugo/dev/visualizer-server/rust"
	resp, err := a.ContainerRun(
		ctx,
		"visualizer-rust",
		[]string{
			path + "/lib.rs:/builder/src/lib.rs",
			path + "/artifact:/builder/artifact",
		},
	)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	statusCode, err := a.ContainerWait(ctx, resp.ID)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	var stdErrBuf bytes.Buffer
	err = a.ContainerLogs(ctx, resp.ID, nil, &stdErrBuf)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}
	stdErr := stdErrBuf.String()
	encoded := base64.StdEncoding.EncodeToString([]byte(stdErr))

	if statusCode != 0 {
		c.JSON(500, gin.H{
			"status": "compilation_error",
			"code":   statusCode,
			"output": encoded,
		})
		return
	}

	jsBytes, err := os.ReadFile(path + "/artifact/visualizer_rust.js")
	if err != nil {
		c.AbortWithError(500, err)
		return
	}
	jsEncoded := utils.B64Encode(jsBytes)

	wasmBytes, err := os.ReadFile(path + "/artifact/visualizer_rust_bg.wasm")
	if err != nil {
		c.AbortWithError(500, err)
		return
	}
	wasmEncoded := utils.B64Encode(wasmBytes)

	c.JSON(200, gin.H{
		"status": "success",
		"output": encoded,
		"js":     jsEncoded,
		"wasm":   wasmEncoded,
	})
}
