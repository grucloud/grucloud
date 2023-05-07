const assert = require("assert");
const { pipe, tap, get, eq, assign } = require("rubico");
const { defaultsDeep, isIn, identity, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./GlueCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () =>
  pipe([
    get("SchemaArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ RegistryName, SchemaName }) => {
    assert(RegistryName);
    assert(SchemaName);
  }),
  ({ RegistryName, SchemaName }) => ({
    SchemaId: { RegistryName, SchemaName },
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ endpoint, buildArn: buildArn() }),
    //
    when(
      eq(get("DataFormat"), "JSON"),
      assign({
        SchemaDefinition: pipe([get("SchemaDefinition"), JSON.parse]),
      })
    ),
  ]);

const filterPayload = pipe([
  ({ RegistryArn, RegistryName, ...other }) => ({
    ...other,
    RegistryId: { RegistryArn },
  }),
  when(
    eq(get("DataFormat"), "JSON"),
    assign({
      SchemaDefinition: pipe([get("SchemaDefinition"), JSON.stringify]),
    })
  ),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueSchema = () => ({
  type: "Schema",
  package: "glue",
  client: "Glue",
  propertiesDefault: {},
  omitProperties: [
    "SchemaArn",
    "RegistryName",
    "RegistryArn",
    "SchemaStatus",
    "CreatedTime",
    "UpdatedTime",
    "SchemaCheckpoint",
    "LatestSchemaVersion",
    "NextSchemaVersion",
  ],
  inferName:
    ({ dependenciesSpec: { registry } }) =>
    ({ SchemaName }) =>
      pipe([
        tap((params) => {
          assert(registry);
          assert(SchemaName);
        }),
        () => `${registry}::${SchemaName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ SchemaName, RegistryName }) =>
      pipe([
        tap((params) => {
          assert(RegistryName);
          assert(SchemaName);
        }),
        () => `${RegistryName}::${SchemaName}`,
      ])(),
  findId: () =>
    pipe([
      get("SchemaArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["EntityNotFoundException"],
  dependencies: {
    analyzer: {
      type: "Registry",
      group: "Glue",
      parent: true,
      dependencyId: () =>
        pipe([
          get("RegistryArn"),
          tap((RegistryArn) => {
            assert(RegistryArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getSchema-property
  getById: {
    method: "getSchema",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#listSchemas-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Registry", group: "Glue" },
          pickKey: pipe([
            ({ RegistryArn }) => ({ RegistryId: { RegistryArn } }),
          ]),
          method: "listSchemas",
          getParam: "Schemas",
          config,
          decorate: ({ parent }) => pipe([getById({})]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createSchema-property
  create: {
    filterPayload,
    method: "createSchema",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([get("SchemaStatus"), isIn(["AVAILABLE"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#updateSchema-property
  update: {
    method: "updateSchema",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        defaultsDeep(pickId(live)),
        defaultsDeep({ SchemaVersionNumber: { LatestVersion: true } }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deleteSchema-property
  destroy: {
    method: "deleteSchema",
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
    dependencies: { registry },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(registry);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        RegistryArn: getField(registry, "RegistryArn"),
      }),
    ])(),
});
