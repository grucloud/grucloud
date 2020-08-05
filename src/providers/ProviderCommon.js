const _ = require("lodash");
const { get } = require("rubico");
const assert = require("assert");
const notAvailable = (name, field) => {
  assert(field);
  return `<< ${field} of ${name} not available yet >>`;
};

exports.notAvailable = notAvailable;

exports.getField = ({ resource, live }, field) =>
  get(field, notAvailable(resource.name, field))(live);
