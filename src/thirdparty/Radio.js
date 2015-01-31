/* A standalone verion of Backbone.Radio.js
 * Customized to work with brackets extensions
 * 
 * https://gist.github.com/baig/8c2244dc48be3908b82d
 */

define(function (require, exports, module) {
    "use strict";

    var _ = brackets.getModule("thirdparty/lodash");

    //  var previousRadio = Backbone.Radio;
    var Radio = {};
    Radio.VERSION = '<%= version %>';

    // This allows you to run multiple instances of Radio on the same
    // webapp. After loading the new version, call `noConflict()` to
    // get a reference to it. At the same time the old version will be
    // returned to Backbone.Radio.
    Radio.noConflict = function () {
        //    Backbone.Radio = previousRadio;
        return this;
    };

    // Whether or not we're in DEBUG mode or not. DEBUG mode helps you
    // get around the issues of lack of warnings when events are mis-typed.
    Radio.DEBUG = false;

    // Format debug text.
    Radio._debugText = function (warning, eventName, channelName) {
        return warning + (channelName ? ' on the ' + channelName + ' channel' : '') +
            ': "' + eventName + '"';
    };

    // This is the method that's called when an unregistered event was called.
    // By default, it logs warning to the console. By overriding this you could
    // make it throw an Error, for instance. This would make firing a nonexistent event
    // have the same consequence as firing a nonexistent method on an Object.
    Radio.debugLog = function (warning, eventName, channelName) {
        if (Radio.DEBUG && console && console.warn) {
            console.warn(Radio._debugText(warning, eventName, channelName));
        }
    };

    // Regular expression used to split event strings.
    var eventSplitter = /\s+/;

    // An internal method used to handle Radio's method overloading for Requests and
    // Commands. It's borrowed from Backbone.Events. It differs from Backbone's overload
    // API (which is used in Backbone.Events) in that it doesn't support space-separated
    // event names.
    Radio._eventsApi = function (obj, action, name, rest) {
        if (!name) {
            return false;
        }

        var results = {};

        // Handle event maps.
        if (typeof name === 'object') {
            for (var key in name) {
                var result = obj[action].apply(obj, [key, name[key]].concat(rest));
                eventSplitter.test(key) ? _.extend(results, result) : results[key] = result;
            }
            return results;
        }

        // Handle space separated event names.
        if (eventSplitter.test(name)) {
            var names = name.split(eventSplitter);
            for (var i = 0, l = names.length; i < l; i++) {
                results[names[i]] = obj[action].apply(obj, [names[i]].concat(rest));
            }
            return results;
        }

        return false;
    };

    // BACKBONE VERSION!! Implement fancy features of the Events API such as multiple event
    // names `"change blur"` and jQuery-style event maps `{change: action}`
    // in terms of the existing API.
    var eventsApi = function (obj, action, name, rest) {
        if (!name) return true;

        // Handle event maps.
        if (typeof name === 'object') {
            for (var key in name) {
                obj[action].apply(obj, [key, name[key]].concat(rest));
            }
            return false;
        }

        // Handle space separated event names.
        if (eventSplitter.test(name)) {
            var names = name.split(eventSplitter);
            for (var i = 0, length = names.length; i < length; i++) {
                obj[action].apply(obj, [names[i]].concat(rest));
            }
            return false;
        }

        return true;
    };

    // An optimized way to execute callbacks.
    Radio._callHandler = function (callback, context, args) {
        var a1 = args[0],
            a2 = args[1],
            a3 = args[2];
        switch (args.length) {
        case 0:
            return callback.call(context);
        case 1:
            return callback.call(context, a1);
        case 2:
            return callback.call(context, a1, a2);
        case 3:
            return callback.call(context, a1, a2, a3);
        default:
            return callback.apply(context, args);
        }
    };

    // A difficult-to-believe, but optimized internal dispatch function for
    // triggering events. Tries to keep the usual cases speedy (most internal
    // Backbone events have 3 arguments).
    var triggerEvents = function (events, args) {
        var ev, i = -1,
            l = events.length,
            a1 = args[0],
            a2 = args[1],
            a3 = args[2];
        switch (args.length) {
        case 0:
            while (++i < l)(ev = events[i]).callback.call(ev.ctx);
            return;
        case 1:
            while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1);
            return;
        case 2:
            while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2);
            return;
        case 3:
            while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
            return;
        default:
            while (++i < l)(ev = events[i]).callback.apply(ev.ctx, args);
            return;
        }
    };

    // A helper used by `off` methods to the handler from the store
    function removeHandler(store, name, callback, context) {
        var event = store[name];
        if (
            (!callback || (callback === event.callback || callback === event.callback._callback)) &&
            (!context || (context === event.context))
        ) {
            delete store[name];
            return true;
        }
    }

    function removeHandlers(store, name, callback, context) {
        store || (store = {});
        var names = name ? [name] : _.keys(store);
        var matched = false;

        for (var i = 0, length = names.length; i < length; i++) {
            name = names[i];

            // If there's no event by this name, log it and continue
            // with the loop
            if (!store[name]) {
                continue;
            }

            if (removeHandler(store, name, callback, context)) {
                matched = true;
            }
        }

        return matched;
    }

    /*
     * tune-in
     * -------
     * Get console logs of a channel's activity
     *
     */

    var _logs = {};

    // This is to produce an identical function in both tuneIn and tuneOut,
    // so that Backbone.Events unregisters it.
    function _partial(channelName) {
        return _logs[channelName] || (_logs[channelName] = _.partial(Radio.log, channelName));
    }

    _.extend(Radio, {

        // Log information about the channel and event
        log: function (channelName, eventName) {
            var args = _.rest(arguments, 2);
            console.log('[' + channelName + '] "' + eventName + '"', args);
        },

        // Logs all events on this channel to the console. It sets an
        // internal value on the channel telling it we're listening,
        // then sets a listener on the Backbone.Events
        tuneIn: function (channelName) {
            var channel = Radio.channel(channelName);
            channel._tunedIn = true;
            channel.on('all', _partial(channelName));
            return this;
        },

        // Stop logging all of the activities on this channel to the console
        tuneOut: function (channelName) {
            var channel = Radio.channel(channelName);
            channel._tunedIn = false;
            channel.off('all', _partial(channelName));
            delete _logs[channelName];
            return this;
        }
    });

    // Backbone.Events
    // ---------------

    // A module that can be mixed in to *any object* in order to provide it with
    // custom events. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = {};
    //     _.extend(object, Backbone.Events);
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    Radio.Events = {

        // Bind an event to a `callback` function. Passing `"all"` will bind
        // the callback to all events fired.
        on: function (name, callback, context) {
            if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
            this._events || (this._events = {});
            var events = this._events[name] || (this._events[name] = []);
            events.push({
                callback: callback,
                context: context,
                ctx: context || this
            });
            return this;
        },

        // Bind an event to only be triggered a single time. After the first time
        // the callback is invoked, it will be removed.
        once: function (name, callback, context) {
            if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
            var self = this;
            var once = _.once(function () {
                self.off(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.on(name, once, context);
        },

        // Remove one or many callbacks. If `context` is null, removes all
        // callbacks with that function. If `callback` is null, removes all
        // callbacks for the event. If `name` is null, removes all bound
        // callbacks for all events.
        off: function (name, callback, context) {
            if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;

            // Remove all callbacks for all events.
            if (!name && !callback && !context) {
                this._events = void 0;
                return this;
            }

            var names = name ? [name] : _.keys(this._events);
            for (var i = 0, length = names.length; i < length; i++) {
                name = names[i];

                // Bail out if there are no events stored.
                var events = this._events[name];
                if (!events) continue;

                // Remove all callbacks for this event.
                if (!callback && !context) {
                    delete this._events[name];
                    continue;
                }

                // Find any remaining events.
                var remaining = [];
                for (var j = 0, k = events.length; j < k; j++) {
                    var event = events[j];
                    if (
                        callback && callback !== event.callback &&
                        callback !== event.callback._callback ||
                        context && context !== event.context
                    ) {
                        remaining.push(event);
                    }
                }

                // Replace events if there are any remaining.  Otherwise, clean up.
                if (remaining.length) {
                    this._events[name] = remaining;
                } else {
                    delete this._events[name];
                }
            }

            return this;
        },

        // Trigger one or many events, firing all bound callbacks. Callbacks are
        // passed the same arguments as `trigger` is, apart from the event name
        // (unless you're listening on `"all"`, which will cause your callback to
        // receive the true name of the event as the first argument).
        trigger: function (name) {
            if (!this._events) return this;
            var args = Array.prototype.slice.call(arguments, 1);
            if (!eventsApi(this, 'trigger', name, args)) return this;
            var events = this._events[name];
            var allEvents = this._events.all;
            if (events) triggerEvents(events, args);
            if (allEvents) triggerEvents(allEvents, arguments);
            return this;
        },

        // Inversion-of-control versions of `on` and `once`. Tell *this* object to
        // listen to an event in another object ... keeping track of what it's
        // listening to.
        listenTo: function (obj, name, callback) {
            var listeningTo = this._listeningTo || (this._listeningTo = {});
            var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
            listeningTo[id] = obj;
            if (!callback && typeof name === 'object') callback = this;
            obj.on(name, callback, this);
            return this;
        },

        listenToOnce: function (obj, name, callback) {
            if (typeof name === 'object') {
                for (var event in name) this.listenToOnce(obj, event, name[event]);
                return this;
            }
            if (eventSplitter.test(name)) {
                var names = name.split(eventSplitter);
                for (var i = 0, length = names.length; i < length; i++) {
                    this.listenToOnce(obj, names[i], callback);
                }
                return this;
            }
            if (!callback) return this;
            var once = _.once(function () {
                this.stopListening(obj, name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.listenTo(obj, name, once);
        },

        // Tell this object to stop listening to either specific events ... or
        // to every object it's currently listening to.
        stopListening: function (obj, name, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) return this;
            var remove = !name && !callback;
            if (!callback && typeof name === 'object') callback = this;
            if (obj)(listeningTo = {})[obj._listenId] = obj;
            for (var id in listeningTo) {
                obj = listeningTo[id];
                obj.off(name, callback, this);
                if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
            }
            return this;
        }

    };

    /*
     * Backbone.Radio.Commands
     * -----------------------
     * A messaging system for sending orders.
     *
     */

    Radio.Commands = {

        // Issue a command
        command: function (name) {
            var args = _.rest(arguments);
            if (Radio._eventsApi(this, 'command', name, args)) {
                return this;
            }
            var channelName = this.channelName;
            var commands = this._commands;

            // Check if we should log the command, and if so, do it
            if (channelName && this._tunedIn) {
                Radio.log.apply(this, [channelName, name].concat(args));
            }

            // If the command isn't handled, log it in DEBUG mode and exit
            if (commands && (commands[name] || commands['default'])) {
                var handler = commands[name] || commands['default'];
                args = commands[name] ? args : arguments;
                Radio._callHandler(handler.callback, handler.context, args);
            } else {
                Radio.debugLog('An unhandled command was fired', name, channelName);
            }

            return this;
        },

        // Register a handler for a command.
        comply: function (name, callback, context) {
            if (Radio._eventsApi(this, 'comply', name, [callback, context])) {
                return this;
            }
            this._commands || (this._commands = {});

            if (this._commands[name]) {
                Radio.debugLog('A command was overwritten', name, this.channelName);
            }

            this._commands[name] = {
                callback: callback,
                context: context || this
            };

            return this;
        },

        // Register a handler for a command that happens just once.
        complyOnce: function (name, callback, context) {
            if (Radio._eventsApi(this, 'complyOnce', name, [callback, context])) {
                return this;
            }
            var self = this;

            var once = _.once(function () {
                self.stopComplying(name);
                return callback.apply(this, arguments);
            });

            return this.comply(name, once, context);
        },

        // Remove handler(s)
        stopComplying: function (name, callback, context) {
            if (Radio._eventsApi(this, 'stopComplying', name)) {
                return this;
            }

            // Remove everything if there are no arguments passed
            if (!name && !callback && !context) {
                delete this._commands;
            } else if (!removeHandlers(this._commands, name, callback, context)) {
                Radio.debugLog('Attempted to remove the unregistered command', name, this.channelName);
            }

            return this;
        }
    };

    /*
     * Backbone.Radio.Requests
     * -----------------------
     * A messaging system for requesting data.
     *
     */

    function makeCallback(callback) {
        return _.isFunction(callback) ? callback : function () {
            return callback;
        };
    }

    Radio.Requests = {

        // Make a request
        request: function (name) {
            var args = _.rest(arguments);
            var results = Radio._eventsApi(this, 'request', name, args);
            if (results) {
                return results;
            }
            var channelName = this.channelName;
            var requests = this._requests;

            // Check if we should log the request, and if so, do it
            if (channelName && this._tunedIn) {
                Radio.log.apply(this, [channelName, name].concat(args));
            }

            // If the request isn't handled, log it in DEBUG mode and exit
            if (requests && (requests[name] || requests['default'])) {
                var handler = requests[name] || requests['default'];
                args = requests[name] ? args : arguments;
                return Radio._callHandler(handler.callback, handler.context, args);
            } else {
                Radio.debugLog('An unhandled request was fired', name, channelName);
            }
        },

        // Set up a handler for a request
        reply: function (name, callback, context) {
            if (Radio._eventsApi(this, 'reply', name, [callback, context])) {
                return this;
            }

            this._requests || (this._requests = {});

            if (this._requests[name]) {
                Radio.debugLog('A request was overwritten', name, this.channelName);
            }

            this._requests[name] = {
                callback: makeCallback(callback),
                context: context || this
            };

            return this;
        },

        // Set up a handler that can only be requested once
        replyOnce: function (name, callback, context) {
            if (Radio._eventsApi(this, 'replyOnce', name, [callback, context])) {
                return this;
            }

            var self = this;

            var once = _.once(function () {
                self.stopReplying(name);
                return makeCallback(callback).apply(this, arguments);
            });

            return this.reply(name, once, context);
        },

        // Remove handler(s)
        stopReplying: function (name, callback, context) {
            if (Radio._eventsApi(this, 'stopReplying', name)) {
                return this;
            }

            // Remove everything if there are no arguments passed
            if (!name && !callback && !context) {
                delete this._requests;
            } else if (!removeHandlers(this._requests, name, callback, context)) {
                Radio.debugLog('Attempted to remove the unregistered request', name, this.channelName);
            }

            return this;
        }
    };

    /*
     * Backbone.Radio.channel
     * ----------------------
     * Get a reference to a channel by name.
     *
     */

    Radio._channels = {};

    Radio.channel = function (channelName) {
        if (!channelName) {
            throw new Error('You must provide a name for the channel.');
        }

        if (Radio._channels[channelName]) {
            return Radio._channels[channelName];
        } else {
            return (Radio._channels[channelName] = new Radio.Channel(channelName));
        }
    };

    /*
     * Backbone.Radio.Channel
     * ----------------------
     * A Channel is an object that extends from Backbone.Events,
     * Radio.Commands, and Radio.Requests.
     *
     */

    Radio.Channel = function (channelName) {
        this.channelName = channelName;
    };

    _.extend(Radio.Channel.prototype, Radio.Events, Radio.Commands, Radio.Requests, {

        // Remove all handlers from the messaging systems of this channel
        reset: function () {
            this.off();
            this.stopListening();
            this.stopComplying();
            this.stopReplying();
            return this;
        }
    });

    /*
     * Top-level API
     * -------------
     * Supplies the 'top-level API' for working with Channels directly
     * from Backbone.Radio.
     *
     */

    var channel, args, systems = [Radio.Events, Radio.Commands, Radio.Requests];

    _.each(systems, function (system) {
        _.each(system, function (method, methodName) {
            Radio[methodName] = function (channelName) {
                args = _.rest(arguments);
                channel = this.channel(channelName);
                return channel[methodName].apply(channel, args);
            };
        });
    });

    Radio.reset = function (channelName) {
        var channels = !channelName ? this._channels : [this._channels[channelName]];
        _.invoke(channels, 'reset');
    };

    module.exports = Radio;

});