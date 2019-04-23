"use strict";

exports.__esModule = true;
exports.default = batchMiddleware;
exports.RRNLBatchMiddlewareError = void 0;

var _utils = require("../utils");

var _RelayRequestBatch = _interopRequireDefault(require("../RelayRequestBatch"));

var _RelayRequest = _interopRequireDefault(require("../RelayRequest"));

var _RRNLError = _interopRequireDefault(require("../RRNLError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// Max out at roughly 100kb (express-graphql imposed max)
const DEFAULT_BATCH_SIZE = 102400;

class RRNLBatchMiddlewareError extends _RRNLError.default {
  constructor(msg) {
    super(msg);
    this.name = 'RRNLBatchMiddlewareError';
  }

}

exports.RRNLBatchMiddlewareError = RRNLBatchMiddlewareError;

function batchMiddleware(options) {
  const opts = options || {};
  const batchTimeout = opts.batchTimeout || 0; // 0 is the same as nextTick in nodeJS

  const allowMutations = opts.allowMutations || false;
  const batchUrl = opts.batchUrl || '/graphql/batch';
  const maxBatchSize = opts.maxBatchSize || DEFAULT_BATCH_SIZE;
  const singleton = {};
  const fetchOpts = {};
  if (opts.method) fetchOpts.method = opts.method;
  if (opts.credentials) fetchOpts.credentials = opts.credentials;
  if (opts.mode) fetchOpts.mode = opts.mode;
  if (opts.cache) fetchOpts.cache = opts.cache;
  if (opts.redirect) fetchOpts.redirect = opts.redirect;
  if (opts.headers) fetchOpts.headersOrThunk = opts.headers;
  return next => req => {
    // do not batch mutations unless allowMutations = true
    if (req.isMutation() && !allowMutations) {
      return next(req);
    }

    if (!(req instanceof _RelayRequest.default)) {
      throw new RRNLBatchMiddlewareError('Relay batch middleware accepts only simple RelayRequest. Did you add batchMiddleware twice?');
    } // req with FormData can not be batched


    if (req.isFormData()) {
      return next(req);
    }

    return passThroughBatch(req, next, {
      batchTimeout,
      batchUrl,
      singleton,
      maxBatchSize,
      fetchOpts
    });
  };
}

function passThroughBatch(req, next, opts) {
  const {
    singleton
  } = opts;
  const bodyLength = req.fetchOpts.body.length;

  if (!bodyLength) {
    return next(req);
  }

  if (!singleton.batcher || !singleton.batcher.acceptRequests) {
    singleton.batcher = prepareNewBatcher(next, opts);
  }

  if (singleton.batcher.bodySize + bodyLength + 1 > opts.maxBatchSize) {
    singleton.batcher = prepareNewBatcher(next, opts);
  } // +1 accounts for tailing comma after joining


  singleton.batcher.bodySize += bodyLength + 1; // queue request

  return new Promise((resolve, reject) => {
    const relayReqId = req.getID();
    const {
      requestMap
    } = singleton.batcher;
    const requestWrapper = {
      req,
      completeOk: res => {
        requestWrapper.done = true;
        resolve(res);
        requestWrapper.duplicates.forEach(r => r.completeOk(res));
      },
      completeErr: err => {
        requestWrapper.done = true;
        reject(err);
        requestWrapper.duplicates.forEach(r => r.completeErr(err));
      },
      done: false,
      duplicates: []
    };

    if (requestMap[relayReqId]) {
      /*
        I've run into a scenario with Relay Classic where if you have 2 components
        that make the exact same query, Relay will dedup the queries and reuse
        the request ids but still make 2 requests. The batch code then loses track
        of all the duplicate requests being made and never resolves or rejects
        the duplicate requests
        https://github.com/nodkz/react-relay-network-layer/pull/52
      */
      requestMap[relayReqId].duplicates.push(requestWrapper);
    } else {
      requestMap[relayReqId] = requestWrapper;
    }
  });
}

function prepareNewBatcher(next, opts) {
  const batcher = {
    bodySize: 2,
    // account for '[]'
    requestMap: {},
    acceptRequests: true
  };
  setTimeout(() => {
    batcher.acceptRequests = false;
    sendRequests(batcher.requestMap, next, opts).then(() => finalizeUncompleted(batcher.requestMap)).catch(() => finalizeUncompleted(batcher.requestMap));
  }, opts.batchTimeout);
  return batcher;
}

async function sendRequests(requestMap, next, opts) {
  const ids = Object.keys(requestMap);

  if (ids.length === 1) {
    // SEND AS SINGLE QUERY
    const request = requestMap[ids[0]];
    const res = await next(request.req);
    request.completeOk(res);
    request.duplicates.forEach(r => r.completeOk(res));
    return res;
  } else if (ids.length > 1) {
    // SEND AS BATCHED QUERY
    const batchRequest = new _RelayRequestBatch.default(ids.map(id => requestMap[id].req)); // $FlowFixMe

    const url = await ((0, _utils.isFunction)(opts.batchUrl) ? opts.batchUrl(requestMap) : opts.batchUrl);
    batchRequest.setFetchOption('url', url);

    const _opts$fetchOpts = opts.fetchOpts,
          {
      headersOrThunk
    } = _opts$fetchOpts,
          fetchOpts = _objectWithoutProperties(_opts$fetchOpts, ["headersOrThunk"]);

    batchRequest.setFetchOptions(fetchOpts);

    if (headersOrThunk) {
      const headers = await ((0, _utils.isFunction)(headersOrThunk) ? headersOrThunk(batchRequest) : headersOrThunk);
      batchRequest.setFetchOption('headers', headers);
    }

    try {
      const batchResponse = await next(batchRequest);

      if (!batchResponse || !Array.isArray(batchResponse.json)) {
        throw new RRNLBatchMiddlewareError('Wrong response from server. Did your server support batch request?');
      }

      batchResponse.json.forEach(payload => {
        if (!payload) return;
        const request = requestMap[payload.id];

        if (request) {
          const res = createSingleResponse(batchResponse, payload);
          request.completeOk(res);
        }
      });
      return batchResponse;
    } catch (e) {
      ids.forEach(id => {
        requestMap[id].completeErr(e);
      });
    }
  }

  return Promise.resolve();
} // check that server returns responses for all requests


function finalizeUncompleted(requestMap) {
  Object.keys(requestMap).forEach(id => {
    const request = requestMap[id];

    if (!request.done) {
      request.completeErr(new RRNLBatchMiddlewareError(`Server does not return response for request with id ${id} \n` + `Response should have following shape { "id": "${id}", "data": {} }`));
    }
  });
}

function createSingleResponse(batchResponse, json) {
  // Fallback for graphql-graphene and apollo-server batch responses
  const data = json.payload || json;
  const res = batchResponse.clone();
  res.processJsonData(data);
  return res;
}