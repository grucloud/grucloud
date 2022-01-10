const assert = require("assert");
const { pipe, filter, eq, get, tap, map, set, omit } = require("rubico");
const { defaultsDeep, pluck, callProp, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const {
  findDependenciesResourceGroup,
  configDefaultGeneric,
} = require("../AzureCommon");

const group = "Authorization";

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "RoleDefinition",
        managedByOther: pipe([eq(get("live.properties.type"), "BuiltInRole")]),
        findName: pipe([get("live.properties.roleName")]),
        // onResponseList: (xxx) =>
        //   pipe([
        //     tap((params) => {
        //       assert(true);
        //     }),
        //     get("value"),
        //     tap((params) => {
        //       assert(true);
        //     }),
        //     //filter(not(eq(get("properties.type"), "BuiltInRole"))),
        //   ]),
      },
      {
        type: "RoleAssignment",
        apiVersion: "2021-04-01-preview",
        dependsOnList: ["Authorization::RoleDefinition"],
        dependencies: {
          roleDefinition: {
            type: "RoleDefinition",
            group: "Authorization",
            createOnly: true,
            pathId: "properties.roleDefinitionId",
          },
        },
        decorate:
          ({ axios, lives }) =>
          (live) =>
            pipe([
              () => live,
              set(
                "properties.roleName",
                pipe([
                  () =>
                    lives.getById({
                      id: live.properties.roleDefinitionId,
                      providerName: config.providerName,
                      type: "RoleDefinition",
                      group: "Authorization",
                    }),
                  tap((params) => {
                    assert(true);
                  }),
                  get("name"),
                ])()
              ),
            ])(),
        // findDependencies: ({ live, lives }) => [
        //   findDependenciesResourceGroup({ live, lives, config }),
        //   {
        //     type: "Subnet",
        //     group: "Network",
        //     ids: pipe([
        //       () => live,
        //       get("properties.networkAcls.virtualNetworkRules"),
        //       pluck("id"),
        //     ])(),
        //   },
        // ],
        // configDefault: ({ properties, dependencies, config }) =>
        //   pipe([
        //     tap(() => {
        //       assert(true);
        //     }),
        //     () => properties,
        //     when(
        //       () => dependencies.subnets,
        //       defaultsDeep({
        //         properties: {
        //           networkAcls: {
        //             virtualNetworkRules: pipe([
        //               () => dependencies,
        //               get("subnets", []),
        //               map((subnet) =>
        //                 pipe([
        //                   () => getField(subnet, "id"),
        //                   callProp("toLowerCase"),
        //                   (id) => ({
        //                     id,
        //                   }),
        //                 ])()
        //               ),
        //             ])(),
        //           },
        //         },
        //       })
        //     ),
        //     defaultsDeep(
        //       configDefaultGeneric({ properties, dependencies, config })
        //     ),
        //     tap((params) => {
        //       assert(true);
        //     }),
        //   ])(),
        // omitProperties: [
        //   "id",
        //   "name",
        //   "type",
        //   "systemData",
        //   "properties.vaultUri", // fix azure spec
        //   "properties.tenantId",
        //   "properties.hsmPoolResourceId",
        //   "properties.createMode",
        //   "properties.provisioningState",
        //   "properties.privateEndpointConnections",
        // ],
        // filterLive: ({ pickPropertiesCreate }) =>
        //   pipe([
        //     tap((params) => {
        //       assert(pickPropertiesCreate);
        //     }),
        //     omit([
        //       "properties.vaultUri", // fix azure specs
        //       "properties.networkAcls.virtualNetworkRules",
        //     ]),
        //     pick(pickPropertiesCreate),
        //     assign({
        //       properties: pipe([
        //         get("properties"),
        //         assign({
        //           tenantId: () => () => "`" + "${config.tenantId}" + "`",
        //           accessPolicies: pipe([
        //             get("accessPolicies"),
        //             map(
        //               assign({
        //                 tenantId: pipe([
        //                   () => () => "`" + "${config.tenantId}" + "`",
        //                 ]),
        //               })
        //             ),
        //           ]),
        //         }),
        //       ]),
        //     }),
        //   ]),
      },
    ],
    map(defaultsDeep({ group })),
  ])();
