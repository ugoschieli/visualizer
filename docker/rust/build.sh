#!/bin/sh
set -e
cargo build --target=wasm32-unknown-unknown --release
wasm-bindgen --target=web --out-dir=./artifact ./target/wasm32-unknown-unknown/release/visualizer_rust.wasm
