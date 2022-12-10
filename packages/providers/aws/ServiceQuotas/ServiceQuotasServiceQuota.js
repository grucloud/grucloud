const assert = require("assert");
const { pipe, tap, get, pick, map, assign } = require("rubico");
const { defaultsDeep, callProp, last } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./ServiceQuotasCommon");

const buildArn = () =>
  pipe([
    get("QuotaArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ QuotaCode, ServiceCode }) => {
    assert(QuotaCode);
    assert(ServiceCode);
  }),
  pick(["QuotaCode", "ServiceCode"]),
]);

const assignTags = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ endpoint, config }),
  ]);

const filterPayload = pipe([
  pick(["QuotaCode", "ServiceCode", "Value"]),
  ({ Value, ...other }) => ({ ...other, DesiredValue: Value }),
  tap((params) => {
    assert(true);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceQuotas.html
exports.ServiceQuotasServiceQuota = ({ compare }) => ({
  type: "ServiceQuota",
  package: "service-quotas",
  client: "ServiceQuotas",
  region: "us-east-1",
  propertiesDefault: {},
  managedByOther: () => () => true,
  cannotBeDeleted: () => () => true,
  omitProperties: [
    "QuotaArn",
    "Adjustable",
    "GlobalQuota",
    "ServiceName",
    "RequestedQuotas",
  ],
  inferName: () =>
    pipe([
      get("QuotaName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("QuotaName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("QuotaArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  compare: compare({
    filterLive: () =>
      pipe([
        assign({
          Value: pipe([get("RequestedQuotas"), last, get("DesiredValue")]),
        }),
      ]),
  }),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceQuotas.html#listServiceQuotas-property
  getList:
    ({ endpoint, resources }) =>
    ({ resources }) =>
      pipe([
        tap((params) => {
          assert(resources);
        }),
        () => resources,
        map(
          pipe([
            callProp("properties", {}),
            endpoint().getServiceQuota,
            get("Quota"),
            assign({
              RequestedQuotas: pipe([
                endpoint().listRequestedServiceQuotaChangeHistoryByQuota,
                get("RequestedQuotas"),
              ]),
            }),
          ])
        ),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceQuotas.html#createServiceQuota-property
  create: {
    filterPayload,
    method: "requestServiceQuotaIncrease",
    pickCreated: ({ payload }) => pipe([get("RequestedQuota")]),
    isInstanceUp: () => true,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceQuotas.html#updateServiceQuota-property
  update: {
    method: "requestServiceQuotaIncrease",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
    isInstanceUp: () => true,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        //TODO
        // Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
