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
const ipaddr = require("ipaddr.js");

const { iacTpl } = require("./template/aws/iacTpl");
const { vpcTpl } = require("./template/aws/ec2/vpcTpl");
const { subnetTpl } = require("./template/aws/ec2/subnetTpl");

const {
  readModel,
  readMapping,
  writeResources,
  findLiveById,
  ResourceVarName,
  writeOutput,
} = require("./generatorUtils");

const { Command } = require("commander");

const createProgram = ({ version }) => {
  const program = new Command();
  program.storeOptionsAsProperties(false);
  program.allowUnknownOption(); // For testing
  program.version(version);
  program.requiredOption("-i, --input <file>", "lives resources");
  program.option("-o, --output <file>", "iac.js output", "iac.js");
  program.option("-m, --mapping <file>", "mapping file", "mapping.json");

  program.parse(process.argv);

  return program;
};

// Vpc
const writeVpc = ({ resource, lives }) =>
  pipe([
    tap(() => {
      console.log(`writeVpc`, resource, size(lives));
    }),
    () => resource,
    switchCase([
      not(get("isDefault")),
      pipe([
        () => ResourceVarName(resource.name),
        (resourceVarName) => ({
          resourceVarName,
          code: vpcTpl({
            resourceVarName,
            resource,
          }),
        }),
      ]),
      () => undefined,
    ]),
    tap((xxx) => {
      assert(true);
    }),
  ])();

const writeVpcs = writeResources({
  group: "ec2",
  type: "Vpc",
  writeResource: writeVpc,
});

const findSubnetDependencyNames = ({ type, resource, lives }) =>
  pipe([
    () => resource.dependencies,
    find(eq(get("type"), type)),
    get("ids"),
    map(findLiveById({ type, lives })),
    pluck("name"),
    map(ResourceVarName),
    tap((xxx) => {
      assert(true);
    }),
  ])();

const ResourceVarNameSubnet = (resource) => `${ResourceVarName(resource.name)}`;

const ResourceNameSubnet = (resource) =>
  ResourceVarNameSubnet(resource).replace(/_/g, "-");

const writeSubnet = ({ resource, lives }) =>
  pipe([
    () => resource,
    switchCase([
      not(get("isDefault")),
      pipe([
        tap(() => {}),
        () => ResourceVarNameSubnet(resource),
        (resourceVarName) => ({
          resourceVarName,
          code: subnetTpl({
            resource,
            resourceVarName,
            resourceName: ResourceNameSubnet(resource),
            dependencies: {
              vpc: findSubnetDependencyNames({
                type: "Vpc",
                resource,
                lives,
              }),
            },
          }),
        }),
      ]),
      () => {
        //console.log("default subnet");
      },
    ]),
  ])();

const writeSubnets = writeResources({
  type: "Subnet",
  writeResource: writeSubnet,
});

//TODO

const main = async (options) =>
  pipe([
    tap((xxx) => {
      console.log("aws2gc");
    }),
    fork({ lives: readModel(options), mapping: () => ({}) }),
    ({ lives, mapping }) =>
      flatMap((writeResource) => writeResource({ lives, mapping }))([
        writeVpcs,
        writeSubnets,
        // writeVolumes,
        // writeVirtualMachines,
      ]),
    filter(identity),
    tap((xxx) => {
      assert(true);
    }),
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
    (content) => writeOutput({ options, content }),
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
