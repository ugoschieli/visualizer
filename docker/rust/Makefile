.PHONY: build run clean

run: clean build
	docker run --rm -v ./artifact:/builder/artifact visualizer-rust

build:
	docker build -t visualizer-rust .

clean:
	rm -rf ./artifact
