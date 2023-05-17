const assert = require("assert");
const { pipe, tap, get, pick, map, eq, set } = require("rubico");
const { defaultsDeep, first, find, size } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live);
      assert(live.Id);
    }),
    defaultsDeep({ Id: live.Id }),
  ]);

const findName = ({ lives, config }) =>
  pipe([
    get("ContinuousDeploymentPolicyConfig.StagingDistributionDnsNames.Items"),
    first,
    tap((name) => {
      assert(name);
    }),
    (DomainName) =>
      pipe([
        lives.getByType({
          type: "Distribution",
          group: "CloudFront",
          providerName: config.providerName,
        }),
        find(eq(get("live.DomainName"), DomainName)),
        get("name"),
      ])(),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontContinuousDeploymentPolicy = ({ compare }) => ({
  type: "ContinuousDeploymentPolicy",
  package: "cloudfront",
  client: "CloudFront",
  inferName:
    ({ dependenciesSpec: { distributions } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(distributions);
        }),
        () => distributions,
        first,
      ])(),
  findName,
  findId: () =>
    pipe([
      get("Id"),
      tap((Id) => {
        assert(Id);
      }),
    ]),
  ignoreErrorCodes: [
    "NoSuchContinuousDeploymentPolicy",
    "InvalidIfMatchVersion",
  ],
  omitProperties: [
    "Id",
    "ETag",
    "LastModifiedTime",
    "ContinuousDeploymentPolicyConfig.StagingDistributionDnsNames",
  ],
  compare: compare({}),
  dependencies: {
    distributions: {
      type: "Distribution",
      group: "CloudFront",
      list: true,
      parent: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get(
            "ContinuousDeploymentPolicyConfig.StagingDistributionDnsNames.Items"
          ),
          map((DomainName) =>
            pipe([
              lives.getByType({
                type: "Distribution",
                group: "CloudFront",
                providerName: config.providerName,
              }),
              find(eq(get("live.DomainName"), DomainName)),
              get("id"),
            ])()
          ),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getContinuousDeploymentPolicyConfig-property
  getById: {
    method: "getContinuousDeploymentPolicyConfig",
    decorate,
    pickId: pipe([
      tap(({ Id }) => {
        assert(Id);
      }),
      pick(["Id"]),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#listContinuousDeploymentPolicies-property
  getList: {
    method: "listContinuousDeploymentPolicies",
    getParam: "ContinuousDeploymentPolicyList.Items",
    decorate: ({ getById }) =>
      pipe([get("ContinuousDeploymentPolicy"), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createContinuousDeploymentPolicy-property
  create: {
    method: "createContinuousDeploymentPolicy",
    pickCreated: ({ payload }) => pipe([get("ContinuousDeploymentPolicy")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#updateCloudFrontContinuousDeploymentPolicy-property
  update: {
    method: "updateContinuousDeploymentPolicy",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        tap(() => {
          assert(live.Id);
          assert(live.ETag);
        }),
        defaultsDeep({ Id: live.Id, IfMatch: live.ETag }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteContinuousDeploymentPolicy-property
  destroy: {
    method: "deleteContinuousDeploymentPolicy",
    pickId: pipe([
      tap(({ Id, ETag }) => {
        assert(Id);
        assert(ETag);
      }),
      ({ Id, ETag }) => ({ Id, IfMatch: ETag }),
    ]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    dependencies: { distributions = [] },
    properties,
  }) =>
    pipe([
      () => properties,
      set(
        "ContinuousDeploymentPolicyConfig.StagingDistributionDnsNames.Items",
        pipe([
          () => distributions,
          map((distribution) => getField(distribution, "DomainName")),
        ])
      ),
      set(
        "ContinuousDeploymentPolicyConfig.StagingDistributionDnsNames.Quantity",
        pipe([() => distributions, size])
      ),
    ])(),
});
