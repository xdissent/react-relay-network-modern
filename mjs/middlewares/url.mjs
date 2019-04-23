function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-disable no-param-reassign */
import { isFunction } from '../utils';
export default function urlMiddleware(opts) {
  var _ref = opts || {},
      url = _ref.url,
      headers = _ref.headers,
      _ref$method = _ref.method,
      method = _ref$method === void 0 ? 'POST' : _ref$method,
      credentials = _ref.credentials,
      mode = _ref.mode,
      cache = _ref.cache,
      redirect = _ref.redirect;

  var urlOrThunk = url || '/graphql';
  var headersOrThunk = headers;
  return function (next) {
    return (
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(req) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return isFunction(urlOrThunk) ? urlOrThunk(req) : urlOrThunk;

                case 2:
                  req.fetchOpts.url = _context.sent;

                  if (!headersOrThunk) {
                    _context.next = 7;
                    break;
                  }

                  _context.next = 6;
                  return isFunction(headersOrThunk) ? headersOrThunk(req) : headersOrThunk;

                case 6:
                  req.fetchOpts.headers = _context.sent;

                case 7:
                  if (method) req.fetchOpts.method = method;
                  if (credentials) req.fetchOpts.credentials = credentials;
                  if (mode) req.fetchOpts.mode = mode;
                  if (cache) req.fetchOpts.cache = cache;
                  if (redirect) req.fetchOpts.redirect = redirect;
                  return _context.abrupt("return", next(req));

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }()
    );
  };
}