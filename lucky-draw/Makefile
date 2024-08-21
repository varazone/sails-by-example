all:
	sails-js generate -n LuckyDrawProgram ./wasm/*.idl
	deno fmt lib.ts

deploy:
	node ./deploy.mjs ./wasm/lucky_draw.idl ../target/wasm32-unknown-unknown/release/lucky_draw.opt.wasm
