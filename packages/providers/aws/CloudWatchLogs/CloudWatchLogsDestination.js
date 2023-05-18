const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./CloudWatchLogsCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ destinationName }) => {
    assert(destinationName);
  }),
  pick(["destinationName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    // when(
    //   get("accessPolicy"),
    //   assign({
    //     accessPolicy: pipe([get("accessPolicy"), JSON.parse]),
    //   })
    // ),
  ]);

// const filterPayload = pipe([
//   when(
//     get("accessPolicy"),
//     assign({
//       accessPolicy: pipe([get("accessPolicy"), JSON.stringify]),
//     })
//   ),
// ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html
exports.CloudWatchLogsDestination = () => ({
  type: "Destination",
  package: "cloudwatch-logs",
  client: "CloudWatchLogs",
  propertiesDefault: {},
  omitProperties: ["arn", "creationTime", "accessPolicy"],
  inferName: () =>
    pipe([
      get("destinationName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("destinationName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      required: true,
      pathId: "roleArn",
      dependencyId: () =>
        pipe([
          get("roleArn"),
          tap((roleArn) => {
            assert(roleArn);
          }),
        ]),
    },
    kinesisStream: {
      type: "Stream",
      group: "Kinesis",
      pathId: "targetArn",
      required: true,
      dependencyId: () =>
        pipe([
          get("targetArn"),
          tap((targetArn) => {
            assert(targetArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeDestinations-property
  getById: {
    method: "describeDestinations",
    getField: "destinations",
    pickId: pipe([
      tap(({ destinationName }) => {
        assert(destinationName);
      }),
      ({ destinationName }) => ({ DestinationNamePrefix: destinationName }),
    ]),
    // TODO find exact destinationName
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeDestinations-property
  getList: {
    method: "describeDestinations",
    getParam: "destinations",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putDestination-property
  create: {
    method: "putDestination",
    pickCreated: ({ payload }) => pipe([() => payload]),
    // postCreate: ({ endpoint }) =>
    //   pipe([
    //     () => payload,
    //     when(
    //       get("accessPolicy"),
    //       pipe([filterPayload, endpoint().putDestinationPolicy])
    //     ),
    //   ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putDestination-property
  update: {
    method: "putDestination",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#deleteDestination-property
  destroy: {
    method: "deleteDestination",
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
    dependencies: { iamRole, kinesisStream },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(iamRole);
        assert(targetArn);
      }),
      () => otherProps,
      defaultsDeep({
        roleArn: getField(iamRole, "Arn"),
        targetArn: getField(kinesisStream, "StreamARN"),
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
      }),
    ])(),
});
