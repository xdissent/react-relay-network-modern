"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = queryMiddleware;

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("regenerator-runtime/runtime");

var _relayRuntime = require("relay-runtime");

var _utils = require("../utils");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function queryMiddleware(opts) {
  var _ref = opts || {},
      size = _ref.size,
      ttl = _ref.ttl,
      onInit = _ref.onInit,
      allowMutations = _ref.allowMutations,
      allowFormData = _ref.allowFormData,
      clearOnMutation = _ref.clearOnMutation,
      cacheErrors = _ref.cacheErrors;

  var cache = new _relayRuntime.QueryResponseCache({
    size: size || 100,
    // 100 requests
    ttl: ttl || 15 * 60 * 1000 // 15 minutes

  });

  if ((0, _utils.isFunction)(onInit)) {
    onInit(cache);
  }

  return function (next) {
    return (
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(req) {
          var queryId, variables, res, _queryId, _variables, cachedRes, _res;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!req.isMutation()) {
                    _context.next = 4;
                    break;
                  }

                  if (clearOnMutation) {
                    cache.clear();
                  }

                  if (allowMutations) {
                    _context.next = 4;
                    break;
                  }

                  return _context.abrupt("return", next(req));

                case 4:
                  if (!(req.isFormData() && !allowFormData)) {
                    _context.next = 6;
                    break;
                  }

                  return _context.abrupt("return", next(req));

                case 6:
                  if (!(req.cacheConfig && req.cacheConfig.force)) {
                    _context.next = 14;
                    break;
                  }

                  queryId = req.getID();
                  variables = req.getVariables();
                  _context.next = 11;
                  return next(req);

                case 11:
                  res = _context.sent;

                  if (!res.errors || res.errors && cacheErrors) {
                    cache.set(queryId, variables, res);
                  }

                  return _context.abrupt("return", res);

                case 14:
                  _context.prev = 14;
                  _queryId = req.getID();
                  _variables = req.getVariables();
                  cachedRes = cache.get(_queryId, _variables);

                  if (!cachedRes) {
                    _context.next = 20;
                    break;
                  }

                  return _context.abrupt("return", cachedRes);

                case 20:
                  _context.next = 22;
                  return next(req);

                case 22:
                  _res = _context.sent;

                  if (!_res.errors || _res.errors && cacheErrors) {
                    cache.set(_queryId, _variables, _res);
                  }

                  return _context.abrupt("return", _res);

                case 27:
                  _context.prev = 27;
                  _context.t0 = _context["catch"](14);
                  // if error, just log it to console
                  console.log(_context.t0); // eslint-disable-line

                case 30:
                  return _context.abrupt("return", next(req));

                case 31:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[14, 27]]);
        }));

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }()
    );
  };
}