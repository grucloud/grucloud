#!/usr/bin/env node
const fs = require("fs").promises;
const path = require("path");
const { pipe, tap, get, eq, map, flatMap, fork } = require("rubico");
const { first, find, callProp, pluck } = require("rubico/x");
const { camelCase } = require("change-case");
const prettier = require("prettier");

const { iacTpl } = require("./iacTpl");
const { networkTpl } = require("./networkTpl");
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

const writeNetworks = pipe([
  tap((models) => {
    console.log(`writeNetwork`);
  }),
  find(eq(get("type"), "Network")),
  get("resources"),
  map(
    pipe([
      tap((network) => {
        console.log(`writeNetwork`);
      }),
      get("live"),
      writeNetwork,
      tap((network) => {
        console.log(`writeNetwork`);
      }),
    ])
  ),
  tap((networks) => {
    console.log(`writeNetwork`);
  }),
]);

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

const writeVirtualMachines = pipe([
  tap((models) => {
    console.log(`writeVMs`);
  }),
  find(eq(get("type"), "Server")),
  get("resources"),
  map(
    pipe([
      tap((network) => {
        console.log(`writeVMs`);
      }),
      get("live"),
      writeVirtualMachine,
    ])
  ),
  tap((networks) => {
    console.log(`writeVMs`);
  }),
]);

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
