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
  fork,
} = require("rubico");
const {
  find,
  first,
  defaultsDeep,
  isEmpty,
  callProp,
  when,
} = require("rubico/x");
const moment = require("moment");

const logger = require("@grucloud/core/logger")({
  prefix: "KmsKey",
});
const { retryCall } = require("@grucloud/core/Retry");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { configProviderDefault } = require("@grucloud/core/Common");

const { sortStatements } = require("../IAM/AwsIamCommon");

const { assignPolicyAccountAndRegion } = require("../IAM/AwsIamCommon");

const { tagResource, untagResource } = require("./KmsCommon");

const findId = () => get("Arn");
const pickId = pick(["KeyId"]);

const findNameInTags = pipe([
  get("Tags"),
  find(eq(get("Key"), configProviderDefault.nameKey)),
  get("Value"),
  tap((params) => {
    assert(true);
  }),
]);

const findNames = [findNameInTags, get("Alias"), get("KeyId")];

const findName = () => (live) =>
  pipe([() => findNames, map((fn) => fn(live)), find(not(isEmpty))])();

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      Policy: pipe([
        pickId,
        defaultsDeep({ PolicyName: "default" }),
        endpoint().getKeyPolicy,
        get("Policy"),
        JSON.parse,
        sortStatements,
      ]),
    }),
    tryCatch(
      assign({
        Tags: pipe([
          pickId,
          endpoint().listResourceTags,
          get("Tags"),
          map(({ TagKey, TagValue }) => ({ Key: TagKey, Value: TagValue })),
        ]),
      }),
      (error, item) => item
    ),
    tryCatch(
      assign({
        Alias: pipe([
          pickId,
          endpoint().listAliases,
          get("Aliases"),
          first,
          get("AliasName"),
        ]),
      }),
      (error, item) => item
    ),
  ]);

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
const createAlias = ({ endpoint, name }) =>
  pipe([
    pickId,
    ({ KeyId }) => ({ AliasName: `alias/${name}`, TargetKeyId: KeyId }),
    endpoint().createAlias,
  ]);

// https://docs.aws.amazon.com/AWSJavaS:criptSDK/latest/AWS/KMS.html#putKeyPolicy-property
const putKeyPolicy = ({ endpoint, payload: { Policy } }) =>
  when(
    () => Policy,
    pipe([
      pickId,
      defaultsDeep({ PolicyName: "default", Policy: JSON.stringify(Policy) }),
      endpoint().putKeyPolicy,
    ])
  );

const isDefault = () =>
  pipe([
    or([
      pipe([get("Alias", ""), callProp("startsWith", "alias/aws/")]),
      pipe([get("Description"), callProp("startsWith", "Default ")]),
    ]),
  ]);

const cannotBeDeleted = () =>
  or([
    //
    eq(get("KeyState"), "PendingDeletion"),
    isDefault(),
  ]);

exports.KmsKey = () => ({
  type: "Key",
  package: "kms",
  client: "KMS",
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  omitProperties: [
    "AWSAccountId",
    "KeyId",
    "Arn",
    "Alias",
    "CreationDate",
    "DeletionDate",
    "KeyState",
    "CustomerMasterKeySpec",
  ],
  propertiesDefault: {
    Enabled: true,
    KeyManager: "CUSTOMER",
    KeySpec: "SYMMETRIC_DEFAULT",
    // You cannot specify KeySpec and CustomerMasterKeySpec in the same request. CustomerMasterKeySpec is deprecated
    //CustomerMasterKeySpec: "SYMMETRIC_DEFAULT",
    MultiRegion: false,
    Origin: "AWS_KMS",
    Description: "",
    KeyUsage: "ENCRYPT_DECRYPT",
    EncryptionAlgorithms: ["SYMMETRIC_DEFAULT"],
  },
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      //TODO no pick
      pick(["Enabled", "Description", "Policy"]),
      assign({
        Policy: pipe([
          get("Policy"),
          assignPolicyAccountAndRegion({ providerConfig, lives }),
        ]),
      }),
    ]),
  ignoreResource: ({ lives }) => pipe([not(get("live.Enabled"))]),
  findName,
  findId,
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#describeKey-property
  getById: {
    pickId,
    method: "describeKey",
    getField: "KeyMetadata",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#listKeys-property
  getList: {
    method: "listKeys",
    getParam: "Keys",
    transformListPost: () =>
      pipe([
        callProp("sort", (a, b) => {
          return moment(b.CreationDate).isAfter(a.CreationDate) ? 1 : -1;
        }),
      ]),
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createKey-property
  create: {
    isInstanceUp,
    method: "createKey",
    filterPayload: pipe([
      omit(["Policy"]),
      assign({
        Tags: pipe([
          get("Tags", []),
          map(({ Key, Value }) => ({ TagKey: Key, TagValue: Value })),
        ]),
      }),
    ]),
    pickCreated: () => pipe([get("KeyMetadata")]),
    postCreate: ({ endpoint, name, payload }) =>
      pipe([
        tap(createAlias({ endpoint, name })),
        tap(putKeyPolicy({ endpoint, payload })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#updateMyResource-property
  update:
    ({ endpoint, getById, config }) =>
    ({ name, payload, diff, live }) =>
      pipe([
        tap(() => {
          assert(endpoint);
          assert(getById);
          logger.info(`key update: ${name}`);
          //logger.debug(tos({ payload, diff, live }));
        }),
        () => live,
        tap.if(
          isInstanceDown,
          tryCatch(
            pipe([
              pickId,
              endpoint().cancelKeyDeletion,
              tap(({ KeyId }) =>
                retryCall({
                  name: `key isInstanceDisabled: ${name} id: ${KeyId}`,
                  fn: pipe([
                    () => ({ KeyId }),
                    getById({}),
                    isInstanceDisabled,
                  ]),
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
            tap(endpoint().enableKey),
            tap(({ KeyId }) =>
              retryCall({
                name: `key isUpById: ${name} id: ${KeyId}`,
                fn: pipe([() => ({ KeyId }), getById({}), isInstanceUp]),
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
            tap(endpoint().disableKey),
            tap(({ KeyId }) =>
              retryCall({
                name: `key isUpById: ${name} id: ${KeyId}`,
                fn: pipe([() => ({ KeyId }), getById({}), isInstanceDisabled]),
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
            tap(endpoint().updateKeyDescription),
          ])
        ),
        // Update policy
        tap.if(
          or([
            () => get("liveDiff.updated.Policy")(diff),
            () => get("liveDiff.deleted.Policy")(diff),
          ]),
          pipe([putKeyPolicy({ endpoint, payload })])
        ),
        tap(() => {
          logger.info(`key updated: ${name}`);
        }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#deleteMyResource-property
  destroy: {
    postDestroy: ({ endpoint }) =>
      pipe([
        fork({
          deleteAlias: when(
            get("Alias"),
            pipe([
              ({ Alias }) => ({ AliasName: Alias }),
              endpoint().deleteAlias,
            ])
          ),
          scheduleKeyDeletion: pipe([
            pickId,
            defaultsDeep({ PendingWindowInDays: 7 }),
            endpoint().scheduleKeyDeletion,
          ]),
        }),
      ]),
    pickId,
    method: "disableKey",
    isInstanceDown,
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource,
    untagResource,
  }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({
          config,
          namespace,
          name,
          UserTags: Tags,
        }),
      }),
    ])(),
});
