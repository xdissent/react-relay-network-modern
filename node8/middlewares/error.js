"use strict";

exports.__esModule = true;
exports.default = errorMiddleware;

var _RelayRequest = _interopRequireDefault(require("../RelayRequest"));

var _RelayRequestBatch = _interopRequireDefault(require("../RelayRequestBatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function errorMiddleware(options) {
  const opts = options || {};
  const logger = opts.logger || console.error.bind(console);
  const prefix = opts.prefix || '[RELAY-NETWORK] GRAPHQL SERVER ERROR:\n\n';
  const disableServerMiddlewareTip = opts.disableServerMiddlewareTip || false;

  function displayErrors(errors, reqRes) {
    return errors.forEach(error => {
      const {
        message,
        stack
      } = error,
            rest = _objectWithoutProperties(error, ["message", "stack"]);

      let msg = `${prefix}`;
      const fmt = [];

      if (stack && Array.isArray(stack)) {
        msg = `${msg}%c${stack.shift()}\n%c${stack.join('\n')}`;
        fmt.push('font-weight: bold;', 'font-weight: normal;');
      } else {
        msg = `${msg}%c${message} %c`;
        fmt.push('font-weight: bold;', 'font-weight: normal;');
      }

      if (rest && Object.keys(rest).length) {
        msg = `${msg}\n  %O`;
        fmt.push(rest);
      }

      msg = `${msg}\n\n%cRequest Response data:\n  %c%O`;
      fmt.push('font-weight: bold;', 'font-weight: normal;', reqRes);

      if (!stack && !disableServerMiddlewareTip) {
        msg = `${msg}\n\n%cNotice:%c${noticeAbsentStack()}`;
        fmt.push('font-weight: bold;', 'font-weight: normal;');
      }

      logger(`${msg}\n\n`, ...fmt);
    });
  }

  return next => req => {
    return next(req).then(res => {
      if (req instanceof _RelayRequest.default) {
        if (Array.isArray(res.errors)) {
          displayErrors(res.errors, {
            req,
            res
          });
        }
      } else if (req instanceof _RelayRequestBatch.default) {
        if (Array.isArray(res.json)) {
          res.json.forEach(payload => {
            if (Array.isArray(payload.errors)) {
              displayErrors(payload.errors, {
                req,
                res
              });
            }
          });
        }
      }

      return res;
    });
  };
}

function noticeAbsentStack() {
  return `
    If you using 'express-graphql', you may get server stack-trace for error.
    Just tune 'formatError' to return 'stack' with stack-trace:

    import graphqlHTTP from 'express-graphql';

    const graphQLMiddleware = graphqlHTTP({
      schema: myGraphQLSchema,
      formatError: (error) => ({
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack.split('\\n') : null,
      })
    });

    app.use('/graphql', graphQLMiddleware);`;
}