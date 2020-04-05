require("dotenv").config();

const utils = require("util");

const GruCloud = (infra) => {
  console.log("GruCloud", utils.inspect(infra, null, 4));

  const providers = infra.providers.map((provider) =>
    provider.engine(provider.config)
  );

  const connect = async () => {
    console.log("connect");
    await Promise.all(providers.map((provider) => provider.connect()));
    console.log("connected");
  };

  const list = async () => {
    console.log("list");
    await Promise.all(providers.map((provider) => provider.list()));
    console.log("listed");
  };

  const plan = async () => {
    console.log("plan");
  };

  return {
    connect,
    list,
    plan,
  };
};

module.exports = GruCloud;
