const assert = require("assert");
const {
  pipe,
  eq,
  not,
  get,
  tap,
  pick,
  map,
  assign,
  omit,
  and,
} = require("rubico");
const {
  defaultsDeep,
  pluck,
  isEmpty,
  find,
  includes,
  first,
  when,
  flatten,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");
const {
  findDependenciesResourceGroup,
  findDependenciesUserAssignedIdentity,
  configDefaultDependenciesId,
  configDefaultGeneric,
} = require("../AzureCommon");

const group = "Compute";

const findResourceById =
  ({ groupType, lives }) =>
  (id) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(groupType);
      }),
      () => lives,
      find(and([eq(get("groupType"), groupType), eq(get("id"), id)])),
    ])();

const assignDependenciesId = ({ group, type, lives }) =>
  assign({
    id: pipe([
      get("id"),
      findResourceById({
        groupType: `${group}::${type}`,
        lives,
      }),
      get("name"),
      (name) => () =>
        `getId({ type: "${type}", group: "${group}", name: "${name}" })`,
    ]),
  });
const filterVirtualMachineProperties = ({ resource, lives }) =>
  pipe([
    tap((params) => {
      assert(resource);
      assert(lives);
    }),
    pick([
      "hardwareProfile",
      "osProfile",
      "storageProfile",
      "diagnosticsProfile",
      "networkProfile",
    ]),
    omit([
      "osProfile.requireGuestProvisionSignal",
      "storageProfile.imageReference.exactVersion",
      "storageProfile.osDisk",
      "networkProfile.networkInterfaces",
    ]),
    assign({
      networkProfile: pipe([
        get("networkProfile"),
        // assign({
        //   networkInterfaces: pipe([
        //     get("networkInterfaces"),
        //     map(
        //       assignDependenciesId({
        //         group: "Network",
        //         type: "NetworkInterface",
        //         lives,
        //       })
        //     ),
        //   ]),
        // }),
        when(
          get("networkInterfaceConfigurations"),
          assign({
            networkInterfaceConfigurations: pipe([
              get("networkInterfaceConfigurations"),
              map(
                assign({
                  properties: pipe([
                    get("properties"),
                    assign({
                      networkSecurityGroup: pipe([
                        get("networkSecurityGroup"),
                        assignDependenciesId({
                          group: "Network",
                          type: "NetworkSecurityGroup",
                          lives,
                        }),
                      ]),
                      ipConfigurations: pipe([
                        get("ipConfigurations"),
                        map(
                          pipe([
                            assign({
                              properties: pipe([
                                get("properties"),
                                assign({
                                  subnet: pipe([
                                    get("subnet"),
                                    assignDependenciesId({
                                      group: "Network",
                                      type: "Subnet",
                                      lives,
                                    }),
                                  ]),
                                }),
                              ]),
                            }),
                          ])
                        ),
                      ]),
                    }),
                  ]),
                })
              ),
            ]),
          })
        ),
      ]),
      osProfile: pipe([
        get("osProfile"),
        when(
          get("linuxConfiguration.ssh.publicKeys"),
          assign({
            linuxConfiguration: pipe([
              get("linuxConfiguration"),
              assign({
                ssh: pipe([
                  get("ssh"),
                  assign({
                    publicKeys: pipe([
                      get("publicKeys", []),
                      map(omit(["keyData"])),
                    ]),
                  }),
                ]),
              }),
            ]),
          })
        ),
      ]),
    }),
    omitIfEmpty([
      "osProfile.secrets",
      "storageProfile.dataDisks",
      "networkProfile",
    ]),
    tap((params) => {
      assert(true);
    }),
  ]);

