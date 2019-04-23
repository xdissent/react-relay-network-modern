function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/* eslint-disable no-console */
import { isFunction } from '../utils';
import RRNLError from '../RRNLError';

function noopFn() {}

export var RRNLRetryMiddlewareError =
/*#__PURE__*/
function (_RRNLError) {
  _inheritsLoose(RRNLRetryMiddlewareError, _RRNLError);

  function RRNLRetryMiddlewareError(msg) {
    var _this;

    _this = _RRNLError.call(this, msg) || this;
    _this.name = 'RRNLRetryMiddlewareError';
    return _this;
  }

  return RRNLRetryMiddlewareError;
}(RRNLError);
export default function retryMiddleware(options) {
  var opts = options || {};
  var timeout = opts.fetchTimeout || 15000;
  var retryDelays = opts.retryDelays || [1000, 3000];
  var statusCodes = opts.statusCodes || false;
  var logger = opts.logger === false ? function () {} : opts.logger || console.log.bind(console, '[RELAY-NETWORK]');
  var allowMutations = opts.allowMutations || false;
  var allowFormData = opts.allowFormData || false;
  var forceRetryFn = opts.forceRetry || false; // DEPRECATED in favor `beforeRetry`

  var beforeRetry = opts.beforeRetry || false;

  var retryAfterMs = function retryAfterMs() {
    return false;
  };

  if (retryDelays) {
    if (Array.isArray(retryDelays)) {
      retryAfterMs = function retryAfterMs(attempt) {
        if (retryDelays.length >= attempt) {
          return retryDelays[attempt];
        }

        return false;
      };
    } else if (isFunction(retryDelays)) {
      retryAfterMs = retryDelays;
    }
  }

  var timeoutAfterMs;

  if (typeof timeout === 'number') {
    timeoutAfterMs = function timeoutAfterMs() {
      return timeout;
    };
  } else {
    timeoutAfterMs = timeout;
  }

  var retryOnStatusCode = function retryOnStatusCode(status, req, res) {
    return res.status < 200 || res.status > 300;
  };

  if (statusCodes) {
    if (Array.isArray(statusCodes)) {
      retryOnStatusCode = function retryOnStatusCode(status, req, res) {
        return statusCodes.indexOf(res.status) !== -1;
      };
    } else if (isFunction(statusCodes)) {
      retryOnStatusCode = statusCodes;
    }
  }

  return function (next) {
    return function (req) {
      if (req.isMutation() && !allowMutations) {
        return next(req);
      }

      if (req.isFormData() && !allowFormData) {
        return next(req);
      }

      return makeRetriableRequest({
        req: req,
        next: next,
        timeoutAfterMs: timeoutAfterMs,
        retryAfterMs: retryAfterMs,
        retryOnStatusCode: retryOnStatusCode,
        forceRetryFn: forceRetryFn,
        beforeRetry: beforeRetry,
        logger: logger
      });
    };
  };
}

function makeRetriableRequest(_x, _x2, _x3, _x4) {
  return _makeRetriableRequest.apply(this, arguments);
}
/**
 * This function delays execution of some function for some period of time.
 * Returns a promise, with ability to run execution immidiately, or abort it.
 */


