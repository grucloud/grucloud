const assert = require("assert");
const {
  pipe,
  tap,
  get,
  flatMap,
  map,
  fork,
  filter,
  not,
  pick,
} = require("rubico");
const { defaultsDeep, first, unless, isEmpty } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pick(["VpcId", "InternetGatewayId"]);

const findId = () =>
  pipe([
    unless(
      isEmpty,
      ({ VpcId, InternetGatewayId }) =>
        `ig-attach::${InternetGatewayId}::${VpcId}`
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2InternetGatewayAttachment = () => ({
  type: "InternetGatewayAttachment",
  package: "ec2",
  client: "EC2",
  omitProperties: ["VpcId", "InternetGatewayId"],
  inferName: ({ dependenciesSpec: { vpc, internetGateway } }) =>
    pipe([
      tap((params) => {
        assert(vpc);
        assert(internetGateway);
      }),
      () => `ig-attach::${internetGateway}::${vpc}`,
    ]),
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("VpcId"),
    },
    internetGateway: {
      type: "InternetGateway",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("InternetGatewayId"),
    },
  },
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        fork({
          vpc: pipe([
            () => live,
            get("VpcId"),
            lives.getById({
              type: "Vpc",
              group: "EC2",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
          internetGateway: pipe([
            () => live,
            get("InternetGatewayId"),
            lives.getById({
              type: "InternetGateway",
              group: "EC2",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
        }),
        tap(({ vpc, internetGateway }) => {
          assert(vpc);
          assert(internetGateway);
        }),
        ({ vpc, internetGateway }) => `ig-attach::${internetGateway}::${vpc}`,
      ])(),
  findId,
  pickId,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTransitGatewayAttachments-property
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
        lives.getByType({
          providerName: config.providerName,
          type: "InternetGateway",
          group: "EC2",
        }),
        filter(not(get("isDefault"))),
        flatMap(
          pipe([
            get("live"),
            ({ InternetGatewayId, Attachments = [] }) =>
              pipe([
                () => Attachments,
                map(({ VpcId }) => ({ VpcId, InternetGatewayId })),
              ])(),
          ])
        ),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#attachInternetGateway-property
  create: { method: "attachInternetGateway" },
  destroy: {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#detachInternetGateway-property
    method: "detachInternetGateway",
    pickId,
    ignoreErrorCodes: ["InvalidInternetGatewayID.NotFound"],
    shouldRetryOnExceptionCodes: ["DependencyViolation"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInternetGateways-property
  getByName:
    ({ getById, endpoint }) =>
    ({ resolvedDependencies: { vpc, internetGateway } }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
          assert(vpc);
          assert(internetGateway);
        }),
        () => ({
          InternetGatewayIds: [internetGateway.live.InternetGatewayId],
          Filters: [
            {
              Name: "attachment.vpc-id",
              Values: [vpc.live.VpcId],
            },
          ],
        }),
        endpoint().describeInternetGateways,
        get("InternetGateways"),
        first,
        unless(isEmpty, ({ InternetGatewayId, Attachments }) =>
          pipe([
            () => Attachments,
            first,
            get("VpcId"),
            unless(isEmpty, (VpcId) => ({ InternetGatewayId, VpcId })),
          ])()
        ),
      ])(),
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { vpc, internetGateway },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(vpc);
        assert(internetGateway);
      }),
      () => properties,
      defaultsDeep({
        VpcId: getField(vpc, "VpcId"),
        InternetGatewayId: getField(internetGateway, "InternetGatewayId"),
      }),
    ])(),
});
