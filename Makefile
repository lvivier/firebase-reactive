
build: components
	@component build --dev

components:
	@component install --dev

test: components build
	@mocha-phantomjs -R spec test/index.html

clean:
	@rm -rf build components
