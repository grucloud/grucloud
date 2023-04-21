const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  flatMap,
  map,
  not,
  filter,
  switchCase,
  tryCatch,
  fork,
} = require("rubico");
const { defaultsDeep, isEmpty, identity, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./VpcLatticeCommon");

const toAccessLogSubscriptionId = pipe([
  tap(({ id, resourceId }) => {
    assert(id);
    assert(resourceId);
  }),
  ({ id, resourceId, ...other }) => ({
    accessLogSubscriptionIdentifier: id,
    resourceIdentifier: resourceId,
    ...other,
  }),
]);

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ accessLogSubscriptionIdentifier }) => {
    assert(accessLogSubscriptionIdentifier);
  }),
  pick(["accessLogSubscriptionIdentifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toAccessLogSubscriptionId,
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html
exports.VpcLatticeAccessLogSubscription = () => ({
  type: "AccessLogSubscription",
  package: "vpc-lattice",
  client: "VPCLattice",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "createdAt",
    "destinationArn",
    "lastUpdatedAt",
    "resourceArn",
    "resourceId",
  ],
  inferName:
    ({ dependenciesSpec: { service, serviceNetwork } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(service || serviceNetwork);
        }),
        () => service || serviceNetwork,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("resourceArn"),
        tap((resourceArn) => {
          assert(resourceArn);
        }),
        fork({
          service: pipe([
            lives.getById({
              type: "Service",
              group: "VpcLattice",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
          serviceNetwork: pipe([
            lives.getById({
              type: "ServiceNetwork",
              group: "VpcLattice",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
        }),
        tap(({ service, serviceNetwork }) => {
          assert(service || serviceNetwork);
        }),
        ({ service, serviceNetwork }) => service || serviceNetwork,
      ])(),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    service: {
      type: "Service",
      group: "VpcLattice",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("resourceArn")]),
    },
    serviceNetwork: {
      type: "ServiceNetwork",
      group: "VpcLattice",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("resourceArn")]),
    },
    cloudWatchLogGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) => get("destinationArn"),
    },
    firehoseDeliveryStream: {
      type: "DeliveryStream",
      group: "Firehose",
      dependencyId: ({ lives, config }) => pipe([get("destinationArn")]),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([get("destinationArn"), callProp("replace", "s3://", "")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#getAccessLogSubscription-property
  getById: {
    method: "getAccessLogSubscription",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#listAccessLogSubscriptions-property
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
        tap((params) => {
          assert(config);
        }),
        () => ["Service", "ServiceNetwork"],
        flatMap(
          tryCatch(
            (type) =>
              pipe([
                lives.getByType({
                  type,
                  group: "VpcLattice",
                  providerName: config.providerName,
                }),
                map(
                  pipe([
                    tap((params) => {
                      assert(true);
                    }),
                    get("id"),
                    (resourceIdentifier) => ({ resourceIdentifier }),
                    endpoint().listAccessLogSubscriptions,
                    get("items"),
                    tap((params) => {
                      assert(true);
                    }),
                  ])
                ),
                tap((params) => {
                  assert(true);
                }),
              ])(),
            (error) =>
              pipe([
                tap((params) => {
                  assert(error);
                }),
                () => undefined,
              ])()
          )
        ),
        tap((params) => {
          assert(true);
        }),
        filter(not(isEmpty)),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#createAccessLogSubscription-property
  create: {
    method: "createAccessLogSubscription",
    pickCreated: ({ payload }) => pipe([toAccessLogSubscriptionId]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#updateAccessLogSubscription-property
  update: {
    method: "updateAccessLogSubscription",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        toAccessLogSubscriptionId,
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#deleteAccessLogSubscription-property
  destroy: {
    method: "deleteAccessLogSubscription",
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
    properties: { tags, ...otherProps },
    dependencies: {
      service,
      serviceNetwork,
      cloudWatchLogGroup,
      firehoseDeliveryStream,
      s3Bucket,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      switchCase([
        () => service,
        defaultsDeep({
          resourceIdentifier: getField(service, "serviceIdentifier"),
        }),
        () => serviceNetwork,
        defaultsDeep({
          resourceIdentifier: getField(
            serviceNetwork,
            "serviceNetworkIdentifier"
          ),
        }),
        () => {
          assert(false, "missing service or serviceNetwork dependency");
        },
      ]),
      switchCase([
        () => cloudWatchLogGroup,
        defaultsDeep({
          destinationArn: getField(cloudWatchLogGroup, "arn"),
        }),
        () => firehoseDeliveryStream,
        defaultsDeep({
          destinationArn: getField(
            firehoseDeliveryStream,
            "DeliveryStreamName"
          ),
        }),
        //TODO
        () => s3Bucket,
        defaultsDeep({
          destinationArn: getField(s3Bucket, "id"),
        }),
        () => {
          assert(
            false,
            "missing cloudWatchLogGroup, firehoseDeliveryStream or s3Bucket dependency"
          );
        },
      ]),
    ])(),
});
