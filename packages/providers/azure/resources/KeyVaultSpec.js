const assert = require("assert");
const { pipe, assign, tryCatch, get, tap, map, pick, omit } = require("rubico");
const { defaultsDeep, pluck, callProp, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const {
  findDependenciesResourceGroup,
  configDefaultGeneric,
  createAxiosAzure,
  AZURE_KEYVAULT_AUDIENCE,
} = require("../AzureCommon");

const group = "KeyVault";

const assignVersions = ({ uri, config }) =>
  assign({
    versions: pipe([
      tryCatch(
        pipe([
          get(`properties.${uri}`),
          (baseURL) => ({
            baseURL,
            bearerToken: () => config.bearerToken(AZURE_KEYVAULT_AUDIENCE),
          }),
          createAxiosAzure,
          callProp("get", "/versions?api-version=7.2"),
          get("data.value"),
        ]),
        (error) =>
          pipe([
            tap((params) => {
              assert(error);
            }),
          ])()
      ),
    ]),
  });

const assignIam = ({ axios, uri, config }) =>
  assign({
    iam: ({ id, properties }) =>
      pipe([
        tap((params) => {
          assert(id);
        }),
        () => axios,
        callProp(
          "get",
          `${id}/providers/Microsoft.Authorization/roleAssignments?api-version=2015-07-01`
        ),
        tap((params) => {
          assert(true);
        }),
        get("data.value"),
      ])(),
  });

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "Key",
        decorate: () => pipe([assignVersions({ uri: "keyUri", config })]),
      },
      {
        type: "Secret",
        omitProperties: [
          "properties.secretUri",
          "properties.secretUriWithVersion",
          "properties.attributes.created",
          "properties.attributes.updated",
        ],
        pickPropertiesCreate: [
          "tags",
          "properties.value",
          "properties.contentType",
          "properties.attributes.enabled",
        ],
        decorate: () => pipe([assignVersions({ uri: "secretUri", config })]),
      },
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
        decorate: ({ axios }) =>
          pipe([
            tap((xxx) => {
              assert(xxx);
            }),
            assignIam({ axios, uri: "vaultUri", config }),
          ]),
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
            when(
              () => dependencies.subnets,
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
              })
            ),
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
            pick(["name", ...pickPropertiesCreate]),
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
