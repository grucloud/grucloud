#!/usr/bin/env node
const fs = require("fs").promises;
const path = require("path");
const { pipe, tap, get, eq, map } = require("rubico");
const { first, find } = require("rubico/x");
const { camelCase } = require("change-case");
const prettier = require("prettier");

const { iacTpl } = require("./iacTpl");
const { networkTpl } = require("./networkTpl");

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
    () =>
      networkTpl({
        resourceVarName: camelCase(network.name),
        resourceName: network.name,
      }),
    tap((code) => {
      console.log(`writeNetwork`, code);
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

const writeOutput = ({ options, content }) =>
  pipe([
    () => fs.writeFile(options.output, content),
    tap(() => {
      console.log(`infrastrucure written to ${options.output}`);
    }),
  ])();

exports.main = async (options) =>
  pipe([
    tap(() => {
      console.log("OpenStack2Gcp");
    }),
    () => options,
    readModel,
    (models) => map((writeResource) => writeResource(models))([writeNetworks]),
    (results) => results.join("/n"),
    tap((xxx) => {
      console.log("");
    }),
    (resources) => iacTpl({ resources }),
    prettier.format,
    (content) => writeOutput({ options, content }),
  ])();
