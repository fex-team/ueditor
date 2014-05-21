/**
 * 测试用例库文件，提供如event mock、iframe封装等各种常用功能 部分方法来源于YUI测试框架
 */
UserAction = {
    beforedispatch:null,
//    flag : true,
    isf /* is function ? */:function (value) {
        return value && (typeof value == 'function');
    },
    isb /* is boolean? */:function (value) {
        return value && (typeof value == 'boolean');
    },
    iso /* is object? */:function (value) {
        return value && (typeof value == 'object');
    },
    iss /* is string? */:function (value) {
        return value && (typeof value == 'string');
    },
    isn /* is number? */:function (value) {
        return value && (typeof value == 'number');
    },
    // --------------------------------------------------------------------------
    // Generic event methods
    // --------------------------------------------------------------------------

    /**
     * Simulates a key event using the given event information to populate the
     * generated event object. This method does browser-equalizing calculations
     * to account for differences in the DOM and IE event models as well as
     * different browser quirks. Note: keydown causes Safari 2.x to crash.
     *
     * @method simulateKeyEvent
     * @private
     * @static
     * @param {HTMLElement}
        *            target The target of the given event.
     * @param {String}
        *            type The type of event to fire. This can be any one of the
     *            following: keyup, keydown, and keypress.
     * @param {Boolean}
        *            bubbles (Optional) Indicates if the event can be bubbled up.
     *            DOM Level 3 specifies that all key events bubble by default.
     *            The default is true.
     * @param {Boolean}
        *            cancelable (Optional) Indicates if the event can be canceled
     *            using preventDefault(). DOM Level 3 specifies that all key
     *            events can be cancelled. The default is true.
     * @param {Window}
        *            view (Optional) The view containing the target. This is
     *            typically the window object. The default is window.
     * @param {Boolean}
        *            ctrlKey (Optional) Indicates if one of the CTRL keys is
     *            pressed while the event is firing. The default is false.
     * @param {Boolean}
        *            altKey (Optional) Indicates if one of the ALT keys is pressed
     *            while the event is firing. The default is false.
     * @param {Boolean}
        *            shiftKey (Optional) Indicates if one of the SHIFT keys is
     *            pressed while the event is firing. The default is false.
     * @param {Boolean}
        *            metaKey (Optional) Indicates if one of the META keys is
     *            pressed while the event is firing. The default is false.
     * @param {int}
        *            keyCode (Optional) The code for the key that is in use. The
     *            default is 0.
     * @param {int}
        *            charCode (Optional) The Unicode code for the character
     *            associated with the key being used. The default is 0.
     */
    simulateKeyEvent:function (target /* :HTMLElement */, type /* :String */, bubbles /* :Boolean */, cancelable /* :Boolean */, view /* :Window */, ctrlKey /* :Boolean */, altKey /* :Boolean */, shiftKey /* :Boolean */, metaKey /* :Boolean */, keyCode /* :int */, charCode /* :int */) /* :Void */ {
        // check target
        target = typeof target == 'string' ? document.getElementById(target)
            : target;
        if (!target) {
            throw new Error("simulateKeyEvent(): Invalid target.");
        }

        // check event type
        if (typeof type == 'string') {
            type = type.toLowerCase();
            switch (type) {
                case "compositionend":
                case "compositionstart":
                case "paste":
                case "cut":
                case "keyup":
                case "keydown":
                case "keypress":
                    break;
                case "textevent": // DOM Level 3
                    type = "keypress";
                    break;
                // @TODO was the fallthrough intentional, if so throw error
                default:
                    throw new Error("simulateKeyEvent(): Event type '" + type
                        + "' not supported.");
            }
        } else {
            throw new Error("simulateKeyEvent(): Event type must be a string.");
        }

        // setup default values
        if (!this.isb(bubbles)) {
            bubbles = true; // all key events bubble
        }
        if (!this.isb(cancelable)) {
            cancelable = true; // all key events can be cancelled
        }
        if (!this.iso(view)) {
            view = window; // view is typically window
        }
        if (!this.isb(ctrlKey)) {
            ctrlKey = false;
        }
        if (!this.isb(typeof altKey == 'boolean')) {
            altKey = false;
        }
        if (!this.isb(shiftKey)) {
            shiftKey = false;
        }
        if (!this.isb(metaKey)) {
            metaKey = false;
        }
        if (!(typeof keyCode == 'number')) {
            keyCode = 0;
        }
        if (!(typeof charCode == 'number')) {
            charCode = 0;
        }

        // try to create a mouse event
        var customEvent /* :MouseEvent */ = null;

        // check for DOM-compliant browsers first
        if (this.isf(document.createEvent)) {

            try {

                // try to create key event
                customEvent = document.createEvent("KeyEvents");

                /*
                 * Interesting problem: Firefox implemented a non-standard
                 * version of initKeyEvent() based on DOM Level 2 specs. Key
                 * event was removed from DOM Level 2 and re-introduced in DOM
                 * Level 3 with a different interface. Firefox is the only
                 * browser with any implementation of Key Events, so for now,
                 * assume it's Firefox if the above line doesn't error.
                 */
                // TODO: Decipher between Firefox's implementation and a correct
                // one.
                customEvent.initKeyEvent(type, bubbles, cancelable, view,
                    ctrlKey, altKey, shiftKey, metaKey, keyCode, charCode);

            } catch (ex /* :Error */) {

                /*
                 * If it got here, that means key events aren't officially
                 * supported. Safari/WebKit is a real problem now. WebKit 522
                 * won't let you set keyCode, charCode, or other properties if
                 * you use a UIEvent, so we first must try to create a generic
                 * event. The fun part is that this will throw an error on
                 * Safari 2.x. The end result is that we need another
                 * try...catch statement just to deal with this mess.
                 */
                try {

                    // try to create generic event - will fail in Safari 2.x
                    customEvent = document.createEvent("Events");

                } catch (uierror /* :Error */) {

                    // the above failed, so create a UIEvent for Safari 2.x
                    customEvent = document.createEvent("UIEvents");

                } finally {

                    customEvent.initEvent(type, bubbles, cancelable);

                    // initialize
                    customEvent.view = view;
                    customEvent.altKey = altKey;
                    customEvent.ctrlKey = ctrlKey;
                    customEvent.shiftKey = shiftKey;
                    customEvent.metaKey = metaKey;
                    customEvent.keyCode = keyCode;
                    customEvent.charCode = charCode;

                }

            }

            // before dispatch
            if (this.beforedispatch && typeof this.beforedispatch == 'function')
                this.beforedispatch(customEvent);
            this.beforedispatch = null;

            // fire the event
            target.dispatchEvent(customEvent);

        } else if (this.iso(document.createEventObject)) { // IE

            // create an IE event object
            customEvent = document.createEventObject();

            // assign available properties
            customEvent.bubbles = bubbles;
            customEvent.cancelable = cancelable;
            customEvent.view = view;
            customEvent.ctrlKey = ctrlKey;
            customEvent.altKey = altKey;
            customEvent.shiftKey = shiftKey;
            customEvent.metaKey = metaKey;

            /*
             * IE doesn't support charCode explicitly. CharCode should take
             * precedence over any keyCode value for accurate representation.
             */
            customEvent.keyCode = (charCode > 0) ? charCode : keyCode;

            // before dispatch
            if (this.beforedispatch && typeof this.beforedispatch == 'function')
                this.beforedispatch(customEvent);
            this.beforedispatch = null;

            // fire the event
            target.fireEvent("on" + type, customEvent);

        } else {
            throw new Error(
                "simulateKeyEvent(): No event simulation framework present.");
        }

        this.beforedispatch = null;
    },

    /**
     * Simulates a mouse event using the given event information to populate the
     * generated event object. This method does browser-equalizing calculations
     * to account for differences in the DOM and IE event models as well as
     * different browser quirks.
     *
     * @method simulateMouseEvent
     * @private
     * @static
     * @param {HTMLElement}
        *            target The target of the given event.
     * @param {String}
        *            type The type of event to fire. This can be any one of the
     *            following: click, dblclick, mousedown, mouseup, mouseout,
     *            mouseover, and mousemove.
     * @param {Boolean}
        *            bubbles (Optional) Indicates if the event can be bubbled up.
     *            DOM Level 2 specifies that all mouse events bubble by default.
     *            The default is true.
     * @param {Boolean}
        *            cancelable (Optional) Indicates if the event can be canceled
     *            using preventDefault(). DOM Level 2 specifies that all mouse
     *            events except mousemove can be cancelled. The default is true
     *            for all events except mousemove, for which the default is
     *            false.
     * @param {Window}
        *            view (Optional) The view containing the target. This is
     *            typically the window object. The default is window.
     * @param {int}
        *            detail (Optional) The number of times the mouse button has
     *            been used. The default value is 1.
     * @param {int}
        *            screenX (Optional) The x-coordinate on the screen at which
     *            point the event occured. The default is 0.
     * @param {int}
        *            screenY (Optional) The y-coordinate on the screen at which
     *            point the event occured. The default is 0.
     * @param {int}
        *            clientX (Optional) The x-coordinate on the client at which
     *            point the event occured. The default is 0.
     * @param {int}
        *            clientY (Optional) The y-coordinate on the client at which
     *            point the event occured. The default is 0.
     * @param {Boolean}
        *            ctrlKey (Optional) Indicates if one of the CTRL keys is
     *            pressed while the event is firing. The default is false.
     * @param {Boolean}
        *            altKey (Optional) Indicates if one of the ALT keys is pressed
     *            while the event is firing. The default is false.
     * @param {Boolean}
        *            shiftKey (Optional) Indicates if one of the SHIFT keys is
     *            pressed while the event is firing. The default is false.
     * @param {Boolean}
        *            metaKey (Optional) Indicates if one of the META keys is
     *            pressed while the event is firing. The default is false.
     * @param {int}
        *            button (Optional) The button being pressed while the event is
     *            executing. The value should be 0 for the primary mouse button
     *            (typically the left button), 1 for the terciary mouse button
     *            (typically the middle button), and 2 for the secondary mouse
     *            button (typically the right button). The default is 0.
     * @param {HTMLElement}
        *            relatedTarget (Optional) For mouseout events, this is the
     *            element that the mouse has moved to. For mouseover events,
     *            this is the element that the mouse has moved from. This
     *            argument is ignored for all other events. The default is null.
     */
    simulateMouseEvent:function (target /* :HTMLElement */, type /* :String */, bubbles /* :Boolean */, cancelable /* :Boolean */, view /* :Window */, detail /* :int */, screenX /* :int */, screenY /* :int */, clientX /* :int */, clientY /* :int */, ctrlKey /* :Boolean */, altKey /* :Boolean */, shiftKey /* :Boolean */, metaKey /* :Boolean */, button /* :int */, relatedTarget /* :HTMLElement */,button) /* :Void */ {

        // check target
        target = typeof target == 'string' ? document.getElementById(target)
            : target;
        if (!target) {
            throw new Error("simulateMouseEvent(): Invalid target.");
        }

        // check event type
        if (this.iss(type)) {
            type = type.toLowerCase();
            switch (type) {
                case "mouseover":
                case "mouseout":
                case "mousedown":
                case "mouseup":
                case "click":
                case "dblclick":
                case "mousemove":
                case "mouseenter":// 非标准支持，仅为测试提供，该项仅IE下work
                case "mouseleave":
                case "contextmenu":
                case "dragend":
                case "blur":
                    break;
                default:
                    throw new Error("simulateMouseEvent(): Event type '" + type
                        + "' not supported.");
            }
        } else {
            throw new Error(
                "simulateMouseEvent(): Event type must be a string.");
        }

        // setup default values
        if (!this.isb(bubbles)) {
            bubbles = true; // all mouse events bubble
        }
        if (!this.isb(cancelable)) {
            cancelable = (type != "mousemove"); // mousemove is the only one
            // that can't be cancelled
        }
        if (!this.iso(view)) {
            view = window; // view is typically window
        }
        if (!this.isn(detail)) {
            detail = 1; // number of mouse clicks must be at least one
        }
        if (!this.isn(screenX)) {
            screenX = 0;
        }
        if (!this.isn(screenY)) {
            screenY = 0;
        }
        if (!this.isn(clientX)) {
            clientX = 0;
        }
        if (!this.isn(clientY)) {
            clientY = 0;
        }
        if (!this.isb(ctrlKey)) {
            ctrlKey = false;
        }
        if (!this.isb(altKey)) {
            altKey = false;
        }
        if (!this.isb(shiftKey)) {
            shiftKey = false;
        }
        if (!this.isb(metaKey)) {
            metaKey = false;
        }
        if (!this.isn(button)) {
            button = 0;
        }
        // try to create a mouse event
        var customEvent /* :MouseEvent */ = null;

        // check for DOM-compliant browsers first
        if (this.isf(document.createEvent)) {

            customEvent = document.createEvent("MouseEvents");
            // Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
            if (this.browser.ie < 9 && customEvent.initMouseEvent) {

                customEvent.initMouseEvent(type, bubbles, cancelable, view,
                    detail, screenX, screenY, clientX, clientY, ctrlKey,
                    altKey, shiftKey, metaKey, button, relatedTarget);
            } else { // Safari

                // the closest thing available in Safari 2.x is UIEvents
                customEvent = document.createEvent("UIEvents");
                customEvent.initEvent(type, bubbles, cancelable);
                customEvent.view = view;
                customEvent.detail = detail;
                customEvent.screenX = screenX;
                customEvent.screenY = screenY;
                customEvent.clientX = clientX;
                customEvent.clientY = clientY;
                customEvent.ctrlKey = ctrlKey;
                customEvent.altKey = altKey;
                customEvent.metaKey = metaKey;
                customEvent.shiftKey = shiftKey;
                customEvent.button = button;
                customEvent.relatedTarget = relatedTarget;
            }

            /*
             * Check to see if relatedTarget has been assigned. Firefox versions
             * less than 2.0 don't allow it to be assigned via initMouseEvent()
             * and the property is readonly after event creation, so in order to
             * keep YAHOO.util.getRelatedTarget() working, assign to the IE
             * proprietary toElement property for mouseout event and fromElement
             * property for mouseover event.
             */
            if (relatedTarget && !customEvent.relatedTarget) {
                if (type == "mouseout") {
                    customEvent.toElement = relatedTarget;
                } else if (type == "mouseover") {
                    customEvent.fromElement = relatedTarget;
                }
            }

            // before dispatch
            if (this.beforedispatch && typeof this.beforedispatch == 'function')
                this.beforedispatch(customEvent);
            this.beforedispatch = null;

            // fire the event
            target.dispatchEvent(customEvent);

        } else if (this.iso(document.createEventObject)) { // IE

            // create an IE event object
            customEvent = document.createEventObject();

            // assign available properties
            customEvent.bubbles = bubbles;
            customEvent.cancelable = cancelable;
            customEvent.view = view;
            customEvent.detail = detail;
            customEvent.screenX = screenX;
            customEvent.screenY = screenY;
            customEvent.clientX = clientX;
            customEvent.clientY = clientY;
            customEvent.ctrlKey = ctrlKey;
            customEvent.altKey = altKey;
            customEvent.metaKey = metaKey;
            customEvent.shiftKey = shiftKey;

            // fix button property for IE's wacky implementation
            switch (button) {
                case 0:
                    customEvent.button = 1;
                    break;
                case 1:
                    customEvent.button = 4;
                    break;
                case 2:
                    customEvent.button = 2;
                    // leave as is
                    break;
                default:
                    customEvent.button = 0;
            }

            /*
             * Have to use relatedTarget because IE won't allow assignment to
             * toElement or fromElement on generic events. This keeps
             * YAHOO.util.customEvent.getRelatedTarget() functional.
             */
            customEvent.relatedTarget = relatedTarget;

            // before dispatch
            if (this.beforedispatch && typeof this.beforedispatch == 'function')
                this.beforedispatch(customEvent);
            this.beforedispatch = null;
            // fire the event
            target.fireEvent("on" + type, customEvent);

        } else {
            throw new Error(
                "simulateMouseEvent(): No event simulation framework present.");
        }
    },

    // --------------------------------------------------------------------------
    // Mouse events
    // --------------------------------------------------------------------------

    /**
     * Simulates a mouse event on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to click on.
     * @param {String}
        *            type The type of event to fire. This can be any one of the
     *            following: click, dblclick, mousedown, mouseup, mouseout,
     *            mouseover, and mousemove.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method mouseEvent
     * @static
     */
    fireMouseEvent:function (target /* :HTMLElement */, type /* :String */, options /* :Object */) /* :Void */ {
        options = options || {};
        this.simulateMouseEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.detail,
            options.screenX, options.screenY, options.clientX,
            options.clientY, options.ctrlKey, options.altKey,
            options.shiftKey, options.metaKey, options.button,
            options.relatedTarget,options.button);
    },

    /**
     * Simulates a click on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to click on.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method click
     * @static
     */
    click:function (target /* :HTMLElement */, options /* :Object */) /* :Void */ {
        this.fireMouseEvent(target, "click", options);
    },

    /**
     * Simulates a double click on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to double click on.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method dblclick
     * @static
     */
    dblclick:function (target /* :HTMLElement */, options /* :Object */) /* :Void */ {
        this.fireMouseEvent(target, "dblclick", options);
    },

    /**
     * Simulates a mousedown on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to act on.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method mousedown
     * @static
     */
    mousedown:function (target /* :HTMLElement */, options /* Object */) /* :Void */ {
        this.fireMouseEvent(target, "mousedown", options);
    },

    /**
     * Simulates a mousemove on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to act on.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method mousemove
     * @static
     */
    mousemove:function (target /* :HTMLElement */, options /* Object */) /* :Void */ {
        this.fireMouseEvent(target, "mousemove", options);
    },

    /**
     * Simulates a mouseout event on a particular element. Use "relatedTarget"
     * on the options object to specify where the mouse moved to. Quirks:
     * Firefox less than 2.0 doesn't set relatedTarget properly, so toElement is
     * assigned in its place. IE doesn't allow toElement to be be assigned, so
     * relatedTarget is assigned in its place. Both of these concessions allow
     * YAHOO.util.Event.getRelatedTarget() to work correctly in both browsers.
     *
     * @param {HTMLElement}
        *            target The element to act on.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method mouseout
     * @static
     */
    mouseout:function (target /* :HTMLElement */, options /* Object */) /* :Void */ {
        this.fireMouseEvent(target, "mouseout", options);
    },

    /**
     * Simulates a mouseover event on a particular element. Use "relatedTarget"
     * on the options object to specify where the mouse moved from. Quirks:
     * Firefox less than 2.0 doesn't set relatedTarget properly, so fromElement
     * is assigned in its place. IE doesn't allow fromElement to be be assigned,
     * so relatedTarget is assigned in its place. Both of these concessions
     * allow YAHOO.util.Event.getRelatedTarget() to work correctly in both
     * browsers.
     *
     * @param {HTMLElement}
        *            target The element to act on.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method mouseover
     * @static
     */
    mouseover:function (target /* :HTMLElement */, options /* Object */) /* :Void */ {
        this.fireMouseEvent(target, "mouseover", options);
    },

    /**
     * Simulates a mouseup on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to act on.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method mouseup
     * @static
     */
    mouseup:function (target /* :HTMLElement */, options /* Object */) /* :Void */ {
        this.fireMouseEvent(target, "mouseup", options);
    },
    mouseenter:function (target /* :HTMLElement */, options /* Object */) /* :Void */ {
        this.fireMouseEvent(target, "mouseenter", options);
    },
    mouseleave:function (target /* :HTMLElement */, options /* Object */) /* :Void */ {
        this.fireMouseEvent(target, "mouseleave", options);
    },
    /**
     * Simulates a contextmenu on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to show contextmenu.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method contextmenu
     * @static
     */
    contextmenu:function (target /* :HTMLElement */, options /* :Object */) /* :Void */ {
        this.fireMouseEvent(target, "contextmenu", options);
    },
    /**
     * Simulates a dragend on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to show dragend.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method dragend
     * @static
     */
    dragend:function (target /* :HTMLElement */, options /* :Object */) /* :Void */ {
        this.fireMouseEvent(target, "dragend", options);
    },
    /**
     * Simulates a blur on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to show blur.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method blur
     * @static
     */
    blur:function (target /* :HTMLElement */, options /* :Object */) /* :Void */ {
        this.fireMouseEvent(target, "blur", options);
    },
    dragto:function (target, options) {
        var me = this;
        me.mousemove(target, {
            clientX:options.startX,
            clientY:options.startY
        });
        setTimeout(function () {
            me.mousedown(target, {
                clientX:options.startX,
                clientY:options.startY
            });
            setTimeout(function () {
                me.mousemove(target, {
                    clientX:options.endX,
                    clientY:options.endY
                });
                setTimeout(function () {
                    me.mouseup(target, {
                        clientX:options.endX,
                        clientY:options.endY
                    });
                    if (options.callback)
                        options.callback();
                }, options.aftermove || 20);
            }, options.beforemove || 20);
        }, options.beforestart || 50);
    },

    // --------------------------------------------------------------------------
    // Key events
    // --------------------------------------------------------------------------

    /**
     * Fires an event that normally would be fired by the keyboard (keyup,
     * keydown, keypress). Make sure to specify either keyCode or charCode as an
     * option.
     *
     * @private
     * @param {String}
        *            type The type of event ("keyup", "keydown" or "keypress").
     * @param {HTMLElement}
        *            target The target of the event.
     * @param {Object}
        *            options Options for the event. Either keyCode or charCode are
     *            required.
     * @method fireKeyEvent
     * @static
     */
    fireKeyEvent:function (type /* :String */, target /* :HTMLElement */, options /* :Object */) /* :Void */ {
        options = options || {};
        this.simulateKeyEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.ctrlKey,
            options.altKey, options.shiftKey, options.metaKey,
            options.keyCode, options.charCode);
    },

    /**
     * Simulates a cut event on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to act on.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method cut
     * @static
     */
    cut:function (target /* :HTMLElement */, options /* :Object */) /* :Void */ {
        this.fireKeyEvent("cut", target, options);
    },

    /**
     * Simulates a paste event on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to act on.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method paste
     * @static
     */
    paste:function ( target /* :HTMLElement */, options /* :Object */ ) /* :Void */ {
        this.fireKeyEvent( "paste", target, options );
    },

    /**
     * Simulates a keydown event on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to act on.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method keydown
     * @static
     */
    keydown:function (target /* :HTMLElement */, options /* :Object */) /* :Void */ {
        this.fireKeyEvent("keydown", target, options);
    },

    /**
     * Simulates a keypress on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to act on.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method keypress
     * @static
     */
    keypress:function (target /* :HTMLElement */, options /* :Object */) /* :Void */ {
        this.fireKeyEvent("keypress", target, options);
    },

    /**
     * Simulates a keyup event on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to act on.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method keyup
     * @static
     */
    keyup:function (target /* :HTMLElement */, options /* Object */) /* :Void */ {
        this.fireKeyEvent("keyup", target, options);
    },

    /**
     * Simulates a compositionstart event on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to act on.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method compositionstart
     * @static
     */
    compositionstart:function (target /* :HTMLElement */, options /* Object */) /* :Void */ {
        this.fireKeyEvent("compositionstart", target, options);
    },

    /**
     * Simulates a compositionstart event on a particular element.
     *
     * @param {HTMLElement}
        *            target The element to act on.
     * @param {Object}
        *            options Additional event options (use DOM standard names).
     * @method compositionstart
     * @static
     */
    compositionend:function (target /* :HTMLElement */, options /* Object */) /* :Void */ {
        this.fireKeyEvent("compositionend", target, options);
    },

    /**
     * 提供iframe扩展支持，用例测试需要独立场景的用例，由于异步支持，通过finish方法触发start
     * <li>事件绑定在frame上，包括afterfinish和jsloaded
     *
     * @param op.win
     * @param op.nojs
     *            不加载额外js
     * @param op.ontest
     *            测试步骤
     * @param op.onbeforestart
     *            测试启动前处理步骤，默认为QUnit.stop();
     * @param op.onafterfinish
     *            测试完毕执行步骤，默认为QUnit.start()
     *
     */
    frameExt:function (op) {
        stop();
        op = typeof op == 'function' ? {
            ontest:op
        } : op;
        var pw = op.win || window, w, f, url = '', id = typeof op.id == 'undefined' ? 'f'
            : op.id, fid = 'iframe#' + id;

        op.finish = function () {
            pw.$(fid).unbind();
            setTimeout(function () {
                pw.$('div#div' + id).remove();
                start();
            }, 20);
        };

        if (pw.$(fid).length == 0) {
            /* 添加frame，部分情况下，iframe没有边框，为了可以看到效果，添加一个带边框的div */
            pw.$(pw.document.body).append('<div id="div' + id + '"></div>');
            pw.$('div#div' + id).append('<iframe id="' + id + '"></iframe>');
        }
        op.onafterstart && op.onafterstart($('iframe#f')[0]);
        pw.$('script').each(function () {
            if (this.src && this.src.indexOf('import.php') >= 0) {
                url = this.src.split('import.php')[1];
            }
        });
        pw.$(fid).one('load',
            function (e) {
                var w = e.target.contentWindow;
                var h = setInterval(function () {
                    if (w.baidu) {// 等待加载完成，IE6下这地方总出问题
                        clearInterval(h);
                        op.ontest(w, w.frameElement);
                    }
                }, 20);
                // 找到当前操作的iframe，然后call ontest
            }).attr('src', cpath + 'frame.php' + url);
    },

    /**
     *
     * 判断2个数组是否相等
     *
     * @static
     */
    isEqualArray:function (array1, array2) {
        if ('[object Array]' != Object.prototype.toString.call(array1)
            || '[object Array]' != Object.prototype.toString.call(array2))
            return (array1 === array2);
        else if (array1.length != array2.length)
            return false;
        else {
            for (var i in array1) {
                if (array1[i] != array2[i])
                    return false;
            }
            return true;
        }
    },

    /***************************************************************************
     *
     * 通用数据模块
     *
     * @static
     *
     **************************************************************************/
    commonData:{// 针对测试文件的路径而不是UserAction的路径
        "testdir":'../../',
        datadir:(function () {
            return location.href.split("/_test/")[0] + "/_test/tools/data/";
        })(),
        currentPath:function () {
            var params = location.search.substring(1).split('&');
            for (var i = 0; i < params.length; i++) {
                var p = params[i];
                if (p.split('=')[0] == 'case') {
                    var casepath = p.split('=')[1].split('.').join('/');
                    return location.href.split('/_test/')[0] + '/_test/'
                        + casepath.substring(0, casepath.lastIndexOf('/'))
                        + '/';
                }
            }
            return "";
        }
    },

    importsrc:function (src, callback, matcher, exclude, win) {
        win = win || window;
        var doc = win.document;

        var srcpath = location.href.split("/_test/")[0]
            + "/_test/tools/br/import.php";
        var param0 = src;
        var ps = {
            f:src
        };
        if (exclude)
            ps.e = exclude;
        var param1 = exclude || "";
        /**
         * IE下重复载入会出现无法执行情况
         */
        if (win.execScript) {
            $.get(srcpath, ps, function (data) {
                win.execScript(data);
            });
        } else {
            var head = doc.getElementsByTagName('head')[0];
            var sc = doc.createElement('script');
            sc.type = 'text/javascript';
            sc.src = srcpath + "?f=" + param0 + "&e=" + param1;
            head.appendChild(sc);
        }

        matcher = matcher || src;
        var mm = matcher.split(",")[0].split(".");
        var h = setInterval(function () {
            var p = win;
            for (var i = 0; i < mm.length; i++) {
                if (typeof (p[mm[i]]) == 'undefined') {
                    // console.log(mm[i]);
                    return;
                }
                p = p[mm[i]];
            }
            clearInterval(h);
            if (callback && 'function' == typeof callback)
                callback();
        }, 20);
    },

    /* 用于加载css文件，如果没有加载完毕则不执行回调函数 */
    loadcss:function (url, callback, classname, style, value) {
        var links = document.getElementsByTagName('link');
        for (var link in links) {
            if (link.href == url) {
                callback();
                return;
            }
        }
        var head = document.getElementsByTagName('head')[0];
        var link = head.appendChild(document.createElement('link'));
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", url);
        var div = document.body.appendChild(document.createElement("div"));
        $(document).ready(
            function () {
                div.className = classname || 'cssloaded';
                var h = setInterval(function () {
                    if ($(div).css(style || 'width') == value
                        || $(div).css(style || 'width') == '20px') {
                        clearInterval(h);
                        document.body.removeChild(div);
                        setTimeout(callback, 20);
                    }
                }, 20);
            });
    },

    /**
     * options supported
     */
    delayhelper:function (oncheck, onsuccess, onfail, timeout) {
        onsuccess = onsuccess || oncheck.onsuccess;
        onfail = onfail || oncheck.onfail || function () {
            window.QUnit.fail('timeout wait for timeout : ' + timeout + 'ms');
            start();
        };
        timeout = timeout || oncheck.timeout || 10000;

        oncheck = (typeof oncheck == 'function') ? oncheck : oncheck.oncheck;
        var h1 = setInterval(function () {
            if (!oncheck())
                return;
            else {
                clearInterval(h1);
                clearTimeout(h2);
                typeof onsuccess == "function" && onsuccess();
            }
        }, 20);
        var h2 = setTimeout(function () {
            clearInterval(h1);
            clearTimeout(h2);
            onfail();
        }, timeout);
    },

    browser:(function () {
        var win = window;
        var numberify = function (s) {
                var c = 0;
                return parseFloat(s.replace(/\./g, function () {
                    return (c++ == 1) ? '' : '.';
                }));
            },

            nav = win && win.navigator,

            o = {

                /**
                 * Internet Explorer version number or 0. Example: 6
                 *
                 * @property ie
                 * @type float
                 * @static
                 */
                ie:0,

                /**
                 * Opera version number or 0. Example: 9.2
                 *
                 * @property opera
                 * @type float
                 * @static
                 */
                opera:0,

                /**
                 * Gecko engine revision number. Will evaluate to 1 if Gecko is
                 * detected but the revision could not be found. Other browsers will
                 * be 0. Example: 1.8
                 *
                 * <pre>
                 * Firefox 1.0.0.4: 1.7.8   &lt;-- Reports 1.7
                 * Firefox 1.5.0.9: 1.8.0.9 &lt;-- 1.8
                 * Firefox 2.0.0.3: 1.8.1.3 &lt;-- 1.81
                 * Firefox 3.0   &lt;-- 1.9
                 * Firefox 3.5   &lt;-- 1.91
                 * </pre>
                 *
                 * @property gecko
                 * @type float
                 * @static
                 */
                gecko:0,

                /**
                 * AppleWebKit version. KHTML browsers that are not WebKit browsers
                 * will evaluate to 1, other browsers 0. Example: 418.9
                 *
                 * <pre>
                 * Safari 1.3.2 (312.6): 312.8.1 &lt;-- Reports 312.8 -- currently the
                 *                                   latest available for Mac OSX 10.3.
                 * Safari 2.0.2:         416     &lt;-- hasOwnProperty introduced
                 * Safari 2.0.4:         418     &lt;-- preventDefault fixed
                 * Safari 2.0.4 (419.3): 418.9.1 &lt;-- One version of Safari may run
                 *                                   different versions of webkit
                 * Safari 2.0.4 (419.3): 419     &lt;-- Tiger installations that have been
                 *                                   updated, but not updated
                 *                                   to the latest patch.
                 * Webkit 212 nightly:   522+    &lt;-- Safari 3.0 precursor (with native SVG
                 *                                   and many major issues fixed).
                 * Safari 3.0.4 (523.12) 523.12  &lt;-- First Tiger release - automatic update
                 *                                   from 2.x via the 10.4.11 OS patch
                 * Webkit nightly 1/2008:525+    &lt;-- Supports DOMContentLoaded event.
                 *                                   yahoo.com user agent hack removed.
                 * </pre>
                 *
                 * http://en.wikipedia.org/wiki/Safari_version_history
                 *
                 * @property webkit
                 * @type float
                 * @static
                 */
                webkit:0,

                /**
                 * Chrome will be detected as webkit, but this property will also be
                 * populated with the Chrome version number
                 *
                 * @property chrome
                 * @type float
                 * @static
                 */
                chrome:0,

                safari:0,

                firefox:0,

                maxthon:0,
                maxthonIE:0,

                /**
                 * The mobile property will be set to a string containing any
                 * relevant user agent information when a modern mobile browser is
                 * detected. Currently limited to Safari on the iPhone/iPod Touch,
                 * Nokia N-series devices with the WebKit-based browser, and Opera
                 * Mini.
                 *
                 * @property mobile
                 * @type string
                 * @static
                 */
                mobile:null,

                /**
                 * Adobe AIR version number or 0. Only populated if webkit is
                 * detected. Example: 1.0
                 *
                 * @property air
                 * @type float
                 */
                air:0,

                /**
                 * Google Caja version number or 0.
                 *
                 * @property caja
                 * @type float
                 */
                caja:nav && nav.cajaVersion,

                /**
                 * Set to true if the pagebreak appears to be in SSL
                 *
                 * @property secure
                 * @type boolean
                 * @static
                 */
                secure:false,

                /**
                 * The operating system. Currently only detecting windows or
                 * macintosh
                 *
                 * @property os
                 * @type string
                 * @static
                 */
                os:null

            },

            ua = nav && nav.userAgent,

            loc = win && win.location,

            href = loc && loc.href,

            m;

        o.secure = href && (href.toLowerCase().indexOf("https") === 0);

        if (ua) {

            if ((/windows|win32/i).test(ua)) {
                o.os = 'windows';
            } else if ((/macintosh/i).test(ua)) {
                o.os = 'macintosh';
            } else if ((/rhino/i).test(ua)) {
                o.os = 'rhino';
            }

            // Modern KHTML browsers should qualify as Safari X-Grade
            if ((/KHTML/).test(ua)) {
                o.webkit = 1;
            }
            if (window.external && /(\d+\.\d)/.test(external.max_version)) {

                o.maxthon = parseFloat(RegExp['\x241']);
                if (/MSIE/.test(ua)) {
                    o.maxthonIE = 1;
                    o.maxthon = 0;
                }

            }
            // Modern WebKit browsers are at least X-Grade
            m = ua.match(/AppleWebKit\/([^\s]*)/);
            if (m && m[1]) {
                o.webkit = numberify(m[1]);

                // Mobile browser check
                if (/ Mobile\//.test(ua)) {
                    o.mobile = "Apple"; // iPhone or iPod Touch
                } else {
                    m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/);
                    if (m) {
                        o.mobile = m[0]; // Nokia N-series, Android, webOS,
                        // ex:
                        // NokiaN95
                    }
                }

                var m1 = ua.match(/Safari\/([^\s]*)/);
                if (m1 && m1[1]) // Safari
                    o.safari = numberify(m1[1]);
                m = ua.match(/Chrome\/([^\s]*)/);
                if (o.safari && m && m[1]) {
                    o.chrome = numberify(m[1]); // Chrome
                } else {
                    m = ua.match(/AdobeAIR\/([^\s]*)/);
                    if (m) {
                        o.air = m[0]; // Adobe AIR 1.0 or better
                    }
                }
            }

            if (!o.webkit) { // not webkit
                // @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316;
                // fi; U;
                // try get firefox and it's ver
                // ssr)
                m = ua.match(/Opera[\s\/]([^\s]*)/);
                if (m && m[1]) {
                    m = ua.match(/Version[\s\/]([^\s]*)/);
                    o.opera = numberify(m[1]);
                    m = ua.match(/Opera Mini[^;]*/);
                    if (m) {
                        o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
                    }
                } else { // not opera or webkit
                    m = ua.match(/MSIE\s([^;]*)/);
                    if (m && m[1]) {
                        o.ie = numberify(m[1]);
                    }else if (ua.match(/Gecko([^\s]*)/)&&ua.match(/rv:11/)){//todo
                        o.ie = 11;
                    } else { // not opera, webkit, or ie
                        m = ua.match(/Gecko\/([^\s]*)/);
                        if (m) {
                            o.gecko = 1; // Gecko detected, look for revision
                            m = ua.match(/rv:([^\s\)]*)/);
                            if (m && m[1]) {
                                o.gecko = numberify(m[1]);
                            }
                        }
                    }
                }
            }
        }

        return o;
    })
        (),

    /**
     * 提供队列方式执行用例的方案，接口包括start、add、next，方法全部执行完毕时会启动用例继续执行
     */
    functionListHelper:function () {
        var check = {
            list:[],
            start:function () {
                var self = this;
                $(this).bind('next', function () {
                    setTimeout(function () {// 避免太深的堆栈
                        if (self.list.length == 0)
                            start();
                        else
                            self.list.shift()();
                    }, 0);
                });
                self.next();
            },
            add:function (func) {
                this.list.push(func);
            },
            next:function (delay) {
                var self = this;
                if (delay) {
                    setTimeout(function () {
                        $(self).trigger('next');
                    }, delay);
                } else
                    $(this).trigger('next');
            }
        };
        return check;
    },
    getHTML:function (co) {
        var div = document.createElement('div'), h;
        if (!co)
            return 'null';
        div.appendChild(co.cloneNode(true));
        h = div.innerHTML.toLowerCase();

        h = h.replace(/[\r\n\t\u200b\ufeff]/g, ''); // Remove line feeds and tabs
        h = h.replace(/ (\w+)=([^\"][^\s>]*)/gi, ' $1="$2"'); // Restore
        // attribs on IE
        return h;
    },
    getChildHTML:function (co) {

        var h = co.innerHTML.toLowerCase();

        h = h.replace(/[\r\n\t\u200b\ufeff]/g, ''); // Remove line feeds and tabs
        h = h.replace(/ (\w+)=([^\"][^\s>]*)/gi, ' $1="$2"'); // Restore attribs on IE

        return h.replace(/\u200B/g, '');
    },
    getIndex:function (node) {
        var childNodes = node.parentNode.childNodes, i = 0;
        while (childNodes[i] !== node)
            i++;
        return i;
    },
    checkResult:function (range, sc, ec, so, eo, collapsed, descript) {
        descript = descript ? descript : '';
        equal(range.collapsed, collapsed, "check collapsed --" + descript);
        ok(range.startContainer === sc, "check startContainer--" + descript);
        ok(range.endContainer === ec, "check endContainer--" + descript);
        equal(range.startOffset, so, "check startOffset--" + descript);
        equal(range.endOffset, eo, "check endOffset--" + descript);
    },
    isSameRange:function (rangeA, rangeB, descript) {
        descript = descript ? descript : '';
        equal(rangeA.collapsed, rangeB.collapsed, "check collapsed --" + descript);
        ok(rangeA.document === rangeB.document, "check document--" + descript);
        ok(rangeA.startContainer === rangeB.startContainer, "check startContainer--" + descript);
        ok(rangeA.endContainer === rangeB.endContainer, "check endContainer--" + descript);
        equal(rangeA.startOffset, rangeB.startOffset, "check startOffset--" + descript);
        equal(rangeA.endOffset, rangeB.endOffset, "check endOffset--" + descript);
    },
    manualDeleteFillData:function (node) {
        var childs = node.childNodes;
        for (var i = 0; i < childs.length; i++) {
            var fillData = childs[i];
            if ((fillData.nodeType == 3) && ( fillData.data == domUtils.fillChar )) {
                domUtils.remove(fillData);
                fillData = null;

            }
            else
                this.manualDeleteFillData(fillData);
        }


    },
    cssStyleToDomStyle:function (cssName) {
        var test = document.createElement('div').style,
            cssFloat = test.cssFloat != undefined ? 'cssFloat'
                : test.styleFloat != undefined ? 'styleFloat'
                : 'float',
            cache = { 'float':cssFloat };

        function replacer(match) {
            return match.charAt(1).toUpperCase();
        }

//        return function( cssName ) {
        return cache[cssName] || (cache[cssName] = cssName.replace(/-./g, replacer) );
//        };
    },
    isSameStyle:function (elementA, elementB) {
//        var styleA = elementA.style.cssText,
//            styleB = elementB.style.cssText;
//        if ( this.browser.ie && this.browser.version == 6 ) {
//            styleA = styleA.toLowerCase();
//            styleB = styleB.toLowerCase();
//        }
//        if ( !styleA && !styleB ) {
//            return true;
//        } else if ( !styleA || !styleB ) {
//            return false;
//        }
//        var styleNameMap = {},
//            record = [],
//            exit = {};
//        styleA.replace( /[\w-]+\s*(?=:)/g, function ( name ) {
//            styleNameMap[name] = record.push( name );
//        } );
//        try {
//            styleB.replace( /[\w-]+\s*(?=:)/g, function ( name ) {
//                var index = styleNameMap[name];
//                if ( index ) {
////                    name = this.cssStyleToDomStyle( name );
//                    if ( elementA.style[name] !== elementB.style[name] ) {
//                        throw exit;
//                    }
//                    record[index - 1] = '';
//                } else {
//                    throw exit;
//                }
//            } );
//        } catch ( ex ) {
//            if ( ex === exit ) {
//                return false;
//            }
//        }
//        return !record.join( '' );
        function indexOf(array, item, at) {
            for (var i = at || 0, l = array.length; i < l; i++) {
                if (array[i] === item) {
                    return i;
                }
            }
            return -1;
        }

        var styleA = elementA.style.cssText.replace(/( ?; ?)/g, ';').replace(/( ?: ?)/g, ':'),
            styleB = elementB.style.cssText.replace(/( ?; ?)/g, ';').replace(/( ?: ?)/g, ':');
        if (browser.opera) {
            styleA = elementA.style;
            styleB = elementB.style;
            if (styleA.length != styleB.length)
                return 0;
            for (var p in styleA) {
                if (/^(\d+|csstext)$/i.test(p))
                    continue;
                if (styleA[p] != styleB[p])
                    return 0;
            }
            return 1;
        }


        if (!styleA || !styleB) {
            return styleA == styleB ? 1 : 0;
        }
        styleA = styleA.split(';');
        styleB = styleB.split(';');

        if (styleA.length != styleB.length)
            return 0;
        for (var j = 0; j < styleB.length; j++) {
            if (styleB[j].toLowerCase().indexOf("color") > -1 && styleB[j].toLowerCase().indexOf("rgb") > -1) {
                var color = this.formatColor(styleB[j].substr(styleB[j].indexOf("rgb"), styleB[j].length));
                styleB[j] = styleB[j].replace(styleB[j].substr(styleB[j].indexOf("rgb"), styleB[j].length), color);
            }
        }
        for (var i = 0, ci; ci = styleA[i++];) {
            if (ci.toLowerCase().indexOf("color") > -1 && ci.toLowerCase().indexOf("rgb") > -1) {
                var color = this.formatColor(ci.substr(ci.indexOf("rgb"), ci.length));
                ci = ci.replace(ci.substr(ci.indexOf("rgb"), ci.length), color);
            }
            if (indexOf(styleB, ci) == -1) {

                return 0;

            }//styleA[0].substr(styleA[0].indexOf("rga"),styleA[0].length)
        }
        return 1;
    },


    formatColor:function (color) {
        var reg1 = /^\#[\da-f]{6}$/i,
            reg2 = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/,
            keyword = {
                black:'#000000',
                silver:'#c0c0c0',
                gray:'#808080',
                white:'#ffffff',
                maroon:'#800000',
                red:'#ff0000',
                purple:'#800080',
                fuchsia:'#ff00ff',
                green:'#008000',
                lime:'#00ff00',
                olive:'#808000',
                yellow:'#ffff0',
                navy:'#000080',
                blue:'#0000ff',
                teal:'#008080',
                aqua:'#00ffff'
            };
        if (reg1.test(color)) {
            // #RRGGBB 直接返回
            return color;
        } else if (reg2.test(color)) {
            // 非IE中的 rgb(0, 0, 0)
            for (var s, i = 1, color = "#"; i < 4; i++) {
                s = parseInt(RegExp["\x24" + i]).toString(16);
                color += ("00" + s).substr(s.length);
            }
            return color;
        } else if (/^\#[\da-f]{3}$/.test(color)) {
            // 简写的颜色值: #F00
            var s1 = color.charAt(1),
                s2 = color.charAt(2),
                s3 = color.charAt(3);
            return "#" + s1 + s1 + s2 + s2 + s3 + s3;
        } else if (keyword[color])
            return keyword[color];

        return "";

    },
    hasSameAttrs:function (nodeA, nodeB) {
        if (nodeA.tagName != nodeB.tagName)
            return 0;
        var thisAttribs = nodeA.attributes,
            otherAttribs = nodeB.attributes;
        if (thisAttribs.length != otherAttribs.length)
            return 0;
        if (thisAttribs.length == 0)
            return 1;
        var attrA, attrB;
        for (var i = 0; attrA = thisAttribs[i++];) {
            if (attrA.nodeName == 'style') {
                if (this.isSameStyle(nodeA, nodeB)) {
                    continue
                } else {
                    return 0;
                }
            }
            if (!ua.browser.ie || attrA.specified) {
                attrB = nodeB.attributes[attrA.nodeName];
                if (!attrB) {
                    return 0;
                }
            }
            return 1;
        }
        return 1;
    },
    /**
     *清除空Text节点
     */

    clearWhiteNode:function (node) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var tmpNode = node.childNodes[i];
            if (tmpNode.nodeType == 3 && !tmpNode.length) {
                tmpNode.parentNode.removeChild(tmpNode);
                i--;
            }
        }
    },
    /**
     *检查两个节点（包含所有子节点）是否具有相同的属性
     */
    flag:true,
    checkAllChildAttribs:function (nodeA, nodeB) {
        var k = nodeA.childNodes.length;
        if (k != nodeB.childNodes.length) {
            if (ua.browser.opera) {
                this.clearWhiteNode(nodeA);
                k = nodeA.childNodes.length;
                if (k != nodeB.childNodes.length)
                    this.flag = false;
            }
            else
                this.flag = false;
        }
        if (!this.flag)
            return this.flag;
        while (k) {
            var tmpNodeA = nodeA.childNodes[k - 1];
            var tmpNodeB = nodeB.childNodes[k - 1];
            k--;

            if (tmpNodeA.nodeType == 3 || tmpNodeB.nodeType == 3 || tmpNodeA.nodeType == 8 || tmpNodeB.nodeType == 8)
                continue;
            if (!this.hasSameAttrs(tmpNodeA, tmpNodeB)) {
                this.flag = false;
                break;

            }

            this.checkAllChildAttribs(tmpNodeA, tmpNodeB);
        }
        return this.flag;
    },
    haveSameAllChildAttribs:function (nodeA, nodeB) {
        this.flag = true;
        return this.checkAllChildAttribs(nodeA, nodeB);
    },
    /*查看传入的html是否与传入的元素ele具有相同的style*/
    checkHTMLSameStyle:function (html, doc, ele, descript) {
        var tagEle = doc.createElement(ele.tagName);
        tagEle.innerHTML = html;
        /*会有一些不可见字符，在比较前提前删掉*/
        this.manualDeleteFillData(ele);
        ok(this.haveSameAllChildAttribs(ele, tagEle), descript);
//        ok(this.equalsNode(ele.innerHMTL,html),descript);
    },


    equalsNode:function (na, nb) {
        function compare(nodeA, nodeB) {
            if (nodeA.nodeType != nodeB.nodeType) {
                return 0;
            }
            if (nodeA.nodeType == 3) {
                return  nodeA.nodeValue == nodeB.nodeValue
            }
            if (domUtils.isSameElement(nodeA, nodeB)) {
                if (!nodeA.firstChild && !nodeB.firstChild) {
                    return 1;
                }
                if (nodeA.firstChild && !nodeB.firstChild || !nodeA.firstChild && nodeB.firstChild) {
                    return 0
                }
                for (var i = 0, ai, bi; ai = nodeA.childNodes[i], bi = nodeB.childNodes[i++];) {

                    if (!compare(ai, bi)) {
                        return 0
                    }
                }
                return 1;
            } else {
                return 0;
            }
        }

        return compare(domUtils.createElement(document, 'div', {
            'innerHTML':na
        }), domUtils.createElement(document, 'div', {
            'innerHTML':nb
        }));
    },


    getSelectedText:function () {
        if (window.getSelection) {
            // This technique is the most likely to be standardized.
            // getSelection() returns a Selection object, which we do not document.
            return window.getSelection().toString();
        }
        else if (document.getSelection) {
            // This is an older, simpler technique that returns a string
            return document.getSelection();
        }
        else if (document.selection) {
            // This is the IE-specific technique.
            // We do not document the IE selection property or TextRange objects.
            return document.selection.createRange().text;
        }
    },
    findPosition:function (oElement) {
        var x2 = 0;
        var y2 = 0;
        var width = oElement.offsetWidth;
        var height = oElement.offsetHeight;
        if (typeof( oElement.offsetParent ) != 'undefined') {
            for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
                posX += oElement.offsetLeft;
                posY += oElement.offsetTop;
            }
            x2 = posX + width;
            y2 = posY + height;
            return [ posX, posY , x2, y2];

        } else {
            x2 = oElement.x + width;
            y2 = oElement.y + height;
            return [ oElement.x, oElement.y, x2, y2];
        }
    },

    checkElementPath:function (arr1, arr2, descript) {
        if (!descript)
            descript = '';
        var index = arr1.length;
        if (index != arr2.length)
            ok(false, '路径深度不相同');
        else {

            while (index > 0)
                equal(arr1[--index ], arr2[index ], descript + '---第' + index + '个元素' + arr1[index]);
        }
    },
    getBrowser:function () {
        var browser = "";
        if (this.browser.ie == 6)
            browser = 'ie6';
        if (this.browser.ie == 7)
            browser = 'ie7';
        if (this.browser.ie == 8)
            browser = 'ie8';
        if (this.browser.ie == 9)
            browser = 'ie9';
        if (this.browser.safari)
            browser = 'safari';
        if (this.browser.firefox)
            browser = 'firefox';
        if (this.browser.chrome)
            browser = 'chrome';
        if (this.browser.maxthon) {
            browser = 'maxthon';
        }
        if (this.browser.maxthonIE)
            browser = 'maxIE';
        if (this.browser.opera)
            browser = 'opera';
        return browser;
    },
    getFloatStyle:function (ele) {
        if (this.browser.ie)
            return ele.style['styleFloat'];
        else
            return ele.style['cssFloat'];
    },

    getComputedStyle:function(ele ){
        if(this.browser.ie&&ua.browser.ie<9){
            return ele.currentStyle;
        }else{
            return window.getComputedStyle(ele);
        }
    },
    readFile:function (name, f) {
        var args = {};
        args['name'] =  name;
        $.ajax({
            url:'read.php',
            type:'post',
            data:args,
            success:function (msg) {
                f(msg);
            },
            error:function (xhr, msg) {
                f(null);
            }
        });
    },
    readTxt:function (name, f) {
        var args = {};
        args['name'] = './txt/' + name;
        $.ajax({
            url:'read.php',
            type:'post',
            data:args,
            success:function (msg) {
                f(msg);
            },
            error:function (xhr, msg) {
                f(null);
            }
        });
    }, checkLowerCase:function (stringA, stringB) {
        if (!(stringA || stringB))
            return true;
        else if (!stringA || !stringB)
            return false;
        else {
            return stringA.toLowerCase() == stringB.toLowerCase();
        }
    }, removeEndSemicolon:function (styleValue) {
        if (styleValue.length - 1 == styleValue.lastIndexOf(';'))
            styleValue = styleValue.substring(0, styleValue.length - 1);
        return styleValue;
    }, checkNodeStyle:function (nodeA, nodeB) {
        var nodeAStyle = this.removeEndSemicolon(nodeA.getAttr("style").replace(/\s+/g, "")).replace(/&quot;/g,'').split(";");
        var nodeBStyle = this.removeEndSemicolon(nodeB.getAttr("style").replace(/\s+/g, "")).replace(/&quot;/g,'').split(";");
        var lengthA = nodeAStyle.length;
        var lengthB = nodeBStyle.length;
        if (!(lengthA && lengthB))
            return true;
        else if (lengthA != lengthB)
            return false;
        else {
            for (var i = 0; i < lengthA; i++) {
                if (nodeAStyle[i].match(/[-\w]+\s*:/) ) {
                    var styleName = nodeAStyle[i].match(/[-\w]+\s*:/)[0].replace(/\s*:/, "");
                    nodeA.attrs.style = nodeA.attrs.style.replace(/&quot;/g,'');
                    nodeB.attrs.style = nodeB.attrs.style.replace(/&quot;/g,'');
                    var styleValueA = nodeA.getStyle(styleName).toLowerCase().replace(/\s+/g, "");
                    var styleValueB = nodeB.getStyle(styleName).toLowerCase().replace(/\s+/g, "");
                    if(/color/.test(styleName)){
                        styleValueA = this.formatColor(styleValueA);
                        styleValueB = this.formatColor(styleValueB);
                    }
                    else;
                    if (styleValueA != styleValueB)
                        return false;
                }
            }
        }
        return true;
    }, getPropertyCount:function (o) {
        var n, count = 0;
        for (n in o) {
            if (o.hasOwnProperty(n)) {
                count++;
            }
        }
        return count;
    },formHref:function(str){
        if(str.lastIndexOf('/')== str.length-1){
            str = str.substring(0,str.length-1);
        }
        return str;
    },checkSameNodeAttrs:function (nodeA, nodeB) {
        var lengthA = this.getPropertyCount(nodeA.attrs);
        var lengthB = this.getPropertyCount(nodeB.attrs);
        if (!(lengthA && lengthB))
            return true;
        else if (lengthA != lengthB)
            return false;
        else {
            for (var p in nodeA.attrs) {
                if(!nodeB.getAttr(p)&&!nodeA.getAttr(p))
                    return true;
                else if (!nodeB.getAttr(p)||!nodeA.getAttr(p))
                    return false;
                else if (p.toLowerCase() == "style") {
                    if (!this.checkNodeStyle(nodeA, nodeB))
                        return false;
                }
                else if(p.toLowerCase() == "href"){
                    if (this.formHref(nodeA.getAttr(p).toLowerCase()) != this.formHref(nodeB.getAttr(p).toLowerCase()))
                        return false;
                }
                else {
                    if (nodeA.getAttr(p).toLowerCase().replace(/^\s+|\s+$/g, "") != nodeB.getAttr(p).toLowerCase().replace(/^\s+|\s+$/g, ""))
                        return false;
                }
            }
        }
        return true;

    }, checkChildren:function (nodeA, nodeB) {
        if (!(nodeA.children || nodeB.children))
            return true;
        else if (!(nodeA.children && nodeB.children))
            return false;
        else if (nodeA.children.length != nodeB.children.length)
            return false;
        else {
            var lengthA = nodeA.children.length;
            for (var i = 0; i < lengthA; i++) {
                if (!this.checkSameNode(nodeA.children[i], nodeB.children[i]))
                    return false;
            }
        }
        return true;
    }, checkSameNode:function (nodeA, nodeB) {
        if (!this.checkSameNodeAttrs(nodeA, nodeB))
            return false;
        else if (!this.checkChildren(nodeA, nodeB))
            return false;
        else if (nodeA.data != nodeB.data)
            return false;
        else if (!this.checkLowerCase(nodeA.tagName, nodeB.tagName))
            return false;
        else if (!this.checkLowerCase(nodeA.type, nodeB.type))
            return false;
        else
            return true;
    }, checkSameHtml:function (stringA, stringB, scholium) {
        ok(this.checkSameNode(UE.htmlparser(stringA), UE.htmlparser(stringB)), scholium);
    },
    getContextmenuIndexByName:function(contextmenu,name){
        for(var i=0;i<contextmenu.length;i++){
            if(contextmenu[i].innerText ==name || contextmenu[i].textContent ==name)
                return i;
        }
        return 0;
    }
};
var ua = UserAction;
var upath = ua.commonData.currentPath();
var cpath = ua.commonData.datadir;