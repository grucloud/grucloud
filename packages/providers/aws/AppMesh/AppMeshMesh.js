const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./AppMeshCommon");

const buildArn = () =>
  pipe([
    get("metadata.arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ meshName }) => {
    assert(meshName);
  }),
  pick(["meshName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html
exports.AppMeshMesh = () => ({
  type: "Mesh",
  package: "app-mesh",
  client: "AppMesh",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "createdAt",
    "lastUpdatedAt",
    "metadata",
    "resourceOwner",
    "status",
    "version",
    "meshOwner",
  ],
  inferName: () =>
    pipe([
      get("meshName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("meshName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("meshName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#describeMesh-property
  getById: {
    method: "describeMesh",
    getField: "mesh",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#listMeshes-property
  getList: {
    method: "listMeshes",
    getParam: "meshes",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#createMesh-property
  create: {
    method: "createMesh",
    pickCreated: ({ payload }) => pipe([get("mesh")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#updateMesh-property
  update: {
    method: "updateMesh",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html#deleteMesh-property
  destroy: {
    method: "deleteMesh",
    pickId,
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ meshName: name }), getById({})]),
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
