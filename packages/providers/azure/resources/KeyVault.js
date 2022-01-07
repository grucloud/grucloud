const assert = require("assert");
const { pipe, assign, eq, get, tap, map, pick, omit } = require("rubico");
const { defaultsDeep, pluck, callProp } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const {
  findDependenciesResourceGroup,
  configDefaultGeneric,
} = require("../AzureCommon");

const group = "KeyVault";

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "Vault",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
          },
          subnets: {
            type: "Subnet",
            group: "Network",
            createOnly: "true",
            list: true,
            //pathId: "properties.networkAcls.virtualNetworkRules.items.id",
          },
        },
        findDependencies: ({ live, lives }) => [
          findDependenciesResourceGroup({ live, lives, config }),
          {
            type: "Subnet",
            group: "Network",
            ids: pipe([
              () => live,
              get("properties.networkAcls.virtualNetworkRules"),
              pluck("id"),
            ])(),
          },
        ],
        configDefault: ({ properties, dependencies, config }) =>
          pipe([
            tap(() => {
              assert(true);
            }),
            () => properties,
            defaultsDeep({
              properties: {
                networkAcls: {
                  virtualNetworkRules: pipe([
                    () => dependencies,
                    get("subnets", []),
                    map((subnet) =>
                      pipe([
                        () => getField(subnet, "id"),
                        callProp("toLowerCase"),
                        (id) => ({
                          id,
                        }),
                      ])()
                    ),
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
        omitProperties: [
          "id",
          "name",
          "type",
          "systemData",
          "properties.vaultUri", // fix azure spec
          "properties.tenantId",
          "properties.hsmPoolResourceId",
          "properties.createMode",
          "properties.provisioningState",
          "properties.privateEndpointConnections",
        ],
        filterLive: ({ pickPropertiesCreate }) =>
          pipe([
            tap((params) => {
              assert(pickPropertiesCreate);
            }),
            omit([
              "properties.vaultUri", // fix azure specs
              "properties.networkAcls.virtualNetworkRules",
            ]),
            pick(pickPropertiesCreate),
            assign({
              properties: pipe([
                get("properties"),
                assign({
                  tenantId: () => () => "`" + "${config.tenantId}" + "`",
                  accessPolicies: pipe([
                    get("accessPolicies"),
                    map(
                      assign({
                        tenantId: pipe([
                          () => () => "`" + "${config.tenantId}" + "`",
                        ]),
                      })
                    ),
                  ]),
                }),
              ]),
            }),
          ]),
      },
    ],
    map(defaultsDeep({ group })),
  ])();