const VirtualMachineDependencySshPublicKey = ({
  publicKeysPath,
  live,
  lives,
  config,
}) => ({
  type: "SshPublicKey",
  group: "Compute",
  ids: pipe([
    () => live,
    get(publicKeysPath),
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
});

const publicKeysCreatePayload = ({ dependencies }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    () => dependencies.sshPublicKeys,
    map((sshPublicKey) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        //TODO azureuser
        () => ({
          path: "/home/azureuser/.ssh/authorized_keys",
          keyData: getField(sshPublicKey, "properties.publicKey"),
        }),
      ])()
    ),
  ])();

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "Disk",
        managedByOther: pipe([get("live.managedBy"), not(isEmpty)]),
        //TODO default configDefault should be this
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
        type: "VirtualMachineScaleSetVM",
        ignoreResource: () => () => true,
        managedByOther: () => true,
      },
      {
        type: "VirtualMachineScaleSet",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
          },
          subnets: {
            type: "Subnet",
            group: "Network",
            createOnly: true,
            list: true,
          },
          networkInterfaces: {
            type: "NetworkInterface",
            group: "Network",
            list: true,
            createOnly: true,
          },
          managedIdentities: {
            type: "UserAssignedIdentity",
            group: "ManagedIdentity",
            createOnly: true,
            list: true,
          },
          sshPublicKeys: {
            type: "SshPublicKey",
            group: "Compute",
            list: true,
            createOnly: true,
          },
          galleryImage: {
            type: "GalleryImage",
            group: "Compute",
            createOnly: true,
          },
          networkSecurityGroups: {
            type: "NetworkSecurityGroup",
            group: "Network",
            createOnly: true,
            list: true,
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
          capacityReservationGroup: {
            type: "CapacityReservationGroup",
            group: "Compute",
            createOnly: true,
          },
        },
        environmentVariables: [
          {
            path: "properties.virtualMachineProfile.osProfile.adminPassword",
            suffix: "ADMIN_PASSWORD",
          },
        ],
        omitProperties: [
          "properties.virtualMachineProfile.osProfile.adminPassword",
          "properties.virtualMachineProfile.osProfile.secrets",
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
            type: "NetworkSecurityGroup",
            group: "Network",
            ids: pipe([
              () => live,
              get(
                "properties.virtualMachineProfile.networkProfile.networkInterfaceConfigurations"
              ),
              pluck("properties"),
              pluck("networkSecurityGroup"),
              pluck("id"),
            ])(),
          },
          {
            type: "Subnet",
            group: "Network",
            ids: pipe([
              () => live,
              get(
                "properties.virtualMachineProfile.networkProfile.networkInterfaceConfigurations"
              ),
              pluck("properties"),
              pluck("ipConfigurations"),
              flatten,
              pluck("properties"),
              pluck("subnet"),
              pluck("id"),
            ])(),
          },
          VirtualMachineDependencySshPublicKey({
            live,
            lives,
            config,
            publicKeysPath:
              "properties.virtualMachineProfile.osProfile.linuxConfiguration.ssh.publicKeys",
          }),
          //TODO common
          {
            type: "Disk",
            group: "Compute",
            ids: [
              pipe([
                () => live,
                get(
                  "properties.virtualMachineProfile.storageProfile.osDisk.managedDisk.id"
                ),
              ])(),
            ],
          },
        ],
        filterLive: (context) =>
          pipe([
            tap((params) => {
              assert(context);
            }),
            pick(["sku", "identity.type", "properties", "tags"]),
            assign({
              properties: pipe([
                get("properties"),
                omit(["provisioningState", "uniqueId"]),
                assign({
                  virtualMachineProfile: pipe([
                    get("virtualMachineProfile"),
                    filterVirtualMachineProperties(context),
                  ]),
                }),
                ,
              ]),
            }),
          ]),
        configDefault: ({ properties, dependencies, config }) =>
          pipe([
            tap(() => {
              assert(true);
            }),
            () => properties,
            when(
              () => dependencies.sshPublicKeys,
              defaultsDeep({
                properties: {
                  virtualMachineProfile: {
                    osProfile: {
                      linuxConfiguration: {
                        ssh: {
                          publicKeys: publicKeysCreatePayload({ dependencies }),
                        },
                      },
                    },
                  },
                },
              })
            ),
            defaultsDeep(
              configDefaultGeneric({ properties, dependencies, config })
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
          networkInterfaces: {
            type: "NetworkInterface",
            group: "Network",
            list: true,
            createOnly: true,
          },
          managedIdentities: {
            type: "UserAssignedIdentity",
            group: "ManagedIdentity",
            createOnly: true,
            list: true,
          },
          sshPublicKeys: {
            type: "SshPublicKey",
            group: "Compute",
            list: true,
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
        filterLive: (context) =>
          pipe([
            tap((params) => {
              assert(context);
            }),
            pick(["tags", "properties", "identity.type"]),
            assign({
              properties: pipe([
                get("properties"),
                filterVirtualMachineProperties(context),
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
          VirtualMachineDependencySshPublicKey({
            lives,
            live,
            config,
            publicKeysPath:
              "properties.osProfile.linuxConfiguration.ssh.publicKeys",
          }),
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
              assert(
                dependencies.networkInterfaces,
                "networkInterfaces is missing VirtualMachine"
              );
            }),
            () => properties,
            when(
              () => dependencies.sshPublicKeys,
              defaultsDeep({
                properties: {
                  osProfile: {
                    linuxConfiguration: {
                      ssh: {
                        publicKeys: publicKeysCreatePayload({ dependencies }),
                      },
                    },
                  },
                },
              })
            ),
            defaultsDeep({
              properties: {
                networkProfile: {
                  networkInterfaces: pipe([
                    () => dependencies,
                    get("networkInterfaces", []),
                    map((networkInterface) => ({
                      id: getField(networkInterface, "id"),
                    })),
                  ])(),
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
