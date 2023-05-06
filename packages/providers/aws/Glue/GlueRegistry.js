const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./GlueCommon");

const buildArn = () =>
  pipe([
    get("RegistryArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ RegistryArn }) => {
    assert(RegistryArn);
  }),
  ({ RegistryArn }) => ({ RegistryId: { RegistryArn } }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ endpoint, buildArn: buildArn() }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueRegistry = () => ({
  type: "Registry",
  package: "glue",
  client: "Glue",
  propertiesDefault: {},
  omitProperties: ["RegistryArn", "Status", "CreatedTime", "UpdatedTime"],
  inferName: () =>
    pipe([
      get("RegistryName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("RegistryName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("RegistryArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["EntityNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getRegistry-property
  getById: {
    method: "getRegistry",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#listRegistries-property
  getList: {
    method: "listRegistries",
    getParam: "Registries",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createRegistry-property
  create: {
    method: "createRegistry",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#updateRegistry-property
  update: {
    method: "updateRegistry",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deleteRegistry-property
  destroy: {
    method: "deleteRegistry",
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
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
