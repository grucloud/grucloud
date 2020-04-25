#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const { displayPlan } = require("./displayPlan");
const { displayLives } = require("./displayLives");
const { planDeploy } = require("./planDeploy");
const { planDestroy } = require("./planDestroy");

const creatInfraFromFile = ({ filename, config }) => {
  console.log("creatInfraFromFile", filename);
  try {
    const InfraCode = require(filename);
    const infra = InfraCode({ config });
    return infra;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getInfraFilename = ({ infra }) =>
  infra ? path.join(process.cwd(), infra) : path.join(process.cwd(), "iac.js");

const checkFileExist = ({ filename }) => {
  if (!fs.existsSync(filename)) {
    throw Error(`Cannot open file ${filename}`);
  }
};

const createInfra = ({ infra }) => {
  const filename = getInfraFilename({ infra });
  console.log(`Using ${filename}`);
  checkFileExist({ filename });
  const config = {};
  return creatInfraFromFile({ filename, config });
};

exports.planQuery = async ({ program }) => {
  console.log("plan query");
  console.log(program.infra);
  const infra = createInfra({ infra: program.infra });
  //console.log(program.opts());
  if (!infra.providers) {
    throw Error(`no providers provided`);
  }
  try {
    await displayPlan(infra.providers[0]);
    await displayLives(infra.providers[0]);
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};
exports.planDeploy = async ({ program }) => {
  console.log("plan deploy");
  const infra = createInfra({ infra: program.infra });
  if (!infra.providers) {
    throw Error(`no providers provided`);
  }
  try {
    await planDeploy(infra.providers[0]);
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};
exports.planDestroy = async ({ program }) => {
  console.log("plan destroy");
  const infra = createInfra({ infra: program.infra });

  if (!infra.providers) {
    throw Error(`no providers provided`);
  }

  try {
    await planDestroy(infra.providers[0]);
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};
