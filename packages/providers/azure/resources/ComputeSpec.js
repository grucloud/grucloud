const assert = require("assert");
const { pipe, not, get, tap, pick, map, assign, omit } = require("rubico");
const { defaultsDeep, pluck, isEmpty } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { buildTags } = require("../AzureCommon");

const group = "Compute";

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "Disk",
        managedByOther: pipe([get("live.managedBy"), not(isEmpty)]),
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/compute/virtual-machines
        type: "VirtualMachine",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
          },
          //TODO
          // CapacityGroup
          // ManagedIdentities
          // GalleryImage
          networkInterface: {
            type: "NetworkInterface",
            group: "Network",
            createOnly: true,
          },
        },
        environmentVariables: [
          {
            path: "properties.osProfile.adminPassword",
            suffix: "ADMIN_PASSWORD",
          },
        ],
        propertiesDefault: {
          properties: {
            osProfile: {
              linuxConfiguration: {
                disablePasswordAuthentication: false,
                provisionVMAgent: true,
                patchSettings: {
                  patchMode: "ImageDefault",
                  assessmentMode: "ImageDefault",
                },
              },
              allowExtensionOperations: true,
            },
          },
        },
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
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
        findDependencies: ({ live, lives }) => [
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
          {
            type: "Disk",
            group: "Compute",
            ids: [
              pipe([
                () => live,
                get("properties.storageProfile.osDisk.managedDisk.id"),
              ])(),
            ],
          },
        ],
        configDefault: ({ properties, dependencies }) => {
          const { networkInterface } = dependencies;
          assert(
            networkInterface,
            "networkInterfaces is missing VirtualMachine"
          );
          return defaultsDeep({
            location: config.location,
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
      },
    ],
    map(defaultsDeep({ group })),
  ])();
