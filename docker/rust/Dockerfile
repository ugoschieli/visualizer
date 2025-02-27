FROM rust:1.83-alpine
WORKDIR /builder

RUN apk add musl-dev

RUN rustup target add wasm32-unknown-unknown
RUN cargo install wasm-bindgen-cli@0.2.99

COPY ./Cargo.toml ./Cargo.lock ./

# Cache dependencies
RUN sed -i 's#src/lib.rs#dummy.rs#' Cargo.toml
RUN touch dummy.rs
RUN cargo build --target=wasm32-unknown-unknown --release
RUN sed -i 's#dummy.rs#src/lib.rs#' Cargo.toml

COPY ./build.sh ./

CMD [ "./build.sh" ]
