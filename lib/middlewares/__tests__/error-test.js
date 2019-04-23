"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("regenerator-runtime/runtime");

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _RelayNetworkLayer = _interopRequireDefault(require("../../RelayNetworkLayer"));

var _mockReq = require("../../__mocks__/mockReq");

var _error = _interopRequireDefault(require("../error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

describe('middlewares/error', function () {
  beforeEach(function () {
    _fetchMock["default"].restore();
  });
  it('should display graphql errors',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var logger, rnl;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  errors: [{
                    message: 'Wow!',
                    stack: ['Error: Wow!', '    at resolve (/Volumes/npm_ram_disk/build/development/webpack:/src/schema/cabinet/cabinet.js:492:1)', '    at resolveFieldValueOrError (/Volumes/npm_ram_disk/node_modules/graphql/execution/execute.js:498:12)', '    at resolveField (/Volumes/npm_ram_disk/node_modules/graphql/execution/execute.js:462:16)', '    at /Volumes/npm_ram_disk/node_modules/graphql/execution/execute.js:311:18', '    at Array.reduce (<anonymous>)', '    at executeFields (/Volumes/npm_ram_disk/node_modules/graphql/execution/execute.js:308:42)', '    at collectAndExecuteSubfields (/Volumes/npm_ram_disk/node_modules/graphql/execution/execute.js:746:10)', '    at completeObjectValue (/Volumes/npm_ram_disk/node_modules/graphql/execution/execute.js:728:10)', '    at completeValue (/Volumes/npm_ram_disk/node_modules/graphql/execution/execute.js:625:12)', '    at /Volumes/npm_ram_disk/node_modules/graphql/execution/execute.js:582:14', '    at <anonymous>', '    at process._tickDomainCallback (internal/process/next_tick.js:228:7)']
                  }]
                }
              },
              method: 'POST'
            });

            logger = jest.fn();
            rnl = new _RelayNetworkLayer["default"]([(0, _error["default"])({
              logger: logger
            })]);
            _context.next = 5;
            return (0, _mockReq.mockReq)('MyRequest').execute(rnl)["catch"](function () {});

          case 5:
            expect(logger).toHaveBeenCalledTimes(1);
            expect(logger.mock.calls[0][0]).toMatchSnapshot();

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
});