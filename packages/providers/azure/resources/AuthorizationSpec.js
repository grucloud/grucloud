const assert = require("assert");
const {
  pipe,
  not,
  eq,
  get,
  tap,
  map,
  set,
  switchCase,
  pick,
  assign,
  omit,
} = require("rubico");
const {
  defaultsDeep,
  pluck,
  flatten,
  find,
  isEmpty,
  when,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { configDefaultDependenciesId } = require("../AzureCommon");

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
        dependsOnList: [
          "Authorization::RoleDefinition",
          "Compute::DiskEncryptionSet",
        ],
        dependencies: {
          roleDefinition: {
            type: "RoleDefinition",
            group: "Authorization",
            createOnly: true,
            pathId: "properties.roleDefinitionId",
          },
          principal: {
            type: "DiskEncryptionSet",
            group: "Compute",
            createOnly: true,
          },
        },
        // findName: pipe([
        //   tap((params) => {
        //     assert(true);
        //   }),
        //   get("live.properties"),
        //   ({ roleName, principalName, principalId }) =>
        //     `role-assignment::${roleName}::${principalName || principalId}`,
        //   tap((params) => {
        //     assert(true);
        //   }),
        // ]),
        // inferName: ({ properties }) =>
        //   pipe([
        //     tap((params) => {
        //       assert(properties);
        //     }),
        //     () =>
        //       `role-assignment::${properties.roleName}::${
        //         properties.principalName || properties.principalId
        //       }`,
        //     tap((params) => {
        //       assert(true);
        //     }),
        //   ])(),
        cannotBeDeleted: eq(get("live.properties.roleName"), "Owner"),
        ignoreResource: ({ lives }) =>
          not(get("live.properties.principalName")),
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
              set(
                "properties.principalName",
                pipe([
                  () => lives.getByProvider(config),
                  pluck("resources"),
                  flatten,
                  find(
                    eq(
                      get("live.identity.principalId"),
                      live.properties.principalId
                    )
                  ),
                  get("name"),
                ])()
              ),
            ])(),
        findDependencies: ({ live, lives }) => [
          {
            type: "RoleDefinition",
            group: "Authorization",
            ids: [pipe([() => live.roleDefinitionId])()],
          },
          ...pipe([
            tap((params) => {
              assert(lives);
              assert(live.properties.principalId);
            }),
            () => lives.getByProvider(config),
            pluck("resources"),
            flatten,
            find(
              eq(get("live.identity.principalId"), live.properties.principalId)
            ),
            switchCase([
              isEmpty,
              () => [],
              pipe([({ group, type, id }) => [{ group, type, ids: [id] }]]),
            ]),
          ])(),
        ],
        configDefault: ({ properties, dependencies, config, lives }) =>
          pipe([
            tap(() => {
              assert(dependencies.principal);
              assert(lives);
            }),
            () => properties,
            omit(["properties.principalName", "properties.roleName"]),
            defaultsDeep({
              properties: {
                roleDefinitionId: when(
                  () => properties.properties.roleName,
                  pipe([
                    () =>
                      lives.getByType({
                        providerName: config.providerName,
                        type: "RoleDefinition",
                        group: "Authorization",
                      }),
                    tap((params) => {
                      assert(true);
                    }),
                    find(
                      eq(
                        get("live.properties.roleName"),
                        properties.properties.roleName
                      )
                    ),
                    get("id"),
                    tap((id) => {
                      assert(id);
                    }),
                  ])
                )(),
                principalId: getField(
                  dependencies.principal,
                  "identity.principalId"
                ),
              },
            }),
            tap((params) => {
              assert(true);
            }),
          ])(),
        filterLive: ({}) =>
          pipe([
            pick([
              "properties.roleName",
              "properties.principalName",
              "properties.principalType",
              "properties.description",
            ]),
            assign({
              properties: pipe([
                get("properties"),
                // assign({
                //   tenantId: () => () => "`" + "${config.tenantId}" + "`",
                // }),
              ]),
            }),
          ]),
      },
    ],
    map(defaultsDeep({ group })),
  ])();
