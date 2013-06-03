module.exports = function( grunt ){

    var meta = {
            pkg: grunt.file.readJSON( 'package.json' )
        },
        banner = [
            '/**',
            ' * UEditor',
            ' * @version 2.0.0',
            ' */',
            '',
            ''
        ];

    meta.buildInfo = (function(){

        var projectInfo = meta.pkg.projectInfo,
            sp = projectInfo.scripts.src.root,
            src = projectInfo.scripts.src.files;

        if( sp ) {

            src = sp + src.join( ',' + sp );

            src = src.split(',');

        }

        return {
            src: src,
            dest: projectInfo.scripts.dest + meta.pkg.project + '.js',
            destmin: projectInfo.scripts.dest + meta.pkg.project + '.min.js'
        }

    })();

    grunt.initConfig({

        meta: meta,
        concat: {
            options: {
                banner: banner.join('\n')
            },
            scripts: {
                src: '<%= meta.buildInfo.src %>',
                dest: '<%= meta.buildInfo.dest %>',
                filter: 'isFile'
            }
        },
        'uglify': {
            options: {
                banner: banner.join('\n')
            },
            'min': {
                files: {
                    '<%= meta.buildInfo.destmin %>': '<%= concat.scripts.dest %>'
                }
            }
        },
        less: {
            'build': {
                files: {
                    '<%= meta.pkg.projectInfo.styles.dest %><%= meta.pkg.project %>.css': '<%= meta.pkg.projectInfo.styles.src.files %>'
                }
            }
        }

    });


    var plugins = meta.pkg.devDependencies;

    for( var key in plugins ) {
        if( key.indexOf('grunt-contrib-') === 0 ) {
            grunt.loadNpmTasks( key );
        }
    }

    grunt.registerTask('default', ['concat', 'uglify', 'less']);

};