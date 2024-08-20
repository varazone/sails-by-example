all:
	sails-js generate -n CounterProgram ./wasm/*.idl
	# esbuild lib.ts --outfile=lib.js

deploy:
	node ./deploy.mjs ./wasm/counter_with_event.idl ../target/wasm32-unknown-unknown/release/counter_with_event.opt.wasm
