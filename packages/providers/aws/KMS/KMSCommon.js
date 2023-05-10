const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  assign,
  tryCatch,
  pick,
  not,
  eq,
  and,
  or,
  fork,
} = require("rubico");
const {
  defaultsDeep,
  find,
  isEmpty,
  first,
  callProp,
  when,
  isIn,
} = require("rubico/x");
const moment = require("moment");
const { retryCall } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({
  prefix: "KmsKey",
});

const { sortStatements } = require("../IAM/IAMCommon");
const { configProviderDefault } = require("@grucloud/core/Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#tagResource-property
exports.tagResource =
  ({ endpoint }) =>
  ({ id, live }) =>
    pipe([
      tap((params) => {
        assert(live.KeyId);
      }),
      map(({ Key, Value }) => ({ TagKey: Key, TagValue: Value })),
      (Tags) => ({ KeyId: live.KeyId, Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#untagResource-property
exports.untagResource =
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live.KeyId);
      }),
      (TagKeys) => ({ KeyId: live.KeyId, TagKeys }),
      endpoint().untagResource,
    ]);

exports.ignoreErrorCodes = ["NotFoundException"];

const cannotBeDeleted = () =>
  or([
    isInstanceDown,
    pipe([get("Alias", ""), callProp("startsWith", "alias/aws/")]),
    pipe([get("Description", ""), callProp("startsWith", "Default ")]),
  ]);
exports.cannotBeDeleted = cannotBeDeleted;

exports.managedByOther = () =>
  pipe([
    or([
      //
      not(get("Enabled")),
      cannotBeDeleted(),
    ]),
  ]);

const pickId = pipe([
  pick(["KeyId"]),
  tap(({ KeyId }) => {
    assert(KeyId);
  }),
]);

exports.pickId = pickId;

exports.findId = () =>
  pipe([
    get("Arn"),
    tap((Arn) => {
      assert(Arn);
    }),
  ]);

exports.pickId = pipe([
  pick(["KeyId"]),
  tap(({ KeyId }) => {
    assert(KeyId);
  }),
]);

const findNameInTags = pipe([
  get("Tags"),
  find(eq(get("Key"), configProviderDefault.nameKey)),
  get("Value"),
  tap((params) => {
    assert(true);
  }),
]);
// TODO Description ?
const findNames = [
  findNameInTags,
  get("Alias"),
  //get("Description"),
  get("KeyId"),
];

exports.findName = () => (live) =>
  pipe([() => findNames, map((fn) => fn(live)), find(not(isEmpty))])();

const isInstanceUp = and([
  eq(get("KeyState"), "Enabled"),
  eq(get("Enabled"), true),
]);

exports.isInstanceUp = isInstanceUp;

const isInstanceDisabled = and([
  eq(get("KeyState"), "Disabled"),
  eq(get("Enabled"), false),
]);
exports.isInstanceDisabled = isInstanceDisabled;
//
const isInstanceDown = pipe([
  get("KeyState"),
  isIn(["PendingDeletion", "PendingReplicaDeletion"]),
]);
exports.isInstanceDown = isInstanceDown;

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

exports.putKeyPolicy = putKeyPolicy;

exports.assignTags = assign({
  Tags: pipe([
    get("Tags", []),
    map(({ Key, Value }) => ({ TagKey: Key, TagValue: Value })),
  ]),
});

exports.update =
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
                fn: pipe([() => ({ KeyId }), getById({}), isInstanceDisabled]),
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
    ])();

exports.omitProperties = [
  "AWSAccountId",
  "KeyId",
  "Arn",
  "Alias",
  "CreationDate",
  "DeletionDate",
  "KeyState",
  "CustomerMasterKeySpec",
  "MultiRegionConfiguration",
  "Origin",
];

exports.getById = {
  pickId,
  method: "describeKey",
  getField: "KeyMetadata",
  decorate,
};
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#listKeys-property
exports.getList = {
  method: "listKeys",
  getParam: "Keys",
  transformListPost: () =>
    pipe([
      callProp("sort", (a, b) =>
        moment(b.CreationDate).isAfter(a.CreationDate) ? 1 : -1
      ),
    ]),
  decorate: ({ getById }) => pipe([getById]),
};

exports.destroy = {
  postDestroy: ({ endpoint }) =>
    pipe([
      fork({
        deleteAlias: when(
          get("Alias"),
          pipe([({ Alias }) => ({ AliasName: Alias }), endpoint().deleteAlias])
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
};
