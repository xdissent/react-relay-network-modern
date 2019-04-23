"use strict";

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _RelayNetworkLayer = _interopRequireDefault(require("../../RelayNetworkLayer"));

var _mockReq = require("../../__mocks__/mockReq");

var _retry = _interopRequireWildcard(require("../retry"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

describe('middlewares/retry', () => {
  describe('promiseWithTimeout()', () => {
    it('should return Promise result if not reach timeout ', async () => {
      const p = Promise.resolve(5);
      const r = await (0, _retry.promiseWithTimeout)(p, 1000, () => Promise.resolve(0));
      expect(r).toBe(5);
    });
    it('should run `onTimeout` when timout is reached', async () => {
      const p = new Promise(resolve => {
        setTimeout(() => {
          resolve(333);
        }, 20);
      });
      const onTimeout = jest.fn(() => {
        return Promise.resolve(555);
      });
      const r = await (0, _retry.promiseWithTimeout)(p, 10, onTimeout);
      expect(onTimeout).toHaveBeenCalledTimes(1);
      expect(r).toBe(555);
    });
  });
  describe('delayedExecution()', () => {
    it('should run function after delay', async () => {
      const execFn = jest.fn(() => Promise.resolve(777));
      const {
        promise
      } = (0, _retry.delayedExecution)(execFn, 10);
      await sleep(5);
      expect(execFn).toHaveBeenCalledTimes(0);
      await sleep(10);
      expect(execFn).toHaveBeenCalledTimes(1);
      const r = await promise;
      expect(r).toBe(777);
    });
    it('should run function immediately after `forceExec` call', async () => {
      const execFn = jest.fn(() => Promise.resolve(888));
      const {
        promise,
        forceExec
      } = (0, _retry.delayedExecution)(execFn, 1000);
      await sleep(5);
      expect(execFn).toHaveBeenCalledTimes(0);
      forceExec();
      await sleep(1);
      expect(execFn).toHaveBeenCalledTimes(1);
      const r = await promise;
      expect(r).toBe(888);
    });
    it('should abort function after `abort` call', async () => {
      const execFn = jest.fn(() => Promise.resolve(999));
      const {
        promise,
        abort
      } = (0, _retry.delayedExecution)(execFn, 1000);
      await sleep(5);
      expect(execFn).toHaveBeenCalledTimes(0);
      abort();
      await expect(promise).rejects.toThrow(/aborted/i);
      expect(execFn).toHaveBeenCalledTimes(0);
    });
  });
  describe('middleware', () => {
    beforeEach(async () => {
      await sleep(5); // fix: some strange error

      _fetchMock.default.restore();
    });
    it('should make retries', async () => {
      // First 2 requests return code 500,
      // 3rd request returns code 200
      let attempt = 0;

      _fetchMock.default.mock({
        matcher: '/graphql',
        response: () => {
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

      const rnl = new _RelayNetworkLayer.default([(0, _retry.default)({
        retryDelays: () => 1,
        logger: false
      })]);
      const res = await (0, _mockReq.mockReq)(1).execute(rnl);
      expect(res.data).toEqual('PAYLOAD');

      const reqs = _fetchMock.default.calls('/graphql');

      expect(reqs).toHaveLength(3);
      expect(reqs).toMatchSnapshot();
    });
    it('should retry request on timeout', async () => {
      let attempt = 0; // First 2 requests answered after 50ms
      // 3rd request returns without delay

      _fetchMock.default.mock({
        matcher: '/graphql',
        response: () => {
          attempt++;
          return new Promise(resolve => {
            setTimeout(() => resolve({
              status: 200,
              body: {
                data: 'PAYLOAD'
              }
            }), attempt <= 2 ? 100 : 0);
          });
        },
        method: 'POST'
      });

      const rnl = new _RelayNetworkLayer.default([(0, _retry.default)({
        fetchTimeout: 20,
        retryDelays: () => 1,
        logger: false
      })]);
      await (0, _mockReq.mockReq)(1).execute(rnl);

      const reqs = _fetchMock.default.calls('/graphql');

      expect(reqs).toHaveLength(3);
      expect(reqs).toMatchSnapshot();
    });
    it('should allow fetchTimeout to specify a function or number', async () => {
      // returns request after 30ms
      // 3rd request should work
      _fetchMock.default.mock({
        matcher: '/graphql',
        response: () => {
          return new Promise(resolve => {
            setTimeout(() => resolve({
              status: 200,
              body: {
                data: 'PAYLOAD'
              }
            }), 30);
          });
        },
        method: 'POST'
      });

      const rnl = new _RelayNetworkLayer.default([(0, _retry.default)({
        fetchTimeout: attempt => attempt < 2 ? 5 : 100,
        retryDelays: () => 1,
        logger: false
      })]);
      (0, _mockReq.mockReq)(1).execute(rnl);
      await sleep(60);
      expect(_fetchMock.default.calls('/graphql')).toHaveLength(3);
    });
    it('should throw error on timeout', async () => {
      // returns request after 100ms
      _fetchMock.default.mock({
        matcher: '/graphql',
        response: () => {
          return new Promise(resolve => {
            setTimeout(() => resolve({
              status: 200,
              body: {
                data: 'PAYLOAD'
              }
            }), 100);
          });
        },
        method: 'POST'
      });

      const rnl = new _RelayNetworkLayer.default([(0, _retry.default)({
        fetchTimeout: 20,
        retryDelays: [1],
        logger: false
      })]);
      await expect((0, _mockReq.mockReq)(1).execute(rnl)).rejects.toThrow('Reached request timeout in 20 ms');
      expect(_fetchMock.default.calls('/graphql')).toHaveLength(2);
    });
    it('should work forceRetry callback when request delayed', async () => {
      // First request will be fulfilled after 100ms delay
      // 2nd request and the following - without delays
      let attempt = 0;

      _fetchMock.default.mock({
        matcher: '/graphql',
        response: () => {
          attempt++;
          return new Promise(resolve => {
            setTimeout(() => resolve({
              status: 200,
              body: {
                data: 'PAYLOAD'
              }
            }), attempt === 1 ? 100 : 0);
          });
        },
        method: 'POST'
      }); // will call force retry after 30 ms


      const forceRetry = jest.fn(runNow => {
        setTimeout(() => {
          runNow();
        }, 30);
      });
      const rnl = new _RelayNetworkLayer.default([(0, _retry.default)({
        fetchTimeout: 10,
        retryDelays: () => 199,
        logger: false,
        forceRetry
      })]); // make request

      const resPromise = (0, _mockReq.mockReq)(1).execute(rnl);
      await sleep(1); // should be sended first request (server will respond after 100 ms)

      expect(_fetchMock.default.calls('/graphql')).toHaveLength(1);
      await sleep(10); // after 10 ms should be reached `fetchTimeout`
      // so middleware hang request
      // and starts 199ms delayed period before making a new request
      // when delay period was started, should be called forceRetry method

      expect(forceRetry).toHaveBeenCalledTimes(1); // second arg of forceRetry call should be delay period in ms

      expect(forceRetry.mock.calls[0][1]).toBe(199); // on 30 ms will be called `runNow` function

      await sleep(50); // so Middlware should made second request under the hood

      expect(_fetchMock.default.calls('/graphql')).toHaveLength(2);
      expect((await resPromise).data).toBe('PAYLOAD'); // await that no more calls was made by middleware

      await sleep(200);
      expect(_fetchMock.default.calls('/graphql')).toHaveLength(2);
    });
    it('should call `beforeRetry` when request delayed', async () => {
      // First request will be fulfilled after 100ms delay
      // 2nd request and next without delays
      let attempt = 0;

      _fetchMock.default.mock({
        matcher: '/graphql',
        response: () => {
          attempt++;
          return new Promise(resolve => {
            setTimeout(() => resolve({
              status: 200,
              body: {
                data: 'PAYLOAD'
              }
            }), attempt === 1 ? 100 : 0);
          });
        },
        method: 'POST'
      }); // will call force retry after 30 ms


      const beforeRetry = jest.fn(({
        forceRetry
      }) => {
        setTimeout(() => {
          forceRetry();
        }, 30);
      });
      const rnl = new _RelayNetworkLayer.default([(0, _retry.default)({
        fetchTimeout: 10,
        retryDelays: () => 999,
        logger: false,
        beforeRetry
      })]); // make request

      const resPromise = (0, _mockReq.mockReq)(1).execute(rnl);
      await sleep(1); // should be sended first request (server will respond after 100 ms)

      expect(_fetchMock.default.calls('/graphql')).toHaveLength(1);
      await sleep(10); // after 10 ms should be reached `fetchTimeout`
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

      await sleep(50); // so we make second request before delay period will end

      expect(_fetchMock.default.calls('/graphql')).toHaveLength(2);
      expect((await resPromise).data).toBe('PAYLOAD');
    });
    it('should call `beforeRetry` and reject request if called `abort`', async () => {
      // First request will be fulfilled after 100ms delay
      // 2nd request and further - without delays
      let attempt = 0;
      const customAbortedMsg = 'custom aborted in before beforeRetry';

      _fetchMock.default.mock({
        matcher: '/graphql',
        response: () => {
          attempt++;
          return new Promise(resolve => {
            setTimeout(() => resolve({
              status: 200,
              body: {
                data: 'PAYLOAD'
              }
            }), attempt === 1 ? 100 : 0);
          });
        },
        method: 'POST'
      }); // will call force retry after 30 ms


      const beforeRetry = jest.fn(({
        abort
      }) => {
        abort(customAbortedMsg);
      });
      const rnl = new _RelayNetworkLayer.default([(0, _retry.default)({
        fetchTimeout: 10,
        retryDelays: () => 999,
        logger: false,
        beforeRetry
      })]); // make request

      const resPromise = (0, _mockReq.mockReq)(1).execute(rnl);
      await sleep(1); // should be sended first request (server will respond after 100 ms)

      expect(_fetchMock.default.calls('/graphql')).toHaveLength(1);
      await sleep(10); // after 10 ms should be reached `fetchTimeout`
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
      await expect(resPromise).rejects.toThrow(customAbortedMsg); // we should not make second request

      expect(_fetchMock.default.calls('/graphql')).toHaveLength(1);
    });
  });
});