function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import fetchMock from 'fetch-mock';
import RelayNetworkLayer from '../../RelayNetworkLayer';
import { mockReq } from '../../__mocks__/mockReq';
import urlMiddleware from '../url';
describe('middlewares/url', function () {
  beforeEach(function () {
    fetchMock.restore();
  });
  it('`url` option as string',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var rnl, req, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fetchMock.mock({
              matcher: '/some_url',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD'
                }
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([urlMiddleware({
              url: '/some_url'
            })]);
            req = mockReq(1);
            _context.next = 5;
            return req.execute(rnl);

          case 5:
            res = _context.sent;
            expect(res.data).toBe('PAYLOAD');
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('`url` option as thunk',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var rnl, req, res;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            fetchMock.mock({
              matcher: '/thunk_url',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD2'
                }
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([urlMiddleware({
              url: function url() {
                return '/thunk_url';
              }
            })]);
            req = mockReq(1);
            _context2.next = 5;
            return req.execute(rnl);

          case 5:
            res = _context2.sent;
            expect(res.data).toBe('PAYLOAD2');
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  it('`url` option as thunk with Promise',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var rnl, req, res;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            fetchMock.mock({
              matcher: '/thunk_url_promise',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD promise'
                }
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([urlMiddleware({
              url: function url() {
                return Promise.resolve('/thunk_url_promise');
              }
            })]);
            req = mockReq(1);
            _context3.next = 5;
            return req.execute(rnl);

          case 5:
            res = _context3.sent;
            expect(res.data).toBe('PAYLOAD promise');
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  it('`method` option',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var rnl, req, res;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            fetchMock.mock({
              matcher: '/get_url',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD3'
                }
              },
              method: 'GET'
            });
            rnl = new RelayNetworkLayer([urlMiddleware({
              url: '/get_url',
              method: 'GET'
            })]);
            req = mockReq(1);
            _context4.next = 5;
            return req.execute(rnl);

          case 5:
            res = _context4.sent;
            expect(res.data).toBe('PAYLOAD3');
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  it('`headers` option as Object',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    var rnl, req, res;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            fetchMock.mock({
              matcher: '/headers_url',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD4'
                }
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([urlMiddleware({
              url: '/headers_url',
              headers: {
                'custom-header': '123'
              }
            })]);
            req = mockReq(1);
            _context5.next = 5;
            return req.execute(rnl);

          case 5:
            res = _context5.sent;
            expect(res.data).toBe('PAYLOAD4');
            expect(fetchMock.lastOptions().headers).toEqual(expect.objectContaining({
              'custom-header': '123'
            }));

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
  it('`headers` option as thunk',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6() {
    var rnl, req, res;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            fetchMock.mock({
              matcher: '/headers_thunk',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD5'
                }
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([urlMiddleware({
              url: '/headers_thunk',
              headers: function headers() {
                return {
                  'thunk-header': '333'
                };
              }
            })]);
            req = mockReq(1);
            _context6.next = 5;
            return req.execute(rnl);

          case 5:
            res = _context6.sent;
            expect(res.data).toBe('PAYLOAD5');
            expect(fetchMock.lastOptions().headers).toEqual(expect.objectContaining({
              'thunk-header': '333'
            }));

          case 8:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  })));
  it('`headers` option as thunk with Promise',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7() {
    var rnl, req, res;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            fetchMock.mock({
              matcher: '/headers_thunk_promise',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD5'
                }
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([urlMiddleware({
              url: '/headers_thunk_promise',
              headers: function headers() {
                return Promise.resolve({
                  'thunk-header': 'as promise'
                });
              }
            })]);
            req = mockReq(1);
            _context7.next = 5;
            return req.execute(rnl);

          case 5:
            res = _context7.sent;
            expect(res.data).toBe('PAYLOAD5');
            expect(fetchMock.lastOptions().headers).toEqual(expect.objectContaining({
              'thunk-header': 'as promise'
            }));

          case 8:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  })));
  it('`credentials` option',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8() {
    var rnl, req, res;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            fetchMock.mock({
              matcher: '/credentials_url',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD6'
                }
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([urlMiddleware({
              url: '/credentials_url',
              credentials: 'same-origin'
            })]);
            req = mockReq(1);
            _context8.next = 5;
            return req.execute(rnl);

          case 5:
            res = _context8.sent;
            expect(res.data).toBe('PAYLOAD6');
            expect(fetchMock.lastOptions()).toEqual(expect.objectContaining({
              credentials: 'same-origin'
            }));

          case 8:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  })));
  it('other fetch options',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9() {
    var rnl, req, res;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            fetchMock.mock({
              matcher: '/fetch',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD7'
                }
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([urlMiddleware({
              url: '/fetch',
              credentials: 'include',
              mode: 'cors',
              cache: 'no-store',
              redirect: 'follow'
            })]);
            req = mockReq(1);
            _context9.next = 5;
            return req.execute(rnl);

          case 5:
            res = _context9.sent;
            expect(res.data).toBe('PAYLOAD7');
            expect(fetchMock.lastOptions()).toEqual(expect.objectContaining({
              credentials: 'include',
              mode: 'cors',
              cache: 'no-store',
              redirect: 'follow'
            }));

          case 8:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  })));
});