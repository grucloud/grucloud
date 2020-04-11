const type = "servers";

module.exports = ({ name, provider, client }, config) => {
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
