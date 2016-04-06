export default class EmitListener {
    constructor(callback, ttl = -1) {
        this._ttl = ttl; // -1 means forever
        this._callback = callback;
    }
    deductLife() {
        if (this._ttl > 0)
            this._ttl -= 1;
    }
    ;
    isAlive() {
        return this._ttl !== 0;
    }
    ;
    apply(context, arr) {
        return this._callback.apply(context, arr);
    }
    ;
    call(context) {
        var args = new Array(arguments.length);
        for (var i = 1; i < arguments.length; i++)
            args[i] = arguments[i];
        return this._callback.apply(context, args);
    }
    ;
}
