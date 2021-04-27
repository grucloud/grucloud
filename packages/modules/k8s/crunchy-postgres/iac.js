const CruncyPostgres = require("./resources");
exports.hooks = [];

exports.createResources = async ({ provider }) =>
  CruncyPostgres.createResources({ provider });
