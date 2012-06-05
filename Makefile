MOCHA=./node_modules/.bin/mocha

export NEO4J_URL=http://127.0.0.1:7474

test:
	@${MOCHA}

.PHONY: test