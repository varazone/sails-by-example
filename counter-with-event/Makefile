all:
	npx -y sails-js-cli generate -y --no-project -n CounterProgram ../target/wasm32-gear/release/counter_with_event.idl
	deno fmt lib.ts
	# esbuild lib.ts --outfile=lib.js

build:
	# build with release profile
	cargo build --release

deploy:
	# deploy release build to testnet and write result to config.yaml
	./deploy.ts --release --rpc wss://testnet.vara.network

interact:
	# interact with existing deployment in config.yaml
	./interact.ts

