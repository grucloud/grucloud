const ScalewayClient = require("../ScalewayClient");
const type = "address";

module.exports = ({ name, provider }, config) => {
  const client = ScalewayClient({
    config,
    onResponse: (data) => ({ items: data.ips }),
    url: `/ips`,
  });

  const plan = async (resource) => {
    try {
      const { address } = await client.get(resource.name);

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
    provider,
    client,
    plan,
  };
};
