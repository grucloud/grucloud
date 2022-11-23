const assert = require("assert");
const { pipe, tap, get, tryCatch, switchCase } = require("rubico");
const { defaultsDeep, when, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([() => "default"]);

const isStandardsEnabled = ({ endpoint }) =>
  pipe([
    tryCatch(
      pipe([
        () => ({}),
        endpoint().getEnabledStandards,
        () => ({
          Enable: true,
        }),
      ]),
      (error) =>
        pipe([
          tap((params) => {
            assert(error);
          }),
          () => undefined,
        ])()
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html
exports.SecurityHubAccount = () => ({
  type: "Account",
  package: "securityhub",
  client: "SecurityHub",
  propertiesDefault: { Enable: true },
  omitProperties: [],
  inferName: () => pipe([() => "default"]),
  findName: () => pipe([() => "default"]),
  findId: () => pipe([() => "default"]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById:
    ({ endpoint }) =>
    () =>
      pipe([isStandardsEnabled({ endpoint })]),
  getList: ({ endpoint }) =>
    pipe([
      isStandardsEnabled({ endpoint }),
      switchCase([isEmpty, () => [], (result) => [result]]),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#createAccount-property
  create: {
    method: "enableSecurityHub",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#updateAccount-property
  update: {
    method: "enableSecurityHub",
    filterParams: ({ pickId, payload, diff, live }) => pipe([() => payload])(),
  },
  // Custom update
  // update:
  //   ({ endpoint, getById }) =>
  //   async ({ payload, live, diff }) =>
  //     pipe([
  //       () => diff,
  //       tap.if(
  //         or([get("liveDiff.deleted.resourceTypes")]),
  //         pipe([
  //           () => payload.resourceTypes,
  //           differenceWith(isDeepEqual, resourceTypesAll),
  //           (resourceTypes) => ({
  //             accountIds: payload.accountIds,
  //             resourceTypes,
  //           }),
  //           endpoint().disable,
  //         ])
  //       ),
  //       tap.if(
  //         or([get("liveDiff.added.resourceTypes")]),
  //         pipe([() => payload, endpoint().enable])
  //       ),
  //     ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#deleteAccount-property
  destroy: {
    method: "disableSecurityHub",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
