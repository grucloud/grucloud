const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./AppMeshCommon");

const buildArn = () =>
  pipe([
    get("metadata.arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ meshName, virtualRouterName, routeName }) => {
    assert(meshName);
    assert(virtualRouterName);
    assert(routeName);
  }),
  pick(["meshName", "virtualRouterName", "routeName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html
exports.AppMeshRoute = () => ({
  type: "Route",
  package: "app-mesh",
  client: "AppMesh",
  propertiesDefault: {},
  omitProperties: ["metadata", "status"],
  inferName:
    ({ dependenciesSpec: { mesh, virtualRouter } }) =>
    ({ routeName }) =>
      pipe([
        tap((params) => {
          assert(mesh);
          assert(virtualRouter);
          assert(routeName);
        }),
        () => `${mesh}::${virtualRouter}::${routeName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ meshName, virtualRouter, routeName }) =>
      pipe([
        tap((params) => {
          assert(meshName);
          assert(virtualRouter);
          assert(routeName);
        }),
        () => `${meshName}::${virtualRouter}::${routeName}`,
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
    virtualRouter: {
      type: "VirtualRouter",
      group: "AppMesh",
      parent: true,
      dependencyId: ({ lives, config }) => get("VirtualRouterName"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#describeRoute-property
  getById: {
    method: "describeRoute",
    getField: "route",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#listRoutes-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "VirtualRouter", group: "AppMesh" },
          pickKey: pipe([pick(["meshName", "virtualRouterName"])]),
          method: "listRoutes",
          getParam: "routes",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#createRoute-property
  create: {
    method: "createRoute",
    pickCreated: ({ payload }) => pipe([get("route")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#updateRoute-property
  update: {
    method: "updateRoute",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#deleteRoute-property
  destroy: {
    method: "deleteRoute",
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
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
          value: "tag",
          key: "key",
        }),
      }),
    ])(),
});
