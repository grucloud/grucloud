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
  tap(({ meshName, virtualNodeName }) => {
    assert(meshName);
    assert(virtualNodeName);
  }),
  pick(["meshName", "virtualNodeName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html
exports.AppMeshVirtualNode = () => ({
  type: "VirtualNode",
  package: "app-mesh",
  client: "AppMesh",
  propertiesDefault: {},
  omitProperties: ["metadata", "status"],
  inferName:
    ({ dependenciesSpec: { mesh } }) =>
    ({ virtualNodeName }) =>
      pipe([
        tap((params) => {
          assert(mesh);
          assert(virtualNodeName);
        }),
        () => `${mesh}::${virtualNodeName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ meshName, virtualNodeName }) =>
      pipe([
        tap((params) => {
          assert(meshName);
          assert(virtualNodeName);
        }),
        () => `${meshName}::${virtualNodeName}`,
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#describeVirtualNode-property
  getById: {
    method: "describeVirtualNode",
    getField: "virtualGateway",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#listVirtualNodes-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Mesh", group: "AppMesh" },
          pickKey: pipe([pick(["meshName"])]),
          method: "listVirtualNodes",
          getParam: "virtualGateways",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#createVirtualNode-property
  create: {
    method: "createVirtualNode",
    pickCreated: ({ payload }) => pipe([get("virtualGateway")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#updateVirtualNode-property
  update: {
    method: "updateVirtualNode",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#deleteVirtualNode-property
  destroy: {
    method: "deleteVirtualNode",
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
