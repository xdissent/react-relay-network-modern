"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = errorMiddleware;

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.array.index-of");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.function.bind");

var _RelayRequest = _interopRequireDefault(require("../RelayRequest"));

var _RelayRequestBatch = _interopRequireDefault(require("../RelayRequestBatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function errorMiddleware(options) {
  var opts = options || {};
  var logger = opts.logger || console.error.bind(console);
  var prefix = opts.prefix || '[RELAY-NETWORK] GRAPHQL SERVER ERROR:\n\n';
  var disableServerMiddlewareTip = opts.disableServerMiddlewareTip || false;

  function displayErrors(errors, reqRes) {
    return errors.forEach(function (error) {
      var message = error.message,
          stack = error.stack,
          rest = _objectWithoutProperties(error, ["message", "stack"]);

      var msg = "".concat(prefix);
      var fmt = [];

      if (stack && Array.isArray(stack)) {
        msg = "".concat(msg, "%c").concat(stack.shift(), "\n%c").concat(stack.join('\n'));
        fmt.push('font-weight: bold;', 'font-weight: normal;');
      } else {
        msg = "".concat(msg, "%c").concat(message, " %c");
        fmt.push('font-weight: bold;', 'font-weight: normal;');
      }

      if (rest && Object.keys(rest).length) {
        msg = "".concat(msg, "\n  %O");
        fmt.push(rest);
      }

      msg = "".concat(msg, "\n\n%cRequest Response data:\n  %c%O");
      fmt.push('font-weight: bold;', 'font-weight: normal;', reqRes);

      if (!stack && !disableServerMiddlewareTip) {
        msg = "".concat(msg, "\n\n%cNotice:%c").concat(noticeAbsentStack());
        fmt.push('font-weight: bold;', 'font-weight: normal;');
      }

      logger.apply(void 0, ["".concat(msg, "\n\n")].concat(fmt));
    });
  }

  return function (next) {
    return function (req) {
      return next(req).then(function (res) {
        if (req instanceof _RelayRequest["default"]) {
          if (Array.isArray(res.errors)) {
            displayErrors(res.errors, {
              req: req,
              res: res
            });
          }
        } else if (req instanceof _RelayRequestBatch["default"]) {
          if (Array.isArray(res.json)) {
            res.json.forEach(function (payload) {
              if (Array.isArray(payload.errors)) {
                displayErrors(payload.errors, {
                  req: req,
                  res: res
                });
              }
            });
          }
        }

        return res;
      });
    };
  };
}

function noticeAbsentStack() {
  return "\n    If you using 'express-graphql', you may get server stack-trace for error.\n    Just tune 'formatError' to return 'stack' with stack-trace:\n\n    import graphqlHTTP from 'express-graphql';\n\n    const graphQLMiddleware = graphqlHTTP({\n      schema: myGraphQLSchema,\n      formatError: (error) => ({\n        message: error.message,\n        stack: process.env.NODE_ENV === 'development' ? error.stack.split('\\n') : null,\n      })\n    });\n\n    app.use('/graphql', graphQLMiddleware);";
}