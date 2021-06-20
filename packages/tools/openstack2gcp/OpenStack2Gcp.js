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
} = require("rubico/x");
const { camelCase } = require("change-case");
const prettier = require("prettier");
const ipaddr = require("ipaddr.js");

const { iacTpl } = require("./iacTpl");
const { networkTpl } = require("./networkTpl");
const { diskTpl } = require("./diskTpl");
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
        properties: { diskSizeGb: get("live.flavor.disk")(resource) },
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
