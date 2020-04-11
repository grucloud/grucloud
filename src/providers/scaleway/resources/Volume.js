const ScalewayClient = require("../ScalewayClient");
const type = "volume";

module.exports = ({ name, provider }, config) => {
  const client = ScalewayClient({
    config: provider.config,
    onResponse: ({ volumes }) => ({
      total: volumes.length,
      items: volumes,
    }),
    url: `/volumes`,
  });

  const plan = async (resource) => {
    return [];
  };

  return {
    name,
    type,
    provider,
    client,
    plan,
  };
};
