const assert = require("assert");
const { pipe, tap, get, tryCatch, pick, map, filter, not } = require("rubico");
const { isEmpty, defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

// TODO all sub account has the same contact information, the admin account receive an exception when invoking getContactInformation/
// // 'User: arn:aws:iam::12345677:root is not authorized to perform: account:GetContactInformation
//  (The management account can only be managed using the standalone context from the management account.)'

// https://docs.aws.amazon.com/accounts/latest/reference/using-orgs-trusted-access.html

// aws organizations enable-aws-service-access --service-principal account.amazonaws.com

const pickId = pipe([
  pick(["AccountId"]),
  tap(({ AccountId }) => {
    assert(AccountId);
  }),
]);

const cannotBeDeleted = () => () => true;
const managedByOther = () => () => true;

exports.AccountContactInformation = () => ({
  type: "ContactInformation",
  package: "account",
  client: "Account",
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  propertiesDefault: {},
  omitProperties: [],
  managedByOther,
  cannotBeDeleted,
  inferName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(true);
      }),
    ]),
  findId: () =>
    pipe([
      get("AccountId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    account: {
      type: "Account",
      group: "Organisations",
      parent: true,
      dependencyId: () =>
        pipe([
          get("AccountId"),
          tap((params) => {
            assert(true);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Account.html#getContactInformation-property
  getById: {
    pickId,
    method: "getContactInformation",
    getField: "ContactInformation",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AccessAnalyzer.html#putContactInformation-property
  create: {
    method: "putContactInformation",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AccessAnalyzer.html#putContactInformation-property
  update: {
    method: "putContactInformation",
    filterParams: ({ payload }) =>
      pipe([
        () => payload,
        tap((params) => {
          assert(true);
        }),
      ])(),
  },
  getList:
    ({ endpoint, config }) =>
    ({ lives }) =>
      pipe([
        lives.getByType({
          type: "Account",
          group: "Organisations",
          providerName: config.providerName,
        }),
        map(
          tryCatch(
            ({ live }) =>
              pipe([
                tap((params) => {
                  assert(config);
                }),
                () => live,
                ({ Id }) => ({
                  AccountId: Id,
                }),
                endpoint().getContactInformation,
                tap((params) => {
                  assert(true);
                }),
                defaultsDeep({ AccountId: live.Id, Name: live.Name }),
              ])(),
            // is not authorized to perform: account:GetContactInformation
            // Your organization must first enable trusted access with AWS Account Management.
            // OR
            // 'User: arn:aws:iam::12345677:root is not authorized to perform: account:GetContactInformation
            //  (The management account can only be managed using the standalone context from the management account.)'
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
        tap((params) => {
          assert(true);
        }),
      ])(),
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
  }) => pipe([() => otherProps])(),
});
