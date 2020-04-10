const ScalewayClient = require("../ScalewayClient");

const type = "servers";

module.exports = ({ name, provider }, config) => {
  const client = ScalewayClient({
    config,
    onResponse: (data) => {
      return { items: data.servers };
    },
    url: `servers`,
  });

  const plan = async (resource) => {
    try {
      return [];
    } catch (ex) {
      console.log(`resource ${resource.name} not found `);
      return [
        {
          action: "CREATE",
          resource,
        },
      ];
    }
  };
  return {
    name,
    type,
    client,
    provider,
    plan,
  };
};
