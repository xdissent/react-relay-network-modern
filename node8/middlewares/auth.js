"use strict";

exports.__esModule = true;
exports.default = authMiddleware;
exports.RRNLAuthMiddlewareError = void 0;

var _utils = require("../utils");

var _RRNLError = _interopRequireDefault(require("../RRNLError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign, arrow-body-style, dot-notation */
class RRNLAuthMiddlewareError extends _RRNLError.default {
  constructor(msg) {
    super(msg);
    this.name = 'RRNLAuthMiddlewareError';
  }

}

exports.RRNLAuthMiddlewareError = RRNLAuthMiddlewareError;

function authMiddleware(opts) {
  const {
    token: tokenOrThunk,
    tokenRefreshPromise,
    allowEmptyToken = false,
    prefix = 'Bearer ',
    header = 'Authorization'
  } = opts || {};
  let tokenRefreshInProgress = null;
  return next => async req => {
    try {
      // $FlowFixMe
      const token = await ((0, _utils.isFunction)(tokenOrThunk) ? tokenOrThunk(req) : tokenOrThunk);

      if (!token && tokenRefreshPromise && !allowEmptyToken) {
        throw new RRNLAuthMiddlewareError('Empty token');
      }

      if (token) {
        req.fetchOpts.headers[header] = `${prefix}${token}`;
      }

      const res = await next(req);
      return res;
    } catch (e) {
      if (e && tokenRefreshPromise) {
        if (e.message === 'Empty token' || e.res && e.res.status === 401) {
          if (tokenRefreshPromise) {
            if (!tokenRefreshInProgress) {
              tokenRefreshInProgress = Promise.resolve(tokenRefreshPromise(req, e.res)).then(newToken => {
                tokenRefreshInProgress = null;
                return newToken;
              }).catch(err => {
                tokenRefreshInProgress = null;
                throw err;
              });
            }

            return tokenRefreshInProgress.then(newToken => {
              const newReq = req.clone();
              newReq.fetchOpts.headers[header] = `${prefix}${newToken}`;
              return next(newReq); // re-run query with new token
            });
          }
        }
      }

      throw e;
    }
  };
}