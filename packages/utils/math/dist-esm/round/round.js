var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to =
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, 'default', { value: mod, enumerable: true })
      : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true,
      });
  return to;
};
var __commonJS = (cb, mod) => () => (
  mod || cb((mod = { exports: {} }).exports, mod), mod.exports
);

// ../../../node_modules/lodash.round/index.js
var require_lodash = __commonJS((exports, module) => {
  var INFINITY = 1 / 0;
  var MAX_INTEGER = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000;
  var NAN = 0 / 0;
  var symbolTag = '[object Symbol]';
  var reTrim = /^\s+|\s+$/g;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  var freeGlobal =
    typeof global == 'object' && global && global.Object === Object && global;
  var freeSelf =
    typeof self == 'object' && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function('return this')();
  var objectProto = Object.prototype;
  var objectToString = objectProto.toString;
  var Symbol2 = root.Symbol;
  var nativeMin = Math.min;
  var symbolProto = Symbol2 ? Symbol2.prototype : undefined;
  var symbolToString = symbolProto ? symbolProto.toString : undefined;
  function baseToString(value) {
    if (typeof value == 'string') {
      return value;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  }
  function createRound(methodName) {
    var func = Math[methodName];
    return function (number, precision) {
      number = toNumber(number);
      precision = nativeMin(toInteger(precision), 292);
      if (precision) {
        var pair = (toString(number) + 'e').split('e'),
          value = func(pair[0] + 'e' + (+pair[1] + precision));
        pair = (toString(value) + 'e').split('e');
        return +(pair[0] + 'e' + (+pair[1] - precision));
      }
      return func(number);
    };
  }
  function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
  }
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }
  function isSymbol(value) {
    return (
      typeof value == 'symbol' ||
      (isObjectLike(value) && objectToString.call(value) == symbolTag)
    );
  }
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
      var sign = value < 0 ? -1 : 1;
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }
  function toInteger(value) {
    var result = toFinite(value),
      remainder = result % 1;
    return result === result ? (remainder ? result - remainder : result) : 0;
  }
  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject(other) ? other + '' : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value)
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : reIsBadHex.test(value)
        ? NAN
        : +value;
  }
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }
  var round = createRound('round');
  module.exports = round;
});

// src/round/round.ts
var import_lodash = __toESM(require_lodash(), 1);
var round = (value, options = {}) => {
  const { precision = 2 } = options;
  const valueRound = import_lodash.default(value, precision);
  return valueRound;
};
export { round };

export { round };
