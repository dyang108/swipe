module.exports = (grunt) ->
    grunt.loadNpmTasks('grunt-htmllint');
    grunt.initConfig
        lesslint:
            src: ['css/**/*.less']
            options:
                csslint:
                    'known-properties': false
                    'important': false
        htmllint: {
            template_lint: {
                options: {
                    force: false,
                    'attr-name-style': 'dash',
                    'id-class-style': false,
                    'attr-req-value': false,
                    'label-req-for': false,
                    plugins: []
                },
                src: ['**/*.html', '!node_modules/**/*.html']
            }
        },

    grunt.loadNpmTasks('grunt-lesslint')