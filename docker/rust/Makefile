.PHONY: build run clean

run: clean build
	docker run --rm -v ./artifact:/builder/artifact rust-builder

build:
	docker build -t rust-builder .

clean:
	rm -rf ./artifact
