function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import fetchMock from 'fetch-mock';
import RelayNetworkLayer from '../../RelayNetworkLayer';
import { mockReq } from '../../__mocks__/mockReq';
import retryMiddleware, { delayedExecution, promiseWithTimeout } from '../retry';

function sleep(_x) {
  return _sleep.apply(this, arguments);
}

function _sleep() {
  _sleep = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee14(timeout) {
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            return _context14.abrupt("return", new Promise(function (resolve) {
              setTimeout(resolve, timeout);
            }));

          case 1:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));
  return _sleep.apply(this, arguments);
}

describe('middlewares/retry', function () {
  describe('promiseWithTimeout()', function () {
    it('should return Promise result if not reach timeout ',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var p, r;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              p = Promise.resolve(5);
              _context.next = 3;
              return promiseWithTimeout(p, 1000, function () {
                return Promise.resolve(0);
              });

            case 3:
              r = _context.sent;
              expect(r).toBe(5);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    it('should run `onTimeout` when timout is reached',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var p, onTimeout, r;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              p = new Promise(function (resolve) {
                setTimeout(function () {
                  resolve(333);
                }, 20);
              });
              onTimeout = jest.fn(function () {
                return Promise.resolve(555);
              });
              _context2.next = 4;
              return promiseWithTimeout(p, 10, onTimeout);

            case 4:
              r = _context2.sent;
              expect(onTimeout).toHaveBeenCalledTimes(1);
              expect(r).toBe(555);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
  });
  describe('delayedExecution()', function () {
    it('should run function after delay',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var execFn, _delayedExecution, promise, r;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              execFn = jest.fn(function () {
                return Promise.resolve(777);
              });
              _delayedExecution = delayedExecution(execFn, 10), promise = _delayedExecution.promise;
              _context3.next = 4;
              return sleep(5);

            case 4:
              expect(execFn).toHaveBeenCalledTimes(0);
              _context3.next = 7;
              return sleep(10);

            case 7:
              expect(execFn).toHaveBeenCalledTimes(1);
              _context3.next = 10;
              return promise;

            case 10:
              r = _context3.sent;
              expect(r).toBe(777);

            case 12:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    it('should run function immediately after `forceExec` call',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var execFn, _delayedExecution2, promise, forceExec, r;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              execFn = jest.fn(function () {
                return Promise.resolve(888);
              });
              _delayedExecution2 = delayedExecution(execFn, 1000), promise = _delayedExecution2.promise, forceExec = _delayedExecution2.forceExec;
              _context4.next = 4;
              return sleep(5);

            case 4:
              expect(execFn).toHaveBeenCalledTimes(0);
              forceExec();
              _context4.next = 8;
              return sleep(1);

            case 8:
              expect(execFn).toHaveBeenCalledTimes(1);
              _context4.next = 11;
              return promise;

            case 11:
              r = _context4.sent;
              expect(r).toBe(888);

            case 13:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
    it('should abort function after `abort` call',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var execFn, _delayedExecution3, promise, abort;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              execFn = jest.fn(function () {
                return Promise.resolve(999);
              });
              _delayedExecution3 = delayedExecution(execFn, 1000), promise = _delayedExecution3.promise, abort = _delayedExecution3.abort;
              _context5.next = 4;
              return sleep(5);

            case 4:
              expect(execFn).toHaveBeenCalledTimes(0);
              abort();
              _context5.next = 8;
              return expect(promise).rejects.toThrow(/aborted/i);

            case 8:
              expect(execFn).toHaveBeenCalledTimes(0);

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
  });
  describe('middleware', function () {
    beforeEach(
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return sleep(5);

            case 2:
              // fix: some strange error
              fetchMock.restore();

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
    it('should make retries',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      var attempt, rnl, res, reqs;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              // First 2 requests return code 500,
              // 3rd request returns code 200
              attempt = 0;
              fetchMock.mock({
                matcher: '/graphql',
                response: function response() {
                  attempt++;

                  if (attempt < 3) {
                    return {
                      status: 500,
                      body: ''
                    };
                  }

                  return {
                    status: 200,
                    body: {
                      data: 'PAYLOAD'
                    }
                  };
                },
                method: 'POST'
              });
              rnl = new RelayNetworkLayer([retryMiddleware({
                retryDelays: function retryDelays() {
                  return 1;
                },
                logger: false
              })]);
              _context7.next = 5;
              return mockReq(1).execute(rnl);

            case 5:
              res = _context7.sent;
              expect(res.data).toEqual('PAYLOAD');
              reqs = fetchMock.calls('/graphql');
              expect(reqs).toHaveLength(3);
              expect(reqs).toMatchSnapshot();

            case 10:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })));
    it('should retry request on timeout',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8() {
      var attempt, rnl, reqs;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              attempt = 0; // First 2 requests answered after 50ms
              // 3rd request returns without delay

              fetchMock.mock({
                matcher: '/graphql',
                response: function response() {
                  attempt++;
                  return new Promise(function (resolve) {
                    setTimeout(function () {
                      return resolve({
                        status: 200,
                        body: {
                          data: 'PAYLOAD'
                        }
                      });
                    }, attempt <= 2 ? 100 : 0);
                  });
                },
                method: 'POST'
              });
              rnl = new RelayNetworkLayer([retryMiddleware({
                fetchTimeout: 20,
                retryDelays: function retryDelays() {
                  return 1;
                },
                logger: false
              })]);
              _context8.next = 5;
              return mockReq(1).execute(rnl);

            case 5:
              reqs = fetchMock.calls('/graphql');
              expect(reqs).toHaveLength(3);
              expect(reqs).toMatchSnapshot();

            case 8:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));
    it('should allow fetchTimeout to specify a function or number',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9() {
      var rnl;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              // returns request after 30ms
              // 3rd request should work
              fetchMock.mock({
                matcher: '/graphql',
                response: function response() {
                  return new Promise(function (resolve) {
                    setTimeout(function () {
                      return resolve({
                        status: 200,
                        body: {
                          data: 'PAYLOAD'
                        }
                      });
                    }, 30);
                  });
                },
                method: 'POST'
              });
              rnl = new RelayNetworkLayer([retryMiddleware({
                fetchTimeout: function fetchTimeout(attempt) {
                  return attempt < 2 ? 5 : 100;
                },
                retryDelays: function retryDelays() {
                  return 1;
                },
                logger: false
              })]);
              mockReq(1).execute(rnl);
              _context9.next = 5;
              return sleep(60);

            case 5:
              expect(fetchMock.calls('/graphql')).toHaveLength(3);

            case 6:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    })));
    it('should throw error on timeout',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      var rnl;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              // returns request after 100ms
              fetchMock.mock({
                matcher: '/graphql',
                response: function response() {
                  return new Promise(function (resolve) {
                    setTimeout(function () {
                      return resolve({
                        status: 200,
                        body: {
                          data: 'PAYLOAD'
                        }
                      });
                    }, 100);
                  });
                },
                method: 'POST'
              });
              rnl = new RelayNetworkLayer([retryMiddleware({
                fetchTimeout: 20,
                retryDelays: [1],
                logger: false
              })]);
              _context10.next = 4;
              return expect(mockReq(1).execute(rnl)).rejects.toThrow('Reached request timeout in 20 ms');

            case 4:
              expect(fetchMock.calls('/graphql')).toHaveLength(2);

            case 5:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
    it('should work forceRetry callback when request delayed',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      var attempt, forceRetry, rnl, resPromise;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              // First request will be fulfilled after 100ms delay
              // 2nd request and the following - without delays
              attempt = 0;
              fetchMock.mock({
                matcher: '/graphql',
                response: function response() {
                  attempt++;
                  return new Promise(function (resolve) {
                    setTimeout(function () {
                      return resolve({
                        status: 200,
                        body: {
                          data: 'PAYLOAD'
                        }
                      });
                    }, attempt === 1 ? 100 : 0);
                  });
                },
                method: 'POST'
              }); // will call force retry after 30 ms

              forceRetry = jest.fn(function (runNow) {
                setTimeout(function () {
                  runNow();
                }, 30);
              });
              rnl = new RelayNetworkLayer([retryMiddleware({
                fetchTimeout: 10,
                retryDelays: function retryDelays() {
                  return 199;
                },
                logger: false,
                forceRetry: forceRetry
              })]); // make request

              resPromise = mockReq(1).execute(rnl);
              _context11.next = 7;
              return sleep(1);

            case 7:
              // should be sended first request (server will respond after 100 ms)
              expect(fetchMock.calls('/graphql')).toHaveLength(1);
              _context11.next = 10;
              return sleep(10);

            case 10:
              // after 10 ms should be reached `fetchTimeout`
              // so middleware hang request
              // and starts 199ms delayed period before making a new request
              // when delay period was started, should be called forceRetry method
              expect(forceRetry).toHaveBeenCalledTimes(1); // second arg of forceRetry call should be delay period in ms

              expect(forceRetry.mock.calls[0][1]).toBe(199); // on 30 ms will be called `runNow` function

              _context11.next = 14;
              return sleep(50);

            case 14:
              // so Middlware should made second request under the hood
              expect(fetchMock.calls('/graphql')).toHaveLength(2);
              _context11.t0 = expect;
              _context11.next = 18;
              return resPromise;

            case 18:
              _context11.t1 = _context11.sent.data;
              (0, _context11.t0)(_context11.t1).toBe('PAYLOAD');
              _context11.next = 22;
              return sleep(200);

            case 22:
              expect(fetchMock.calls('/graphql')).toHaveLength(2);

            case 23:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    })));
    it('should call `beforeRetry` when request delayed',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      var attempt, beforeRetry, rnl, resPromise;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              // First request will be fulfilled after 100ms delay
              // 2nd request and next without delays
              attempt = 0;
              fetchMock.mock({
                matcher: '/graphql',
                response: function response() {
                  attempt++;
                  return new Promise(function (resolve) {
                    setTimeout(function () {
                      return resolve({
                        status: 200,
                        body: {
                          data: 'PAYLOAD'
                        }
                      });
                    }, attempt === 1 ? 100 : 0);
                  });
                },
                method: 'POST'
              }); // will call force retry after 30 ms

              beforeRetry = jest.fn(function (_ref13) {
                var forceRetry = _ref13.forceRetry;
                setTimeout(function () {
                  forceRetry();
                }, 30);
              });
              rnl = new RelayNetworkLayer([retryMiddleware({
                fetchTimeout: 10,
                retryDelays: function retryDelays() {
                  return 999;
                },
                logger: false,
                beforeRetry: beforeRetry
              })]); // make request

              resPromise = mockReq(1).execute(rnl);
              _context12.next = 7;
              return sleep(1);

            case 7:
              // should be sended first request (server will respond after 100 ms)
              expect(fetchMock.calls('/graphql')).toHaveLength(1);
              _context12.next = 10;
              return sleep(10);

            case 10:
              // after 10 ms should be reached `fetchTimeout`
              // so middleware hang request
              // and starts 1000ms delayed period before making a new request
              // when delay period was started, should be called forceRetry method
              expect(beforeRetry).toHaveBeenCalledTimes(1);
              expect(beforeRetry.mock.calls[0][0]).toEqual({
                attempt: 1,
                delay: 999,
                forceRetry: expect.anything(),
                abort: expect.anything(),
                lastError: expect.objectContaining({
                  message: 'Reached request timeout in 10 ms'
                }),
                req: expect.anything()
              }); // on 30 ms will be called `forceRetry` function

              _context12.next = 14;
              return sleep(50);

            case 14:
              // so we make second request before delay period will end
              expect(fetchMock.calls('/graphql')).toHaveLength(2);
              _context12.t0 = expect;
              _context12.next = 18;
              return resPromise;

            case 18:
              _context12.t1 = _context12.sent.data;
              (0, _context12.t0)(_context12.t1).toBe('PAYLOAD');

            case 20:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    })));
    it('should call `beforeRetry` and reject request if called `abort`',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      var attempt, customAbortedMsg, beforeRetry, rnl, resPromise;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              // First request will be fulfilled after 100ms delay
              // 2nd request and further - without delays
              attempt = 0;
              customAbortedMsg = 'custom aborted in before beforeRetry';
              fetchMock.mock({
                matcher: '/graphql',
                response: function response() {
                  attempt++;
                  return new Promise(function (resolve) {
                    setTimeout(function () {
                      return resolve({
                        status: 200,
                        body: {
                          data: 'PAYLOAD'
                        }
                      });
                    }, attempt === 1 ? 100 : 0);
                  });
                },
                method: 'POST'
              }); // will call force retry after 30 ms

              beforeRetry = jest.fn(function (_ref15) {
                var abort = _ref15.abort;
                abort(customAbortedMsg);
              });
              rnl = new RelayNetworkLayer([retryMiddleware({
                fetchTimeout: 10,
                retryDelays: function retryDelays() {
                  return 999;
                },
                logger: false,
                beforeRetry: beforeRetry
              })]); // make request

              resPromise = mockReq(1).execute(rnl);
              _context13.next = 8;
              return sleep(1);

            case 8:
              // should be sended first request (server will respond after 100 ms)
              expect(fetchMock.calls('/graphql')).toHaveLength(1);
              _context13.next = 11;
              return sleep(10);

            case 11:
              // after 10 ms should be reached `fetchTimeout`
              // so middleware hang request
              // and starts 1000ms delayed period before making a new request
              // when delay period was started, should be called `abort` method
              expect(beforeRetry).toHaveBeenCalledTimes(1);
              expect(beforeRetry.mock.calls[0][0]).toEqual({
                attempt: 1,
                delay: 999,
                forceRetry: expect.anything(),
                abort: expect.anything(),
                lastError: expect.objectContaining({
                  message: 'Reached request timeout in 10 ms'
                }),
                req: expect.anything()
              });
              _context13.next = 15;
              return expect(resPromise).rejects.toThrow(customAbortedMsg);

            case 15:
              // we should not make second request
              expect(fetchMock.calls('/graphql')).toHaveLength(1);

            case 16:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    })));
  });
});