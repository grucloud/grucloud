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

const { iacTpl } = require("./template/gcp/iacTpl");
const { networkTpl } = require("./template/gcp/networkTpl");
const { diskTpl } = require("./template/gcp/diskTpl");
const { subNetworkTpl } = require("./template/gcp/subNetworkTpl");
const { virtualMachineTpl } = require("./template/gcp/virtualMachineTpl");
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

// Network
const writeNetwork = ({ resource, lives }) =>
  pipe([
    tap(() => {
      //console.log(`writeNetwork`, resource);
    }),
    () => resource,
    switchCase([
      not(eq(get("live.provider:network_type"), "bgp")),
      pipe([
        () => ResourceVarName(resource.name),
        (resourceVarName) => ({
          resourceVarName,
          code: networkTpl({
            resourceVarName,
            resourceName: resource.name,
          }),
        }),
      ]),
      () => undefined,
    ]),
    tap((xxx) => {
      //console.log(`writeNetwork`, xxx);
    }),
  ])();

const writeNetworks = writeResources({
  type: "Network",
  writeResource: writeNetwork,
});

// Volume
const writeVolume = ({ resource, lives }) =>
  pipe([
    tap(() => {
      //console.log(`writeVolume`, resource);
    }),
    () => ResourceVarName(resource.name),
    (resourceVarName) => ({
      resourceVarName,
      code: diskTpl({
        resourceVarName,
        resourceName: resource.name,
      }),
    }),
    tap((xxx) => {
      //console.log(`writeVolume`, xxx);
    }),
  ])();

const writeVolumes = writeResources({
  type: "Volume",
  writeResource: writeVolume,
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

const findSubnetDependencyNames = ({ type, resource, lives }) =>
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

const ResourceVarNameSubnet = (resource) =>
  `subnet_${ResourceVarName(resource.name)}`;

const ResourceNameSubnet = (resource) =>
  ResourceVarNameSubnet(resource).replace(/_/g, "-");

const writeSubNetwork = ({ resource, lives }) =>
  switchCase([
    and([isIpv4, isSubnetPrivate]),
    pipe([
      tap(() => {}),
      () => ResourceVarNameSubnet(resource),
      (resourceVarName) => ({
        resourceVarName,
        code: subNetworkTpl({
          resource,
          resourceVarName,
          resourceName: ResourceNameSubnet(resource),
          dependencies: {
            network: findSubnetDependencyNames({
              type: "Network",
              resource,
              lives,
            }),
          },
        }),
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
const writeVirtualMachine = ({ resource, lives, mapping }) =>
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
        properties: pipe([
          () => ({
            diskSizeGb: get("live.flavor.disk")(resource),
            sourceImage: mapping.image[get("live.image.name")(resource)],
            machineType:
              mapping.virtualMachine.machineType[
                get("live.flavor.name")(resource)
              ],
          }),
          defaultsDeep(mapping.default.virtualMachine),
          assign({
            diskSizeGb: ({ diskSizeGb }) => (diskSizeGb < 20 ? 20 : diskSizeGb),
          }),
        ])(),

        dependencies: {
          disks: pipe([
            () => resource,
            get("live.os-extended-volumes:volumes_attached"),
            pluck("id"),
            map((volumeId) =>
              pipe([
                () => lives,
                find(eq(get("type"), "Volume")),
                get("resources"),
                find(eq(get("id"), volumeId)),
                (resource) => ResourceVarName(resource.name),
              ])()
            ),
          ])(),
          subNetwork: pipe([
            () => resource,
            get("live.addresses"),
            values,
            flatten,
            filter(eq(get("version"), 4)),
            find(
              pipe([
                get("addr"),
                (addr) => {
                  return ipaddr.IPv4.parse(addr);
                },
                eq(callProp("range"), "private"),
              ])
            ),
            get("addr"),
            (addrStr) => {
              return ipaddr.IPv4.parse(addrStr);
            },
            (addr) =>
              pipe([
                () => lives,
                find(eq(get("type"), "Subnet")),
                get("resources"),
                filter(isIpv4),
                find(
                  pipe([
                    get("live.cidr"),
                    (cidr) => {
                      return addr.match(ipaddr.parseCIDR(cidr));
                    },
                  ])
                ),
                ResourceVarNameSubnet,
                tap((matched) => {
                  console.log(`writeVirtualMachine matched `, matched);
                }),
              ])(),
          ])(),
        },
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

const main = async (options) =>
  pipe([
    tap((xxx) => {
      console.log("OpenStack2Gcp");
    }),
    fork({ lives: readModel(options), mapping: readMapping(options) }),
    ({ lives, mapping }) =>
      flatMap((writeResource) => writeResource({ lives, mapping }))([
        writeNetworks,
        writeSubNetworks,
        writeVolumes,
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
