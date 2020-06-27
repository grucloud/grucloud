const _ = require("lodash");
const assert = require("assert");
const CoreClient = require("../CoreClient");
const logger = require("../../logger")({ prefix: "MockClient" });
const { tos } = require("../../tos");
const { findField } = require("../Common");

module.exports = MockClient = ({ spec, url, config, configDefault }) => {
  assert(spec);
  assert(url);
  assert(config);

  const { createAxios } = config;
  assert(createAxios);

  const findName = (item) => findField({ item, field: "name" });
  const core = CoreClient({
    type: "mock",
    spec,
    ...spec,
    axios: createAxios({ spec, url, config }),
    config,
    configDefault,
    findName,
  });
  return core;
};
