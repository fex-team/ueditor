'use strict';

module.exports = function ( grunt ) {

    var fs = require("fs"),
        Util = {

            jsBasePath: '_src/',
            parseBasePath: '_parse/',
            cssBasePath: 'themes/default/_css/',

            fetchScripts: function ( readFile, basePath) {

                var sources = fs.readFileSync( readFile );
                sources = /\[([^\]]+\.js'[^\]]+)\]/.exec( sources );
                sources = sources[1].replace( /\/\/.*\n/g, '\n' ).replace( /'|"|\n|\t|\s/g, '' );
                sources = sources.split( "," );
                sources.forEach( function ( filepath, index ) {
                    sources[ index ] = basePath + filepath;
                } );

                return sources;
            },

            fetchStyles: function () {

                var sources = fs.readFileSync( this.cssBasePath + "ueditor.css" ),
                    filepath = null,
                    pattern = /@import\s+([^;]+)*;/g,
                    src = [];

                while ( filepath = pattern.exec( sources ) ) {
                    src.push( this.cssBasePath + filepath[ 1 ].replace( /'|"/g, "" ) );
                }

                return src;

            }

        },
        server = grunt.option('server') || 'php',
        encode = grunt.option('encode') || 'utf8',
        disDir = "dist/",
        banner = '/*!\n * UEditor\n * version: <%= pkg.version %>\n * build: <%= new Date() %>\n */\n\n';

    //init
    ( function () {

        server = typeof server === "string" ? server.toLowerCase() : 'php';
        encode = typeof encode === "string" ? encode.toLowerCase() : 'utf8';

        disDir = 'dist/' + encode + '-' + server + '/';

    } )();

    grunt.initConfig( {
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                options: {
                    banner: banner + '(function(){\n\n',
                    footer: '\n\n})()',
                    process: function(src) {
                        return src.replace('/_css/', '/css/');
                    }
                },
                src: Util.fetchScripts( "_examples/editor_api.js", Util.jsBasePath ),
                dest: disDir + '<%= pkg.name %>.all.js'
            },
            parse: {
                options: {
                    banner: banner + '(function(){\n\n',
                    footer: '\n\n})()'
                },
                src: Util.fetchScripts( "ueditor.parse.js", Util.parseBasePath ),
                dest: disDir + '<%= pkg.name %>.parse.js'
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
        'closure-compiler': {
            frontend: {
                closurePath: './closure-compiler',
                js: disDir + '<%= pkg.name %>.all.js',
                jsOutputFile: disDir + '<%= pkg.name %>.all.min.js',
                options: {
                    debug: false
                }
            },
            parse: {
                closurePath: './closure-compiler',
                js: disDir + '<%= pkg.name %>.parse.js',
                jsOutputFile: disDir + '<%= pkg.name %>.parse.min.js',
                options: {
                    debug: false
                }
            }
        },
        copy: {
            base: {
                files: [
                    {

                        src: [ 'themes/iframe.css', 'themes/default/dialogbase.css', 'themes/default/images/**', 'dialogs/**', 'lang/**', 'third-party/**' ],
                        dest: disDir

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
            src: [disDir + '**/*.html', disDir + '**/*.js', disDir + '**/*.css', disDir + '**/*.jsp', disDir + '**/*.java', disDir + '**/*.php', disDir + '**/*.asp', disDir + '**/*.ashx', disDir + '**/*.cs']

        }

    } );

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-transcoding');

    grunt.registerTask('default', 'UEditor build', function () {

        var tasks = [ 'concat', 'cssmin', 'closure-compiler', 'copy:base', 'copy:'+server, 'transcoding' ];

        //config修改
        updateConfigFile();

        grunt.task.run( tasks );

    } );


    function updateConfigFile () {

        var filename = 'ueditor.config.js',
            file = grunt.file.read( filename ),
            path = server + "/",
            suffix = server === "net" ? ".ashx" : "."+server;

        file = file.replace( /php\//ig, path ).replace( /\.php/ig, suffix );

        //写入到dist
        if ( grunt.file.write( disDir + filename, file ) ) {

            grunt.log.writeln( 'config file update success' );

        } else {
            grunt.log.warn('config file update error');
        }

    }

};