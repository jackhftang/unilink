import StringSet from './StringSet';
///////////////////////////////////////////////////////////
// helper
function toArray(x) {
    if (Array.isArray(x))
        return x;
    else if (typeof x === 'undefined' || x === null)
        return [];
    return [x];
}
///////////////////////////////////////////////////////////
// TagSet
export default class TagSet {
    constructor() {
        this._cnt = 0;
        this._bag = {}; // map id -> { tags, val }
        this._tags = {}; // map tag -> StringSet
    }
    add(obj, tags) {
        var id = '_' + this._cnt++;
        var arr = toArray(tags);
        // add to set
        this._bag[id] = {
            tags: StringSet.fromArray(arr),
            val: obj
        };
        // add to tags
        for (var i = 0; i < arr.length; i++)
            this.addTag(id, arr[i]);
        return id;
    }
    ;
    getTags(id) {
        var s = this._bag[id];
        if (!s)
            return [];
        return s.tags.concat(); // make a copy
    }
    ;
    addTag(id, tag) {
        // backward lookup
        var x = this._bag[id];
        if (!x)
            return false;
        x.tags.add(tag);
        // forward lookup
        var s = this._tags[tag];
        if (s)
            s.add(id);
        else
            this._tags[tag] = StringSet.singleton(id);
        return true;
    }
    ;
    removeTag(id, tag) {
        // backward lookup
        var x = this._bag[id];
        if (!x)
            return false;
        x.tags.remove(tag);
        // forward lookup
        var s = this._tags[tag];
        if (s) {
            s.remove(id);
            if (s.cardinal === 0)
                delete this._tags[tag];
            return true;
        }
        else {
            return false;
        }
    }
    ;
    updateTag(id, tags) {
        var x = this._bag[id];
        if (!x)
            return false;
        var left = x.tags.members().sort();
        var right = tags.sort();
        var i = 0;
        var j = 0;
        while (true) {
            if (i == left.length && j == right.length) {
                break;
            }
            else if (i == left.length) {
                // add right tags
                this.addTag(id, right[j]);
                j++;
            }
            else if (j == right.length) {
                // remove left tags
                this.removeTag(id, left[i]);
                i++;
            }
            else {
                // compare tags
                var t1 = left[i];
                var t2 = right[j];
                if (t1 === t2) {
                    i++;
                    j++;
                }
                else if (t1 < t2) {
                    this.removeTag(id, left[i]);
                    i++;
                }
                else {
                    this.addTag(id, right[j]);
                    j++;
                }
            }
        }
        x.tags = right;
        return true;
    }
    ;
    remove(id) {
        var self = this;
        var x = this._bag[id];
        if (!x)
            return null;
        x.tags.forEach(function (t) {
            self.removeTag(id, t);
        });
        return x;
    }
    ;
    get(id) {
        var x = this._bag[id];
        if (x)
            return x.val; // allow to modify value
        return null;
    }
    ;
    members(tag) {
        var self = this;
        var ids = this._tags[tag];
        if (!ids)
            return [];
        return ids.members().map(function (id) {
            return self._bag[id].val; // allow to modify values
        });
    }
    ;
    forEach(tag, callback) {
        var self = this;
        var strSet = this._tags[tag];
        if (!strSet)
            return;
        var ids = strSet.toArray();
        var vals = ids.map(function (id) { return self._bag[id].val; });
        for (var i = 0; i < ids.length; i++)
            callback(vals[i], ids[i]);
    }
    ;
    getAll() {
        var self = this;
        var keys = Object.keys(this._bag);
        return keys.map(function (key) { return self._bag[key].val; });
    }
    ;
    cardinal(tag) {
        var s = this._tags[tag];
        if (s)
            return s.cardinal;
        return 0;
    }
    ;
}
