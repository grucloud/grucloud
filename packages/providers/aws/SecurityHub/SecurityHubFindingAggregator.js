const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { ignoreErrorCodes } = require("./SecurityHubCommon");

const pickId = pipe([
  tap(({ FindingAggregatorArn }) => {
    assert(FindingAggregatorArn);
  }),
  pick(["FindingAggregatorArn"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const extractName = pipe([
  ({ RegionLinkingMode, Regions = [] }) =>
    `${RegionLinkingMode}::${Regions.join(",")}`,
  tap((Name) => {
    assert(Name);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html
exports.SecurityHubFindingAggregator = () => ({
  type: "FindingAggregator",
  package: "securityhub",
  client: "SecurityHub",
  propertiesDefault: {},
  omitProperties: ["FindingAggregatorArn"],
  inferName: pipe([
    get("properties"),
    extractName,
    tap((Name) => {
      assert(Name);
    }),
  ]),
  findName: pipe([
    get("live"),
    extractName,
    tap((name) => {
      assert(name);
    }),
  ]),
  findId: pipe([
    get("live"),
    get("FindingAggregatorArn"),
    tap((id) => {
      assert(id);
    }),
  ]),
  dependencies: {
    securityHubAccount: {
      type: "Account",
      group: "SecurityHub",
      dependencyId: ({ lives, config }) => pipe([() => "default"]),
    },
  },
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#getFindingAggregator-property
  getById: {
    method: "getFindingAggregator",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#listFindingAggregators-property
  getList: {
    method: "listFindingAggregators",
    getParam: "FindingAggregators",
    decorate: ({ getById }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#createFindingAggregator-property
  create: {
    method: "createFindingAggregator",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#updateFindingAggregator-property
  update: {
    method: "updateFindingAggregator",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([
        //
        () => payload,
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#deleteFindingAggregator-property
  destroy: {
    method: "deleteFindingAggregator",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
