"use strict";

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.promise");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.string.iterator");

require("regenerator-runtime/runtime");

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _formData = _interopRequireDefault(require("form-data"));

var _ = require("../..");

var _mockReq = require("../../__mocks__/mockReq");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

global.FormData = _formData["default"];
describe('middlewares/batch', function () {
  beforeEach(function () {
    _fetchMock["default"].restore();
  });
  it('should make a successfull single request',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var rnl, req, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _fetchMock["default"].post('/graphql', {
              data: {
                ok: 1
              }
            });

            rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)()]);
            req = (0, _mockReq.mockReq)(1);
            _context.next = 5;
            return req.execute(rnl);

          case 5:
            res = _context.sent;
            expect(res.data).toEqual({
              ok: 1
            });
            expect(_fetchMock["default"].lastOptions()).toMatchSnapshot();

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('should make a successfully batch request',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var rnl, req1, req2, _ref3, _ref4, res1, res2;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 1,
                  data: {
                    ok: 1
                  }
                }, {
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });

            rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)()]);
            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2);
            _context2.next = 6;
            return Promise.all([req1.execute(rnl), req2.execute(rnl)]);

          case 6:
            _ref3 = _context2.sent;
            _ref4 = _slicedToArray(_ref3, 2);
            res1 = _ref4[0];
            res2 = _ref4[1];
            expect(res1.data).toEqual({
              ok: 1
            });
            expect(res2.data).toEqual({
              ok: 2
            });
            expect(_fetchMock["default"].lastOptions()).toMatchSnapshot();

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  it('should make a successfully batch request with duplicate request ids',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var rnl, req1, req2, req3, _ref6, _ref7, res1, res2, res3;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 1,
                  data: {
                    ok: 1
                  }
                }, {
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });

            rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)()]);
            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2);
            req3 = (0, _mockReq.mockReq)(2);
            _context3.next = 7;
            return Promise.all([req1.execute(rnl), req2.execute(rnl), req3.execute(rnl)]);

          case 7:
            _ref6 = _context3.sent;
            _ref7 = _slicedToArray(_ref6, 3);
            res1 = _ref7[0];
            res2 = _ref7[1];
            res3 = _ref7[2];
            expect(res1.data).toEqual({
              ok: 1
            });
            expect(res2.data).toEqual({
              ok: 2
            });
            expect(res3.data).toEqual({
              ok: 2
            });
            expect(_fetchMock["default"].lastOptions()).toMatchSnapshot();

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  it('should reject if server does not return response for request',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var rnl, req1, req2, _ref9, _ref10, res1, res2;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  data: {}
                }, {
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });

            rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)()]);
            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2); // prettier-ignore

            _context4.next = 6;
            return Promise.all([req1.execute(rnl)["catch"](function (e) {
              return e;
            }), req2.execute(rnl)]);

          case 6:
            _ref9 = _context4.sent;
            _ref10 = _slicedToArray(_ref9, 2);
            res1 = _ref10[0];
            res2 = _ref10[1];
            expect(res1).toBeInstanceOf(Error);
            expect(res1.toString()).toMatch('Server does not return response for request');
            expect(res2.data).toEqual({
              ok: 2
            });
            expect(_fetchMock["default"].lastOptions()).toMatchSnapshot();

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  it('should reject if server does not return response for duplicate request ids',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    var rnl, req1, req2, req3, _ref12, _ref13, res1, res2, res3;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  data: {}
                }, {
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });

            rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)()]);
            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2);
            req3 = (0, _mockReq.mockReq)(3);
            _context5.next = 7;
            return Promise.all([req1.execute(rnl)["catch"](function (e) {
              return e;
            }), req2.execute(rnl), req3.execute(rnl)["catch"](function (e) {
              return e;
            })]);

          case 7:
            _ref12 = _context5.sent;
            _ref13 = _slicedToArray(_ref12, 3);
            res1 = _ref13[0];
            res2 = _ref13[1];
            res3 = _ref13[2];
            expect(res1).toBeInstanceOf(Error);
            expect(res1.toString()).toMatch('Server does not return response for request');
            expect(res2.data).toEqual({
              ok: 2
            });
            expect(res3).toBeInstanceOf(Error);
            expect(res3.toString()).toMatch('Server does not return response for request');
            expect(_fetchMock["default"].lastOptions()).toMatchSnapshot();

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
  it('should handle network failure',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6() {
    var rnl, req1, req2, _ref15, _ref16, res1, res2;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql/batch',
              response: {
                "throws": new Error('Network connection error')
              },
              method: 'POST'
            });

            rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)()]);
            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2);
            _context6.next = 6;
            return Promise.all([req1.execute(rnl)["catch"](function (e) {
              return e;
            }), req2.execute(rnl)["catch"](function (e) {
              return e;
            })]);

          case 6:
            _ref15 = _context6.sent;
            _ref16 = _slicedToArray(_ref15, 2);
            res1 = _ref16[0];
            res2 = _ref16[1];
            expect(res1).toBeInstanceOf(Error);
            expect(res1.toString()).toMatch('Network connection error');
            expect(res2).toBeInstanceOf(Error);
            expect(res2.toString()).toMatch('Network connection error');
            expect(_fetchMock["default"].lastOptions()).toMatchSnapshot();

          case 15:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  })));
  it('should handle server errors for one request',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7() {
    var rnl, req1, req2, _ref18, _ref19, res1, res2;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 1,
                  payload: {
                    errors: [{
                      location: 1,
                      message: 'major error'
                    }]
                  }
                }, {
                  id: 2,
                  payload: {
                    data: {
                      ok: 2
                    }
                  }
                }]
              },
              method: 'POST'
            });

            rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)()]);
            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2); // prettier-ignore

            _context7.next = 6;
            return Promise.all([req1.execute(rnl)["catch"](function (e) {
              return e;
            }), req2.execute(rnl)]);

          case 6:
            _ref18 = _context7.sent;
            _ref19 = _slicedToArray(_ref18, 2);
            res1 = _ref19[0];
            res2 = _ref19[1];
            expect(res1).toBeInstanceOf(Error);
            expect(res1.toString()).toMatch('major error');
            expect(res2.data).toEqual({
              ok: 2
            });
            expect(res2.errors).toBeUndefined();
            expect(_fetchMock["default"].lastOptions()).toMatchSnapshot();

          case 15:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  })));
  it('should handle server errors for all requests',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8() {
    var rnl, req1, req2, req3, _ref21, _ref22, res1, res2, res3;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql/batch',
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

            rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)()]);
            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2);
            req3 = (0, _mockReq.mockReq)(3);
            _context8.next = 7;
            return Promise.all([req1.execute(rnl)["catch"](function (e) {
              return e;
            }), req2.execute(rnl)["catch"](function (e) {
              return e;
            }), req3.execute(rnl)["catch"](function (e) {
              return e;
            })]);

          case 7:
            _ref21 = _context8.sent;
            _ref22 = _slicedToArray(_ref21, 3);
            res1 = _ref22[0];
            res2 = _ref22[1];
            res3 = _ref22[2];
            expect(res1.toString()).toMatch('Wrong response');
            expect(res2.toString()).toMatch('Wrong response');
            expect(res3.toString()).toMatch('Wrong response');
            expect(_fetchMock["default"].lastOptions()).toMatchSnapshot();

          case 16:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  })));
  it('should handle responses without payload wrapper',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9() {
    var rnl, req1, req2, _ref24, _ref25, res1, res2;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 1,
                  errors: [{
                    location: 1,
                    message: 'major error'
                  }]
                }, {
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });

            rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)()]);
            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2); // prettier-ignore

            _context9.next = 6;
            return Promise.all([req1.execute(rnl)["catch"](function (e) {
              return e;
            }), req2.execute(rnl)]);

          case 6:
            _ref24 = _context9.sent;
            _ref25 = _slicedToArray(_ref24, 2);
            res1 = _ref25[0];
            res2 = _ref25[1];
            expect(res1).toBeInstanceOf(Error);
            expect(res1.toString()).toMatch('major error');
            expect(res2.data).toEqual({
              ok: 2
            });
            expect(res2.errors).toBeUndefined();
            expect(_fetchMock["default"].lastOptions()).toMatchSnapshot();

          case 15:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  })));
  describe('option `batchTimeout`', function () {
    beforeEach(function () {
      _fetchMock["default"].restore();
    });
    it('should gather different requests into one batch request',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      var rnl, reqs;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _fetchMock["default"].mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }, {
                    id: 3,
                    data: {}
                  }]
                },
                method: 'POST'
              });

              rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                batchTimeout: 50
              })]);
              (0, _mockReq.mockReq)(1).execute(rnl);
              setTimeout(function () {
                return (0, _mockReq.mockReq)(2).execute(rnl);
              }, 30);
              _context10.next = 6;
              return (0, _mockReq.mockReq)(3).execute(rnl);

            case 6:
              reqs = _fetchMock["default"].calls('/graphql/batch');
              expect(reqs).toHaveLength(1);
              expect(_fetchMock["default"].lastOptions()).toMatchSnapshot();

            case 9:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
    it('should gather different requests into two batch request',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      var rnl;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _fetchMock["default"].mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }, {
                    id: 3,
                    data: {}
                  }, {
                    id: 4,
                    data: {}
                  }]
                },
                method: 'POST'
              });

              rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                batchTimeout: 100
              })]);
              (0, _mockReq.mockReq)(1).execute(rnl);
              setTimeout(function () {
                return (0, _mockReq.mockReq)(2).execute(rnl);
              }, 160);
              setTimeout(function () {
                return (0, _mockReq.mockReq)(3).execute(rnl);
              }, 170);
              (0, _mockReq.mockReq)(4).execute(rnl);
              _context11.next = 8;
              return new Promise(function (resolve, reject) {
                setTimeout(function () {
                  try {
                    var reqs = _fetchMock["default"].calls('/graphql/batch');

                    expect(reqs).toHaveLength(2);
                    expect(_fetchMock["default"].calls('/graphql/batch')).toMatchSnapshot();
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                }, 300);
              });

            case 8:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    })));
  });
  describe('option `maxBatchSize`', function () {
    beforeEach(function () {
      _fetchMock["default"].restore();
    });
    it('should split large batched requests into multiple requests',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      var rnl, req1, req2, req3, req4, req5, batchReqs, singleReqs;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _fetchMock["default"].mock({
                matcher: '/graphql',
                response: {
                  status: 200,
                  body: {
                    id: 5,
                    data: {}
                  }
                },
                method: 'POST'
              });

              _fetchMock["default"].mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }, {
                    id: 3,
                    data: {}
                  }, {
                    id: 4,
                    data: {}
                  }]
                },
                method: 'POST'
              });

              rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                maxBatchSize: 1024 * 10
              })]);
              req1 = (0, _mockReq.mockReqWithSize)(1, 1024 * 7);
              req2 = (0, _mockReq.mockReqWithSize)(2, 1024 * 2);
              req3 = (0, _mockReq.mockReqWithSize)(3, 1024 * 5);
              req4 = (0, _mockReq.mockReqWithSize)(4, 1024 * 4);
              req5 = (0, _mockReq.mockReqWithSize)(5, 1024 * 11);
              _context12.next = 10;
              return Promise.all([req1.execute(rnl), req2.execute(rnl), req3.execute(rnl), req4.execute(rnl), req5.execute(rnl)]);

            case 10:
              batchReqs = _fetchMock["default"].calls('/graphql/batch');
              singleReqs = _fetchMock["default"].calls('/graphql');
              expect(batchReqs).toHaveLength(2);
              expect(singleReqs).toHaveLength(1);

            case 14:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    })));
  });
  describe('option `allowMutations`', function () {
    beforeEach(function () {
      _fetchMock["default"].restore();
    });
    it('should not batch mutations by default',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      var rnl, singleReqs;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _fetchMock["default"].mock({
                matcher: '/graphql',
                response: {
                  status: 200,
                  body: {
                    id: 1,
                    data: {}
                  }
                },
                method: 'POST'
              });

              rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                batchTimeout: 20
              })]);
              (0, _mockReq.mockMutationReq)(1).execute(rnl);
              _context13.next = 5;
              return (0, _mockReq.mockMutationReq)(1).execute(rnl);

            case 5:
              singleReqs = _fetchMock["default"].calls('/graphql');
              expect(singleReqs).toHaveLength(2);
              expect(_fetchMock["default"].calls('/graphql')).toMatchSnapshot();

            case 8:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    })));
    it('should not batch requests with FormData',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee14() {
      var rnl, singleReqs;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _fetchMock["default"].mock({
                matcher: '/graphql',
                response: {
                  status: 200,
                  body: {
                    id: 1,
                    data: {}
                  }
                },
                method: 'POST'
              });

              rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                batchTimeout: 20
              })]);
              (0, _mockReq.mockReqWithFiles)(1).execute(rnl);
              _context14.next = 5;
              return (0, _mockReq.mockReqWithFiles)(1).execute(rnl);

            case 5:
              singleReqs = _fetchMock["default"].calls('/graphql');
              expect(singleReqs).toHaveLength(2);

            case 7:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    })));
    it('should batch mutations if `allowMutations=true`',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee15() {
      var rnl, req1, req2, batchReqs;
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _fetchMock["default"].mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }]
                },
                method: 'POST'
              });

              rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                batchTimeout: 20,
                allowMutations: true
              })]);
              req1 = (0, _mockReq.mockMutationReq)(1);
              req1.execute(rnl);
              req2 = (0, _mockReq.mockMutationReq)(2);
              _context15.next = 7;
              return req2.execute(rnl);

            case 7:
              batchReqs = _fetchMock["default"].calls('/graphql/batch');
              expect(batchReqs).toHaveLength(1);
              expect(_fetchMock["default"].lastOptions()).toMatchSnapshot();

            case 10:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    })));
    it('should not batch mutations with files if `allowMutations=true`',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee16() {
      var rnl, req1, req2, singleReqs;
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _fetchMock["default"].mock({
                matcher: '/graphql',
                response: {
                  status: 200,
                  body: {
                    id: 1,
                    data: {}
                  }
                },
                method: 'POST'
              });

              rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                batchTimeout: 20,
                allowMutations: true
              })]);
              req1 = (0, _mockReq.mockMutationReq)(1, {
                files: {
                  file1: 'data'
                }
              });
              req1.execute(rnl);
              req2 = (0, _mockReq.mockMutationReq)(2, {
                files: {
                  file1: 'data'
                }
              });
              _context16.next = 7;
              return req2.execute(rnl);

            case 7:
              singleReqs = _fetchMock["default"].calls('/graphql');
              expect(singleReqs).toHaveLength(2);

            case 9:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    })));
  });
  it('should pass fetch options',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee17() {
    var rnl, req1, req2, batchReqs;
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _fetchMock["default"].mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 1,
                  data: {}
                }, {
                  id: 2,
                  data: {}
                }]
              },
              method: 'POST'
            });

            rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
              batchTimeout: 20,
              credentials: 'include',
              mode: 'cors',
              cache: 'no-store',
              redirect: 'follow'
            })]);
            req1 = (0, _mockReq.mockReq)(1);
            req1.execute(rnl);
            req2 = (0, _mockReq.mockReq)(2);
            _context17.next = 7;
            return req2.execute(rnl);

          case 7:
            batchReqs = _fetchMock["default"].calls('/graphql/batch');
            expect(batchReqs).toHaveLength(1);
            expect(_fetchMock["default"].lastOptions()).toEqual(expect.objectContaining({
              credentials: 'include',
              mode: 'cors',
              cache: 'no-store',
              redirect: 'follow'
            }));

          case 10:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  })));
  describe('headers option', function () {
    it('`headers` option as Object',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee18() {
      var rnl, req1, req2;
      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _fetchMock["default"].mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }]
                },
                method: 'POST'
              });

              rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                headers: {
                  'custom-header': '123'
                }
              })]);
              req1 = (0, _mockReq.mockReq)(1);
              req2 = (0, _mockReq.mockReq)(2);
              _context18.next = 6;
              return Promise.all([req1.execute(rnl), req2.execute(rnl)]);

            case 6:
              expect(_fetchMock["default"].lastOptions().headers).toEqual(expect.objectContaining({
                'custom-header': '123'
              }));

            case 7:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18);
    })));
    it('`headers` option as thunk',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee19() {
      var rnl, req1, req2;
      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _fetchMock["default"].mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }]
                },
                method: 'POST'
              });

              rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                headers: function headers() {
                  return {
                    'thunk-header': '333'
                  };
                }
              })]);
              req1 = (0, _mockReq.mockReq)(1);
              req2 = (0, _mockReq.mockReq)(2);
              _context19.next = 6;
              return Promise.all([req1.execute(rnl), req2.execute(rnl)]);

            case 6:
              expect(_fetchMock["default"].lastOptions().headers).toEqual(expect.objectContaining({
                'thunk-header': '333'
              }));

            case 7:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    })));
    it('`headers` option as thunk with Promise',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee20() {
      var rnl, req1, req2;
      return regeneratorRuntime.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _fetchMock["default"].mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }]
                },
                method: 'POST'
              });

              rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                headers: function headers() {
                  return Promise.resolve({
                    'thunk-header': 'as promise'
                  });
                }
              })]);
              req1 = (0, _mockReq.mockReq)(1);
              req2 = (0, _mockReq.mockReq)(2);
              _context20.next = 6;
              return Promise.all([req1.execute(rnl), req2.execute(rnl)]);

            case 6:
              expect(_fetchMock["default"].lastOptions().headers).toEqual(expect.objectContaining({
                'thunk-header': 'as promise'
              }));

            case 7:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20);
    })));
  });
});