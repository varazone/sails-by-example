all:
	npx -y sails-js-cli generate -y --no-project -n CounterProgram ../target/wasm32-gear/release/counter_with_event.idl
	deno fmt lib.ts
	# esbuild lib.ts --outfile=lib.js

deploy:
	./deploy.ts ../target/wasm32-gear/release/counter_with_event.{idl,opt.wasm}
