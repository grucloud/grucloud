const assert = require("assert");
const { pipe, tap, get, pick, switchCase, omit } = require("rubico");
const { defaultsDeep, isIn, first, callProp, unless } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./Route53ResolverCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const toResolverQueryLogConfigId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  ({ Id, ...other }) => ({
    ResolverQueryLogConfigId: Id,
    ...other,
  }),
]);

const pickId = pipe([
  tap(({ ResolverQueryLogConfigId }) => {
    assert(ResolverQueryLogConfigId);
  }),
  pick(["ResolverQueryLogConfigId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toResolverQueryLogConfigId,
    assignTags({ endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverQueryLogConfig = () => ({
  type: "QueryLogConfig",
  package: "route53resolver",
  client: "Route53Resolver",
  propertiesDefault: {},
  omitProperties: [
    "ResolverQueryLogConfigId",
    "OwnerId",
    "Status",
    "ShareStatus",
    "AssociationCount",
    "Arn",
    "CreatorRequestId",
    "CreationTime",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ResolverQueryLogConfigId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      unless(
        pipe([get("DestinationArn"), callProp("startsWith", "arn:aws:s3:::")]),
        omit(["DestinationArn"])
      ),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    cloudWatchLogGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) => get("DestinationArn"),
    },
    firehoseDeliveryStream: {
      type: "DeliveryStream",
      group: "Firehose",
      dependencyId: ({ lives, config }) => pipe([get("DestinationArn")]),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          // arn:aws:s3:::gc-dns-query-config/my-prefix => gc-dns-query-config
          get("DestinationArn", ""),
          callProp("replace", "arn:aws:s3:::", ""),
          callProp("split", "/"),
          first,
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#getResolverQueryLogConfig-property
  getById: {
    method: "getResolverQueryLogConfig",
    getField: "ResolverQueryLogConfig",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listResolverQueryLogConfigs-property
  getList: {
    method: "listResolverQueryLogConfigs",
    getParam: "ResolverQueryLogConfigs",
    decorate: ({ getById }) => pipe([toResolverQueryLogConfigId, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#createResolverQueryLogConfig-property
  create: {
    method: "createResolverQueryLogConfig",
    pickCreated: ({ payload }) =>
      pipe([get("ResolverQueryLogConfig"), toResolverQueryLogConfigId]),
    isInstanceUp: pipe([get("Status"), isIn(["CREATED"])]),
    isInstanceError: pipe([get("Status"), isIn(["FAILED"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#updateQueryLogConfig-property
  // No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#deleteResolverQueryLogConfig-property
  destroy: {
    method: "deleteResolverQueryLogConfig",
    pickId,
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
    dependencies: { cloudWatchLogGroup, firehoseDeliveryStream, s3Bucket },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      switchCase([
        () => cloudWatchLogGroup,
        defaultsDeep({
          DestinationArn: getField(cloudWatchLogGroup, "arn"),
        }),
        () => firehoseDeliveryStream,
        defaultsDeep({
          DestinationArn: getField(firehoseDeliveryStream, "DeliveryStreamARN"),
        }),
        () => s3Bucket,
        defaultsDeep({}),
        () => {
          assert(
            false,
            "missing cloudWatchLogGroup, firehoseDeliveryStream or s3Bucket dependency"
          );
        },
      ]),
    ])(),
});
