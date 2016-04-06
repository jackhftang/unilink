var EmitListener = (function () {
    function EmitListener(callback, ttl) {
        if (ttl === void 0) { ttl = -1; }
        this._ttl = ttl; // -1 means forever
        this._callback = callback;
    }
    EmitListener.prototype.deductLife = function () {
        if (this._ttl > 0)
            this._ttl -= 1;
    };
    ;
    EmitListener.prototype.isAlive = function () {
        return this._ttl !== 0;
    };
    ;
    EmitListener.prototype.apply = function (context, arr) {
        return this._callback.apply(context, arr);
    };
    ;
    EmitListener.prototype.call = function (context) {
        var args = new Array(arguments.length);
        for (var i = 1; i < arguments.length; i++)
            args[i] = arguments[i];
        return this._callback.apply(context, args);
    };
    ;
    return EmitListener;
})();
exports.default = EmitListener;
