const type = "images";

module.exports = ({ name, provider, client }, config) => {
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
