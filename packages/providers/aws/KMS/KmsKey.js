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
  omit,
} = require("rubico");
const {
  find,
  first,
  defaultsDeep,
  isEmpty,
  callProp,
  when,
} = require("rubico/x");
const logger = require("@grucloud/core/logger")({
  prefix: "KmsKey",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { configProviderDefault } = require("@grucloud/core/Common");

const { AwsClient } = require("../AwsClient");
const { createKMS, tagResource, untagResource } = require("./KMSCommon");

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
      assign({
        Policy: pipe([
          pickId,
          defaultsDeep({ PolicyName: "default" }),
          kms().getKeyPolicy,
          get("Policy"),
          JSON.parse,
        ]),
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createAlias-property
  const createAlias = ({ name }) =>
    pipe([
      pickId,
      ({ KeyId }) => ({ AliasName: `alias/${name}`, TargetKeyId: KeyId }),
      kms().createAlias,
    ]);

  // https://docs.aws.amazon.com/AWSJavaS:criptSDK/latest/AWS/KMS.html#putKeyPolicy-property
  const putKeyPolicy = ({ Policy }) =>
    when(
      () => Policy,
      pipe([
        pickId,
        defaultsDeep({ PolicyName: "default", Policy: JSON.stringify(Policy) }),
        kms().putKeyPolicy,
      ])
    );

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createKey-property
  const create = client.create({
    isInstanceUp,
    method: "createKey",
    filterPayload: pipe([omit(["Policy"])]),
    pickCreated: () => pipe([get("KeyMetadata")]),
    getById,
    postCreate: ({ name, payload }) =>
      pipe([tap(createAlias({ name })), tap(putKeyPolicy(payload))]),
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
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#updateKeyDescription-property
      tap.if(
        () => get("liveDiff.updated.Description")(diff) != undefined,
        pipe([
          () => ({ KeyId: live.KeyId, Description: payload.Description }),
          tap((params) => {
            assert(true);
          }),
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#disableKey-property
          tap(kms().updateKeyDescription),
        ])
      ),
      // Update policy
      tap.if(
        () => get("liveDiff.updated.Policy")(diff),
        pipe([putKeyPolicy(payload)])
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
      (params) => kms().scheduleKeyDeletion(params),
    ]),
    pickId,
    method: "disableKey",
    getById,
    isInstanceDown,
    ignoreErrorCodes: ["NotFoundException"],
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({
          config,
          namespace,
          name,
          key: "TagKey",
          value: "TagValue",
          UserTags: Tags,
        }),
      }),
    ])();

  const isDefault = pipe([
    or([
      pipe([get("live.Alias", ""), callProp("startsWith", "alias/aws/")]),
      pipe([get("live.Description"), callProp("startsWith", "Default ")]),
    ]),
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
    tagResource: tagResource({ kms }),
    untagResource: untagResource({ kms }),
  };
};
