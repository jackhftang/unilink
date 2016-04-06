var TimedCallback_1 = require('./lib/TimedCallback');
var EmitListener_1 = require('./lib/EmitListener');
var Tool = require('./lib/Tool');
var TagSet_1 = require('./struct/TagSet');
var StringMap_1 = require('./struct/StringMap');
var uid = Tool.sequenceGenerator();
var TYPE_EMIT = 0;
var TYPE_REQUEST = 1;
var TYPE_REPLY = 2;
var Link = (function () {
    function Link() {
        this.send = null;
        this._emitListeners = new TagSet_1.default();
        this._requestListeners = new StringMap_1.default();
        this._callbacks = new StringMap_1.default();
    }
    Link.prototype.feed = function (inst) {
        var link = this;
        var type = inst[0];
        var context = null;
        if (type === TYPE_EMIT) {
            var event = inst[1];
            var data = inst[2];
            link._emitListeners.forEach(event, function (listener, id) {
                listener.apply(context, data);
                listener.deductLife();
                if (!listener.isAlive())
                    link.removeEmitListener(id);
            });
        }
        else if (type === TYPE_REQUEST) {
            var event = inst[1];
            var data = inst[2];
            var cbid = inst[3];
            var listener = this._requestListeners.get(event);
            var done = function () {
                var data = Array.prototype.slice.call(arguments);
                link.send([TYPE_REPLY, data, cbid]);
            };
            if (listener)
                listener.call(context, data, done);
            else
                throw new Error('no listeners'); // should not happen
        }
        else if (type === TYPE_REPLY) {
            var data = inst[1];
            var cbid = inst[2];
            var cb = link._callbacks.get(cbid);
            link._callbacks.del(cbid);
            if (cb)
                cb.apply(context, data);
        }
        else {
            console.log('unknown type', type);
        }
    };
    Link.prototype.emitArray = function (event, arr) {
        this.send([TYPE_EMIT, event, arr]);
        return this;
    };
    Link.prototype.emit = function (event) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitArray(event, args);
    };
    Link.prototype.on = function (events, callback, ttl) {
        var listener = new EmitListener_1.default(callback, ttl);
        return this._emitListeners.add(listener, events);
    };
    Link.prototype.once = function (event, callback) {
        return this.on(event, callback, 1);
    };
    ;
    Link.prototype.removeEmitListener = function (id) {
        return this._emitListeners.remove(id);
    };
    ;
    // callback: function(err, arg1, arg2, ...)
    Link.prototype.request = function (event, data, callback, ttw) {
        var _this = this;
        var cbid = uid();
        var cb = new TimedCallback_1.default(callback, ttw, function (wait) {
            _this._callbacks.del(cbid);
            callback(new Error('timeout after ' + wait + 'ms'));
        });
        this._callbacks.set(cbid, cb);
        cb.start(this);
        this.send([TYPE_REQUEST, event, data, cbid]);
        return this;
    };
    ;
    // callback: function(data, rep)
    // rep: function(err, arg1, arg2, ...)
    Link.prototype.reply = function (event, callback) {
        var b = this._requestListeners.has(event);
        if (b)
            throw new Error('multiple reply on ' + event);
        this._requestListeners.set(event, callback);
        return this;
    };
    Link.prototype.removeRequestListener = function (event) {
        return this._requestListeners.del(event);
    };
    return Link;
})();
module.exports = Link;
