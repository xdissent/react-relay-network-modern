"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = fetchWithMiddleware;

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.array.from");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.array.reduce-right");

require("regenerator-runtime/runtime");

var _createRequestError = require("./createRequestError");

var _RelayResponse = _interopRequireDefault(require("./RelayResponse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function runFetch(req) {
  var url = req.fetchOpts.url;
  if (!url) url = '/graphql';
  if (!req.fetchOpts.headers.Accept) req.fetchOpts.headers.Accept = '*/*';

  if (!req.fetchOpts.headers['Content-Type'] && !req.isFormData()) {
    req.fetchOpts.headers['Content-Type'] = 'application/json';
  }

  return fetch(url, req.fetchOpts);
} // convert fetch response to RelayResponse object


var convertResponse = function convertResponse(next) {
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req) {
        var resFromFetch, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return next(req);

              case 2:
                resFromFetch = _context.sent;
                _context.next = 5;
                return _RelayResponse["default"].createFromFetch(resFromFetch);

              case 5:
                res = _context.sent;

                if (!(res.status && res.status >= 400)) {
                  _context.next = 8;
                  break;
                }

                throw (0, _createRequestError.createRequestError)(req, res);

              case 8:
                return _context.abrupt("return", res);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()
  );
};

function fetchWithMiddleware(req, middlewares, // works with RelayResponse
rawFetchMiddlewares, // works with raw fetch response
noThrow) {
  // $FlowFixMe
  var wrappedFetch = compose.apply(void 0, _toConsumableArray(middlewares).concat([convertResponse], _toConsumableArray(rawFetchMiddlewares)))(runFetch);
  return wrappedFetch(req).then(function (res) {
    if (!noThrow && (!res || res.errors || !res.data)) {
      throw (0, _createRequestError.createRequestError)(req, res);
    }

    return res;
  });
}
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */


function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  } else {
    var last = funcs[funcs.length - 1];
    var rest = funcs.slice(0, -1); // $FlowFixMe - Suppress error about promise not being callable

    return function () {
      return rest.reduceRight(function (composed, f) {
        return f(composed);
      }, last.apply(void 0, arguments));
    };
  }
}