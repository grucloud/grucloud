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
} = require("rubico");
const {
  defaultsDeep,
  pluck,
  flatten,
  find,
  when,
  callProp,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const group = "Authorization";

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "RoleDefinition",
        managedByOther: pipe([eq(get("live.properties.type"), "BuiltInRole")]),
        findName: pipe([get("live.properties.roleName")]),
      },
      {
        type: "RoleAssignment",
        apiVersion: "2021-04-01-preview",
        dependsOnList: [
          "Authorization::RoleDefinition",
          "Resource::ResourceGroup",
          "Compute::VirtualMachine",
          "Compute::DiskEncryptionSet",
        ],
        dependencies: {
          scopeResourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            createOnly: true,
          },
          scopeVirtualMachine: {
            type: "VirtualMachine",
            group: "Compute",
            createOnly: true,
            filterDependency:
              ({ resource }) =>
              (dependency) =>
                pipe([
                  () => dependency,
                  get("id"),
                  callProp(
                    "match",
                    new RegExp(`^${resource.live.properties.scope}$`, "ig")
                  ),
                ])(),
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
            filterDependency:
              ({ resource }) =>
              (dependency) =>
                pipe([
                  () => dependency,
                  get("id"),
                  not(
                    callProp(
                      "match",
                      new RegExp(`^${resource.live.properties.scope}$`, "ig")
                    )
                  ),
                ])(),
          },
        },
        cannotBeDeleted: eq(get("live.properties.roleName"), "Owner"),
        ignoreResource: ({ lives }) =>
          or([
            and([
              eq(get("live.properties.principalType"), "ServicePrincipal"),
              not(get("live.properties.principalName")),
            ]),
          ]),
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
