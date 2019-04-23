"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("regenerator-runtime/runtime");

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _RelayNetworkLayer = _interopRequireDefault(require("../../RelayNetworkLayer"));

var _mockReq = require("../../__mocks__/mockReq");

var _cache = _interopRequireDefault(require("../cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function sleep(_x) {
  return _sleep.apply(this, arguments);
}

function _sleep() {
  _sleep = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(timeout) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            return _context7.abrupt("return", new Promise(function (resolve) {
              setTimeout(resolve, timeout);
            }));

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _sleep.apply(this, arguments);
}

describe('middlewares/cache', function () {
  beforeEach(function () {
    _fetchMock["default"].restore();
  });
  it('check `size` option',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var rnl, res1, res2, res3, res4, res5, res6;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD'
                }
              },
              method: 'POST'
            });

            rnl = new _RelayNetworkLayer["default"]([(0, _cache["default"])({
              size: 2
            })]); // data from fetch

            _context.next = 4;
            return (0, _mockReq.mockReq)('FirstQuery').execute(rnl);

          case 4:
            res1 = _context.sent;
            expect(res1.data).toBe('PAYLOAD');
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(1); // data from cache

            _context.next = 9;
            return (0, _mockReq.mockReq)('FirstQuery').execute(rnl);

          case 9:
            res2 = _context.sent;
            expect(res2.data).toBe('PAYLOAD');
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(1); // data from fetch

            _context.next = 14;
            return (0, _mockReq.mockReq)('SecondQuery').execute(rnl);

          case 14:
            res3 = _context.sent;
            expect(res3.data).toBe('PAYLOAD');
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(2); // data from cache

            _context.next = 19;
            return (0, _mockReq.mockReq)('SecondQuery').execute(rnl);

          case 19:
            res4 = _context.sent;
            expect(res4.data).toBe('PAYLOAD');
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(2); // data from fetch

            _context.next = 24;
            return (0, _mockReq.mockReq)('ThirdQuery').execute(rnl);

          case 24:
            res5 = _context.sent;
            expect(res5.data).toBe('PAYLOAD');
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(3); // first request should be removed from cache, cause size = 2

            _context.next = 29;
            return (0, _mockReq.mockReq)('FirstQuery').execute(rnl);

          case 29:
            res6 = _context.sent;
            expect(res6.data).toBe('PAYLOAD');
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(4);

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('check `ttl` option',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var rnl, res1, res2, res3;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD'
                }
              },
              method: 'POST'
            });

            rnl = new _RelayNetworkLayer["default"]([(0, _cache["default"])({
              ttl: 20
            })]); // data from fetch

            _context2.next = 4;
            return (0, _mockReq.mockReq)('FirstQuery').execute(rnl);

          case 4:
            res1 = _context2.sent;
            expect(res1.data).toBe('PAYLOAD');
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(1); // data from cache

            _context2.next = 9;
            return (0, _mockReq.mockReq)('FirstQuery').execute(rnl);

          case 9:
            res2 = _context2.sent;
            expect(res2.data).toBe('PAYLOAD');
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(1);
            _context2.next = 14;
            return sleep(50);

          case 14:
            _context2.next = 16;
            return (0, _mockReq.mockReq)('FirstQuery').execute(rnl);

          case 16:
            res3 = _context2.sent;
            expect(res3.data).toBe('PAYLOAD');
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(2);

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  it('do not use cache for mutations',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var rnl, res1, res2;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD'
                }
              },
              method: 'POST'
            });

            rnl = new _RelayNetworkLayer["default"]([(0, _cache["default"])()]); // data from fetch

            _context3.next = 4;
            return (0, _mockReq.mockMutationReq)('FirstQuery').execute(rnl);

          case 4:
            res1 = _context3.sent;
            expect(res1.data).toBe('PAYLOAD');
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(1); // data from cache

            _context3.next = 9;
            return (0, _mockReq.mockMutationReq)('FirstQuery').execute(rnl);

          case 9:
            res2 = _context3.sent;
            expect(res2.data).toBe('PAYLOAD');
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(2);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  it('do not use cache for FormData',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var rnl, res1, res2;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD'
                }
              },
              method: 'POST'
            });

            rnl = new _RelayNetworkLayer["default"]([(0, _cache["default"])()]); // data from fetch

            _context4.next = 4;
            return (0, _mockReq.mockFormDataReq)('FirstQuery').execute(rnl);

          case 4:
            res1 = _context4.sent;
            expect(res1.data).toBe('PAYLOAD');
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(1); // data from cache

            _context4.next = 9;
            return (0, _mockReq.mockFormDataReq)('FirstQuery').execute(rnl);

          case 9:
            res2 = _context4.sent;
            expect(res2.data).toBe('PAYLOAD');
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(2);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  it('do not use cache for responses with errors',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    var rnl;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD',
                  errors: [{
                    type: 'timeout'
                  }]
                }
              },
              method: 'POST'
            });

            rnl = new _RelayNetworkLayer["default"]([(0, _cache["default"])()]); // try fetch

            _context5.next = 4;
            return expect((0, _mockReq.mockReq)('FirstQuery').execute(rnl)).rejects.toThrow();

          case 4:
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(1); // try fetch again

            _context5.next = 7;
            return expect((0, _mockReq.mockReq)('FirstQuery').execute(rnl)).rejects.toThrow();

          case 7:
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(2);

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
  it('use cache for responses with errors and cacheErrors flag',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6() {
    var rnl;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD',
                  errors: [{
                    type: 'timeout'
                  }]
                }
              },
              method: 'POST'
            });

            rnl = new _RelayNetworkLayer["default"]([(0, _cache["default"])({
              cacheErrors: true
            })]); // try fetch

            _context6.next = 4;
            return expect((0, _mockReq.mockReq)('FirstQuery').execute(rnl)).rejects.toThrow();

          case 4:
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(1); // try fetch again

            _context6.next = 7;
            return expect((0, _mockReq.mockReq)('FirstQuery').execute(rnl)).rejects.toThrow();

          case 7:
            expect(_fetchMock["default"].calls('/graphql')).toHaveLength(1);

          case 8:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  })));
});