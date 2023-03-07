.PHONY: install 

install: 
	yarn install

run-server: 
	node server.js

run-client:
	npx http-server