function _makeRetriableRequest() {
  _makeRetriableRequest = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(o, delay, attempt, lastError) {
    var makeRetry, makeRequest, _delayedExecution, promise, forceExec, abort;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (delay === void 0) {
              delay = 0;
            }

            if (attempt === void 0) {
              attempt = 0;
            }

            if (lastError === void 0) {
              lastError = null;
            }

            makeRetry =
            /*#__PURE__*/
            function () {
              var _ref = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(prevError) {
                var retryDelay;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        retryDelay = o.retryAfterMs(attempt);

                        if (!retryDelay) {
                          _context.next = 5;
                          break;
                        }

                        o.logger(prevError.message);
                        o.logger("will retry in " + retryDelay + " milliseconds");
                        return _context.abrupt("return", makeRetriableRequest(o, retryDelay, attempt + 1, prevError));

                      case 5:
                        throw prevError;

                      case 6:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function makeRetry(_x5) {
                return _ref.apply(this, arguments);
              };
            }();

            makeRequest =
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2() {
                var timeout, err;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;
                        timeout = o.timeoutAfterMs(attempt);
                        _context2.next = 4;
                        return promiseWithTimeout(o.next(o.req), timeout, function () {
                          var err = new RRNLRetryMiddlewareError("Reached request timeout in " + timeout + " ms");
                          return makeRetry(err);
                        });

                      case 4:
                        return _context2.abrupt("return", _context2.sent);

                      case 7:
                        _context2.prev = 7;
                        _context2.t0 = _context2["catch"](0);

                        if (!(_context2.t0 && !_context2.t0.res && !(_context2.t0 instanceof RRNLRetryMiddlewareError))) {
                          _context2.next = 11;
                          break;
                        }

                        return _context2.abrupt("return", makeRetry(_context2.t0));

                      case 11:
                        if (!(_context2.t0 && _context2.t0.res && o.retryOnStatusCode(_context2.t0.res.status, o.req, _context2.t0.res))) {
                          _context2.next = 14;
                          break;
                        }

                        err = new RRNLRetryMiddlewareError("Wrong response status " + _context2.t0.res.status + ", retrying...");
                        return _context2.abrupt("return", makeRetry(err));

                      case 14:
                        throw _context2.t0;

                      case 15:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 7]]);
              }));

              return function makeRequest() {
                return _ref2.apply(this, arguments);
              };
            }();

            if (!(attempt === 0)) {
              _context3.next = 9;
              break;
            }

            return _context3.abrupt("return", makeRequest());

          case 9:
            // second and all further calls should be delayed
            _delayedExecution = delayedExecution(makeRequest, delay), promise = _delayedExecution.promise, forceExec = _delayedExecution.forceExec, abort = _delayedExecution.abort;

            if (o.forceRetryFn) {
              // DEPRECATED in favor `beforeRetry`
              o.forceRetryFn(forceExec, delay);
            }

            if (o.beforeRetry) {
              o.beforeRetry({
                abort: abort,
                forceRetry: forceExec,
                attempt: attempt,
                delay: delay,
                lastError: lastError,
                req: o.req
              });
            }

            return _context3.abrupt("return", promise);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _makeRetriableRequest.apply(this, arguments);
}

export function delayedExecution(execFn, delay) {
  if (delay === void 0) {
    delay = 0;
  }

  var abort = noopFn;
  var forceExec = noopFn;

  if (delay <= 0) {
    return {
      abort: abort,
      forceExec: forceExec,
      promise: execFn()
    };
  }

  var promise = new Promise(function (resolve, reject) {
    var delayId;

    abort = function abort(msg) {
      if (delayId) {
        clearTimeout(delayId);
        delayId = null;
      }

      reject(new RRNLRetryMiddlewareError(msg || 'Aborted in beforeRetry() callback'));
    };

    forceExec = function forceExec() {
      if (delayId) {
        clearTimeout(delayId);
        delayId = null;
        resolve(execFn());
      }
    };

    delayId = setTimeout(function () {
      resolve(execFn());
    }, delay);
  });
  return {
    forceExec: forceExec,
    abort: abort,
    promise: promise
  };
}
/*
 * This function accepts a Promise and watch for it some period of time (timeoutMS)
 * if Promise completed in this period, then returns its result
 * if not - returns other Promise from onTimeout() callback
 */

export function promiseWithTimeout(promise, timeoutMS, onTimeout) {
  if (!timeoutMS) {
    return promise;
  }

  return new Promise(function (resolve, reject) {
    var timeoutId = setTimeout(function () {
      onTimeout().then(resolve)["catch"](reject);
    }, timeoutMS);
    promise.then(function (res) {
      clearTimeout(timeoutId);
      resolve(res);
    })["catch"](function (err) {
      clearTimeout(timeoutId);
      reject(err);
    });
  });
}