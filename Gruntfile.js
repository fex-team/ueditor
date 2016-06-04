'use strict';

module.exports = function (grunt) {

    var fs = require("fs"),
        Util = {

            jsBasePath: '_src/',
            parseBasePath: '_parse/',
            cssBasePath: 'themes/default/_css/',

            fetchScripts: function (readFile, basePath) {

                var sources = fs.readFileSync(readFile);
                sources = /\[([^\]]+\.js'[^\]]+)\]/.exec(sources);
                sources = sources[1].replace(/\/\/.*\n/g, '\n').replace(/'|"|\n|\t|\s/g, '');
                sources = sources.split(",");
                sources.forEach(function (filepath, index) {
                    sources[ index ] = basePath + filepath;
                });

                return sources;
            },

            fetchStyles: function () {

                var sources = fs.readFileSync(this.cssBasePath + "ueditor.css"),
                    filepath = null,
                    pattern = /@import\s+([^;]+)*;/g,
                    src = [];

                while (filepath = pattern.exec(sources)) {
                    src.push(this.cssBasePath + filepath[ 1 ].replace(/'|"/g, ""));
                }

                return src;

            }

        },
        packageJson = grunt.file.readJSON('package.json'),
        server = grunt.option('server') || 'php',
        encode = grunt.option('encode') || 'utf8',
        disDir = "dist/",
        banner = '/*!\n * UEditor\n * version: ' + packageJson.name + '\n * build: <%= new Date() %>\n */\n\n';

    //init
    (function () {

        server = typeof server === "string" ? server.toLowerCase() : 'php';
        encode = typeof encode === "string" ? encode.toLowerCase() : 'utf8';

        disDir = 'dist/' + encode + '-' + server + '/';

    })();

    grunt.initConfig({
        pkg: packageJson,
        concat: {
            js: {
                options: {
                    banner: banner + '(function(){\n\n',
                    footer: '\n\n})();\n',
                    process: function (src, s) {
                        var filename = s.substr(s.indexOf('/') + 1);
                        return '// ' + filename + '\n' + src.replace('/_css/', '/css/') + '\n';
                    }
                },
                src: Util.fetchScripts("_examples/editor_api.js", Util.jsBasePath),
                dest: disDir + packageJson.name + '.all.js'
            },
            parse: {
                options: {
                    banner: banner + '(function(){\n\n',
                    footer: '\n\n})();\n'
                },
                src: Util.fetchScripts("ueditor.parse.js", Util.parseBasePath),
                dest: disDir + packageJson.name + '.parse.js'
            },
            css: {
                src: Util.fetchStyles(),
                dest: disDir + 'themes/default/css/ueditor.css'
            }
        },
        cssmin: {
            options: {
                banner: banner
            },
            files: {
                expand: true,
                cwd: disDir + 'themes/default/css/',
                src: ['*.css', '!*.min.css'],
                dest: disDir + 'themes/default/css/',
                ext: '.min.css'
            }
        },
        uglify: {
            options: {
                banner: banner
            },
            dest: {
                src: disDir + '<%= pkg.name %>.all.js',
                dest: disDir + '<%= pkg.name %>.all.min.js'
            },
            parse: {
                src: disDir + '<%= pkg.name %>.parse.js',
                dest: disDir + '<%= pkg.name %>.parse.min.js'
            }
        },
        copy: {
            base: {
                files: [
                    {

                        src: [ '*.html', 'themes/iframe.css', 'themes/default/dialogbase.css', 'themes/default/images/**', 'dialogs/**', 'lang/**', 'third-party/**' ],
                        dest: disDir

                    }
                ]
            },
            demo: {
                files: [
                    {
                        src: '_examples/completeDemo.html',
                        dest: disDir + 'index.html'
                    }
                ]
            },
            php: {

                expand: true,
                src: 'php/**',
                dest: disDir

            },
            asp: {

                expand: true,
                src: 'asp/**',
                dest: disDir

            },
            jsp: {

                expand: true,
                src: 'jsp/**',
                dest: disDir

            },
            net: {

                expand: true,
                src: 'net/**',
                dest: disDir

            }
        },
        transcoding: {

            options: {
                charset: encode
            },
            src: [disDir + '**/*.html', disDir + '**/*.js', disDir + '**/*.css', disDir + '**/*.json', disDir + '**/*.jsp', disDir + '**/*.asp']

        },
        replace: {

            fileEncode: {
                src: [ disDir + '**/*.html', disDir + 'dialogs/**/*.js', disDir + '**/*.css', disDir + '**/*.php', disDir + '**/*.jsp', disDir + '**/*.ashx', disDir + '**/*.asp' ],
                overwrite: true,
                replacements: [
                    {
                        from: /utf-8/gi,
                        to: 'gbk'
                    }
                ]
            },
            demo: {
                src: disDir + 'index.html',
                overwrite: true,
                replacements: [
                    {
                        from: /\.\.\//gi,
                        to: ''
                    },
                    {
                        from: 'editor_api.js',
                        to: packageJson.name + '.all.min.js'
                    }
                ]
            },
            gbkasp: {
                src: [ disDir + 'asp/*.asp' ],
                overwrite: true,
                replacements: [
                    {
                        from: /65001/gi,
                        to: '936'
                    }
                ]
            }

        },
        clean: {
            build: {
                src: [
                    disDir + "jsp/src",
                    disDir + "*/upload",
                    disDir + ".DS_Store",
                    disDir + "**/.DS_Store",
                    disDir + ".git",
                    disDir + "**/.git"
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-transcoding');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', 'UEditor build', function () {

        var tasks = [ 'concat', 'cssmin', 'uglify', 'copy:base', 'copy:' + server, 'copy:demo', 'replace:demo', 'clean' ];

        if (encode === 'gbk') {
            tasks.push('replace:fileEncode');
            if (server === 'asp') {
                tasks.push('replace:gbkasp');
            }
        }

        tasks.push('transcoding');

        //config修改
        updateConfigFile();

        grunt.task.run(tasks);

    });


    function updateConfigFile() {

        var filename = 'ueditor.config.js',
            file = grunt.file.read(filename),
            path = server + "/",
            suffix = server === "net" ? ".ashx" : "." + server;

        file = file.replace(/php\//ig, path).replace(/\.php/ig, suffix);

        if (encode == 'gbk') {
            file = file.replace(/utf-8/gi, 'gbk');
        }

        //写入到dist
        if (grunt.file.write(disDir + filename, file)) {

            grunt.log.writeln('config file update success');

        } else {
            grunt.log.warn('config file update error');
        }

    }

};
