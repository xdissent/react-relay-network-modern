"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = authMiddleware;
exports.RRNLAuthMiddlewareError = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("regenerator-runtime/runtime");

require("core-js/modules/es6.function.name");

var _utils = require("../utils");

var _RRNLError2 = _interopRequireDefault(require("../RRNLError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RRNLAuthMiddlewareError =
/*#__PURE__*/
function (_RRNLError) {
  _inherits(RRNLAuthMiddlewareError, _RRNLError);

  function RRNLAuthMiddlewareError(msg) {
    var _this;

    _classCallCheck(this, RRNLAuthMiddlewareError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RRNLAuthMiddlewareError).call(this, msg));
    _this.name = 'RRNLAuthMiddlewareError';
    return _this;
  }

  return RRNLAuthMiddlewareError;
}(_RRNLError2["default"]);

exports.RRNLAuthMiddlewareError = RRNLAuthMiddlewareError;

function authMiddleware(opts) {
  var _ref = opts || {},
      tokenOrThunk = _ref.token,
      tokenRefreshPromise = _ref.tokenRefreshPromise,
      _ref$allowEmptyToken = _ref.allowEmptyToken,
      allowEmptyToken = _ref$allowEmptyToken === void 0 ? false : _ref$allowEmptyToken,
      _ref$prefix = _ref.prefix,
      prefix = _ref$prefix === void 0 ? 'Bearer ' : _ref$prefix,
      _ref$header = _ref.header,
      header = _ref$header === void 0 ? 'Authorization' : _ref$header;

  var tokenRefreshInProgress = null;
  return function (next) {
    return (
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(req) {
          var token, _res;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return (0, _utils.isFunction)(tokenOrThunk) ? tokenOrThunk(req) : tokenOrThunk;

                case 3:
                  token = _context.sent;

                  if (!(!token && tokenRefreshPromise && !allowEmptyToken)) {
                    _context.next = 6;
                    break;
                  }

                  throw new RRNLAuthMiddlewareError('Empty token');

                case 6:
                  if (token) {
                    req.fetchOpts.headers[header] = "".concat(prefix).concat(token);
                  }

                  _context.next = 9;
                  return next(req);

                case 9:
                  _res = _context.sent;
                  return _context.abrupt("return", _res);

                case 13:
                  _context.prev = 13;
                  _context.t0 = _context["catch"](0);

                  if (!(_context.t0 && tokenRefreshPromise)) {
                    _context.next = 20;
                    break;
                  }

                  if (!(_context.t0.message === 'Empty token' || _context.t0.res && _context.t0.res.status === 401)) {
                    _context.next = 20;
                    break;
                  }

                  if (!tokenRefreshPromise) {
                    _context.next = 20;
                    break;
                  }

                  if (!tokenRefreshInProgress) {
                    tokenRefreshInProgress = Promise.resolve(tokenRefreshPromise(req, _context.t0.res)).then(function (newToken) {
                      tokenRefreshInProgress = null;
                      return newToken;
                    })["catch"](function (err) {
                      tokenRefreshInProgress = null;
                      throw err;
                    });
                  }

                  return _context.abrupt("return", tokenRefreshInProgress.then(function (newToken) {
                    var newReq = req.clone();
                    newReq.fetchOpts.headers[header] = "".concat(prefix).concat(newToken);
                    return next(newReq); // re-run query with new token
                  }));

                case 20:
                  throw _context.t0;

                case 21:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 13]]);
        }));

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }()
    );
  };
}