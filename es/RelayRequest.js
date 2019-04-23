function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import RRNLError from './RRNLError';

function getFormDataInterface() {
  return typeof window !== 'undefined' && window.FormData || global && global.FormData;
}

export default class RelayRequest {
  constructor(operation, variables, cacheConfig, uploadables) {
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

  getBody() {
    return this.fetchOpts.body;
  }

  prepareBody() {
    const {
      uploadables
    } = this;

    if (uploadables) {
      const _FormData_ = getFormDataInterface();

      if (!_FormData_) {
        throw new RRNLError('Uploading files without `FormData` interface does not supported.');
      }

      const formData = new _FormData_();
      formData.append('id', this.getID());
      formData.append('query', this.getQueryString());
      formData.append('variables', JSON.stringify(this.getVariables()));
      Object.keys(uploadables).forEach(key => {
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

  getID() {
    return this.id;
  }

  _generateID() {
    if (!this.constructor.lastGenId) {
      this.constructor.lastGenId = 0;
    }

    this.constructor.lastGenId += 1;
    return this.constructor.lastGenId.toString();
  }

  getQueryString() {
    return this.operation.text || '';
  }

  getVariables() {
    return this.variables;
  }

  isMutation() {
    return this.getQueryString().startsWith('mutation');
  }

  isFormData() {
    const _FormData_ = getFormDataInterface();

    return !!_FormData_ && this.fetchOpts.body instanceof _FormData_;
  }

  clone() {
    // $FlowFixMe
    const newRequest = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    newRequest.fetchOpts = _objectSpread({}, this.fetchOpts);
    newRequest.fetchOpts.headers = _objectSpread({}, this.fetchOpts.headers);
    return newRequest;
  }

}