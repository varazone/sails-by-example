all:
	sails-js generate --no-project -n CounterProgram ../target/wasm32-unknown-unknown/release/counter_event.idl
	deno fmt lib.ts
	# esbuild lib.ts --outfile=lib.js

deploy:
	# node ./deploy.mjs ./wasm/counter_with_event.idl ../target/wasm32-unknown-unknown/release/counter_with_event.opt.wasm
	node ./deploy.mjs ../target/wasm32-unknown-unknown/release/counter_event.{idl,opt.wasm}
