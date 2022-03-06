const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  not,
  and,
  assign,
  tryCatch,
  or,
  pick,
} = require("rubico");
const { find, first, defaultsDeep, isEmpty, callProp } = require("rubico/x");
const logger = require("@grucloud/core/logger")({
  prefix: "KmsKey",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { configProviderDefault } = require("@grucloud/core/Common");

const { AwsClient } = require("../AwsClient");
const { createKMS } = require("./KMSCommon");

const findId = get("live.Arn");
const pickId = pick(["KeyId"]);

const findNameInTags = pipe([
  get("live.Tags"),
  find(eq(get("TagKey"), configProviderDefault.nameKey)),
  get("TagValue"),
  tap((params) => {
    assert(true);
  }),
]);

const findNames = [findNameInTags, get("live.Alias"), get("live.KeyId")];

const findName = (item) =>
  pipe([() => findNames, map((fn) => fn(item)), find(not(isEmpty))])();

exports.KmsKey = ({ spec, config }) => {
  const kms = createKMS(config);
  const client = AwsClient({ spec, config })(kms);

  const decorate = () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      tryCatch(
        assign({
          Tags: pipe([pickId, kms().listResourceTags, get("Tags")]),
        }),
        (error, item) => item
      ),
      tryCatch(
        assign({
          Alias: pipe([
            pickId,
            kms().listAliases,
            get("Aliases"),
            first,
            get("AliasName"),
          ]),
        }),
        (error, item) => item
      ),
      tap((params) => {
        assert(true);
      }),
    ]);

  const getById = client.getById({
    pickId,
    method: "describeKey",
    getField: "KeyMetadata",
    ignoreErrorCodes: ["NotFoundException"],
    decorate,
  });

  const getList = client.getList({
    method: "listKeys",
    getParam: "Keys",
    decorate: () => getById,
  });

  const getByName = getByNameCore({ getList, findName });

  const isInstanceUp = and([
    eq(get("KeyState"), "Enabled"),
    eq(get("Enabled"), true),
  ]);

  const isInstanceDisabled = and([
    eq(get("KeyState"), "Disabled"),
    eq(get("Enabled"), false),
  ]);

  const isInstanceDown = eq(get("KeyState"), "PendingDeletion");

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createKey-property

  const create = client.create({
    isInstanceUp,
    method: "createKey",
    pickCreated: () => (result) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => result,
        get("KeyMetadata"),
      ])(),
    pickId,
    getById,
    config,
    postCreate: ({ name }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        pickId,
        ({ KeyId }) => ({ AliasName: `alias/${name}`, TargetKeyId: KeyId }),
        kms().createAlias,
      ]),
  });

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`key update: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => live,
      tap.if(
        isInstanceDown,
        tryCatch(
          pipe([
            pickId,
            kms().cancelKeyDeletion,
            tap(({ KeyId }) =>
              retryCall({
                name: `key isInstanceDisabled: ${name} id: ${KeyId}`,
                fn: pipe([() => getById({ KeyId }), isInstanceDisabled]),
                config,
              })
            ),
          ]),
          (error) =>
            pipe([
              tap(() => {
                // Ignore error
                logger.error(`cancelKeyDeletion: ${JSON.stringify(error)}`);
              }),
            ])()
        )
      ),
      tap.if(
        () => get("liveDiff.updated.Enabled")(diff),
        pipe([
          tap((params) => {
            assert(true);
          }),
          pickId,
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#enableKey-property
          tap(kms().enableKey),
          tap(({ KeyId }) =>
            retryCall({
              name: `key isUpById: ${name} id: ${KeyId}`,
              fn: pipe([() => getById({ KeyId }), isInstanceUp]),
              config,
            })
          ),
        ])
      ),
      tap.if(
        () => eq(get("liveDiff.updated.Enabled"), false)(diff),
        pipe([
          pickId,
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#disableKey-property
          tap(kms().disableKey),
          tap(({ KeyId }) =>
            retryCall({
              name: `key isUpById: ${name} id: ${KeyId}`,
              fn: pipe([() => getById({ KeyId }), isInstanceDisabled]),
              config,
            })
          ),
        ])
      ),
      tap(() => {
        logger.info(`key updated: ${name}`);
      }),
    ])();

  const destroy = client.destroy({
    postDestroy: pipe([
      tap((params) => {
        assert(true);
      }),
      pickId,
      defaultsDeep({ PendingWindowInDays: 7 }),
      kms().scheduleKeyDeletion,
    ]),
    pickId,
    method: "disableKey",
    getById,
    isInstanceDown,
    config,
    ignoreErrorCodes: ["NotFoundException"],
  });

  const configDefault = ({ name, namespace, properties }) =>
    pipe([
      () => properties,
      defaultsDeep({
        Tags: buildTags({
          config,
          namespace,
          name,
          key: "TagKey",
          value: "TagValue",
        }),
      }),
    ])();

  const isDefault = or([
    pipe([get("live.Alias", ""), callProp("startsWith", "alias/aws/")]),
    eq(
      get("live.Description"),
      "Default master key that protects my EBS volumes when no other key is defined"
    ),
  ]);

  const cannotBeDeleted = or([
    eq(get("live.KeyState"), "PendingDeletion"),
    isDefault,
  ]);

  return {
    spec,
    findName,
    findId,
    getById,
    create,
    update,
    destroy,
    getByName,
    getList,
    configDefault,
    cannotBeDeleted,
    isDefault,
    managedByOther: isDefault,
  };
};
