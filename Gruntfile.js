/*global module:false*/
module.exports = function(grunt) {
  var fs = require('fs'),
    path = require('path');

  function readJsList() {
    var jslist = fs.readFileSync('_examples/editor_api.js','utf8');
    jslist = jslist.match(/\[([^\]]+)\]/)[1].match(/'[^']+'/g);
    var content = [];
    for(var i= 0,ci;ci=jslist[i++];){
        grunt.log.writeln(ci.replace(/['"]/g,''));
        content.push(path.join('_src/', ci.replace(/['"]/g,'')));
    }
    grunt.log.writeln(content);
    return content;
  }

  function readCssList(theme){
    var content = [];
    var csslist = fs.readFileSync(path.join('themes/', theme, '/_css/ueditor.css'),'utf8');
    csslist = csslist.match(/\"([^\"]+)\"/g);
    for(var i= 0,ci;ci=csslist[i++];){
        grunt.log.writeln(ci.replace(/['"]/g,''));
        content.push(path.join('themes/', theme, '/_css/', ci.replace(/['"]/g,'')));
    }
    grunt.log.writeln(content);
    return content;
  }

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    jslist: readJsList(),
    csslist: readCssList('default'),

    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
      ' Licensed <%= pkg.license %> */\n',

    /*  Tasks */

    //clean build dir
    clean: {
      build: ['<%= pkg.dest %>']
    },

    copy: {
      //添加后台语言
      server_lang: {
        files: [
          {expand: true, cwd: './', src: ['<%= pkg.lang %>/**'], dest: '<%= pkg.dest %>'}
        ]
      },
      //添加语言
      front_lang: {
        files: [
          {expand: true, cwd: './', src: ['lang/**'], dest: '<%= pkg.dest %>'}
        ]
      },
      //添加dialog
      dialogs: {
        files: [
          {expand: true, cwd:'./', src: ['dialogs/**'], dest: '<%= pkg.dest %>'}
        ]
      },
      //添加config.js
      configjs: {
        files: [
          {expand: true, cwd:'./', src: ['ueditor.config.js'], dest: '<%= pkg.dest %>'}
        ]
      },
      //添加parse.js
      parsejs: {
         files: [
          {expand: true, cwd:'./', src: ['ueditor.parse.js'], dest: '<%= pkg.dest %>'}
        ]
      },
      //添加第三方插件
      third_party: {
         files: [
          {expand: true, cwd:'./', src: ['third-party/**'], dest: '<%= pkg.dest %>'}
        ]
      },
      //添加样式
      theme: {
        files: [
          {expand: true, cwd:'./', src: ['themes/<%= pkg.theme %>/**', '!**/_css/**'], dest: '<%= pkg.dest %>'}
        ]
      }
    },


    //合并js、css
    concat: {
      ueditorjs: {
        options: {
          banner: '(function(){\n',
          footer: '})();',
          stripBanners: true,
          process: function(src, filepath) {
            return src.replace('/_css/','/css/') ;
          }
        },
        src: ['<%= jslist %>'],
        dest: '<%= pkg.dest %>/<%= pkg.name %>.all.js'
      },
      ueditorcss: {
        src: ['<%= csslist %>'],
        dest: '<%= pkg.dest %>/themes/<%= pkg.theme %>/css/<%= pkg.name %>.css'
      }
    },

    //压缩js
    uglify: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      ueditorjs: {
        src: '<%= concat.ueditorjs.dest %>',
        dest: '<%= pkg.dest %>/<%= pkg.name %>.all.min.js'
      }
    },

    cssmin: {
      ueditorcss: {
        options: {
          banner: '<%= banner %>'
        },
        files: {
          '<%= pkg.dest %>/themes/<%= pkg.theme %>/css/<%= pkg.name %>.min.css': ['<%= concat.ueditorcss.dest %>']
        }
      }
    },

    connect: {
        server: {
          options: {
            port: 9001,
            base: './',
            keepalive: true
          }
        }
      },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.
  grunt.registerTask('default', ['clean', 'copy', 'concat', 'cssmin', 'uglify']);
 grunt.registerTask('server', ['connect']);
};
