const GoogleClient = require("../GoogleClient");
const type = "address";

module.exports = ({ name, provider, dependencies }, fnConfig) => {
  const { project, region } = provider.config;
  const client = GoogleClient({
    config: provider.config,
    url: `/projects/${project}/regions/${region}/addresses/`,
  });

  const plan = async (resource) => {
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
