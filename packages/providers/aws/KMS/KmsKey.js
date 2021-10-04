const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  not,
  assign,
  tryCatch,
  or,
  omit,
} = require("rubico");
const {
  find,
  first,
  defaultsDeep,
  isEmpty,
  size,
  callProp,
} = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const logger = require("@grucloud/core/logger")({
  prefix: "KmsKey",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getByNameCore, isUpByIdCore } = require("@grucloud/core/Common");
const { KmsNew, buildTags, shouldRetryOnException } = require("../AwsCommon");
const { configProviderDefault } = require("@grucloud/core/Common");

const { AwsClient } = require("../AwsClient");

const findId = get("live.Arn");

const findNameInTags = pipe([
  get("live.Tags"),
  find(eq(get("TagKey"), configProviderDefault.nameKey)),
  get("TagValue"),
]);

const findNames = [findNameInTags, get("live.Alias"), findId];

const findName = (item) =>
  pipe([() => findNames, map((fn) => fn(item)), find(not(isEmpty))])();

exports.KmsKey = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const kms = KmsNew(config);

  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList ${tos(params)}`);
      }),
      () => kms().listKeys(params),
      get("Keys"),
      map(
        tryCatch(
          pipe([
            ({ KeyId }) => kms().describeKey({ KeyId }),
            get("KeyMetadata"),
          ]),
          (error, item) => item
        )
      ),
      map(
        tryCatch(
          assign({
            Tags: pipe([
              ({ KeyId }) => kms().listResourceTags({ KeyId }),
              get("Tags"),
            ]),
          }),
          (error, item) => item
        )
      ),
      map(
        tryCatch(
          assign({
            Alias: pipe([
              ({ KeyId }) => kms().listAliases({ KeyId }),
              get("Aliases"),
              first,
              get("AliasName"),
            ]),
          }),
          (error, item) => item
        )
      ),
    ])();

  const getByName = getByNameCore({ getList, findName });

  const getById = ({ id }) =>
    pipe([
      tap(() => {
        logger.info(`getById ${id}`);
      }),
      () => ({ KeyId: id }),
      kms().describeKey,
      get("KeyMetadata"),
      tap((result) => {
        logger.debug(`getById result: ${tos(result)}`);
      }),
    ])();

  const isInstanceUp = eq(get("Enabled"), true);

  const isUpById = isUpByIdCore({ isInstanceUp, getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createKey-property
  const create = ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create: ${name}`);
        logger.debug(tos(payload));
      }),
      () => kms().createKey(payload),
      get("KeyMetadata"),
      tap(({ KeyId }) =>
        retryCall({
          name: `key isUpById: ${name} id: ${KeyId}`,
          fn: () => isUpById({ name, id: KeyId }),
          config,
        })
      ),
      ({ KeyId }) => ({ AliasName: `alias/${name}`, TargetKeyId: KeyId }),
      kms().createAlias,
      tap(() => {
        logger.info(`created`);
      }),
    ])();

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`key update: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => live,
      tap.if(
        eq(get("KeyState"), "PendingDeletion"),
        pipe([() => kms().cancelKeyDeletion({ KeyId: live.KeyId })])
      ),
      tap.if(
        eq(get("Enabled"), false),
        pipe([
          tap(() => kms().enableKey({ KeyId: live.KeyId })),
          tap(({ KeyId }) =>
            retryCall({
              name: `key isUpById: ${name} id: ${KeyId}`,
              fn: () => isUpById({ name, id: KeyId }),
              config,
            })
          ),
        ])
      ),
      tap(() => {
        logger.info(`key updated: ${name}`);
      }),
    ])();

  const destroy = ({ live }) =>
    pipe([
      () => ({ KeyId: findId({ live }), name: findName({ live }) }),
      ({ KeyId, name }) =>
        pipe([
          tap(() => {
            logger.info(`destroy key ${JSON.stringify({ KeyId, name })}`);
          }),
          () => kms().disableKey({ KeyId }),
          () =>
            kms().scheduleKeyDeletion({
              KeyId,
              PendingWindowInDays: 7,
            }),
          tap(() => {
            logger.info(`destroyed ${JSON.stringify({ KeyId, name })}`);
          }),
        ])(),
    ])();

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

  const isDefault = pipe([
    get("live.Alias", ""),
    callProp("startsWith", "alias/aws/"),
  ]);

  const cannotBeDeleted = or([
    eq(get("live.KeyState"), "PendingDeletion"),
    isDefault,
  ]);

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getByName,
    getList,
    configDefault,
    cannotBeDeleted,
    isDefault,
    managedByOther: isDefault,
    shouldRetryOnException,
  };
};
