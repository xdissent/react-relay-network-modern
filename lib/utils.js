"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFunction = isFunction;

/* eslint-disable  */
function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}