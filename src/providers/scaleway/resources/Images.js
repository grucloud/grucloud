const ScalewayClient = require("../ScalewayClient");
const type = "images";

module.exports = ({ name, provider }, config) => {
  const client = ScalewayClient({
    config: provider.config,
    onResponse: (data) => ({ items: data.images }),
    url: `/images`,
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
