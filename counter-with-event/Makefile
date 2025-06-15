all:
	npx -y sails-js-cli generate -y --no-project -n CounterProgram ../target/wasm32-gear/release/counter_with_event.idl
	deno fmt lib.ts
	# esbuild lib.ts --outfile=lib.js

build:
	cargo build --release

deploy:
	./deploy.ts testnet --release

interact:
	./interact.ts testnet

