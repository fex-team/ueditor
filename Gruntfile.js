/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
      ' Licensed <%= pkg.license %> */\n',

    dev_dest:'dev',  //开发环境
    build_dest: 'build',  //生产环境

    /*  Tasks */

    //clean dest dir
    clean: {
      dev: ['<%=  dev_dest %>'],
      build: ['<%=  build_dest %>']
    },

    copy_files: [
      //添加后台语言
      'php/**',
      'net/**',
      'jsp/**',

      //添加语言
      'lang/**',
      'dialogs/**',  //添加dialog
      'ueditor.config.js',  //添加config.js
      'ueditor.parse.js',  //添加parse.js
      'third-party/**',  //添加第三方插件

      //添加theme
      'themes/default/**', 
      '!**/_css/**',

      //添加bootstrap
      'bootstrap/**', 
      '!bootstrap/img/**',

      //添加font-awesome
      'font-awesome/**', 
      '!font-awesome/less/**'
    ],
    //copy静态文件
    copy: {
      build: {
        files: [
            {expand: true, src: ['<%= copy_files %>'], dest: '<%= build_dest %>'}
        ]
      },
      dev: {
        files: [
            {expand: true, src: ['<%= copy_files %>'], dest: '<%= dev_dest %>'}
        ]
      }
    },

    scripts: [
        "_src/editor.js",
        "_src/core/browser.js",
        "_src/core/utils.js",
        "_src/core/EventBase.js",
        "_src/core/dtd.js",
        "_src/core/domUtils.js",
        "_src/core/Range.js",
        "_src/core/Selection.js",
        "_src/core/Editor.js",
        "_src/core/ajax.js",
        "_src/core/filterword.js",
        "_src/core/node.js",
        "_src/core/htmlparser.js",
        "_src/core/filternode.js",
        "_src/plugins/basestyle.js",
        "_src/plugins/inserthtml.js",
        "_src/plugins/list.js",
        "_src/plugins/font.js",
        "_src/plugins/table.core.js",
        "_src/plugins/table.cmds.js",
        "_src/plugins/table.action.js",
        "_src/ui/widget.js",
        "_src/ui/jq.extend.js",
        "_src/ui/button.js",
        "_src/ui/toolbar.js",
        "_src/ui/menu.js",
        "_src/ui/dropmenu.js",
        "_src/ui/contextmenu.js",
        "_src/ui/splitbutton.js",
        "_src/ui/popup.js",
        "_src/ui/colorpicker.js",
        "_src/ui/tablepicker.js",
        "_src/ui/combobox.js",
        "_src/ui/modal.js",
        "_src/ui/tooltip.js",
        "_src/ui/tab.js",
        "_src/adapter/adapter.js",
        "_src/adapter/button.js",
        "_src/adapter/list.js",
        "_src/adapter/tablepicker.js",
        "_src/adapter/fontfamily.js",
        "_src/adapter/fontsize.js",
        "_src/adapter/forecolor.js",
        "_src/adapter/backcolor.js"
    ],
    //合并js
    concat: {
      options: {
        banner: '(function(){\n',
        footer: '})();',
        stripBanners: true,
        process: function(src, filepath) {
          return src.replace('/_css/','/css/') ;
        }
      },
      build: {
          src: ['<%= scripts %>'], 
          dest: '<%= build_dest %>/<%= pkg.name %>.all.js'
      },
      dev: {
          src: ['<%= scripts %>'],
          dest: '<%= dev_dest %>/<%= pkg.name %>.all.js'
      }
    },

    //合并、编译css
    recess: {
      dist: {
        options: {
            compile: true,
            compress:true
        },
        files: {
            '<%= build_dest %>/themes/default/css/<%= pkg.name %>.min.css': ['themes/default/_css/ueditor.less']
        }
      }
    },

    //压缩js
    uglify: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: '<%= concat.build.dest %>',
        dest: '<%= build_dest %>/<%= pkg.name %>.all.min.js'
      }
    },

    connect: {
        server: {
          options: {
            port: 9000,
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
        undef: false,
        unused: false,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: ['_src/**/**'],
        tasks: ['concat:dev']
      },
      themes: {
        files: ['themes/**/**'],
        tasks: ['copy:dev', 'recess']
      },
      stuff: {
        files: ['*.js', 'lang/**', 'bootstrap/**', 'dialogs/**', 'font-awesome/**', 'jsp/**', 'php/**', 'net/**', 'themes/**', 'third-party/**'],
        tasks: ['copy:dev', 'recess']
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
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-recess');

  // Default task.
  grunt.registerTask('dev', ['clean:dev', 'copy:dev', 'concat:dev', 'recess']);
  grunt.registerTask('build', ['clean:build', 'copy:build', 'concat:build', 'uglify', 'recess']);
  grunt.registerTask('default', ['build', 'dev']);
  grunt.registerTask('server', ['connect']);
};
