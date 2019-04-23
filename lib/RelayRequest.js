"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("core-js/modules/es6.array.filter");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.assign");

require("core-js/modules/es6.string.starts-with");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.function.name");

var _RRNLError = _interopRequireDefault(require("./RRNLError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function getFormDataInterface() {
  return typeof window !== 'undefined' && window.FormData || global && global.FormData;
}

var RelayRequest =
/*#__PURE__*/
function () {
  function RelayRequest(operation, variables, cacheConfig, uploadables) {
    _classCallCheck(this, RelayRequest);

    this.operation = operation;
    this.variables = variables;
    this.cacheConfig = cacheConfig;
    this.uploadables = uploadables;
    this.id = this.operation.id || this.operation.name || this._generateID();
    this.fetchOpts = {
      method: 'POST',
      headers: {},
      body: this.prepareBody()
    };
  }

  _createClass(RelayRequest, [{
    key: "getBody",
    value: function getBody() {
      return this.fetchOpts.body;
    }
  }, {
    key: "prepareBody",
    value: function prepareBody() {
      var uploadables = this.uploadables;

      if (uploadables) {
        var _FormData_ = getFormDataInterface();

        if (!_FormData_) {
          throw new _RRNLError["default"]('Uploading files without `FormData` interface does not supported.');
        }

        var formData = new _FormData_();
        formData.append('id', this.getID());
        formData.append('query', this.getQueryString());
        formData.append('variables', JSON.stringify(this.getVariables()));
        Object.keys(uploadables).forEach(function (key) {
          if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
            formData.append(key, uploadables[key]);
          }
        });
        return formData;
      }

      return JSON.stringify({
        id: this.getID(),
        query: this.getQueryString(),
        variables: this.getVariables()
      });
    }
  }, {
    key: "getID",
    value: function getID() {
      return this.id;
    }
  }, {
    key: "_generateID",
    value: function _generateID() {
      if (!this.constructor.lastGenId) {
        this.constructor.lastGenId = 0;
      }

      this.constructor.lastGenId += 1;
      return this.constructor.lastGenId.toString();
    }
  }, {
    key: "getQueryString",
    value: function getQueryString() {
      return this.operation.text || '';
    }
  }, {
    key: "getVariables",
    value: function getVariables() {
      return this.variables;
    }
  }, {
    key: "isMutation",
    value: function isMutation() {
      return this.getQueryString().startsWith('mutation');
    }
  }, {
    key: "isFormData",
    value: function isFormData() {
      var _FormData_ = getFormDataInterface();

      return !!_FormData_ && this.fetchOpts.body instanceof _FormData_;
    }
  }, {
    key: "clone",
    value: function clone() {
      // $FlowFixMe
      var newRequest = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
      newRequest.fetchOpts = _objectSpread({}, this.fetchOpts);
      newRequest.fetchOpts.headers = _objectSpread({}, this.fetchOpts.headers);
      return newRequest;
    }
  }]);

  return RelayRequest;
}();

exports["default"] = RelayRequest;