export default class StringSet {
    constructor() {
        this.cnt = 0;
        this._bag = {};
    }
    static singleton(str) {
        var s = new StringSet();
        s.add(str);
        return s;
    }
    static fromArray(arr) {
        var s = new StringSet();
        for (var i = 0; i < arr.legnth; i++) {
            s.add(arr[i]);
        }
        return s;
    }
    get cardinal() {
        return this.cnt;
    }
    add(str) {
        str = str.toString();
        var t = this._bag[str];
        if (!t) {
            this._bag[str] = true;
            this.cnt += 1;
        }
        return this;
    }
    ;
    remove(str) {
        var t = this._bag[str];
        if (t) {
            delete this._bag[str];
            this.cnt -= 1;
            return t;
        }
        return null;
    }
    ;
    isMember(str) {
        return str in this._bag;
    }
    ;
    members() {
        return Object.keys(this._bag);
    }
    ;
    forEach(callback) {
        var xs = Object.keys(this._bag);
        for (var i = 0; i < xs.length; i++)
            callback(xs[i]);
    }
    ;
    toArray() {
        return Object.keys(this._bag);
    }
    ;
}
