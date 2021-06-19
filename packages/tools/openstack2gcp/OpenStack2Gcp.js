#!/usr/bin/env node
const fs = require("fs").promises;
const path = require("path");
const { pipe, tap, get, eq, map, flatMap, fork } = require("rubico");
const { first, find, callProp, pluck } = require("rubico/x");
const { camelCase } = require("change-case");
const prettier = require("prettier");

const { iacTpl } = require("./iacTpl");
const { networkTpl } = require("./networkTpl");
const { subNetworkTpl } = require("./subNetworkTpl");

const { virtualMachineTpl } = require("./virtualMachineTpl");

const readModel = pipe([
  tap((options) => {
    console.log(`readModel`, options);
  }),
  (options) => fs.readFile(path.resolve(options.input), "utf-8"),
  JSON.parse,
  get("result.results"),
  first,
  get("results"),
  tap((xxx) => {
    console.log("");
  }),
]);

const writeResources = ({ type, writeResource }) =>
  pipe([
    tap((models) => {
      console.log(`writeResources ${type} `);
    }),
    find(eq(get("type"), type)),
    get("resources"),
    map(
      pipe([
        tap((network) => {
          console.log(`writeNetwork`);
        }),
        //get("live"),
        writeResource,
      ])
    ),
  ]);

// Network
const writeNetwork = (network) =>
  pipe([
    tap(() => {
      console.log(`writeNetwork`, network);
    }),
    () => camelCase(network.name),
    (resourceVarName) => ({
      resourceVarName,
      code: networkTpl({
        resourceVarName,
        resourceName: network.name,
      }),
    }),
    tap((xxx) => {
      console.log(`writeNetwork`, xxx);
    }),
  ])();

const writeNetworks = writeResources({
  type: "Network",
  writeResource: writeNetwork,
});

// SubNetwork
const writeSubNetwork = (subNetwork) =>
  pipe([
    tap(() => {
      console.log(`writeSubNetwork`, subNetwork);
    }),
    () => camelCase(subNetwork.name),
    (resourceVarName) => ({
      resourceVarName,
      code: subNetworkTpl({
        resourceVarName,
        resourceName: subNetwork.name,
      }),
    }),
    tap((xxx) => {
      console.log(`writeSubNetwork`, xxx);
    }),
  ])();

const writeSubNetworks = writeResources({
  type: "Subnet",
  writeResource: writeSubNetwork,
});

// Virtual Machine
const writeVirtualMachine = (virtualMachine) =>
  pipe([
    tap(() => {
      console.log(`writeVirtualMachine`, virtualMachine);
    }),
    () => camelCase(virtualMachine.name),
    (resourceVarName) => ({
      resourceVarName,
      code: virtualMachineTpl({
        resourceVarName,
        resourceName: virtualMachine.name,
      }),
    }),
    tap((xxx) => {
      console.log(`writeVirtualMachine`, xxx);
    }),
  ])();

const writeVirtualMachines = writeResources({
  type: "Server",
  writeResource: writeVirtualMachine,
});

const writeOutput = ({ options, content }) =>
  pipe([
    () => fs.writeFile(options.output, content),
    tap(() => {
      console.log(`infrastrucure written to ${options.output}`);
    }),
  ])();

exports.main = async (options) =>
  pipe([
    tap((xxx) => {
      console.log("OpenStack2Gcp");
    }),
    () => options,
    readModel,
    (models) =>
      flatMap((writeResource) => writeResource(models))([
        writeNetworks,
        writeSubNetworks,
        writeVirtualMachines,
      ]),
    tap((xxx) => {
      console.log("OpenStack2Gcp");
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
