
export var random128 = function () {
  var d4 = function () {
    var b = 0x10000; // 4*4-bit = 16 bit
    return Math.floor(b + b * Math.random()).toString(16).slice(1)
  };
  // 128-bit is safer, see http://en.wikipedia.org/wiki/Birthday_attack
  return [d4(), d4(), d4(), d4(), d4(), d4(), d4(), d4()].join('')
};

export var random32 = function () {
  var d4 = function () {
    var b = 0x10000; // 4*4-bit = 16 bit
    return Math.floor(b + b * Math.random()).toString(16).slice(1)
  };
  // 128-bit is safer, see http://en.wikipedia.org/wiki/Birthday_attack
  return [d4(), d4()].join('')
};

export var sequenceGenerator = function () {
  var n = 0;
  return function () {
    return n++
  }
};

export var unique = function (arr, equal) {
  // must be sorted first, O(n)
  var eq = equal || function (a, b) {
      return a === b
    };
  var t = [], i = 0, j = 0;
  while (j < arr.length) {
    if (i === j) t.push(arr[i]), j++;
    else if (eq(arr[i], arr[j])) j++;
    else t.push(arr[j]), i = j++;
  }
  return t
};

export var arrayCmp = function (a, b) {
  var len = Math.min(a.length, b.length);
  for (var i = 0; i < len; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1
  }
  if (a.length < b.length) return -1;
  if (a.length > b.length) return 1;
  return 0
};

export var arrayEq = function (a, b) {
  return arrayCmp(a, b) === 0
};

export var objectUnion = function () {
  var args = arguments;
  var res = {};
  for (var i = 0; i < args.length; i++) {
    for (var j in args[i]) res[j] = args[i][j];
  }
  return res;
};
