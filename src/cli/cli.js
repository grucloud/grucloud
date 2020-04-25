#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const { displayPlan } = require("./displayPlan");
const { displayLives } = require("./displayLives");

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

exports.main = async ({ program }) => {
  console.log(`GruCloud ${program._version}, ${program.args[0]}`);

  const infra = createInfra({ infra: program.args[0] });
  //console.log(program.opts());
  if (!infra.providers) {
    throw Error(`no providers provided`);
  }
  try {
    if (program.deploy) {
      console.log("deploy");
    } else {
      await displayPlan(infra.providers[0]);
      await displayLives(infra.providers[0]);
    }
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};
