"use strict";

exports.__esModule = true;
exports.default = void 0;

var _relayRuntime = require("relay-runtime");

var _RelayRequest = _interopRequireDefault(require("./RelayRequest"));

var _fetchWithMiddleware = _interopRequireDefault(require("./fetchWithMiddleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line
class RelayNetworkLayer {
  constructor(middlewares, opts) {
    this._middlewares = [];
    this._rawMiddlewares = [];
    this._middlewaresSync = [];
    this.noThrow = false;
    const mws = Array.isArray(middlewares) ? middlewares : [middlewares];
    mws.forEach(mw => {
      if (mw) {
        if (mw.execute) {
          this._middlewaresSync.push(mw.execute);
        } else if (mw.isRawMiddleware) {
          this._rawMiddlewares.push(mw);
        } else {
          this._middlewares.push(mw);
        }
      }
    });

    if (opts) {
      this.subscribeFn = opts.subscribeFn;
      this.noThrow = opts.noThrow === true; // TODO deprecate

      if (opts.beforeFetch) {
        this._middlewaresSync.push(opts.beforeFetch);
      }
    }

    this.fetchFn = (operation, variables, cacheConfig, uploadables) => {
      for (let i = 0; i < this._middlewaresSync.length; i++) {
        const res = this._middlewaresSync[i](operation, variables, cacheConfig, uploadables);

        if (res) return res;
      }

      const req = new _RelayRequest.default(operation, variables, cacheConfig, uploadables);
      let controller = null;

      if (typeof window !== 'undefined' && window.AbortController) {
        controller = new window.AbortController();
        req.fetchOpts.signal = controller.signal;
      }

      const res = (0, _fetchWithMiddleware.default)(req, this._middlewares, this._rawMiddlewares, this.noThrow);
      return {
        subscribe: sink => {
          res.then(value => {
            sink.next(value);
            sink.complete();
          }, error => {
            if (error && error.name && error.name === 'AbortError') {
              sink.complete();
            } else sink.error(error);
          }) // avoid unhandled promise rejection error
          .catch(() => {});
          return () => {
            if (controller) controller.abort();
          };
        }
      };
    };

    const network = _relayRuntime.Network.create(this.fetchFn, this.subscribeFn);

    this.execute = network.execute;
    this.executeWithEvents = network.executeWithEvents;
  }

}

exports.default = RelayNetworkLayer;