require("dotenv").config();
const logger = require("logger")({ prefix: "App" });

const GruCloud = (infra) => {
  //TODO refactor
  const doCommand = async (command, options) =>
    Promise.all(
      infra.providers.map(
        async (provider, index) => await provider[command](options[index])
      )
    );

  return {
    destroy: async () => (await doCommand("destroy")).flat(),
    listTargets: async () => (await doCommand("listTargets")).flat(),
    listLives: async () => (await doCommand("listLives")).flat(),
    plan: async () => (await doCommand("plan")).flat(),
    deployPlan: async () => (await doCommand("deployPlan", plans)).flat(),
  };
};

module.exports = GruCloud;
