const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit, any } = require("rubico");
const { defaultsDeep, pluck, flatten, find, callProp } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { compare, buildTags } = require("../AzureCommon");

exports.fnSpecs = ({ config }) => {
  const { location } = config;

  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/compute/virtual-machines
        // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}?api-version=2019-12-01
        // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/virtualMachines?api-version=2019-12-01
        group: "compute",
        type: "VirtualMachine",
        dependsOn: [
          "Resources::ResourceGroup",
          "virtualNetworks::NetworkInterface",
        ],
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
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
            pathSuffix: ({ dependencies: { resourceGroup } }) => {
              assert(resourceGroup, "missing resourceGroup dependency");
              return `/resourceGroups/${resourceGroup.name}/providers/Microsoft.Compute/virtualMachines`;
            },
            pathSuffixList: () =>
              `/providers/Microsoft.Compute/virtualMachines`,
            apiVersion: "2019-12-01",
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
                group: "Resources",
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
  ])();
};
