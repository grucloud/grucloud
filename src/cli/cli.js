const { createInfra } = require("./infra");
const { planQuery } = require("./planQuery");
const { displayLives } = require("./displayLives");
const { planDeploy } = require("./planDeploy");
const { planDestroy } = require("./planDestroy");
const { displayStatus } = require("./displayStatus");

exports.planQuery = async ({ program }) => {
  //console.log(program.infra);

  try {
    const infra = createInfra({ infra: program.infra });
    await planQuery(infra.providers[0]);
    await displayLives(infra.providers[0]);
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

exports.planDeploy = async ({ program }) => {
  //console.log("plan deploy");

  try {
    const infra = createInfra({ infra: program.infra });
    const provider = infra.providers[0];
    await planDeploy(provider);
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

exports.planDestroy = async ({ program }) => {
  console.log("plan destroy");
  const infra = createInfra({ infra: program.infra });

  try {
    await planDestroy(infra.providers[0]);
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

exports.displayStatus = async ({ program }) => {
  try {
    const infra = createInfra({ infra: program.infra });
    const provider = infra.providers[0];
    await displayStatus(infra.providers[0]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
