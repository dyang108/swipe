#!/bin/bash
npm install -g grunt --save-dev
npm install -g grunt-cli
npm install -g jslint
# ensure less is stylish
grunt lesslint
# to get really fancy, I should use Protractor http://www.protractortest.org/#/
jslint --config .jshintrc js/*.js *.js
grunt htmllint
