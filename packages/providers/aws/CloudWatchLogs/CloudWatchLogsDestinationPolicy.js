const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { assignPolicyAccountAndRegion } = require("../IAM/IAMCommon");

const decorate = ({ endpoint, config }) =>
  pipe([
    pick(["destinationName", "accessPolicy"]),
    when(
      get("accessPolicy"),
      assign({
        accessPolicy: pipe([get("accessPolicy"), JSON.parse]),
      })
    ),
  ]);

const filterPayload = pipe([
  when(
    get("accessPolicy"),
    assign({
      accessPolicy: pipe([get("accessPolicy"), JSON.stringify]),
    })
  ),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html
exports.CloudWatchLogsDestinationPolicy = () => ({
  type: "DestinationPolicy",
  package: "cloudwatch-logs",
  client: "CloudWatchLogs",
  propertiesDefault: {},
  omitProperties: [],
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
      get("destinationName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  cannotBeDeleted: () => () => true,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    cloudWatchLogsDestination: {
      type: "Destination",
      group: "CloudWatchLogs",
      parent: true,
      pathId: "destinationName",
      dependencyId: () =>
        pipe([
          get("destinationName"),
          tap((destinationName) => {
            assert(destinationName);
          }),
        ]),
    },
  },
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      when(
        get("accessPolicy"),
        assign({
          accessPolicy: pipe([
            get("accessPolicy"),
            assignPolicyAccountAndRegion({ providerConfig, lives }),
          ]),
        })
      ),
    ]),
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
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Destination", group: "CloudWatchLogs" },
          pickKey: pipe([
            pick(["destinationName"]),
            tap(({ destinationName }) => {
              assert(destinationName);
            }),
          ]),
          config,
          decorate: ({ parent }) => pipe([decorate({ endpoint, config })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putDestinationPolicy-property
  create: {
    filterPayload,
    method: "putDestinationPolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putDestinationPolicy-property
  update: {
    method: "putDestinationPolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#deleteDestination-property
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { destination },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(destination);
      }),
      () => otherProps,
      defaultsDeep({
        destinationName: getField(destination, "destinationName"),
      }),
    ])(),
});
