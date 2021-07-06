#!/usr/bin/env node
const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  map,
  flatMap,
  fork,
  switchCase,
  filter,
  and,
  tryCatch,
  not,
  assign,
} = require("rubico");
const {
  first,
  find,
  callProp,
  pluck,
  identity,
  values,
  flatten,
  size,
  defaultsDeep,
} = require("rubico/x");
const { Command } = require("commander");

const { readModel, readMapping, writeToFile } = require("./generatorUtils");

const { iacTpl } = require("./src/aws/iacTpl");
const { writeVpcs } = require("./src/aws/ec2/vpc/vpcGen");
const { writeSubnets } = require("./src/aws/ec2/subnet/subnetGen");

const createProgram = ({ version }) => {
  const program = new Command();
  program.storeOptionsAsProperties(false);
  program.allowUnknownOption(); // For testing
  program.version(version);
  program.requiredOption("-i, --input <file>", "lives resources");
  program.option("-o, --outputCode <file>", "iac.js output", "iac.js");
  program.option("-c, --outputConfig <file>", "config.js output", "config.js");
  program.option("-m, --mapping <file>", "mapping file", "mapping.json");

  program.parse(process.argv);

  return program;
};

const writers = [writeVpcs, writeSubnets];

const configTpl = (content) => `const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  ${content}
});`;

const writeIac =
  ({ filename }) =>
  (resources) =>
    pipe([
      () => resources,
      fork({
        resourcesVarNames: pluck("resourceVarName"),
        resourcesCode: pipe([pluck("code"), callProp("join", "\n")]),
      }),
      tap((xxx) => {
        assert(true);
      }),
      ({ resourcesVarNames, resourcesCode }) =>
        iacTpl({ resourcesVarNames, resourcesCode }),
      writeToFile({ filename }),
    ])();

const writeConfig =
  ({ filename }) =>
  (resources) =>
    pipe([
      () => resources,
      pluck("config"),
      callProp("join", "\n"),
      tap((xxx) => {
        assert(true);
      }),
      configTpl,
      writeToFile({ filename }),
    ])();

const main = async (options) =>
  pipe([
    tap((xxx) => {
      console.log("aws2gc");
    }),
    fork({ lives: readModel(options), mapping: () => ({}) }),
    ({ lives, mapping }) =>
      flatMap((writeResource) => writeResource({ lives, mapping }))(writers),
    filter(identity),
    tap((xxx) => {
      assert(true);
    }),
    fork({
      iac: writeIac({ filename: options.outputCode }),
      config: writeConfig({ filename: options.outputConfig }),
    }),
  ])();

//TODO read version from package.json
const program = createProgram({ version: "1.0" });
const options = program.opts();

main(options)
  .then(() => {})
  .catch((error) => {
    console.error("error");
    console.error(error);
    throw error;
  });
