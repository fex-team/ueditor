/*jshint boss: true, rhino: true */
/*globals JSHINT*/



(function (args) {
    var filenames = [],
        optstr, // arg1=val1,arg2=val2,...
        predef, // global1=override,global2,global3,...
        opts   = { rhino: true },
        retval = 0;
    load(args[0]+"jshint.js");
    
    for(var i=1;i<args.length;i++) {
    
        
        if (args[i].indexOf("=") > -1) {
            //first time it's the options
            if (!optstr) {
                optstr = args[i];
            } else if (!predef) {
                predef = args[i];
            }
        } else {
            filenames.push(args[i]);
        
        }
    }

    if (filenames.length === 0) {
        print('Usage: jshint.js file.js');
        quit(1);
    }

    if (optstr) {
        optstr.split(',').forEach(function (arg) {
            var o = arg.split('=');
            opts[o[0]] = (function (ov) {
                switch (ov) {
                case 'true':
                    return true;
                case 'false':
                    return false;
                default:
                    return ov;
                }
            }(o[1]));
        });
    }

    if (predef) {
        opts.predef = {};
        predef.split(',').forEach(function (arg) {
            var global = arg.split('=');
            opts.predef[global[0]] = (function (override) {
                return (override === 'false') ? false : true;
            }(global[1]));
        });
    }

    filenames.forEach(function (name) {

        var input = readFile(name);

        if (!input) {
            print('jshint: Couldn\'t open file ' + name);
            quit(1);
        }

        if (!JSHINT(input, opts)) {
            for (var i = 0, err; err = JSHINT.errors[i]; i += 1) {
                print(name+"***"+err.reason+"***"+err.line+"***"+err.character+"***"+err.evidence);
				//print(err.reason + ' (' + name + ':' + err.line + ':' + err.character + ')');
                //print('> ' + (err.evidence || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
                //print('');
				//print("===========");
				//print(err.evidence);
				//print(err.raw);
				//print(err.a);
				//print("===========");
				//var myReport = JSHINT.report(false);
				//print(myReport);
            }
            retval = 1;
        }
    });

    quit(retval);
}(arguments));
