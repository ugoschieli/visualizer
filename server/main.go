package main

import (
	"os"
	"visualizer-server/app"
	"visualizer-server/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	app.Init()
	defer app.Close()
	a := app.GetApp()

	err = os.MkdirAll(a.WorkDir, 0755)
	if err != nil {
		panic(err)
	}

	r := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	r.Use(cors.New(corsConfig))

	r.POST("/rust", handlers.RustHandler)
	r.Run()
}
