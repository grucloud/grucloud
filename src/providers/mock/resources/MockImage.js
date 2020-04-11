const _ = require("lodash");
const MockClient = require("../MockClient");
const type = "mockImage";

module.exports = ({ name = "MockImage", provider, dependencies }, fnConfig) => {
  const client = MockClient(provider.config);
  const plan = async (resource) => {
    return [];
  };

  return {
    name,
    config: () => fnConfig(dependencies),
    type,
    provider,
    client,
    plan,
  };
};
