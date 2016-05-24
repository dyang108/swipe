#!/bin/bash
# ensure less is stylish
grunt lesslint
# to get really fancy, I should use Protractor http://www.protractortest.org/#/
jslint --config .jshintrc js/*.js *.js
grunt htmllint
