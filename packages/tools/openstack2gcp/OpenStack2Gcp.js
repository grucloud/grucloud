#!/usr/bin/env node
const fs = require("fs").promises;
const path = require("path");
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
} = require("rubico");
const { first, find, callProp, pluck, identity } = require("rubico/x");
const { camelCase } = require("change-case");
const prettier = require("prettier");
const ipaddr = require("ipaddr.js");

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

const writeResources =
  ({ type, writeResource }) =>
  (lives) =>
    pipe([
      tap(() => {
        //console.log(`writeResources ${type} `);
      }),
      () => lives,
      find(eq(get("type"), type)),
      get("resources"),
      map(
        pipe([
          tap((network) => {
            //console.log(`writeResources`);
          }),
          (resource) => writeResource({ resource, lives }),
        ])
      ),
    ])();

const findLiveById =
  ({ lives, type }) =>
  (id) =>
    pipe([
      () => lives,
      find(eq(get("type"), type)),
      get("resources"),
      find(eq(get("id"), id)),
      tap((xxx) => {
        //console.log(`findName`);
      }),
    ])();

const ResourceVarName = (name) => camelCase(name);

// Network
const writeNetwork = ({ resource, lives }) =>
  pipe([
    tap(() => {
      //console.log(`writeNetwork`, resource);
    }),
    () => ResourceVarName(resource.name),
    (resourceVarName) => ({
      resourceVarName,
      code: networkTpl({
        resourceVarName,
        resourceName: resource.name,
      }),
    }),
    tap((xxx) => {
      //console.log(`writeNetwork`, xxx);
    }),
  ])();

const writeNetworks = writeResources({
  type: "Network",
  writeResource: writeNetwork,
});

// SubNetwork
const isIpv4 = eq(get("live.ip_version"), 4);
const isIpv6 = eq(get("live.ip_version"), 6);

const isSubnetPrivate = pipe([
  tap((xxx) => {
    //console.log(`isSubnetPrivate`);
  }),
  get("live.cidr"),
  (cidr) =>
    tryCatch(
      pipe([
        (cidr) => {
          return ipaddr.IPv4.networkAddressFromCIDR(cidr);
        },
        eq(callProp("range"), "private"),
      ]),
      (error, cidr) => {
        console.log(cidr, error);
      }
    )(cidr),
]);

const findDependencyNames = ({ type, resource, lives }) =>
  pipe([
    () => resource.dependencies,
    find(eq(get("type"), type)),
    get("ids"),
    map(findLiveById({ type, lives })),
    pluck("name"),
    map(ResourceVarName),
    tap((xxx) => {
      //console.log(`writeSubNetwork`);
    }),
  ])();

const writeSubNetwork = ({ resource, lives }) =>
  switchCase([
    and([isIpv4, isSubnetPrivate]),
    pipe([
      tap(() => {}),
      () => `subnet_${ResourceVarName(resource.name)}`,
      (resourceVarName) => ({
        resourceVarName,
        code: subNetworkTpl({
          resource,
          resourceVarName,
          resourceName: resource.name,
          dependencyNames: pipe([
            () => resource.dependencies,
            find(eq(get("type"), "Network")),
            get("ids"),
            map(findLiveById({ type: "Network", lives })),
            pluck("name"),
            map(ResourceVarName),
            tap((xxx) => {
              //console.log(`writeSubNetwork`);
            }),
          ])(),
        }),
      }),
      tap((xxx) => {
        //console.log(`writeSubNetwork`, xxx);
      }),
    ]),
    and([isIpv6]),
    () => {
      //console.log("TODO IPv6");
    },
    () => {
      //console.log("not valid");
    },
  ])(resource);

const writeSubNetworks = writeResources({
  type: "Subnet",
  writeResource: writeSubNetwork,
});

// Virtual Machine
const writeVirtualMachine = ({ resource, lives }) =>
  pipe([
    tap(() => {
      console.log(`writeVirtualMachine`, resource);
    }),
    () => ResourceVarName(resource.name),
    (resourceVarName) => ({
      resourceVarName,
      code: virtualMachineTpl({
        resource,
        resourceVarName,
        resourceName: resource.name,
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
    filter(identity),
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
