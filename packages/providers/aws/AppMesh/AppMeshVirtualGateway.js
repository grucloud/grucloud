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
  tap(({ meshName, virtualGatewayName }) => {
    assert(meshName);
    assert(virtualGatewayName);
  }),
  pick(["meshName", "virtualGatewayName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html
exports.AppMeshVirtualGateway = () => ({
  type: "VirtualGateway",
  package: "app-mesh",
  client: "AppMesh",
  propertiesDefault: {},
  omitProperties: ["metadata", "status"],
  inferName:
    ({ dependenciesSpec: { mesh } }) =>
    ({ virtualGatewayName }) =>
      pipe([
        tap((params) => {
          assert(mesh);
          assert(virtualGatewayName);
        }),
        () => `${mesh}::${virtualGatewayName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ meshName, virtualGatewayName }) =>
      pipe([
        tap((params) => {
          assert(meshName);
          assert(virtualGatewayName);
        }),
        () => `${meshName}::${virtualGatewayName}`,
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#describeVirtualGateway-property
  getById: {
    method: "describeVirtualGateway",
    getField: "virtualGateway",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#listVirtualGateways-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Mesh", group: "AppMesh" },
          pickKey: pipe([pick(["meshName"])]),
          method: "listVirtualGateways",
          getParam: "virtualGateways",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#createVirtualGateway-property
  create: {
    method: "createVirtualGateway",
    pickCreated: ({ payload }) => pipe([get("virtualGateway")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#updateVirtualGateway-property
  update: {
    method: "updateVirtualGateway",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#deleteVirtualGateway-property
  destroy: {
    method: "deleteVirtualGateway",
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
