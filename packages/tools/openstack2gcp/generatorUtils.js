const assert = require("assert");
const path = require("path");
const fs = require("fs").promises;
const { camelCase } = require("change-case");
const prettier = require("prettier");
const { Command } = require("commander");

const {
  pipe,
  tap,
  get,
  eq,
  map,
  fork,
  filter,
  flatMap,
  switchCase,
  not,
} = require("rubico");

const pick = require("rubico/pick");

const {
  first,
  isEmpty,
  find,
  callProp,
  pluck,
  isFunction,
  identity,
  values,
  isString,
  isObject,
} = require("rubico/x");

const propertyValue = switchCase([
  isString,
  (value) => `"${value}"`,
  isObject,
  (value) => JSON.stringify(value, null, 4),
  identity,
]);

exports.buildPropertyList = ({ resource: { live }, pickProperties }) =>
  pipe([
    () => live,
    pick(pickProperties),
    map.entries(([key, value]) => [key, `${key}: ${propertyValue(value)}`]),
    values,
  ])();

exports.configTpl = ({ resourceVarName, resource: { name }, propertyList }) =>
  pipe([
    () => propertyList,
    callProp("join", ","),
    (propertyListJoined) => `${resourceVarName}: {
      name: "${name}"${
      !isEmpty(propertyListJoined)
        ? `\n,properties: { 
          ${propertyListJoined} 
        }`
        : ""
    },
    },`,
  ])();

const dependencyValue = ({ key, value }) =>
  switchCase([() => key.endsWith("s"), () => `[${value}]`, () => value])();

const buildDependencies = (dependencies = {}) =>
  pipe([
    () => dependencies,
    map.entries(([key, value]) => [
      key,
      !isEmpty(value) && `${key}: ${dependencyValue({ key, value })}`,
    ]),
    values,
    filter(identity),
    switchCase([
      isEmpty,
      () => "",
      (values) => `dependencies: { 
       ${values.join(",\n")}
     },`,
    ]),
  ])();

exports.codeTpl = ({
  group,
  type,
  resourceVarName,
  dependencies,
  resource: { namespace },
  noProperties = false,
  createPrefix = "make",
}) => `
  const ${resourceVarName} = provider.${group}.${createPrefix}${type}({
    name: config.${resourceVarName}.name,${
  namespace ? `\nnamespace: ${namespace},` : ""
}${buildDependencies(dependencies)}${
  !noProperties
    ? `\nproperties: () => config.${resourceVarName}.properties,`
    : ""
}
  });
  `;

const writeToFile =
  ({ filename }) =>
  (content) =>
    pipe([
      tap(() => {
        assert(filename);
        assert(content);
      }),
      () => prettier.format(content, { parser: "babel" }),
      (formatted) => fs.writeFile(filename, formatted),
      tap(() => {
        console.log(`written to ${filename}`);
      }),
    ])();

exports.writeToFile = writeToFile;

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
      console.log("readMapping", options.mapping);
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
    fork({ lives: readModel(options), mapping: readMapping(options) }),
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

const ResourceVarName = (name) => camelCase(name);
exports.ResourceVarName = ResourceVarName;

const findLiveById =
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

exports.findLiveById = findLiveById;

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

exports.findDependencyNames = ({
  type,
  resource,
  lives,
  filterDependency = () => true,
}) =>
  pipe([
    () => resource.dependencies,
    find(eq(get("type"), type)),
    get("ids"),
    map(findLiveById({ type, lives })),
    tap((xxx) => {
      assert(true);
    }),
    filter(filterDependency),
    pluck("name"),
    map(ResourceVarName),
    tap((xxx) => {
      assert(true);
    }),
  ])();
