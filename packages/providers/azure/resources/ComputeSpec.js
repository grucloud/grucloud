const assert = require("assert");
const {
  pipe,
  eq,
  tryCatch,
  get,
  tap,
  pick,
  map,
  assign,
  omit,
  filter,
  not,
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
  callProp,
} = require("rubico/x");
const fs = require("fs").promises;
const path = require("path");
const { getField } = require("@grucloud/core/ProviderCommon");
const { omitIfEmpty, compare } = require("@grucloud/core/Common");

const {
  findDependenciesResourceGroup,
  findDependenciesUserAssignedIdentity,
  configDefaultDependenciesId,
  configDefaultGeneric,
  assignDependenciesId,
} = require("../AzureCommon");

const group = "Compute";

const filterVirtualMachineProperties =
  ({ config }) =>
  ({ resource, lives }) =>
    pipe([
      tap((params) => {
        assert(resource);
        assert(lives);
        assert(config);
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
      ]),
      assign({
        storageProfile: pipe([
          get("storageProfile"),
          when(
            get("imageReference"),
            assign({
              imageReference: pipe([
                get("imageReference"),
                tap((params) => {
                  assert(true);
                }),
                when(
                  get("id"),
                  assign({
                    id: pipe([
                      get("id"),
                      callProp(
                        "replace",
                        config.subscriptionId,
                        "${config.subscriptionId}"
                      ),
                      (id) => () => "`" + id + "`",
                    ]),
                  })
                ),
              ]),
            })
          ),
          assign({
            osDisk: pipe([
              get("osDisk"),
              assign({
                managedDisk: pipe([
                  get("managedDisk"),
                  omit(["id"]),
                  when(
                    get("diskEncryptionSet"),
                    assign({
                      diskEncryptionSet: pipe([
                        get("diskEncryptionSet"),
                        assignDependenciesId({
                          group: "Compute",
                          type: "DiskEncryptionSet",
                          lives,
                        }),
                      ]),
                    })
                  ),
                ]),
              }),
            ]),
            dataDisks: pipe([
              get("dataDisks", []),
              map(
                assign({
                  managedDisk: pipe([
                    get("managedDisk"),
                    assignDependenciesId({
                      group: "Compute",
                      type: "Disk",
                      lives,
                    }),
                  ]),
                })
              ),
            ]),
          }),
        ]),
      }),
      assign({
        networkProfile: pipe([
          get("networkProfile"),
          when(
            get("networkInterfaces"),
            assign({
              networkInterfaces: pipe([
                get("networkInterfaces"),
                map(
                  assignDependenciesId({
                    group: "Network",
                    type: "NetworkInterface",
                    lives,
                  })
                ),
              ]),
            })
          ),
          when(
            get("networkInterfaceConfigurations"),
            assign({
              networkInterfaceConfigurations: pipe([
                get("networkInterfaceConfigurations"),
                map(
                  assign({
                    properties: pipe([
                      get("properties"),
                      when(
                        get("networkSecurityGroup"),
                        assign({
                          networkSecurityGroup: pipe([
                            get("networkSecurityGroup"),
                            assignDependenciesId({
                              group: "Network",
                              type: "NetworkSecurityGroup",
                              lives,
                            }),
                          ]),
                        })
                      ),
                      assign({
                        ipConfigurations: pipe([
                          get("ipConfigurations"),
                          map(
                            pipe([
                              assign({
                                properties: pipe([
                                  get("properties"),
                                  when(
                                    get("loadBalancerBackendAddressPools"),
                                    assign({
                                      loadBalancerBackendAddressPools: pipe([
                                        get("loadBalancerBackendAddressPools"),
                                        map(
                                          assignDependenciesId({
                                            group: "Network",
                                            type: "LoadBalancerBackendAddressPool",
                                            lives,
                                          })
                                        ),
                                      ]),
                                    })
                                  ),
                                  when(
                                    get(
                                      "applicationGatewayBackendAddressPools"
                                    ),
                                    assign({
                                      applicationGatewayBackendAddressPools:
                                        pipe([
                                          get(
                                            "applicationGatewayBackendAddressPools"
                                          ),
                                          map(
                                            assignDependenciesId({
                                              group: "Network",
                                              type: "ApplicationGateway",
                                              lives,
                                            })
                                          ),
                                        ]),
                                    })
                                  ),
                                  assign({
                                    //TODO
                                    // loadBalancerInboundNatPools: pipe([
                                    //   get("loadBalancerInboundNatPools"),
                                    //   map(
                                    //     assignDependenciesId({
                                    //       group: "Network",
                                    //       type: "LoadBalancerInboundNatPool",
                                    //       lives,
                                    //     })
                                    //   ),
                                    // ]),
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
        type: "SshPublicKey",
        configDefault: async ({
          properties,
          dependencies,
          config,
          spec,
          programOptions,
        }) =>
          pipe([
            () => properties,
            when(get("publicKeyFile"), (props) =>
              pipe([
                () => properties,
                get("publicKeyFile"),
                (publicKeyFile) =>
                  path.resolve(programOptions.workingDirectory, publicKeyFile),
                tryCatch(
                  (fileName) => fs.readFile(fileName, "utf-8"),
                  pipe([() => undefined])
                ),
                (publicKey) =>
                  pipe([
                    () => props,
                    defaultsDeep({
                      properties: {
                        publicKey,
                      },
                    }),
                  ])(),
              ])()
            ),
            defaultsDeep(
              configDefaultGeneric({
                properties,
                dependencies,
                config,
                spec,
              })
            ),
            omit(["publicKeyFile"]),
            tap((params) => {
              assert(true);
            }),
          ])(),
      },
      {
        type: "Disk",
        managedByOther: ({ live, lives }) =>
          pipe([
            () =>
              lives.getById({
                id: live.managedBy,
                type: "VirtualMachine",
                group: "Compute",
                providerName: config.providerName,
              }),
            get("live.properties.storageProfile.osDisk.managedDisk.id", ""),
            eq(
              callProp("toUpperCase"),
              pipe([() => live, get("id"), callProp("toUpperCase")])()
            ),
          ])(),
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
            parent: true,
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
            tap(() => {
              assert(dependencies.vault);
              assert(dependencies.key);
            }),
            () => properties,
            defaultsDeep({
              identity: {
                type: "SystemAssigned",
              },
              properties: {
                activeKey: {
                  sourceVault: {
                    id: getField(dependencies.vault, "id"),
                  },
                  keyUrl: pipe([
                    () => getField(dependencies.key, "versions"),
                    first,
                    get("kid"),
                    tap((kid) => {
                      assert(
                        kid,
                        `Cannot found key version, check role assignment`
                      );
                    }),
                  ])(),
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
            parent: true,
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
          disks: {
            type: "Disk",
            group: "Compute",
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
          loadBalancerBackendAddressPools: {
            type: "LoadBalancerBackendAddressPool",
            group: "Network",
            createOnly: true,
            list: true,
          },
          applicationGateways: {
            type: "ApplicationGateway",
            group: "Network",
            createOnly: true,
            list: true,
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
        compare: compare({
          filterAll: pipe([
            pick(["properties"]),
            assign({
              properties: pipe([
                get("properties"),
                pick(["virtualMachineProfile"]),
                assign({
                  virtualMachineProfile: pipe([
                    get("virtualMachineProfile"),
                    // TODO
                    omit(["extensionProfile", "osProfile"]),
                    omitIfEmpty(["networkProfile"]),
                  ]),
                }),
              ]),
            }),
            tap((params) => {
              assert(true);
            }),
          ]),
        }),
        findDependencies: ({ live, lives }) => [
          findDependenciesResourceGroup({ live, lives }),
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
          {
            type: "LoadBalancerBackendAddressPool",
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
              pluck("loadBalancerBackendAddressPools"),
              flatten,
              pluck("id"),
            ])(),
          },
          {
            type: "ApplicationGateway",
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
              pluck("applicationGatewayBackendAddressPools"),
              flatten,
              pluck("id"),
              filter(not(isEmpty)),
              map(
                pipe([
                  callProp("split", "/"),
                  callProp("slice", 0, -2),
                  callProp("join", "/"),
                ])
              ),
            ])(),
          },
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
            pick(["sku", "identity.type", "properties", "tags"]),
            assign({
              properties: pipe([
                get("properties"),
                omit(["provisioningState", "uniqueId", "timeCreated"]),
                assign({
                  virtualMachineProfile: pipe([
                    get("virtualMachineProfile"),
                    filterVirtualMachineProperties({ config })(context),
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
            parent: true,
          },
          networkInterfaces: {
            type: "NetworkInterface",
            group: "Network",
            list: true,
            createOnly: true,
          },
          disks: {
            type: "Disk",
            group: "Compute",
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
            pick(["tags", "properties", "identity.type"]),
            assign({
              properties: pipe([
                get("properties"),
                filterVirtualMachineProperties({ config })({ context }),
              ]),
            }),
          ]),
        omitProperties: [
          "properties.osProfile.adminPassword",
          "properties.storageProfile",
          "properties.osProfile",
        ],
        findDependencies: ({ live, lives }) => [
          findDependenciesResourceGroup({ live, lives, config }),
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
              ...pipe([
                () => live,
                get("properties.storageProfile.dataDisks"),
                pluck("managedDisk"),
                pluck("id"),
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
          ])(),
      },
    ],
    map(defaultsDeep({ group })),
  ])();
