all:
	npx -y sails-js-cli generate -y --no-project -n CounterProgram ../target/wasm32-gear/release/counter_with_event.idl
	deno fmt lib.ts
	# esbuild lib.ts --outfile=lib.js

deploy:
	./deploy.ts release testnet

build:
	cargo build --release
