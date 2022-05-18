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

const { createAwsResource } = require("../AwsClient");

const pickId = pick(["VpcId", "InternetGatewayId"]);

// TODO isDefault
const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#attachInternetGateway-property
  create: { method: "attachInternetGateway" },
  destroy: {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#detachInternetGateway-property
    method: "detachInternetGateway",
    ignoreErrorCodes: ["InvalidInternetGatewayID.NotFound"],
    shouldRetryOnExceptionCodes: ["DependencyViolation"],
  },
});

const findId = pipe([
  get("live"),
  unless(
    isEmpty,
    ({ VpcId, InternetGatewayId }) =>
      `ig-attach::${InternetGatewayId}::${VpcId}`
  ),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2InternetGatewayAttachment = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findDependencies: ({ live }) => [
      {
        type: "Vpc",
        group: "EC2",
        ids: [live.VpcId],
      },
      {
        type: "InternetGateway",
        group: "EC2",
        ids: [live.InternetGatewayId],
      },
    ],
    findName: ({ live, lives }) =>
      pipe([
        fork({
          vpc: pipe([
            () =>
              lives.getById({
                id: live.VpcId,
                type: "Vpc",
                group: "EC2",
                providerName: config.providerName,
              }),
            get("name"),
          ]),
          internetGateway: pipe([
            () =>
              lives.getById({
                id: live.InternetGatewayId,
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
      ({ lives }) =>
        pipe([
          () =>
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
