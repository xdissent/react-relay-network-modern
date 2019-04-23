"use strict";

exports.__esModule = true;
exports.formatGraphQLErrors = formatGraphQLErrors;
exports.createRequestError = createRequestError;
exports.RRNLRequestError = void 0;

var _RelayRequest = _interopRequireDefault(require("./RelayRequest"));

var _RRNLError = _interopRequireDefault(require("./RRNLError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RRNLRequestError extends _RRNLError.default {
  constructor(msg) {
    super(msg);
    this.name = 'RRNLRequestError';
  }

}
/**
 * Formats an error response from GraphQL server request.
 */


exports.RRNLRequestError = RRNLRequestError;

function formatGraphQLErrors(request, errors) {
  const CONTEXT_BEFORE = 20;
  const CONTEXT_LENGTH = 60;

  if (!request.getQueryString) {
    return errors.join('\n');
  }

  const queryLines = request.getQueryString().split('\n');
  return errors.map(({
    locations,
    message
  }, ii) => {
    const prefix = `${ii + 1}. `;
    const indent = ' '.repeat(prefix.length); // custom errors thrown in graphql-server may not have locations

    const locationMessage = locations ? '\n' + locations.map(({
      column,
      line
    }) => {
      const queryLine = queryLines[line - 1];
      const offset = Math.min(column - 1, CONTEXT_BEFORE);
      return [queryLine.substr(column - 1 - offset, CONTEXT_LENGTH), `${' '.repeat(Math.max(offset, 0))}^^^`].map(messageLine => indent + messageLine).join('\n');
    }).join('\n') : '';
    return prefix + message + locationMessage;
  }).join('\n');
}

function createRequestError(req, res) {
  let errorReason = '';

  if (!res) {
    errorReason = 'Server return empty response.';
  } else if (res.errors) {
    if (req instanceof _RelayRequest.default) {
      errorReason = formatGraphQLErrors(req, res.errors);
    } else {
      errorReason = JSON.stringify(res.errors);
    }
  } else if (!res.json) {
    errorReason = (res.text ? res.text : `Server return empty response with Status Code: ${res.status}.`) + (res ? `\n\n${res.toString()}` : '');
  } else if (!res.data) {
    errorReason = 'Server return empty response.data.\n\n' + res.toString();
  }

  const error = new RRNLRequestError(`Relay request for \`${req.getID()}\` failed by the following reasons:\n\n${errorReason}`);
  error.req = req;
  error.res = res;
  return error;
}