#!/usr/bin/env node
const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  assign,
  and,
  not,
  tryCatch,
  map,
  filter,
} = require("rubico");
const {
  callProp,
  defaultsDeep,
  pluck,
  find,
  values,
  flatten,
} = require("rubico/x");
const ipaddr = require("ipaddr.js");

const {
  createProgramOptions,
  generatorMain,
  ResourceVarNameDefault,
} = require("./generatorUtils");

const { configTpl } = require("./src/gcp/configTpl");
const { iacTpl } = require("./src/gcp/iacTpl");

// SubNetwork
const isIpv4 = eq(get("live.ip_version"), 4);
//const isIpv6 = eq(get("live.ip_version"), 6);

const isSubnetPrivate = pipe([
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

const ResourceVarNameSubnet = (name) =>
  `subnet_${ResourceVarNameDefault(name)}`;

const ResourceNameSubnet = (name) =>
  ResourceVarNameSubnet(name).replace(/_/g, "-");

const writersSpec = [
  {
    group: "compute",
    types: [
      {
        type: "Network",
        typeTarget: "Network",
        properties: ({ resource, mapping }) => ({
          autoCreateSubnetworks: false,
        }),
        ignoreResource: () => eq(get("live.provider:network_type"), "bgp"),
      },
      {
        type: "Subnet",
        typeTarget: "SubNetwork",
        resourceVarName: ResourceVarNameSubnet,
        resourceName: ResourceNameSubnet,
        properties: ({ resource }) => ({
          ipCidrRange: resource.live.cidr,
        }),
        dependencies: {
          network: { type: "Network", group: "compute" },
        },
        ignoreResource: () => not(and([isIpv4, isSubnetPrivate])),
      },
      {
        type: "Volume",
        typeTarget: "Disk",
        resourceName: pipe([(name) => name]),
        filterLive: () => pick([]),
      },
      {
        type: "Server",
        typeTarget: "VmInstance",
        properties: ({ resource, mapping }) =>
          pipe([
            () => ({
              diskSizeGb: get("live.flavor.disk")(resource),
              sourceImage: mapping.image[get("live.image.name")(resource)],
              machineType:
                mapping.virtualMachine.machineType[
                  get("live.flavor.name")(resource)
                ],
            }),
            defaultsDeep(mapping.default.virtualMachine),
            defaultsDeep({
              metadata: {
                items: [
                  {
                    key: "enable-oslogin",
                    value: "True",
                  },
                ],
              },
            }),
            assign({
              diskSizeGb: ({ diskSizeGb }) =>
                diskSizeGb < 20 ? 20 : diskSizeGb,
            }),
          ])(),
        dependencies: {
          disks: {
            type: "Disk",
            group: "compute",
            findDependencyNames: ({ resource, lives }) =>
              pipe([
                () => resource,
                get("live.os-extended-volumes:volumes_attached"),
                pluck("id"),
                map((volumeId) =>
                  pipe([
                    () => lives,
                    find(eq(get("type"), "Volume")),
                    get("resources"),
                    find(eq(get("id"), volumeId)),
                    get("name"),
                    ResourceVarNameDefault,
                    (name) => `resources.compute.Disk.${name}`,
                  ])()
                ),
              ])(),
          },
          subNetwork: {
            type: "Network",
            group: "compute",
            findDependencyNames: ({ resource, lives }) =>
              pipe([
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
                    get("name"),
                    ResourceVarNameSubnet,
                    (name) => `resources.compute.SubNetwork.${name}`,
                  ])(),
              ])(),
          },
        },
      },
    ],
  },
];

//TODO read version from package.json
const options = createProgramOptions({ version: "1.0" });

generatorMain({ name: "os2gcp", options, writersSpec, iacTpl, configTpl })
  .then(() => {})
  .catch((error) => {
    console.error("error");
    console.error(error);
    throw error;
  });
