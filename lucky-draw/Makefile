all:
	sails-js generate -n CounterProgram ./wasm/*.idl

deploy:
	node ./deploy.mjs ./wasm/lucky_draw.idl ../target/wasm32-unknown-unknown/release/lucky_draw.opt.wasm
