all:
	npx -y sails-js-cli generate -y --no-project -n CounterProgram ../target/wasm32-gear/release/counter_with_event.idl
	deno fmt lib.ts
	# esbuild lib.ts --outfile=lib.js

deploy:
	npx -y esbuild postIDL.ts --outfile=postIDL.mjs
	deno fmt postIDL.mjs
	node ./deploy.mjs ../target/wasm32-gear/release/counter_with_event.{idl,opt.wasm}
