const assert = require("assert");
const { pipe, tap, get, pick, and, eq } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

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
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html
exports.AppMeshRoute = () => ({
  type: "Route",
  package: "app-mesh",
  client: "AppMesh",
  propertiesDefault: {},
  omitProperties: [...omitPropertiesMesh],
  inferName:
    ({ dependenciesSpec: { virtualRouter } }) =>
    ({ routeName }) =>
      pipe([
        tap((params) => {
          assert(virtualRouter);
          assert(routeName);
        }),
        () => `${virtualRouter}::${routeName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ meshName, virtualRouterName, routeName, ...other }) =>
      pipe([
        tap((params) => {
          assert(other);
          assert(meshName);
          assert(virtualRouterName);
          assert(routeName);
        }),
        () => `${meshName}::${virtualRouterName}::${routeName}`,
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
      dependencyId:
        ({ lives, config }) =>
        ({ meshName, virtualRouterName }) =>
          pipe([
            tap((params) => {
              assert(meshName);
              assert(virtualRouterName);
            }),
            lives.getByType({
              providerName: config.providerName,
              type: "VirtualRouter",
              group: "AppMesh",
            }),
            find(
              and([
                eq(get("live.meshName"), meshName),
                eq(get("live.virtualRouterName"), virtualRouterName),
              ])
            ),
            get("id"),
          ])(),
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
          decorate: () => pipe([getById({})]),
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
