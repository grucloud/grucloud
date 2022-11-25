const assert = require("assert");
const { pipe, tap, get, tryCatch, pick, map, filter, not } = require("rubico");
const { isEmpty } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  pick(["AccountId", "AlternateContactType"]),
  tap(({ AlternateContactType }) => {
    assert(AlternateContactType);
  }),
]);

exports.AccountAlternateAccount = () => ({
  type: "AlternateAccount",
  package: "account",
  client: "Account",
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  propertiesDefault: {},
  omitProperties: [],
  inferName: () => pipe([get("AlternateContactType")]),
  findName: () => pipe([get("AlternateContactType")]),
  findId: () => pipe([get("AlternateContactType")]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Account.html#getAlternateContact-property
  getById: {
    pickId,
    method: "getAlternateContact",
    getField: "AlternateContact",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AccessAnalyzer.html#putAlternateContact-property
  create: {
    method: "putAlternateContact",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AccessAnalyzer.html#putAlternateContact-property
  update: {
    method: "putAlternateContact",
    filterParams: ({ payload }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AccessAnalyzer.html#deleteAlternateContact-property
  destroy: {
    method: "deleteAlternateContact",
    pickId,
  },
  getList: ({ endpoint }) =>
    pipe([
      () => ["BILLING", "OPERATIONS", "SECURITY"],
      map(
        tryCatch(
          pipe([
            (AlternateContactType) => ({
              AlternateContactType,
            }),
            endpoint().getAlternateContact,
            get("AlternateContact"),
          ]),
          // TODO throw if not  "ResourceNotFoundException" or "AccessDeniedException",
          (error) =>
            pipe([
              tap((params) => {
                assert(error);
              }),
              () => undefined,
            ])()
        )
      ),
      filter(not(isEmpty)),
    ]),
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
  }) => pipe([() => otherProps])(),
});
