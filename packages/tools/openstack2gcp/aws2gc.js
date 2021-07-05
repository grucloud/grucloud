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
const prettier = require("prettier");
//const ipaddr = require("ipaddr.js");
const { iacTpl } = require("./src/aws/iacTpl");

const { writeVpcs } = require("./src/aws/ec2/vpc/vpcGen");
const { writeSubnets } = require("./src/aws/ec2/subnet/subnetGen");

const { readModel, readMapping, writeToFile } = require("./generatorUtils");

const { Command } = require("commander");

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
        console.log("");
      }),
      ({ resourcesVarNames, resourcesCode }) =>
        iacTpl({ resourcesVarNames, resourcesCode }),
      // TODO: No parser and no filepath given, using 'babel' the parser now but this will throw an error in the future. Please specify a parser or a filepath so one can be inferred.
      prettier.format,
      tap((xxx) => {
        console.log("");
      }),
      (content) => writeToFile({ filename, content }),
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
      tap((xxx) => {
        assert(true);
      }),
      // Common put it in writeToFile
      // TODO: No parser and no filepath given, using 'babel' the parser now but this will throw an error in the future. Please specify a parser or a filepath so one can be inferred.
      prettier.format,
      tap((xxx) => {
        assert(true);
      }),
      (content) => writeToFile({ filename, content }),
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
    tap((xxx) => {
      console.log("");
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
