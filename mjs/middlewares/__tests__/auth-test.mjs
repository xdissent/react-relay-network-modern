function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import fetchMock from 'fetch-mock';
import { RelayNetworkLayer } from '../..';
import { mockReq } from '../../__mocks__/mockReq';
import authMiddleware from '../auth';
describe('middlewares/auth', function () {
  beforeEach(function () {
    fetchMock.restore();
  });
  it('`token` option as string (with default `prefix` and `header`)',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var rnl, req, res, reqs;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD'
                }
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([authMiddleware({
              token: '123',
              tokenRefreshPromise: function tokenRefreshPromise() {
                return '345';
              }
            })]);
            req = mockReq(1);
            _context.next = 5;
            return req.execute(rnl);

          case 5:
            res = _context.sent;
            expect(res.data).toEqual('PAYLOAD');
            reqs = fetchMock.calls('/graphql');
            expect(reqs).toHaveLength(1);
            expect(reqs[0][1].headers.Authorization).toBe('Bearer 123');
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('`token` option as thunk (with custom `prefix` and `header`)',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var rnl, req, res, reqs;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD'
                }
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([authMiddleware({
              token: function token() {
                return Promise.resolve('333');
              },
              tokenRefreshPromise: function tokenRefreshPromise() {
                return '345';
              },
              prefix: 'MyBearer ',
              header: 'MyAuthorization'
            })]);
            req = mockReq(1);
            _context2.next = 5;
            return req.execute(rnl);

          case 5:
            res = _context2.sent;
            expect(res.data).toEqual('PAYLOAD');
            reqs = fetchMock.calls('/graphql');
            expect(reqs).toHaveLength(1);
            expect(reqs[0][1].headers.MyAuthorization).toBe('MyBearer 333');
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  it('`tokenRefreshPromise` should be called on 401 response',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var rnl, req, reqs;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql',
              response: function response(_, opts) {
                if (opts.headers.Authorization === 'Bearer ValidToken') {
                  return {
                    status: 200,
                    body: {
                      data: 'PAYLOAD'
                    }
                  };
                }

                return {
                  status: 401,
                  body: ''
                };
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([authMiddleware({
              token: '123',
              tokenRefreshPromise: function tokenRefreshPromise() {
                return Promise.resolve('ValidToken');
              }
            })]);
            req = mockReq(1);
            _context3.next = 5;
            return req.execute(rnl);

          case 5:
            reqs = fetchMock.calls('/graphql');
            expect(reqs).toHaveLength(2);
            expect(reqs[0][1].headers.Authorization).toBe('Bearer 123');
            expect(reqs[1][1].headers.Authorization).toBe('Bearer ValidToken');
            expect(fetchMock.calls('/graphql')).toMatchSnapshot();

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  it('`tokenRefreshPromise` reset refresh token state',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var refershTokenSwitch, rnl, req, reqs;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql',
              response: function response(_, opts) {
                if (opts.headers.Authorization === 'Bearer ValidToken') {
                  return {
                    status: 200,
                    body: {
                      data: 'PAYLOAD'
                    }
                  };
                }

                return {
                  status: 401,
                  body: ''
                };
              },
              method: 'POST'
            });
            refershTokenSwitch = false;
            rnl = new RelayNetworkLayer([authMiddleware({
              token: '',
              tokenRefreshPromise: function tokenRefreshPromise() {
                if (!refershTokenSwitch) {
                  return Promise.reject(new Error('refresh token failed'));
                }

                return Promise.resolve('ValidToken');
              }
            })]);
            req = mockReq(1);
            _context4.prev = 4;
            _context4.next = 7;
            return req.execute(rnl);

          case 7:
            _context4.next = 12;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](4);
            expect(_context4.t0.message).toBe('refresh token failed');

          case 12:
            refershTokenSwitch = true;
            _context4.next = 15;
            return req.execute(rnl);

          case 15:
            reqs = fetchMock.calls('/graphql');
            expect(reqs).toHaveLength(1);

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[4, 9]]);
  })));
});