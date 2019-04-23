"use strict";

exports.__esModule = true;
exports.mockReq = mockReq;
exports.mockMutationReq = mockMutationReq;
exports.mockFormDataReq = mockFormDataReq;
exports.mockReqWithSize = mockReqWithSize;
exports.mockReqWithFiles = mockReqWithFiles;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable import/prefer-default-export, no-param-reassign */
class MockReq {
  constructor(reqid, reqData = {}) {
    this.reqid = reqid || Math.random().toString();
    this.reqData = reqData;
  }

  getID() {
    return this.reqid;
  }

  getQueryString() {
    return this.reqData.query || '';
  }

  getDebugName() {
    return `debugname${this.reqid}`;
  }

  getVariables() {
    return this.reqData.variables || {};
  }

  getFiles() {
    return this.reqData.files;
  }

  reject(err) {
    this.error = err;
  }

  resolve(resp) {
    this.payload = resp;
  }

  execute(rnl) {
    const operation = {
      id: this.getID(),
      text: this.getQueryString() || ''
    };
    const variables = this.getVariables() || {};
    const cacheConfig = {};
    const uploadables = this.getFiles();
    const res = rnl.fetchFn(operation, variables, cacheConfig, uploadables);
    const promise = new Promise((resolve, reject) => {
      res.subscribe({
        complete: () => {},
        error: error => reject(error),
        next: value => resolve(value)
      });
    }); // avoid unhandled rejection in tests

    promise.catch(() => {}); // but allow to read rejected response

    return promise;
  }

}

function mockReq(reqid, data) {
  return new MockReq(reqid ? reqid.toString() : undefined, data);
}

function mockMutationReq(reqid, data) {
  return new MockReq(reqid ? reqid.toString() : undefined, _objectSpread({
    query: 'mutation {}'
  }, data));
}

function mockFormDataReq(reqid, data) {
  return new MockReq(reqid ? reqid.toString() : undefined, _objectSpread({
    files: {
      file1: 'data'
    }
  }, data));
}

function mockReqWithSize(reqid, size) {
  return mockReq(reqid, {
    query: `{${'x'.repeat(size)}}`
  });
}

function mockReqWithFiles(reqid) {
  return mockReq(reqid, {
    files: {
      file1: 'data',
      file2: 'data'
    }
  });
}