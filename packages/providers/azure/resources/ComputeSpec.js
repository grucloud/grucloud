const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit, any } = require("rubico");
const { defaultsDeep, pluck, flatten, find, callProp } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AzProvider" });
const { getField } = require("@grucloud/core/ProviderCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { compare, isUpByIdFactory, isInstanceUp } = require("../AzureCommon");
const AzTag = require("../AzTag");

exports.fnSpecs = ({ config }) => {
  const { location, managedByKey, managedByValue, stageTagKey, stage } = config;
  const subscriptionId = process.env.SUBSCRIPTION_ID;

  const isOurMinion = AzTag.isOurMinion;

  const buildTags = () => ({
    [managedByKey]: managedByValue,
    [stageTagKey]: stage,
  });

  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/compute/virtual-machines
        // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}?api-version=2019-12-01
        // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/virtualMachines?api-version=2019-12-01
        group: "compute",
        type: "VirtualMachine",
        dependsOn: [
          "resourceManagement::ResourceGroup",
          "virtualNetworks::NetworkInterface",
        ],
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "resourceManagement",
          },
          networkInterface: {
            type: "NetworkInterface",
            group: "virtualNetworks",
          },
        }),
        environmentVariables: () => [
          {
            path: "properties.osProfile.adminPassword",
            suffix: "ADMIN_PASSWORD",
          },
        ],
        filterLive: () =>
          pipe([
            pick(["tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                pick([
                  "hardwareProfile",
                  "storageProfile.imageReference",
                  "osProfile",
                ]),
                omitIfEmpty(["osProfile.secrets"]),
                omit([
                  "osProfile.requireGuestProvisionSignal",
                  "storageProfile.imageReference.exactVersion",
                ]),
              ]),
            }),
          ]),
        compare: compare({
          filterTarget: pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["properties.osProfile.adminPassword"]),
          ]),
          filterLive: pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
        }),
        Client: ({ spec }) =>
          AzClient({
            spec,
            pathBase: `/subscriptions/${subscriptionId}`,
            pathSuffix: ({ dependencies: { resourceGroup } }) => {
              assert(resourceGroup, "missing resourceGroup dependency");
              return `/resourceGroups/${resourceGroup.name}/providers/Microsoft.Compute/virtualMachines`;
            },
            pathSuffixList: () =>
              `/providers/Microsoft.Compute/virtualMachines`,
            queryParameters: () => "?api-version=2019-12-01",
            isUpByIdFactory,
            isInstanceUp,
            config,
            configDefault: ({ properties, dependencies }) => {
              const { networkInterface } = dependencies;
              assert(
                networkInterface,
                "networkInterfaces is missing VirtualMachine"
              );
              return defaultsDeep({
                location,
                tags: buildTags(config),
                properties: {
                  networkProfile: {
                    networkInterfaces: [
                      {
                        id: getField(networkInterface, "id"),
                      },
                    ],
                  },
                },
              })(properties);
            },
            findDependencies: ({ live }) => [
              {
                type: "ResourceGroup",
                group: "resourceManagement",
                ids: pipe([
                  () => [
                    live.id
                      .replace(`/providers/${live.type}/${live.name}`, "")
                      .toLowerCase()
                      .replace("resourcegroups", "resourceGroups"),
                  ],
                ])(),
              },
              {
                type: "NetworkInterface",
                group: "virtualNetworks",
                ids: pipe([
                  () => live,
                  get("properties.networkProfile.networkInterfaces"),
                  pluck("id"),
                ])(),
              },
            ],
          }),
      },
    ],
    map(defaultsDeep({ isOurMinion, compare })),
  ])();
};
