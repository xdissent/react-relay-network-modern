"use strict";

exports.__esModule = true;
exports.default = void 0;

class RelayResponse {
  // response from low-level method, eg. fetch
  static async createFromFetch(res) {
    const r = new RelayResponse();
    r._res = res;
    r.ok = res.ok;
    r.status = res.status;
    r.url = res.url;
    r.headers = res.headers;

    if (res.status < 200 || res.status >= 300) {
      r.text = await res.text();
    } else {
      r.processJsonData((await res.json()));
    }

    return r;
  }

  static async createFromGraphQL(res) {
    const r = new RelayResponse();
    r._res = res;
    r.ok = true;
    r.status = 200;
    r.data = res.data;
    r.errors = res.errors;
    return r;
  }

  processJsonData(json) {
    this.json = json;

    if (json) {
      if (json.data) this.data = json.data;
      if (json.errors) this.errors = json.errors;
    }
  }

  clone() {
    // $FlowFixMe
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  toString() {
    return [`Response:`, `   Url: ${this.url || ''}`, `   Status code: ${this.status || ''}`, `   Status text: ${this.statusText || ''}`, `   Response headers: ${JSON.stringify(this.headers) || ''}`, `   Response body: ${JSON.stringify(this.json) || ''}`].join('\n');
  }

}

exports.default = RelayResponse;