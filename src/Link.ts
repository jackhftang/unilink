import TimedCallback from './lib/TimedCallback';
import EmitListener from './lib/EmitListener';
import * as Tool from './lib/Tool';
import TagSet from './struct/TagSet';

const uid = Tool.sequenceGenerator();

const TYPE_EMIT     = 0;
const TYPE_REQUEST  = 1;
const TYPE_REPLY    = 2;

export default class Link {
  send;
  _emitListeners;
  _requestListeners;
  _callbacks;

  constructor(){
    this.send = null;
    this._emitListeners = new TagSet();
    this._requestListeners = new Map();
    this._callbacks = new Map()
  }

  feed(inst){
    var link = this;
    var type = inst[0];
    var context = null;

    if(type === TYPE_EMIT){
      var event = inst[1];
      var data = inst[2];
      link._emitListeners.forEach(event, function(listener,id){
        listener.apply(context, data);
        listener.deductLife();
        if( !listener.isAlive() ) link.removeEmitListener(id)
      })
    }
    else if(type === TYPE_REQUEST){
      var event = inst[1];
      var data = inst[2];
      var cbid = inst[3];
      var listener = this._requestListeners.get(event);
      var done = function(){
        var data = Array.prototype.slice.call(arguments);
        link.send([TYPE_REPLY, data, cbid])
      };
      if(listener) listener.call(context, data, done);
      else throw new Error('no listeners');   // should not happen
    }
    else if(type === TYPE_REPLY){
      var data = inst[1];
      var cbid = inst[2];
      var cb = link._callbacks.get(cbid);
      link._callbacks.delete(cbid);
      if(cb) cb.apply(context, data)
    }
    else {
      console.log('unknown type', type)
    }
  }

  emitArray(event, arr){
    this.send([TYPE_EMIT, event, arr]);
    return this;
  }

  emit(event){
    var args = Array.prototype.slice.call(arguments, 1);
    return this.emitArray(event, args)
  }

  on(events, callback, ttl){
    var listener = new EmitListener(callback,ttl);
    return this._emitListeners.add(listener, events)
  }

  once(event, callback){
    return this.on(event, callback, 1)
  };

  removeEmitListener(id){
    return this._emitListeners.remove(id)
  };

  // callback: function(err, arg1, arg2, ...)
  request(event, data, callback, ttw){
    let cbid = uid();
    let cb = new TimedCallback(callback, ttw, (wait) => {
      this._callbacks.delete(cbid);
      callback('timeout after ' + wait + 'ms')
    });
    this._callbacks.set(cbid, cb);
    cb.start(this);
    this.send([TYPE_REQUEST, event, data, cbid]);
    return this;
  };

  // callback: function(data, rep)
  // rep: function(err, arg1, arg2, ...)
  reply(event, callback){
    var b = this._requestListeners.has(event);
    if(b) throw new Error('multiple reply on ' + event);
    this._requestListeners.set(event, callback);
    return this
  }

  removeRequestListener(event){
    return this._requestListeners.delete(event)
  }

}










