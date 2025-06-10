all:
	sails-js generate -n LuckyDrawProgram ./wasm/*.idl
	deno fmt lib.ts

deploy:
	node ./deploy.mjs ./wasm/lucky_draw.idl ../target/wasm32-gear/release/lucky_draw.opt.wasm
