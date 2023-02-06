const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, ignoreErrorCodes } = require("./SchemasCommon");

const cannotBeDeleted = () => pipe([get("RegistryName"), isIn(["aws.events"])]);

const buildArn = () =>
  pipe([
    get("RegistryArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ RegistryName }) => {
    assert(RegistryName);
  }),
  pick(["RegistryName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omitIfEmpty(["Description"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schemas.html
exports.SchemasRegistry = () => ({
  type: "Registry",
  package: "schemas",
  client: "Schemas",
  propertiesDefault: {},
  omitProperties: ["RegistryArn"],
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
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
      tap((params) => {
        assert(true);
      }),
      get("RegistryName"),
      tap((RegistryName) => {
        assert(RegistryName);
      }),
    ]),
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schemas.html#describeRegistry-property
  getById: {
    method: "describeRegistry",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schemas.html#listRegistries-property
  getList: {
    method: "listRegistries",
    getParam: "Registries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schemas.html#createRegistry-property
  create: {
    method: "createRegistry",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schemas.html#updateRegistry-property
  update: {
    method: "updateRegistry",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schemas.html#deleteRegistry-property
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
