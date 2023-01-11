const assert = require("assert");
const { pipe, tap, get, pick, eq, and } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, omitPropertiesMesh, assignTags } = require("./AppMeshCommon");

const buildArn = () =>
  pipe([
    get("metadata.arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ meshName, virtualServiceName }) => {
    assert(meshName);
    assert(virtualServiceName);
  }),
  pick(["meshName", "virtualServiceName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html
exports.AppMeshVirtualService = () => ({
  type: "VirtualService",
  package: "app-mesh",
  client: "AppMesh",
  propertiesDefault: {},
  omitProperties: [...omitPropertiesMesh],
  inferName:
    ({ dependenciesSpec: { mesh } }) =>
    ({ virtualServiceName }) =>
      pipe([
        tap((params) => {
          assert(mesh);
          assert(virtualServiceName);
        }),
        () => `${mesh}::${virtualServiceName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ meshName, virtualServiceName }) =>
      pipe([
        tap((params) => {
          assert(meshName);
          assert(virtualServiceName);
        }),
        () => `${meshName}::${virtualServiceName}`,
      ])(),
  findId: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      get("metadata.arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  dependencies: {
    mesh: {
      type: "Mesh",
      group: "AppMesh",
      parent: true,
      dependencyId: ({ lives, config }) => get("meshName"),
    },
    virtualRouter: {
      type: "VirtualRouter",
      group: "AppMesh",
      dependencyId:
        ({ lives, config }) =>
        ({ meshName, spec }) =>
          pipe([
            tap((params) => {
              assert(meshName);
              assert(spec);
            }),
            lives.getByType({
              providerName: config.providerName,
              type: "VirtualRouter",
              group: "AppMesh",
            }),
            find(
              and([
                eq(get("live.meshName"), meshName),
                eq(
                  get("live.virtualRouterName"),
                  get("provider.virtualRouter.virtualRouterName")(spec)
                ),
              ])
            ),
          ])(),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#describeVirtualService-property
  getById: {
    method: "describeVirtualService",
    getField: "virtualService",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#listVirtualServices-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Mesh", group: "AppMesh" },
          pickKey: pipe([pick(["meshName"])]),
          method: "listVirtualServices",
          getParam: "virtualServices",
          config,
          decorate: () => pipe([getById({})]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#createVirtualService-property
  create: {
    method: "createVirtualService",
    pickCreated: ({ payload }) => pipe([get("virtualService")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#updateVirtualService-property
  update: {
    method: "updateVirtualService",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#deleteVirtualService-property
  destroy: {
    method: "deleteVirtualService",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { mesh },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(mesh);
        assert(mesh.config.meshName);
      }),
      () => otherProps,
      defaultsDeep({
        meshName: mesh.config.meshName,
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          value: "value",
          key: "key",
        }),
      }),
    ])(),
});
