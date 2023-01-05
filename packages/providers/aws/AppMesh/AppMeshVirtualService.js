const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
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
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html
exports.AppMeshVirtualService = () => ({
  type: "VirtualService",
  package: "app-mesh",
  client: "AppMesh",
  propertiesDefault: {},
  omitProperties: ["metadata", "status"],
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
          decorate,
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
