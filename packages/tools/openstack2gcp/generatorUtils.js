const assert = require("assert");
const path = require("path");
const fs = require("fs").promises;
const { camelCase } = require("change-case");
const prettier = require("prettier");
const { Command } = require("commander");

const { pipe, tap, get, eq, map, fork, filter, flatMap } = require("rubico");
const {
  first,
  find,
  callProp,
  pluck,
  isFunction,
  identity,
} = require("rubico/x");

const writeToFile =
  ({ filename }) =>
  (content) =>
    pipe([
      () => prettier.format(content, { parser: "babel" }),
      (formatted) => fs.writeFile(filename, formatted),
      tap(() => {
        console.log(`written to ${filename}`);
      }),
    ])();

const readModel = (options) =>
  pipe([
    tap(() => {
      console.log(`readModel`, options);
    }),
    () => fs.readFile(path.resolve(options.input), "utf-8"),
    JSON.parse,
    tap((xxx) => {
      console.log("");
    }),
    get("result.results"),
    first,
    tap((xxx) => {
      console.log("");
    }),
    get("results"),
    tap((xxx) => {
      console.log("");
    }),
  ]);

exports.readModel = readModel;

const readMapping = (options) =>
  pipe([
    tap(() => {
      //console.log("readMapping", options.mapping);
    }),
    () => fs.readFile(path.resolve(options.mapping), "utf-8"),
    JSON.parse,
  ]);

exports.readMapping = readMapping;

exports.createProgramOptions = ({ version }) => {
  const program = new Command();
  program.storeOptionsAsProperties(false);
  program.allowUnknownOption(); // For testing
  program.version(version);
  program.requiredOption("-i, --input <file>", "lives resources");
  program.option("-o, --outputCode <file>", "iac.js output", "iac.js");
  program.option("-c, --outputConfig <file>", "config.js output", "config.js");
  program.option("-m, --mapping <file>", "mapping file", "mapping.json");

  program.parse(process.argv);

  return program.opts();
};

const writeIac =
  ({ filename, iacTpl }) =>
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
  ({ filename, configTpl }) =>
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

exports.generatorMain = ({ name, options, writers, iacTpl, configTpl }) =>
  pipe([
    tap((xxx) => {
      console.log(name);
    }),
    fork({ lives: readModel(options), mapping: () => ({}) }),
    ({ lives, mapping }) =>
      flatMap((writeResource) => writeResource({ lives, mapping }))(writers),
    filter(identity),
    tap((xxx) => {
      assert(true);
    }),
    fork({
      iac: writeIac({ filename: options.outputCode, iacTpl }),
      config: writeConfig({ filename: options.outputConfig, configTpl }),
    }),
  ])();

exports.ResourceVarName = (name) => camelCase(name);

exports.findLiveById =
  ({ lives, type }) =>
  (id) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(type);
        assert(id);
      }),
      () => lives,
      find(eq(get("type"), type)),
      get("resources"),
      find(eq(get("id"), id)),
      tap((xxx) => {
        //console.log(`findName`);
      }),
    ])();

exports.writeResources =
  ({ type, writeResource }) =>
  ({ lives, mapping }) =>
    pipe([
      tap(() => {
        assert(type);
        assert(isFunction(writeResource));
      }),
      () => lives,
      find(eq(get("type"), type)),
      get("resources"),
      map(
        pipe([
          tap((network) => {
            //console.log(`writeResources`);
          }),
          (resource) => writeResource({ resource, lives, mapping }),
        ])
      ),
    ])();
