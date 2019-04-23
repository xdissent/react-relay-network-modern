"use strict";

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _RelayNetworkLayer = _interopRequireDefault(require("../../RelayNetworkLayer"));

var _mockReq = require("../../__mocks__/mockReq");

var _cache = _interopRequireDefault(require("../cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

describe('middlewares/cache', () => {
  beforeEach(() => {
    _fetchMock.default.restore();
  });
  it('check `size` option', async () => {
    _fetchMock.default.mock({
      matcher: '/graphql',
      response: {
        status: 200,
        body: {
          data: 'PAYLOAD'
        }
      },
      method: 'POST'
    });

    const rnl = new _RelayNetworkLayer.default([(0, _cache.default)({
      size: 2
    })]); // data from fetch

    const res1 = await (0, _mockReq.mockReq)('FirstQuery').execute(rnl);
    expect(res1.data).toBe('PAYLOAD');
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(1); // data from cache

    const res2 = await (0, _mockReq.mockReq)('FirstQuery').execute(rnl);
    expect(res2.data).toBe('PAYLOAD');
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(1); // data from fetch

    const res3 = await (0, _mockReq.mockReq)('SecondQuery').execute(rnl);
    expect(res3.data).toBe('PAYLOAD');
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(2); // data from cache

    const res4 = await (0, _mockReq.mockReq)('SecondQuery').execute(rnl);
    expect(res4.data).toBe('PAYLOAD');
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(2); // data from fetch

    const res5 = await (0, _mockReq.mockReq)('ThirdQuery').execute(rnl);
    expect(res5.data).toBe('PAYLOAD');
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(3); // first request should be removed from cache, cause size = 2

    const res6 = await (0, _mockReq.mockReq)('FirstQuery').execute(rnl);
    expect(res6.data).toBe('PAYLOAD');
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(4);
  });
  it('check `ttl` option', async () => {
    _fetchMock.default.mock({
      matcher: '/graphql',
      response: {
        status: 200,
        body: {
          data: 'PAYLOAD'
        }
      },
      method: 'POST'
    });

    const rnl = new _RelayNetworkLayer.default([(0, _cache.default)({
      ttl: 20
    })]); // data from fetch

    const res1 = await (0, _mockReq.mockReq)('FirstQuery').execute(rnl);
    expect(res1.data).toBe('PAYLOAD');
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(1); // data from cache

    const res2 = await (0, _mockReq.mockReq)('FirstQuery').execute(rnl);
    expect(res2.data).toBe('PAYLOAD');
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(1);
    await sleep(50); // first request should be removed from cache, cause ttl = 20

    const res3 = await (0, _mockReq.mockReq)('FirstQuery').execute(rnl);
    expect(res3.data).toBe('PAYLOAD');
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(2);
  });
  it('do not use cache for mutations', async () => {
    _fetchMock.default.mock({
      matcher: '/graphql',
      response: {
        status: 200,
        body: {
          data: 'PAYLOAD'
        }
      },
      method: 'POST'
    });

    const rnl = new _RelayNetworkLayer.default([(0, _cache.default)()]); // data from fetch

    const res1 = await (0, _mockReq.mockMutationReq)('FirstQuery').execute(rnl);
    expect(res1.data).toBe('PAYLOAD');
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(1); // data from cache

    const res2 = await (0, _mockReq.mockMutationReq)('FirstQuery').execute(rnl);
    expect(res2.data).toBe('PAYLOAD');
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(2);
  });
  it('do not use cache for FormData', async () => {
    _fetchMock.default.mock({
      matcher: '/graphql',
      response: {
        status: 200,
        body: {
          data: 'PAYLOAD'
        }
      },
      method: 'POST'
    });

    const rnl = new _RelayNetworkLayer.default([(0, _cache.default)()]); // data from fetch

    const res1 = await (0, _mockReq.mockFormDataReq)('FirstQuery').execute(rnl);
    expect(res1.data).toBe('PAYLOAD');
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(1); // data from cache

    const res2 = await (0, _mockReq.mockFormDataReq)('FirstQuery').execute(rnl);
    expect(res2.data).toBe('PAYLOAD');
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(2);
  });
  it('do not use cache for responses with errors', async () => {
    _fetchMock.default.mock({
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

    const rnl = new _RelayNetworkLayer.default([(0, _cache.default)()]); // try fetch

    await expect((0, _mockReq.mockReq)('FirstQuery').execute(rnl)).rejects.toThrow();
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(1); // try fetch again

    await expect((0, _mockReq.mockReq)('FirstQuery').execute(rnl)).rejects.toThrow();
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(2);
  });
  it('use cache for responses with errors and cacheErrors flag', async () => {
    _fetchMock.default.mock({
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

    const rnl = new _RelayNetworkLayer.default([(0, _cache.default)({
      cacheErrors: true
    })]); // try fetch

    await expect((0, _mockReq.mockReq)('FirstQuery').execute(rnl)).rejects.toThrow();
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(1); // try fetch again

    await expect((0, _mockReq.mockReq)('FirstQuery').execute(rnl)).rejects.toThrow();
    expect(_fetchMock.default.calls('/graphql')).toHaveLength(1);
  });
});