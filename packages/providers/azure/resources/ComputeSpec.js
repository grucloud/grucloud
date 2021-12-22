const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit, any } = require("rubico");
const { defaultsDeep, pluck, flatten, find, callProp } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { buildTags } = require("../AzureCommon");

exports.fnSpecs = ({ config }) => {
  const { location } = config;

  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/compute/virtual-machines
        group: "Compute",
        type: "VirtualMachine",
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
          },
          networkInterface: {
            type: "NetworkInterface",
            group: "Network",
            createOnly: true,
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
        omitProperties: [
          "properties.osProfile.adminPassword",
          "properties.storageProfile",
          "properties.osProfile",
        ],
        findDependencies: ({ live }) => [
          {
            //TODO replace with findDependenciesResourceGroup
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
            group: "Network",
            ids: pipe([
              () => live,
              get("properties.networkProfile.networkInterfaces"),
              pluck("id"),
            ])(),
          },
        ],
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
        Client: ({ spec }) =>
          AzClient({
            spec,
            config,
          }),
      },
    ],
  ])();
};
