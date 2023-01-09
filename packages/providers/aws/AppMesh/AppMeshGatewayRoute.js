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
  tap(({ meshName, virtualGatewayName, gatewayRouteName }) => {
    assert(meshName);
    assert(virtualGatewayName);
    assert(gatewayRouteName);
  }),
  pick(["meshName", "virtualGatewayName", "gatewayRouteName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html
exports.AppMeshGatewayRoute = () => ({
  type: "GatewayRoute",
  package: "app-mesh",
  client: "AppMesh",
  propertiesDefault: {},
  omitProperties: [...omitPropertiesMesh],
  inferName:
    ({ dependenciesSpec: { mesh, virtualGateway } }) =>
    ({ gatewayRouteName }) =>
      pipe([
        tap((params) => {
          assert(mesh);
          assert(virtualGatewayName);
          assert(gatewayRouteName);
        }),
        () => `${mesh}::${virtualGateway}::${gatewayRouteName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ meshName, virtualGatewayName, gatewayRouteName }) =>
      pipe([
        tap((params) => {
          assert(meshName);
          assert(virtualGatewayName);
          assert(gatewayRouteName);
        }),
        () => `${meshName}::${virtualGatewayName}::${gatewayRouteName}`,
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
    virtualGateway: {
      type: "VirtualGateway",
      group: "AppMesh",
      parent: true,
      // TODO also use meshName
      dependencyId: ({ lives, config }) => get("VirtualGatewayName"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#describeGatewayRoute-property
  getById: {
    method: "describeGatewayRoute",
    getField: "gatewayRoute",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#listGatewayRoutes-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "VirtualGateway", group: "AppMesh" },
          pickKey: pipe([pick(["meshName", "virtualGatewayName"])]),
          method: "listGatewayRoutes",
          getParam: "gatewayRoutes",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#createGatewayRoute-property
  create: {
    method: "createGatewayRoute",
    pickCreated: ({ payload }) => pipe([get("gatewayRoute")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#updateGatewayRoute-property
  update: {
    method: "updateGatewayRoute",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#deleteGatewayRoute-property
  destroy: {
    method: "deleteGatewayRoute",
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
          UserTags: tags,
          value: "value",
          key: "key",
        }),
      }),
    ])(),
});
