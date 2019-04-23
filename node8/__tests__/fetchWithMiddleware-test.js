"use strict";

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _fetchWithMiddleware = _interopRequireDefault(require("../fetchWithMiddleware"));

var _RelayRequest = _interopRequireDefault(require("../RelayRequest"));

var _RelayResponse = _interopRequireDefault(require("../RelayResponse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
describe('fetchWithMiddleware', () => {
  beforeEach(() => {
    _fetchMock.default.restore();
  });
  it('should make a successfull request without middlewares', async () => {
    _fetchMock.default.post('/graphql', {
      id: 1,
      data: {
        user: 123
      }
    });

    const req = new _RelayRequest.default({}, {}, {}, null);
    const res = await (0, _fetchWithMiddleware.default)(req, [], []);
    expect(res.data).toEqual({
      user: 123
    });
  });
  it('should make a successfull request with middlewares', async () => {
    const numPlus5 = next => async req => {
      req.fetchOpts.headers.reqId += ':mw1';
      const res = await next(req);
      res.data.text += ':mw1';
      return res;
    };

    const numMultiply10 = next => async req => {
      req.fetchOpts.headers.reqId += ':mw2';
      const res = await next(req);
      res.data.text += ':mw2';
      return res;
    };

    _fetchMock.default.post('/graphql', {
      id: 1,
      data: {
        text: 'response'
      }
    });

    const req = new _RelayRequest.default({}, {}, {}, null);
    req.fetchOpts.headers = {
      reqId: 'request'
    };
    const res = await (0, _fetchWithMiddleware.default)(req, [numPlus5, numMultiply10], []);
    expect(res.data.text).toEqual('response:mw2:mw1');
    expect(_fetchMock.default.lastOptions().headers.reqId).toEqual('request:mw1:mw2');
  });
  it('should fail correctly on network failure', async () => {
    _fetchMock.default.mock({
      matcher: '/graphql',
      response: {
        throws: new Error('Network connection error')
      },
      method: 'POST'
    });

    const req = new _RelayRequest.default({}, {}, {}, null);
    expect.assertions(2);

    try {
      await (0, _fetchWithMiddleware.default)(req, [], []);
    } catch (e) {
      expect(e instanceof Error).toBeTruthy();
      expect(e.toString()).toMatch('Network connection error');
    }
  });
  it('should handle error response', async () => {
    _fetchMock.default.mock({
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

    const req = new _RelayRequest.default({}, {}, {}, null);
    expect.assertions(2);

    try {
      await (0, _fetchWithMiddleware.default)(req, [], []);
    } catch (e) {
      expect(e instanceof Error).toBeTruthy();
      expect(e.toString()).toMatch('major error');
    }
  });
  it('should not throw if noThrow set', async () => {
    _fetchMock.default.mock({
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

    const req = new _RelayRequest.default({}, {}, {}, null);
    expect.assertions(1);
    const res = await (0, _fetchWithMiddleware.default)(req, [], [], true);
    expect(res.errors).toEqual([{
      location: 1,
      message: 'major error'
    }]);
  });
  it('should handle server non-2xx errors', async () => {
    _fetchMock.default.mock({
      matcher: '/graphql',
      response: {
        status: 500,
        body: 'Something went completely wrong.'
      },
      method: 'POST'
    });

    const req = new _RelayRequest.default({}, {}, {}, null);
    expect.assertions(2);

    try {
      await (0, _fetchWithMiddleware.default)(req, [], []);
    } catch (e) {
      expect(e instanceof Error).toBeTruthy();
      expect(e.toString()).toMatch('Something went completely wrong');
    }
  });
  it('should fail on missing `data` property', async () => {
    _fetchMock.default.mock({
      matcher: '/graphql',
      response: {
        status: 200,
        body: {},
        sendAsJson: true
      },
      method: 'POST'
    });

    const req = new _RelayRequest.default({}, {}, {}, null);
    expect.assertions(2);

    try {
      await (0, _fetchWithMiddleware.default)(req, [], []);
    } catch (e) {
      expect(e instanceof Error).toBeTruthy();
      expect(e.toString()).toMatch('Server return empty response.data');
    }
  });
  it('should fail correctly with a response from a middleware cache', async () => {
    const middleware = () => async () => _RelayResponse.default.createFromGraphQL({
      errors: [{
        message: 'A GraphQL error occurred'
      }]
    });

    const req = new _RelayRequest.default({}, {}, {}, null);
    expect.hasAssertions();

    try {
      await (0, _fetchWithMiddleware.default)(req, [middleware], []);
    } catch (e) {
      expect(e instanceof Error).toBeTruthy();
      expect(e.toString()).toMatch('A GraphQL error occurred');
    }
  });
});