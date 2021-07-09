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
const { find, first, defaultsDeep, isEmpty, size } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const logger = require("@grucloud/core/logger")({
  prefix: "KmsKey",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getByNameCore, isUpByIdCore } = require("@grucloud/core/Common");
const { KmsNew, buildTags, shouldRetryOnException } = require("../AwsCommon");
const { configProviderDefault } = require("@grucloud/core/Common");

const findId = get("Arn");

const findNameInTags = pipe([
  get("Tags"),
  find(eq(get("TagKey"), configProviderDefault.nameKey)),
  get("TagValue"),
]);

const findNames = [findNameInTags, get("live.Alias"), findId];

const findName = (item) =>
  pipe([() => findNames, map((fn) => fn(item)), find(not(isEmpty))])();

exports.KmsKey = ({ spec, config }) => {
  const kms = KmsNew(config);

  const getList = async ({ params } = {}) =>
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
      tap((results) => {
        logger.debug(`getList: result: ${tos(results)}`);
      }),
      (items = []) => ({
        total: size(items),
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList: #total: ${total}`);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });

  const getById = ({ id }) =>
    pipe([
      tap(() => {
        logger.info(`getById ${id}`);
      }),
      () => ({ KeyId: id }),
      (params) => kms().describeKey(params),
      get("KeyMetadata"),
      tap((result) => {
        logger.debug(`getById result: ${tos(result)}`);
      }),
    ])();

  const isInstanceUp = not(isEmpty);
  const isUpById = isUpByIdCore({ isInstanceUp, getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createKey-property
  const create = async ({ name, payload }) =>
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
      (params) => kms().createAlias(params),
      tap(() => {
        logger.info(`created`);
      }),
    ])();

  const update = async ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => live,
      tap.if(
        eq(get("KeyState"), "PendingDeletion"),
        pipe([() => kms().cancelKeyDeletion({ KeyId: live.KeyId })])
      ),
      tap.if(
        eq(get("Enabled"), false),
        pipe([() => kms().enableKey({ KeyId: live.KeyId })])
      ),
      tap(() => {
        logger.info(`updated`);
      }),
    ])();

  const destroy = async ({ live }) =>
    pipe([
      () => ({ id: findId({ live }), name: findName({ live }) }),
      ({ id, name }) =>
        pipe([
          tap(() => {
            logger.info(`destroy ${JSON.stringify({ id, name })}`);
          }),
          () => kms().disableKey({ KeyId: id }),
          () =>
            kms().scheduleKeyDeletion({
              KeyId: id,
              PendingWindowInDays: 7,
            }),
          tap(() => {
            logger.info(`destroyed ${JSON.stringify({ id, name })}`);
          }),
        ])(),
    ])();

  const configDefault = async ({ name, namespace, properties }) =>
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

  const cannotBeDeleted = or([
    eq(get("live.KeyState"), "PendingDeletion"),
    pipe([get("live.Alias", ""), (alias) => alias.startsWith("alias/aws/")]),
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
    shouldRetryOnException,
  };
};

const filterTarget = ({ target }) =>
  pipe([
    () => target,
    omit(["Tags"]),
    assign({ Enabled: () => true, KeyState: () => "Enabled" }),
  ])();

const filterLive = ({ live }) => pipe([() => live, omit(["Tags"])])();

exports.compareKmsKey = pipe([
  assign({
    target: filterTarget,
    live: filterLive,
  }),
  ({ target, live }) => ({
    targetDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
    ])(),
    liveDiff: pipe([
      () => detailedDiff(live, target),
      omit(["added", "deleted"]),
    ])(),
  }),
  tap((diff) => {
    logger.debug(`compareKmsKey ${tos(diff)}`);
  }),
]);
