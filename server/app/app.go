package app

import (
	"os"

	docker "github.com/docker/docker/client"
	ts "github.com/tree-sitter/go-tree-sitter"
	ts_rust "github.com/tree-sitter/tree-sitter-rust/bindings/go"
)

type App struct {
	Docker     *docker.Client
	RustParser *ts.Parser
	WorkDir    string
}

var a App

func GetApp() *App {
	return &a
}

func Init() {
	workDir, ok := os.LookupEnv("WORK_DIR")
	if !ok {
		panic("ENV WORK_DIR not set")
	}

	d, err := docker.NewClientWithOpts(docker.FromEnv)
	if err != nil {
		panic(err)
	}

	p := ts.NewParser()
	err = p.SetLanguage(ts.NewLanguage(ts_rust.Language()))
	if err != nil {
		panic(err)
	}

	a.Docker = d
	a.RustParser = p
	a.WorkDir = workDir
}

func Close() {
	a.Docker.Close()
	a.RustParser.Close()
}
