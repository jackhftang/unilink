import Heap from '../struct/Heap';

export default class TimerPool {
  static global = new TimerPool();

  _clearingInterval;
  _cnt;
  _pool;
  _timer;

  constructor(option?:{clearingInterval? : number}) {
    var opt = {
      clearingInterval: 100
    };
    if (option && option.clearingInterval) opt.clearingInterval = option.clearingInterval;

    this._clearingInterval = opt.clearingInterval;
    this._cnt = 0;
    this._pool = new Heap(function (a, b) {
      return a.time < b.time
    });
    this._timer = null;

    this.start()
  }

  start(){
    var h = this._pool;
    var run = () => {
      var now = Date.now();
      while( !h.isEmpty() && h.peek().time <= now){
        var t = h.take();
        if( t.type === 'interval' ){
          t.time += t.interval;
          h.add(t)
        }
        // hope to use setImmediate, but for compatibility
        t.action.call()
      }
      this._timer = setTimeout(run, this._clearingInterval)
    };
    run()
  };

  // not stop immediately, unit current round of timeout
  pause(){
    if(this._timer) clearTimeout(this._timer);
    this._timer = null
  };

  setTimeout(f,ms){
    var now = Date.now();
    var id = '_' + this._cnt++;
    this._pool.add({
      id: id,
      type: 'timeout',
      time: now + ms,
      action: f
    });
    return id
  };

  setInterval(f,ms){
    var now = Date.now();
    var id = '_' + this._cnt++;
    this._pool.add({
      id: id,
      type: 'interval',
      interval: ms,
      time: now + ms,
      action: f
    });
    return id
  };

  // O(n)
  clearTimer(id){
    var t = this._pool.removeAny(function(x){
      return x.id === id
    });
    return !!t
  };

}


