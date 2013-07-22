module( "EventBase" );

test( "addListener,fireEvent", function() {
    var editor = te.obj[1];
    var div = te.dom[0];
    expect(6);
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.focus();

        editor.addListener("event1", function () {
            ok(true, "listener1 is fired");
        });
        editor.addListener("event2", function () {
            ok(true, "listener2 is fired");
        });
        editor.fireEvent("event1");
        editor.fireEvent("event2");

        editor.fireEvent("event1 event2");
        var fun = function (type) {
            ok(true, type + " is fired");
        };
        editor.addListener("event3 event4 ", fun);
        editor.fireEvent("event3 event4 ");
        start();
    });
} );

test( "addListener,fireEvent --同一个侦听器绑定多个事件", function() {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render( div );
    expect( 2 );
    stop();
    editor.ready(function () {
        editor.focus();
        editor.addListener( "event1", function() {
            ok( true, "listener1 is fired" );
        } );
        editor.addListener( "event1", function() {
            ok( true, "listener2 is fired" );
        } );
        editor.fireEvent( "event1" );
        start();
    });
} );

test( "removeListener", function() {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render( div);
    expect(3);
    stop();
    editor.ready(function () {
        editor.focus();
        function fun1() {
            ok(true, "listener1 is fired");
        }

        function fun2() {
            ok(true, "listener2 is fired");
        }

        editor.addListener("event1", fun1);
        editor.addListener("event1", fun2);
        editor.fireEvent("event1");

        editor.removeListener("event1", fun1);
        editor.fireEvent("event1");

        function fun(type) {
            ok(true, type + " is fired");
        }

        editor.addListener("event3 event4 ", fun);
        editor.removeListener("event3 event4 ", fun);
        editor.fireEvent("event3 event4 ");
        start();
    });
} );


test( "fireEvent--nolisteners", function() {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.focus();
        function fun1() {
            ok(true, "listener1 is fired");
        }

        editor.fireEvent("event1");//no listener is fired
        editor.addListener("event1", fun1);
        editor.fireEvent("event1");//listener1 and listener2 are both fired
        start();
    });
} );

