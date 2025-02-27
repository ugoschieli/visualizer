package app

import (
	"context"
	"io"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/pkg/stdcopy"
)

// func (a *App) ContainerRun(ctx context.Context, config *container.Config, hostConfig *container.HostConfig) (container.CreateResponse, error) {
// 	var resp container.CreateResponse
//
// 	resp, err := a.Docker.ContainerCreate(ctx, config, hostConfig, nil, nil, "")
// 	if err != nil {
// 		return resp, err
// 	}
//
// 	err = a.Docker.ContainerStart(ctx, resp.ID, container.StartOptions{})
// 	if err != nil {
// 		return resp, err
// 	}
//
// 	return resp, nil
// }

func (a *App) ContainerRun(ctx context.Context, image string, binds []string) (container.CreateResponse, error) {
	var resp container.CreateResponse

	resp, err := a.Docker.ContainerCreate(
		ctx,
		&container.Config{Image: image},
		&container.HostConfig{
			AutoRemove: true,
			Binds:      binds,
		},
		nil, nil, "",
	)
	if err != nil {
		return resp, err
	}

	err = a.Docker.ContainerStart(ctx, resp.ID, container.StartOptions{})
	if err != nil {
		return resp, err
	}

	return resp, nil
}

func (a *App) ContainerWait(ctx context.Context, id string) (int64, error) {
	var statusCode int64

	statusCh, errCh := a.Docker.ContainerWait(ctx, id, container.WaitConditionNotRunning)
	select {
	case err := <-errCh:
		if err != nil {
			return statusCode, err
		}
	case status := <-statusCh:
		statusCode = status.StatusCode
	}

	return statusCode, nil
}

func (a *App) ContainerLogs(ctx context.Context, id string, dstout io.Writer, dsterr io.Writer) error {
	out, err := a.Docker.ContainerLogs(ctx, id, container.LogsOptions{ShowStdout: true, ShowStderr: true})
	if err != nil {
		return err
	}

	_, err = stdcopy.StdCopy(dstout, dsterr, out)
	if err != nil {
		return err
	}

	return nil
}
