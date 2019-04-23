function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import fetchMock from 'fetch-mock';
import RelayNetworkLayer from '../RelayNetworkLayer';
fetchMock.mock({
  matcher: '*',
  response: {
    data: {}
  }
});
var mockOperation = {
  kind: 'Batch',
  fragment: {}
};
describe('RelayNetworkLayer', function () {
  it('should call middlewares',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var mw1, mw2, network;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mw1 = jest.fn(function (next) {
              return next;
            });
            mw2 = jest.fn(function (next) {
              return next;
            });
            network = new RelayNetworkLayer([null, mw1, undefined, mw2]);
            _context.next = 5;
            return network.execute(mockOperation, {}, {});

          case 5:
            expect(mw1).toHaveBeenCalled();
            expect(mw2).toHaveBeenCalled();

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  describe('sync middleware', function () {
    it('should return payload from sync middleware, without calling async middlewares',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var asyncMW, syncMW, network;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              asyncMW = jest.fn(function (next) {
                return next;
              });
              syncMW = {
                execute: function execute() {
                  return {
                    data: {}
                  };
                }
              };
              network = new RelayNetworkLayer([syncMW, asyncMW]);
              _context2.next = 5;
              return network.execute(mockOperation, {}, {});

            case 5:
              expect(asyncMW).not.toHaveBeenCalled();

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    it('should call async middlewares, if sync middleware returns undefined',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var asyncMW, syncMW, network;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              asyncMW = jest.fn(function (next) {
                return next;
              });
              syncMW = {
                execute: function execute() {
                  return undefined;
                }
              };
              network = new RelayNetworkLayer([syncMW, asyncMW]);
              _context3.next = 5;
              return network.execute(mockOperation, {}, {});

            case 5:
              expect(asyncMW).toHaveBeenCalled();

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
  });
  describe('beforeFetch option', function () {
    it('should return payload from beforeFetch, without calling async middlewares',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var asyncMW, network;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              asyncMW = jest.fn(function (next) {
                return next;
              });
              network = new RelayNetworkLayer([asyncMW], {
                beforeFetch: function beforeFetch() {
                  return {
                    data: {}
                  };
                }
              });
              _context4.next = 4;
              return network.execute(mockOperation, {}, {});

            case 4:
              expect(asyncMW).not.toHaveBeenCalled();

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
    it('should call async middlewares, if beforeFetch returns undefined',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var asyncMW, network;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              asyncMW = jest.fn(function (next) {
                return next;
              });
              network = new RelayNetworkLayer([asyncMW], {
                beforeFetch: function beforeFetch() {
                  return undefined;
                }
              });
              _context5.next = 4;
              return network.execute(mockOperation, {}, {});

            case 4:
              expect(asyncMW).toHaveBeenCalled();

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
  });
  it('should correctly call raw middlewares',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9() {
    var regularMiddleware, createRawMiddleware, network, observable, result;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  data: {
                    text: 'response'
                  }
                },
                sendAsJson: true
              },
              method: 'POST'
            });

            regularMiddleware = function regularMiddleware(next) {
              return (
                /*#__PURE__*/
                function () {
                  var _ref7 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee6(req) {
                    var res;
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            req.fetchOpts.headers.reqId += ':regular';
                            _context6.next = 3;
                            return next(req);

                          case 3:
                            res = _context6.sent;
                            res.data.text += ':regular';
                            return _context6.abrupt("return", res);

                          case 6:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6);
                  }));

                  return function (_x) {
                    return _ref7.apply(this, arguments);
                  };
                }()
              );
            };

            createRawMiddleware = function createRawMiddleware(id) {
              var rawMiddleware = function rawMiddleware(next) {
                return (
                  /*#__PURE__*/
                  function () {
                    var _ref8 = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee8(req) {
                      var res, parentJsonFN;
                      return regeneratorRuntime.wrap(function _callee8$(_context8) {
                        while (1) {
                          switch (_context8.prev = _context8.next) {
                            case 0:
                              req.fetchOpts.headers.reqId += ":raw" + id;
                              _context8.next = 3;
                              return next(req);

                            case 3:
                              res = _context8.sent;
                              parentJsonFN = res.json;
                              res.json =
                              /*#__PURE__*/
                              _asyncToGenerator(
                              /*#__PURE__*/
                              regeneratorRuntime.mark(function _callee7() {
                                var json;
                                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                                  while (1) {
                                    switch (_context7.prev = _context7.next) {
                                      case 0:
                                        _context7.next = 2;
                                        return parentJsonFN.bind(res)();

                                      case 2:
                                        json = _context7.sent;
                                        json.data.text += ":raw" + id;
                                        return _context7.abrupt("return", json);

                                      case 5:
                                      case "end":
                                        return _context7.stop();
                                    }
                                  }
                                }, _callee7);
                              }));
                              return _context8.abrupt("return", res);

                            case 7:
                            case "end":
                              return _context8.stop();
                          }
                        }
                      }, _callee8);
                    }));

                    return function (_x2) {
                      return _ref8.apply(this, arguments);
                    };
                  }()
                );
              };

              rawMiddleware.isRawMiddleware = true;
              return rawMiddleware;
            }; // rawMiddlewares should be called the last


            network = new RelayNetworkLayer([createRawMiddleware(1), createRawMiddleware(2), regularMiddleware]);
            observable = network.execute(mockOperation, {}, {});
            _context9.next = 7;
            return observable.toPromise();

          case 7:
            result = _context9.sent;
            expect(fetchMock.lastOptions().headers.reqId).toEqual('undefined:regular:raw1:raw2');
            expect(result.data).toEqual({
              text: 'undefined:raw2:raw1:regular'
            });

          case 10:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  })));
});