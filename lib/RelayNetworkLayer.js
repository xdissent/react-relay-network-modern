"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.array.is-array");

var _relayRuntime = require("relay-runtime");

var _RelayRequest = _interopRequireDefault(require("./RelayRequest"));

var _fetchWithMiddleware = _interopRequireDefault(require("./fetchWithMiddleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RelayNetworkLayer = function RelayNetworkLayer(middlewares, opts) {
  var _this = this;

  _classCallCheck(this, RelayNetworkLayer);

  this._middlewares = [];
  this._rawMiddlewares = [];
  this._middlewaresSync = [];
  this.noThrow = false;
  var mws = Array.isArray(middlewares) ? middlewares : [middlewares];
  mws.forEach(function (mw) {
    if (mw) {
      if (mw.execute) {
        _this._middlewaresSync.push(mw.execute);
      } else if (mw.isRawMiddleware) {
        _this._rawMiddlewares.push(mw);
      } else {
        _this._middlewares.push(mw);
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

  this.fetchFn = function (operation, variables, cacheConfig, uploadables) {
    for (var i = 0; i < _this._middlewaresSync.length; i++) {
      var _res = _this._middlewaresSync[i](operation, variables, cacheConfig, uploadables);

      if (_res) return _res;
    }

    var req = new _RelayRequest["default"](operation, variables, cacheConfig, uploadables);
    var controller = null;

    if (typeof window !== 'undefined' && window.AbortController) {
      controller = new window.AbortController();
      req.fetchOpts.signal = controller.signal;
    }

    var res = (0, _fetchWithMiddleware["default"])(req, _this._middlewares, _this._rawMiddlewares, _this.noThrow);
    return {
      subscribe: function subscribe(sink) {
        res.then(function (value) {
          sink.next(value);
          sink.complete();
        }, function (error) {
          if (error && error.name && error.name === 'AbortError') {
            sink.complete();
          } else sink.error(error);
        }) // avoid unhandled promise rejection error
        ["catch"](function () {});
        return function () {
          if (controller) controller.abort();
        };
      }
    };
  };

  var network = _relayRuntime.Network.create(this.fetchFn, this.subscribeFn);

  this.execute = network.execute;
  this.executeWithEvents = network.executeWithEvents;
};

exports["default"] = RelayNetworkLayer;