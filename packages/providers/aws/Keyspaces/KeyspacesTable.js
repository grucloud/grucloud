const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn, when, identity } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./KeyspacesCommon");

const buildArn = () =>
  pipe([
    get("resourceArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ keyspaceName, tableName }) => {
    assert(keyspaceName);
    assert(tableName);
  }),
  pick(["keyspaceName", "tableName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    //
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Keyspaces.html
exports.KeyspacesTable = () => ({
  type: "Table",
  package: "keyspaces",
  client: "Keyspaces",
  propertiesDefault: {
    comment: {
      message: "",
    },
    defaultTimeToLive: 0,
  },
  omitProperties: [
    "keyspaceName",
    "resourceArn",
    "creationTimestamp",
    "status",
    "encryptionSpecification.kmsKeyIdentifier",
    "capacitySpecification.lastUpdateToPayPerRequestTimestamp",
  ],
  inferName:
    ({ dependenciesSpec: { keyspace } }) =>
    ({ tableName }) =>
      pipe([
        tap((params) => {
          assert(keyspace);
          assert(tableName);
        }),
        () => `${keyspace}::${tableName}`,
      ])(),
  findName:
    () =>
    ({ keyspaceName, tableName }) =>
      pipe([
        tap(() => {
          assert(keyspaceName);
          assert(tableName);
        }),
        () => `${keyspaceName}::${tableName}`,
      ])(),
  findId: () =>
    pipe([
      get("resourceArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "ValidationException"],
  dependencies: {
    keyspace: {
      type: "Keyspace",
      group: "Keyspaces",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("keyspaceName"),
          tap((keyspaceName) => {
            assert(keyspaceName);
          }),
        ]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) =>
        get("encryptionSpecification.kmsKeyIdentifier"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Keyspaces.html#getTable-property
  getById: {
    method: "getTable",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Keyspaces.html#listTables-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Keyspace", group: "Keyspaces" },
          pickKey: pipe([
            tap(({ keyspaceName }) => {
              assert(keyspaceName);
            }),
            pick(["keyspaceName"]),
          ]),
          method: "listTables",
          getParam: "tables",
          config,
          decorate: () => pipe([getById({})]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Keyspaces.html#createTable-property
  create: {
    method: "createTable",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("status"), isIn(["ACTIVE"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Keyspaces.html#updateTable-property
  update: {
    // TODO add addColumns
    method: "updateTable",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Keyspaces.html#deleteTable-property
  destroy: {
    method: "deleteTable",
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
    dependencies: { keyspace, kmsKey },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(keyspace);
      }),
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
        keyspaceName: keyspace.config.keyspaceName,
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          encryptionSpecification: {
            kmsKeyIdentifier: getField(kmsKey, "Arn"),
          },
        })
      ),
    ])(),
});
