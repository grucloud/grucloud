const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
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
  tap(({ meshName, virtualRouterName }) => {
    assert(meshName);
    assert(virtualRouterName);
  }),
  pick(["meshName", "virtualRouterName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html
exports.AppMeshVirtualRouter = () => ({
  type: "VirtualRouter",
  package: "app-mesh",
  client: "AppMesh",
  propertiesDefault: {},
  omitProperties: [...omitPropertiesMesh],
  inferName:
    ({ dependenciesSpec: { mesh } }) =>
    ({ virtualRouterName }) =>
      pipe([
        tap((params) => {
          assert(mesh);
          assert(virtualRouterName);
        }),
        () => `${mesh}::${virtualRouterName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ meshName, virtualRouterName }) =>
      pipe([
        tap((params) => {
          assert(meshName);
          assert(virtualRouterName);
        }),
        () => `${meshName}::${virtualRouterName}`,
      ])(),

  findId: () =>
    pipe([
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
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#describeVirtualRouter-property
  getById: {
    method: "describeVirtualRouter",
    getField: "virtualRouter",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#listVirtualRouters-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Mesh", group: "AppMesh" },
          pickKey: pipe([pick(["meshName"])]),
          method: "listVirtualRouters",
          getParam: "virtualRouters",
          config,
          decorate: () => pipe([getById({})]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#createVirtualRouter-property
  create: {
    method: "createVirtualRouter",
    pickCreated: ({ payload }) => pipe([get("virtualRouter")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#updateVirtualRouter-property
  update: {
    method: "updateVirtualRouter",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#deleteVirtualRouter-property
  destroy: {
    method: "deleteVirtualRouter",
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
