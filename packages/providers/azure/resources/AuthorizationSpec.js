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
  omit,
  or,
  and,
  filter,
  any,
} = require("rubico");
const {
  includes,
  defaultsDeep,
  pluck,
  flatten,
  find,
  when,
  callProp,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const group = "Authorization";

const roleAssignmentFilterDep =
  ({ resource }) =>
  (dependency) =>
    pipe([
      () => dependency,
      get("id"),
      callProp(
        "match",
        new RegExp(`^${resource.live.properties.scope}$`, "ig")
      ),
    ])();

const roleAssignmentManagedByOther = ({ lives, config }) =>
  pipe([
    tap((params) => {
      assert(config.objectId);
      assert(lives);
    }),
    or([
      not(eq(get("properties.principalId"), config.objectId)),
      // and([
      //   eq(get("live.properties.principalType"), "ServicePrincipal"),
      //   not(get("live.properties.principalName")),
      // ]),
      pipe([
        // dependency scope starting with mc_ , mamaged by the aks cluster
        tap((params) => {
          assert(true);
        }),
        get("id"),
        includes("resourceGroups/MC_"),
      ]),
      pipe([
        get("properties.scope"),
        callProp("toUpperCase"),
        (scope) =>
          pipe([
            () => lives.getByProvider(config),
            pluck("resources"),
            flatten,
            not(any(eq(pipe([get("id"), callProp("toUpperCase")]), scope))),
          ])(),
        tap((params) => {
          assert(true);
        }),
      ]),
    ]),
    tap((params) => {
      assert(true);
    }),
  ]);

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "RoleDefinition",
        hideResource: () => pipe([eq(get("properties.type"), "BuiltInRole")]),
        managedByOther: () => pipe([eq(get("properties.type"), "BuiltInRole")]),
        findName: () => pipe([get("properties.roleName")]),
      },
      {
        type: "RoleAssignment",
        apiVersion: "2021-04-01-preview",
        //TODO
        dependsOnList: [
          "Authorization::RoleDefinition",
          "Resource::ResourceGroup",
          "Compute::VirtualMachine",
          "Compute::DiskEncryptionSet",
        ],
        omitProperties: [
          "id",
          "type",
          "properties.scope",
          "properties.roleDefinitionId",
          "properties.createdOn",
          "properties.updatedOn",
          "properties.createdBy",
          "properties.updatedBy",
          "properties.delegatedManagedIdentityResourceId",
        ],
        dependencies: {
          scopeResourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            createOnly: true,
            filterDependency: roleAssignmentFilterDep,
          },
          scopeVirtualMachine: {
            type: "VirtualMachine",
            group: "Compute",
            createOnly: true,
            filterDependency: roleAssignmentFilterDep,
          },
          roleDefinition: {
            type: "RoleDefinition",
            group: "Authorization",
            createOnly: true,
            pathId: "properties.roleDefinitionId",
          },
          principalManagedCluster: {
            type: "ManagedCluster",
            group: "ContainerService",
            createOnly: true,
          },
          principalDiskEncryptionSet: {
            type: "DiskEncryptionSet",
            group: "Compute",
            createOnly: true,
          },
          principalVirtualMachine: {
            type: "VirtualMachine",
            group: "Compute",
            createOnly: true,
            filterDependency: roleAssignmentFilterDep,
          },
        },
        operations: {
          getAll: {
            queryParameters: () => ({
              $filter: `principalId eq '{${config.objectId}}'`,
            }),
          },
        },
        managedByOther: roleAssignmentManagedByOther,
        cannotBeDeleted: roleAssignmentManagedByOther,
        decorate:
          ({ axios, lives }) =>
          (live) =>
            pipe([
              tap((params) => {
                assert(config);
              }),
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
                  () => config,
                  lives.getByProvider,
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
            filter(
              or([
                pipe([
                  get("id", ""),
                  callProp(
                    "match",
                    new RegExp(`^${live.properties.scope}$`, "ig")
                  ),
                ]),
                eq(
                  get("live.identity.principalId"),
                  live.properties.principalId
                ),
                //AKS
                eq(
                  get(
                    "live.properties.identityProfile.kubeletidentity.objectId"
                  ),
                  live.properties.principalId
                ),
              ])
            ),
            map(({ group, type, id }) => ({ group, type, ids: [id] })),
          ])(),
        ],
        configDefault: ({ properties, dependencies, config, lives }) =>
          pipe([
            tap(() => {
              assert(lives);
              assert(config.subscriptionId);
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
                principalId: switchCase([
                  () => dependencies.principalManagedCluster,
                  () =>
                    getField(
                      dependencies.principalManagedCluster,
                      "properties.identityProfile.kubeletidentity.objectId"
                    ),
                  () => dependencies.principalDiskEncryptionSet,
                  () =>
                    getField(
                      dependencies.principalDiskEncryptionSet,
                      "identity.principalId"
                    ),
                  () => dependencies.principalVirtualMachine,
                  () =>
                    getField(
                      dependencies.principalVirtualMachine,
                      "identity.principalId"
                    ),
                  () => undefined,
                ])(),
              },
            }),
            when(
              () => dependencies.scopeResourceGroup,
              defaultsDeep({
                properties: {
                  scope: getField(dependencies.scopeResourceGroup, "id"),
                },
              })
            ),
            when(
              () => dependencies.scopeVirtualMachine,
              defaultsDeep({
                properties: {
                  scope: getField(dependencies.scopeVirtualMachine, "id"),
                },
              })
            ),
            defaultsDeep({
              properties: {
                scope: `/subscriptions/${config.subscriptionId}`,
              },
            }),
            tap((params) => {
              assert(true);
            }),
          ])(),
        filterLive: ({}) =>
          pipe([
            pick([
              "name",
              "properties.roleName",
              "properties.principalName",
              "properties.principalId",
              "properties.principalType",
              "properties.description",
            ]),
            when(
              eq(get("properties.principalType"), "ServicePrincipal"),
              omit(["properties.principalId"])
            ),
          ]),
      },
    ],
    map(defaultsDeep({ group })),
  ])();
