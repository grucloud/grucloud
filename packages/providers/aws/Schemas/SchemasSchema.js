const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, ignoreErrorCodes } = require("./SchemasCommon");

const buildArn = () =>
  pipe([
    get("SchemaArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ SchemaName, RegistryName }) => {
    assert(SchemaName);
    assert(RegistryName);
  }),
  pick(["SchemaName", "RegistryName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html
exports.SchemasSchema = () => ({
  type: "Schema",
  package: "schemas",
  client: "Schemas",
  propertiesDefault: {},
  omitProperties: ["VersionCreatedDate", "SchemaArn", "RegistryName"],
  inferName:
    ({ registry }) =>
    ({ SchemaName }) =>
      pipe([
        tap((name) => {
          assert(StatementName);
          assert(registry);
        }),
        () => `${registry}::${SchemaName}`,
      ]),
  findName:
    () =>
    ({ SchemaName, RegistryName }) =>
      pipe([
        tap((name) => {
          assert(SchemaName);
          assert(RegistryName);
        }),
        () => `${RegistryName}::${SchemaName}`,
      ]),
  findId: () =>
    pipe([
      get("SchemaArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    registry: {
      type: "Registry",
      group: "EventSchemas",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("RegistryName"),
          tap((RegistryName) => {
            assert(RegistryName);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html#getSchema-property
  getById: {
    method: "describeSchema",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html#listSchemas-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Registry", group: "EventSchemas" },
          pickKey: pipe([
            pick(["RegistryName"]),
            tap(({ RegistryName }) => {
              assert(RegistryName);
            }),
          ]),
          method: "listSchemas",
          getParam: "Schemas",
          config,
          decorate: ({ parent }) =>
            pipe([
              defaultsDeep({ RegistryName: parent.RegistryName }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html#createSchema-property
  create: {
    method: "createSchema",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html#updateSchema-property
  update: {
    method: "updateSchema",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html#deleteSchema-property
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
      tap((params) => {
        assert(registry);
      }),
      () => otherProps,
      defaultsDeep({
        RegistryName: getField(registry, "Name"),
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
