const assert = require("assert");
const { pipe, tap, get, pick, assign, switchCase } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger, ignoreErrorCodes } = require("./SchemasCommon");

const cannotBeDeleted = () =>
  pipe([get("SchemaName", ""), callProp("startsWith", "aws")]);

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

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(live.RegistryName);
    }),
    defaultsDeep({ RegistryName: live.RegistryName }),
    assign({ Content: pipe([get("Content"), JSON.parse]) }),
  ]);

const filterPayload = pipe([
  assign({ Content: pipe([get("Content"), JSON.stringify]) }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schemas.html
exports.SchemasSchema = () => ({
  type: "Schema",
  package: "schemas",
  client: "Schemas",
  propertiesDefault: {},
  omitProperties: [
    "VersionCreatedDate",
    "SchemaArn",
    "RegistryName",
    "LastModified",
    "SchemaVersion",
  ],
  inferName:
    ({ dependenciesSpec: { registry } }) =>
    ({ SchemaName }) =>
      pipe([
        tap((name) => {
          assert(SchemaName);
          assert(registry);
        }),
        () => `${registry}::${SchemaName}`,
      ])(),
  findName:
    () =>
    ({ SchemaName, RegistryName }) =>
      pipe([
        tap((name) => {
          assert(SchemaName);
          assert(RegistryName);
        }),
        () => `${RegistryName}::${SchemaName}`,
      ])(),
  //TODO same as findName
  findId: () =>
    pipe([
      get("SchemaName"),
      tap((SchemaName) => {
        assert(SchemaName);
      }),
    ]),
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schemas.html#getSchema-property
  getById: {
    method: "describeSchema",
    pickId,
    decorate,
    noSortKey: true,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schemas.html#listSchemas-property
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
              tap((params) => {
                assert(parent.RegistryName);
              }),
              switchCase([
                cannotBeDeleted(),
                () => undefined,
                pipe([
                  defaultsDeep({ RegistryName: parent.RegistryName }),
                  getById({}),
                ]),
              ]),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schemas.html#createSchema-property
  create: {
    filterPayload,
    method: "createSchema",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schemas.html#updateSchema-property
  update: {
    method: "updateSchema",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schemas.html#deleteSchema-property
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
        RegistryName: getField(registry, "RegistryName"),
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
