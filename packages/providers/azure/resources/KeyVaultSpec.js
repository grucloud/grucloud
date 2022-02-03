const assert = require("assert");
const {
  pipe,
  assign,
  tryCatch,
  get,
  tap,
  map,
  pick,
  omit,
  eq,
  set,
} = require("rubico");
const {
  defaultsDeep,
  pluck,
  callProp,
  when,
  isEmpty,
  find,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const {
  findDependenciesResourceGroup,
  configDefaultGeneric,
  createAxiosAzure,
  AZURE_KEYVAULT_AUDIENCE,
  buildGetId,
} = require("../AzureCommon");

const group = "KeyVault";

const decorateKey =
  ({ config }) =>
  (resource) =>
    pipe([
      () => resource,
      tryCatch(
        pipe([
          get(`properties.keyUri`),
          tap((baseURL) => {
            assert(baseURL);
          }),
          (baseURL) => ({
            baseURL,
            bearerToken: () => config.bearerToken(AZURE_KEYVAULT_AUDIENCE),
          }),
          createAxiosAzure,
          callProp("get", "?api-version=7.2"),
          get("data.key"),
        ]),
        (error) =>
          pipe([
            tap((params) => {
              assert(error);
            }),
            () => ({ error: error.message }),
          ])()
      ),
      (properties) => pipe([() => resource, defaultsDeep({ properties })])(),
    ])();

const assignVersions = ({ uri, config }) =>
  assign({
    versions: pipe([
      tryCatch(
        pipe([
          get(`properties.${uri}`),
          tap((baseURL) => {
            assert(baseURL);
          }),
          (baseURL) => ({
            baseURL,
            bearerToken: () => config.bearerToken(AZURE_KEYVAULT_AUDIENCE),
          }),
          createAxiosAzure,
          callProp("get", "/versions?api-version=7.2"),
          get("data.value"),
          tap((params) => {
            assert(true);
          }),
        ]),
        (error) =>
          pipe([
            tap((params) => {
              assert(error);
            }),
            () => ({ error: error.message }),
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
        get("data.value"),
      ])(),
  });

const findResourceByPrincipalId =
  ({ lives }) =>
  ({ objectId }) =>
    pipe([
      tap((params) => {
        assert(objectId);
      }),
      () => lives,
      find(eq(get("live.identity.principalId"), objectId)),
    ])();

const assignObjectId =
  ({ lives }) =>
  (policy) =>
    pipe([
      tap(() => {
        assert(policy);
      }),
      () => policy,
      findResourceByPrincipalId({ lives }),
      (resource) =>
        pipe([
          () => policy,
          when(
            () => !isEmpty(resource),
            assign({
              objectId: pipe([
                () =>
                  buildGetId({
                    id: resource.id,
                    path: "live.identity.principalId",
                  })(resource),
              ]),
            })
          ),
        ])(),
    ])();

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "Key",
        decorate: () =>
          pipe([
            decorateKey({ config }),
            assignVersions({ uri: "keyUri", config }),
            tap((params) => {
              assert(true);
            }),
          ]),
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
            parent: true,
          },
          subnets: {
            type: "Subnet",
            group: "Network",
            createOnly: "true",
            list: true,
          },
        },
        decorate: ({ axios }) =>
          pipe([assignIam({ axios, uri: "vaultUri", config })]),
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
        configDefault: ({ properties, dependencies, config, spec }) =>
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
              configDefaultGeneric({ properties, dependencies, config, spec })
            ),
          ])(),
        omitProperties: [
          "id",
          "name",
          "type",
          "location",
          "systemData",
          "properties.vaultUri", // fix azure spec
          "properties.tenantId",
          "properties.hsmPoolResourceId",
          "properties.createMode",
          "properties.provisioningState",
          "properties.privateEndpointConnections",
          "properties.networkAcls.virtualNetworkRules",
        ],
        filterLive: ({ pickPropertiesCreate, omitProperties, lives }) =>
          pipe([
            tap((params) => {
              assert(pickPropertiesCreate);
              assert(omitProperties);
              assert(lives);
            }),
            pick(["name", ...pickPropertiesCreate]),
            omit(omitProperties),
            assign({
              properties: pipe([
                get("properties"),
                assign({
                  tenantId: () => () => "`" + "${config.tenantId}" + "`",
                  accessPolicies: pipe([
                    get("accessPolicies"),
                    map(
                      pipe([
                        assignObjectId({ lives }),
                        when(
                          eq(get("tenantId"), config.tenantId),
                          assign({
                            tenantId: pipe([
                              () => () => "`" + "${config.tenantId}" + "`",
                            ]),
                          })
                        ),
                      ])
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
