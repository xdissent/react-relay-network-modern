"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatGraphQLErrors = formatGraphQLErrors;
exports.createRequestError = createRequestError;
exports.RRNLRequestError = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.string.repeat");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.function.name");

var _RelayRequest = _interopRequireDefault(require("./RelayRequest"));

var _RRNLError2 = _interopRequireDefault(require("./RRNLError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RRNLRequestError =
/*#__PURE__*/
function (_RRNLError) {
  _inherits(RRNLRequestError, _RRNLError);

  function RRNLRequestError(msg) {
    var _this;

    _classCallCheck(this, RRNLRequestError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RRNLRequestError).call(this, msg));
    _this.name = 'RRNLRequestError';
    return _this;
  }

  return RRNLRequestError;
}(_RRNLError2["default"]);
/**
 * Formats an error response from GraphQL server request.
 */


exports.RRNLRequestError = RRNLRequestError;

function formatGraphQLErrors(request, errors) {
  var CONTEXT_BEFORE = 20;
  var CONTEXT_LENGTH = 60;

  if (!request.getQueryString) {
    return errors.join('\n');
  }

  var queryLines = request.getQueryString().split('\n');
  return errors.map(function (_ref, ii) {
    var locations = _ref.locations,
        message = _ref.message;
    var prefix = "".concat(ii + 1, ". ");
    var indent = ' '.repeat(prefix.length); // custom errors thrown in graphql-server may not have locations

    var locationMessage = locations ? '\n' + locations.map(function (_ref2) {
      var column = _ref2.column,
          line = _ref2.line;
      var queryLine = queryLines[line - 1];
      var offset = Math.min(column - 1, CONTEXT_BEFORE);
      return [queryLine.substr(column - 1 - offset, CONTEXT_LENGTH), "".concat(' '.repeat(Math.max(offset, 0)), "^^^")].map(function (messageLine) {
        return indent + messageLine;
      }).join('\n');
    }).join('\n') : '';
    return prefix + message + locationMessage;
  }).join('\n');
}

function createRequestError(req, res) {
  var errorReason = '';

  if (!res) {
    errorReason = 'Server return empty response.';
  } else if (res.errors) {
    if (req instanceof _RelayRequest["default"]) {
      errorReason = formatGraphQLErrors(req, res.errors);
    } else {
      errorReason = JSON.stringify(res.errors);
    }
  } else if (!res.json) {
    errorReason = (res.text ? res.text : "Server return empty response with Status Code: ".concat(res.status, ".")) + (res ? "\n\n".concat(res.toString()) : '');
  } else if (!res.data) {
    errorReason = 'Server return empty response.data.\n\n' + res.toString();
  }

  var error = new RRNLRequestError("Relay request for `".concat(req.getID(), "` failed by the following reasons:\n\n").concat(errorReason));
  error.req = req;
  error.res = res;
  return error;
}