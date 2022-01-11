const assert = require("assert");
const { pipe, eq, not, get, tap, pick, map, assign, omit } = require("rubico");
const {
  defaultsDeep,
  pluck,
  isEmpty,
  find,
  includes,
  first,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");
const {
  buildTags,
  findDependenciesResourceGroup,
  findDependenciesUserAssignedIdentity,
  configDefaultDependenciesId,
  configDefaultGeneric,
} = require("../AzureCommon");

const group = "Compute";

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "Disk",
        managedByOther: pipe([get("live.managedBy"), not(isEmpty)]),
        //TODO default configDefault shouls be this
        configDefault: ({ properties, dependencies, config, spec }) =>
          pipe([
            () => properties,
            defaultsDeep(
              configDefaultGeneric({
                properties,
                dependencies,
                config,
                spec,
              })
            ),
            defaultsDeep(
              configDefaultDependenciesId({
                properties,
                dependencies,
                config,
                spec,
              })
            ),
          ])(),
      },
      {
        type: "DiskEncryptionSet",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
          },
          vault: {
            type: "Vault",
            group: "KeyVault",
            createOnly: true,
          },
          key: {
            type: "Key",
            group: "KeyVault",
            createOnly: true,
          },
        },
        pickProperties: [
          "properties.encryptionType",
          "properties.rotationToLatestKeyVersionEnabled",
        ],
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            pick(["tags", "properties"]),
            omit(["properties.activeKey", "properties.provisioningState"]),
          ]),
        findDependencies: ({ live, lives }) => [
          findDependenciesResourceGroup({ live, lives, config }),
          {
            type: "Vault",
            group: "KeyVault",
            ids: [
              pipe([() => live, get("properties.activeKey.sourceVault.id")])(),
            ],
          },
          {
            type: "Key",
            group: "KeyVault",
            ids: [
              pipe([
                () => live,
                get("properties.activeKey.keyUrl"),
                (keyUrl) =>
                  pipe([
                    () =>
                      lives.getByType({
                        type: "Key",
                        group: "KeyVault",
                        providerName: config.providerName,
                      }),
                    find(
                      pipe([
                        get("live.properties.keyUri"),
                        (liveKeyUri) =>
                          pipe([() => keyUrl, includes(liveKeyUri)])(),
                      ])
                    ),
                    get("id"),
                  ])(),
              ])(),
            ],
          },
        ],
        configDefault: ({ properties, dependencies, config }) =>
          pipe([
            () => properties,
            defaultsDeep({
              identity: {
                type: "SystemAssigned",
              },
              properties: {
                activeKey: {
                  ...(dependencies.vault && {
                    sourceVault: {
                      id: getField(dependencies.vault, "id"),
                    },
                  }),
                  ...(dependencies.key && {
                    keyUrl: pipe([
                      () => getField(dependencies.key, "versions"),
                      first,
                      get("kid"),
                    ])(),
                  }),
                },
              },
            }),
            defaultsDeep(
              configDefaultGeneric({
                properties,
                dependencies,
                config,
              })
            ),
            tap((params) => {
              assert(true);
            }),
          ])(),
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
          networkInterface: {
            type: "NetworkInterface",
            group: "Network",
            createOnly: true,
          },
          managedIdentities: {
            type: "UserAssignedIdentity",
            group: "ManagedIdentity",
            createOnly: true,
            list: true,
          },
          sshPublicKey: {
            type: "SshPublicKey",
            group: "Compute",
            createOnly: true,
          },
          galleryImage: {
            type: "GalleryImage",
            group: "Compute",
            createOnly: true,
          },
          networkSecurityGroup: {
            type: "NetworkSecurityGroup",
            group: "Network",
            createOnly: true,
          },
          dscpConfiguration: {
            type: "DscpConfiguration",
            group: "Network",
            createOnly: true,
          },
          availabilitySet: {
            type: "AvailabilitySet",
            group: "Compute",
            createOnly: true,
          },
          virtualMachineScaleSet: {
            type: "VirtualMachineScaleSet",
            group: "Compute",
            createOnly: true,
          },
          proximityPlacementGroup: {
            type: "ProximityPlacementGroup",
            group: "Compute",
            createOnly: true,
          },
          dedicatedHostGroup: {
            type: "DedicatedHostGroup",
            group: "Compute",
            createOnly: true,
          },
          virtualMachineScaleSetVm: {
            type: "VirtualMachineScaleSetVM",
            group: "Compute",
            createOnly: true,
          },
          capacityReservationGroup: {
            type: "CapacityReservationGroup",
            group: "Compute",
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
          findDependenciesUserAssignedIdentity({ live }),
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
            type: "SshPublicKey",
            group: "Compute",
            ids: pipe([
              () => live,
              get("properties.osProfile.linuxConfiguration.ssh.publicKeys"),
              map(({ keyData }) =>
                pipe([
                  () =>
                    lives.getByType({
                      providerName: config.providerName,
                      type: "SshPublicKey",
                      group: "Compute",
                    }),
                  find(eq(get("live.properties.publicKey"), keyData)),
                  get("id"),
                ])()
              ),
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
        configDefault: ({ properties, dependencies, config }) =>
          pipe([
            tap(() => {
              //TODO multiple networkInterface ?
              assert(
                dependencies.networkInterface,
                "networkInterfaces is missing VirtualMachine"
              );
            }),
            () => properties,
            defaultsDeep({
              properties: {
                //TODO ssh key
                networkProfile: {
                  networkInterfaces: [
                    {
                      id: getField(dependencies.networkInterface, "id"),
                    },
                  ],
                },
              },
            }),
            defaultsDeep(
              configDefaultGeneric({ properties, dependencies, config })
            ),
            tap((params) => {
              assert(true);
            }),
          ])(),
      },
    ],
    map(defaultsDeep({ group })),
  ])();
