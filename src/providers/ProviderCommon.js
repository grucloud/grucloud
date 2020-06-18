const _ = require("lodash");

const notAvailable = (name) => `<< id of ${name} not available yet >>`;
exports.notAvailable = notAvailable;

exports.getField = ({ resource, live }, field) =>
  _.get(live, field, notAvailable(resource.name));
