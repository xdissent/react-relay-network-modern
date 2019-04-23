function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var RelayResponse =
/*#__PURE__*/
function () {
  function RelayResponse() {}

  // response from low-level method, eg. fetch
  RelayResponse.createFromFetch =
  /*#__PURE__*/
  function () {
    var _createFromFetch = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(res) {
      var r;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              r = new RelayResponse();
              r._res = res;
              r.ok = res.ok;
              r.status = res.status;
              r.url = res.url;
              r.headers = res.headers;

              if (!(res.status < 200 || res.status >= 300)) {
                _context.next = 12;
                break;
              }

              _context.next = 9;
              return res.text();

            case 9:
              r.text = _context.sent;
              _context.next = 17;
              break;

            case 12:
              _context.t0 = r;
              _context.next = 15;
              return res.json();

            case 15:
              _context.t1 = _context.sent;

              _context.t0.processJsonData.call(_context.t0, _context.t1);

            case 17:
              return _context.abrupt("return", r);

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function createFromFetch(_x) {
      return _createFromFetch.apply(this, arguments);
    };
  }();

  RelayResponse.createFromGraphQL =
  /*#__PURE__*/
  function () {
    var _createFromGraphQL = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(res) {
      var r;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              r = new RelayResponse();
              r._res = res;
              r.ok = true;
              r.status = 200;
              r.data = res.data;
              r.errors = res.errors;
              return _context2.abrupt("return", r);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function createFromGraphQL(_x2) {
      return _createFromGraphQL.apply(this, arguments);
    };
  }();

  var _proto = RelayResponse.prototype;

  _proto.processJsonData = function processJsonData(json) {
    this.json = json;

    if (json) {
      if (json.data) this.data = json.data;
      if (json.errors) this.errors = json.errors;
    }
  };

  _proto.clone = function clone() {
    // $FlowFixMe
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  };

  _proto.toString = function toString() {
    return ["Response:", "   Url: " + (this.url || ''), "   Status code: " + (this.status || ''), "   Status text: " + (this.statusText || ''), "   Response headers: " + (JSON.stringify(this.headers) || ''), "   Response body: " + (JSON.stringify(this.json) || '')].join('\n');
  };

  return RelayResponse;
}();

export { RelayResponse as default };