all:
	npx -y sails-js-cli generate -y --no-project -n Ss58Program ../target/wasm32-gear/release/ss58.idl
	deno fmt lib.ts
	# esbuild lib.ts --outfile=lib.js

deploy:
	./deploy.ts ../target/wasm32-gear/release/ss58.{idl,opt.wasm}
