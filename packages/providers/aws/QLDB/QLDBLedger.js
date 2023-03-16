const assert = require("assert");
const { pipe, tap, get, pick, or } = require("rubico");
const { defaultsDeep, when, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./QLDBCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    when(
      get("EncryptionDescription"),
      ({ EncryptionDescription, ...other }) => ({
        KmsKey: EncryptionDescription.KmsKeyArn,
        ...other,
      })
    ),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QLDB.html
exports.QLDBLedger = () => ({
  type: "Ledger",
  package: "qldb",
  client: "QLDB",
  propertiesDefault: { PermissionsMode: "STANDARD" },
  omitProperties: ["Arn", "State", "CreationDateTime", "EncryptionDescription"],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Name"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKey"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QLDB.html#describeLedger-property
  getById: {
    method: "describeLedger",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QLDB.html#listLedgers-property
  getList: {
    method: "listLedgers",
    getParam: "Ledgers",
    decorate: ({ getById }) =>
      pipe([
        tap((id) => {
          assert(id);
        }),
        getById,
        tap((id) => {
          assert(id);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QLDB.html#createLedger-property
  create: {
    method: "createLedger",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("State"), isIn(["ACTIVE"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QLDB.html#updateLedger-property
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => diff,
        tap.if(
          or([get("liveDiff.updated.PermissionsMode")]),
          pipe([
            () => payload,
            pick(["Name", "PermissionsMode"]),
            endpoint().updateLedgerPermissionsMode,
          ])
        ),
        () => payload,
        pick(["Name", "DeletionProtection", "KmsKey"]),
        endpoint().updateLedger,
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QLDB.html#deleteLedger-property
  destroy: {
    // preDestroy: call updateLedger with DeletionProtection = false
    method: "deleteLedger",
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
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKey: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
