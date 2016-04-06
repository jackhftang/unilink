export default class Heap {
    constructor(cmp, arr) {
        this._arr = arr || [];
        this._cmp = cmp || function (a, b) {
            return a < b;
        };
        this.heapify();
    }
    get length() {
        return this._arr.length;
    }
    isEmpty() {
        return this._arr.length === 0;
    }
    ;
    take() {
        var arr = this._arr;
        if (arr.length === 0)
            throw new Error('empty heap');
        else if (arr.length === 1)
            return arr.pop();
        else {
            var x = arr[0];
            arr[0] = arr.pop();
            this.heapDown(0);
            return x;
        }
    }
    ;
    add(x) {
        this._arr.push(x);
        this.heapUp(this.length - 1);
        return this;
    }
    ;
    peek() {
        return this._arr[0];
    }
    ;
    heapUp(i) {
        if (i === 0)
            return;
        var p = Math.floor((i - 1) / 2);
        var arr = this._arr;
        var cmp = this._cmp;
        if (cmp(arr[i], arr[p])) {
            var t = arr[i];
            arr[i] = arr[p];
            arr[p] = t;
            this.heapUp(p);
        }
    }
    ;
    heapDown(i) {
        var arr = this._arr;
        var cmp = this._cmp;
        var min = function (a, b) {
            if (b >= arr.length || cmp(arr[a], arr[b]))
                return a;
            return b;
        };
        var l = 2 * i + 1;
        var r = 2 * i + 2;
        var m = min(i, min(l, r));
        if (m !== i) {
            var t = arr[i];
            arr[i] = arr[m];
            arr[m] = t;
            this.heapDown(m);
        }
    }
    ;
    heapify() {
        var len = this.length;
        if (len === 0)
            return;
        var s = Math.floor((len - 1) / 2);
        for (var i = s; i >= 0; i--)
            this.heapDown(i);
    }
    ;
    clear() {
        if (this._arr.length !== 0)
            this._arr = [];
    }
    ;
    // O(n)
    removeAny(pred) {
        var i = 0;
        var arr = this._arr;
        while (i < arr.length) {
            var x = arr[i];
            if (pred(x)) {
                if (i === arr.length - 1)
                    arr.pop();
                else {
                    arr[i] = arr.pop();
                    this.heapDown(i);
                }
                return x;
            }
            else
                i++;
        }
        return null;
    }
    ;
    // O(n)
    removeAll(pred) {
        var i = 0;
        var cnt = 0;
        var arr = this._arr;
        while (i < arr.length) {
            var x = arr[i];
            if (pred(x)) {
                if (i === arr.length - 1)
                    arr.pop();
                else {
                    arr[i] = arr.pop();
                    this.heapDown(i);
                }
                cnt++;
            }
            else
                i++;
        }
        return cnt;
    }
    ;
}
