#!/bin/bash
npm install grunt --save-dev
npm install -g grunt
npm install -g grunt-cli
npm install -g jslint
npm install grunt-lesslint
npm install grunt-htmllint
# ensure less is stylish
grunt lesslint
# to get really fancy, I should use Protractor http://www.protractortest.org/#/
jslint --config .jshintrc js/*.js *.js
grunt htmllint
