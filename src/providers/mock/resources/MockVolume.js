const MockClient = require("../MockClient");
const type = "mockVolume";

module.exports = (
  { name = "MockVolume", provider, dependencies },
  fnConfig
) => {
  const client = MockClient(provider.config);
  const plan = async (resource) => {
    //console.log("plan resource", resource);
    return [];
  };

  return {
    config: () => fnConfig(dependencies),
    name,
    type,
    provider,
    client,
    plan,
  };
};
