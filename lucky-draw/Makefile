all:
	sails-js generate -n LuckyDraw ./wasm/*.idl

deploy:
	node ./deploy.mjs ./wasm/lucky_draw.idl ../target/wasm32-unknown-unknown/release/lucky_draw.opt.wasm
