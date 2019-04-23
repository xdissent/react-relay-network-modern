/* eslint-disable no-param-reassign, prefer-const */
import { createRequestError } from './createRequestError';
import RelayResponse from './RelayResponse';

function runFetch(req) {
  let {
    url
  } = req.fetchOpts;
  if (!url) url = '/graphql';
  if (!req.fetchOpts.headers.Accept) req.fetchOpts.headers.Accept = '*/*';

  if (!req.fetchOpts.headers['Content-Type'] && !req.isFormData()) {
    req.fetchOpts.headers['Content-Type'] = 'application/json';
  }

  return fetch(url, req.fetchOpts);
} // convert fetch response to RelayResponse object


const convertResponse = next => async req => {
  const resFromFetch = await next(req);
  const res = await RelayResponse.createFromFetch(resFromFetch);

  if (res.status && res.status >= 400) {
    throw createRequestError(req, res);
  }

  return res;
};

export default function fetchWithMiddleware(req, middlewares, // works with RelayResponse
rawFetchMiddlewares, // works with raw fetch response
noThrow) {
  // $FlowFixMe
  const wrappedFetch = compose(...middlewares, convertResponse, ...rawFetchMiddlewares)(runFetch);
  return wrappedFetch(req).then(res => {
    if (!noThrow && (!res || res.errors || !res.data)) {
      throw createRequestError(req, res);
    }

    return res;
  });
}
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  } else {
    const last = funcs[funcs.length - 1];
    const rest = funcs.slice(0, -1); // $FlowFixMe - Suppress error about promise not being callable

    return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args));
  }
}