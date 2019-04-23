function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-disable no-await-in-loop */
function createProgressHandler(opts) {
  var _ref = opts || {},
      onProgress = _ref.onProgress,
      _ref$sizeHeader = _ref.sizeHeader,
      sizeHeader = _ref$sizeHeader === void 0 ? 'Content-Length' : _ref$sizeHeader;

  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(res) {
        var body, headers, totalResponseSize, totalSize, reader, completed, runningTotal, step, done, value, length;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                body = res.body, headers = res.headers;

                if (body) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return");

              case 3:
                totalResponseSize = headers.get(sizeHeader);
                totalSize = null;

                if (totalResponseSize !== null) {
                  totalSize = parseInt(totalResponseSize, 10);
                }

                reader = body.getReader();
                completed = false;
                runningTotal = 0;

              case 9:
                _context.next = 11;
                return reader.read();

              case 11:
                step = _context.sent;
                done = step.done, value = step.value;
                length = value && value.length || 0;
                completed = done;

                if (!completed) {
                  runningTotal += length;
                  onProgress(runningTotal, totalSize);
                }

              case 16:
                if (!completed) {
                  _context.next = 9;
                  break;
                }

              case 17:
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
}

export default function progressMiddleware(opts) {
  var progressHandler = createProgressHandler(opts);

  var mw = function mw(next) {
    return (
      /*#__PURE__*/
      function () {
        var _ref3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2(req) {
          var res;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return next(req);

                case 2:
                  res = _context2.sent;
                  progressHandler(res.clone());
                  return _context2.abrupt("return", res);

                case 5:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function (_x2) {
          return _ref3.apply(this, arguments);
        };
      }()
    );
  };

  mw.isRawMiddleware = true;
  return mw;
}