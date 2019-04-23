"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

require("regenerator-runtime/runtime");

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _fetchWithMiddleware = _interopRequireDefault(require("../fetchWithMiddleware"));

var _RelayRequest = _interopRequireDefault(require("../RelayRequest"));

var _RelayResponse = _interopRequireDefault(require("../RelayResponse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

describe('fetchWithMiddleware', function () {
  beforeEach(function () {
    _fetchMock["default"].restore();
  });
  it('should make a successfull request without middlewares',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var req, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _fetchMock["default"].post('/graphql', {
              id: 1,
              data: {
                user: 123
              }
            });

            req = new _RelayRequest["default"]({}, {}, {}, null);
            _context.next = 4;
            return (0, _fetchWithMiddleware["default"])(req, [], []);

          case 4:
            res = _context.sent;
            expect(res.data).toEqual({
              user: 123
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('should make a successfull request with middlewares',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var numPlus5, numMultiply10, req, res;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            numPlus5 = function numPlus5(next) {
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
                            req.fetchOpts.headers.reqId += ':mw1';
                            _context2.next = 3;
                            return next(req);

                          case 3:
                            res = _context2.sent;
                            res.data.text += ':mw1';
                            return _context2.abrupt("return", res);

                          case 6:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x) {
                    return _ref3.apply(this, arguments);
                  };
                }()
              );
            };

            numMultiply10 = function numMultiply10(next) {
              return (
                /*#__PURE__*/
                function () {
                  var _ref4 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee3(req) {
                    var res;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            req.fetchOpts.headers.reqId += ':mw2';
                            _context3.next = 3;
                            return next(req);

                          case 3:
                            res = _context3.sent;
                            res.data.text += ':mw2';
                            return _context3.abrupt("return", res);

                          case 6:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x2) {
                    return _ref4.apply(this, arguments);
                  };
                }()
              );
            };

            _fetchMock["default"].post('/graphql', {
              id: 1,
              data: {
                text: 'response'
              }
            });

            req = new _RelayRequest["default"]({}, {}, {}, null);
            req.fetchOpts.headers = {
              reqId: 'request'
            };
            _context4.next = 7;
            return (0, _fetchWithMiddleware["default"])(req, [numPlus5, numMultiply10], []);

          case 7:
            res = _context4.sent;
            expect(res.data.text).toEqual('response:mw2:mw1');
            expect(_fetchMock["default"].lastOptions().headers.reqId).toEqual('request:mw1:mw2');

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  it('should fail correctly on network failure',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    var req;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql',
              response: {
                "throws": new Error('Network connection error')
              },
              method: 'POST'
            });

            req = new _RelayRequest["default"]({}, {}, {}, null);
            expect.assertions(2);
            _context5.prev = 3;
            _context5.next = 6;
            return (0, _fetchWithMiddleware["default"])(req, [], []);

          case 6:
            _context5.next = 12;
            break;

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](3);
            expect(_context5.t0 instanceof Error).toBeTruthy();
            expect(_context5.t0.toString()).toMatch('Network connection error');

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 8]]);
  })));
  it('should handle error response',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6() {
    var req;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  errors: [{
                    location: 1,
                    message: 'major error'
                  }]
                }
              },
              method: 'POST'
            });

            req = new _RelayRequest["default"]({}, {}, {}, null);
            expect.assertions(2);
            _context6.prev = 3;
            _context6.next = 6;
            return (0, _fetchWithMiddleware["default"])(req, [], []);

          case 6:
            _context6.next = 12;
            break;

          case 8:
            _context6.prev = 8;
            _context6.t0 = _context6["catch"](3);
            expect(_context6.t0 instanceof Error).toBeTruthy();
            expect(_context6.t0.toString()).toMatch('major error');

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[3, 8]]);
  })));
  it('should not throw if noThrow set',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7() {
    var req, res;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  errors: [{
                    location: 1,
                    message: 'major error'
                  }]
                }
              },
              method: 'POST'
            });

            req = new _RelayRequest["default"]({}, {}, {}, null);
            expect.assertions(1);
            _context7.next = 5;
            return (0, _fetchWithMiddleware["default"])(req, [], [], true);

          case 5:
            res = _context7.sent;
            expect(res.errors).toEqual([{
              location: 1,
              message: 'major error'
            }]);

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  })));
  it('should handle server non-2xx errors',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8() {
    var req;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql',
              response: {
                status: 500,
                body: 'Something went completely wrong.'
              },
              method: 'POST'
            });

            req = new _RelayRequest["default"]({}, {}, {}, null);
            expect.assertions(2);
            _context8.prev = 3;
            _context8.next = 6;
            return (0, _fetchWithMiddleware["default"])(req, [], []);

          case 6:
            _context8.next = 12;
            break;

          case 8:
            _context8.prev = 8;
            _context8.t0 = _context8["catch"](3);
            expect(_context8.t0 instanceof Error).toBeTruthy();
            expect(_context8.t0.toString()).toMatch('Something went completely wrong');

          case 12:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[3, 8]]);
  })));
  it('should fail on missing `data` property',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9() {
    var req;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {},
                sendAsJson: true
              },
              method: 'POST'
            });

            req = new _RelayRequest["default"]({}, {}, {}, null);
            expect.assertions(2);
            _context9.prev = 3;
            _context9.next = 6;
            return (0, _fetchWithMiddleware["default"])(req, [], []);

          case 6:
            _context9.next = 12;
            break;

          case 8:
            _context9.prev = 8;
            _context9.t0 = _context9["catch"](3);
            expect(_context9.t0 instanceof Error).toBeTruthy();
            expect(_context9.t0.toString()).toMatch('Server return empty response.data');

          case 12:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[3, 8]]);
  })));
  it('should fail correctly with a response from a middleware cache',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11() {
    var middleware, req;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            middleware = function middleware() {
              return (
                /*#__PURE__*/
                _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee10() {
                  return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                      switch (_context10.prev = _context10.next) {
                        case 0:
                          return _context10.abrupt("return", _RelayResponse["default"].createFromGraphQL({
                            errors: [{
                              message: 'A GraphQL error occurred'
                            }]
                          }));

                        case 1:
                        case "end":
                          return _context10.stop();
                      }
                    }
                  }, _callee10);
                }))
              );
            };

            req = new _RelayRequest["default"]({}, {}, {}, null);
            expect.hasAssertions();
            _context11.prev = 3;
            _context11.next = 6;
            return (0, _fetchWithMiddleware["default"])(req, [middleware], []);

          case 6:
            _context11.next = 12;
            break;

          case 8:
            _context11.prev = 8;
            _context11.t0 = _context11["catch"](3);
            expect(_context11.t0 instanceof Error).toBeTruthy();
            expect(_context11.t0.toString()).toMatch('A GraphQL error occurred');

          case 12:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[3, 8]]);
  })));
});