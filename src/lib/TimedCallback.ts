import TimerPool from './TimerPool';

const timerPool = TimerPool.global;
const MinTimeToWait = 20;
const DefaultTimeToWait = 5*1000;

export default class TimedCallback {
  _timer;
  _ttw;
  _callback;
  _timeoutCallback;

  constructor(callback, ttw, timeoutCallback) {
    this._timer = null;
    this._ttw = Math.max(ttw || DefaultTimeToWait, MinTimeToWait);
    this._callback = callback;
    this._timeoutCallback = timeoutCallback
  }

  call(context){
    var arr = Array.prototype.slice.call(arguments, 1);
    return this.apply(context,arr)
  };

  apply(context, arr){
    var cb = this._callback;
    this._callback = null;
    this._timeoutCallback = null;
    if(typeof cb === 'function') return cb.apply(context, arr);
  };

  start(context){
    var start = Date.now();
    this._timer = timerPool.setTimeout(() => {
      this._callback = null;
      if(this._timeoutCallback){
        var end = Date.now();
        this._timeoutCallback.call(context, end-start)
      }
    }, this._ttw)
  }

  isStarted(){
    return !!this._timer;
  }

}

