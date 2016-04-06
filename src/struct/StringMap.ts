export default class StringMap {
  _map : Object;

  constructor(){
    this._map = {}
  }

  get(key){
    var k = key.toString();
    return this._map[k]
  };

  set(key, val){
    var k = key.toString();
    this._map[k] = val;
    return this
  };

  setnx(key,val){
    var k = key.toString();
    var v = this._map[k];
    if(typeof v === 'undefined') this._map[k] = val;
    return this
  };

  modify(key,val,f){
    var k = key.toString();
    var v = this._map[k];
    return this._map[k] = f(v,val)
  };

  getset(key,val){
    var k = key.toString();
    var t = this._map[k];
    this._map[k] = val;
    return t
  };

  getdel(key){
    var k = key.toString();
    var t = this._map[k];
    delete this._map[k];
    return t
  };

// avoid to use keyword delete
  del(key){
    var k = key.toString();
    var t = this._map[k];
    delete this._map[k];
    return t
  };

  keys(){
    return Object.keys(this._map)
  };

  vals(){
    var ks = Object.keys(this._map);
    var arr = new Array(ks.length);
    for(var i=ks.length; i--;) arr[i] = this._map[ks[i]]
    return arr
  };

  has(key){
    var k = key.toString();
    return k in this._map
  };

  getAll(){
    var arr = [];
    var keys = this.keys();
    for(var i=0; i<keys.length; i++){
      var k = keys[i];
      arr.push(k);
      arr.push(this._map[k])
    }
    return arr
  };

  forEach(callback){
    var ks = this.keys();
    for(var i=ks.length; i--; ){
      var k = ks[i];
      var v = this.get(k);
      callback.call(null, k, v)
    }
  };
}

