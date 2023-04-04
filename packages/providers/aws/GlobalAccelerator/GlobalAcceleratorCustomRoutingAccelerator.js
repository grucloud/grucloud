const assert = require("assert");
const { pipe, tap, get, pick, eq, or, assign } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { retryCall } = require("@grucloud/core/Retry");

const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./GlobalAcceleratorCommon");

const pickId = pick(["AcceleratorArn"]);

const buildArn = () =>
  pipe([
    get("AcceleratorArn"),
    tap((AcceleratorArn) => {
      assert(AcceleratorArn);
    }),
  ]);

const decorate =
  ({ endpoint, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(live.AcceleratorArn);
      }),
      () => live,
      pickId,
      endpoint().describeCustomRoutingAcceleratorAttributes,
      pick(["AcceleratorAttributes"]),
      defaultsDeep(live),
      assignTags({ buildArn: buildArn({ config }), endpoint }),
    ])();

const updateAcceleratorAttributes = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live.AcceleratorArn);
    }),
    get("AcceleratorAttributes"),
    defaultsDeep({ AcceleratorArn: live.AcceleratorArn }),
    endpoint().updateCustomRoutingAcceleratorAttributes,
  ]);

exports.GlobalAcceleratorCustomRoutingAccelerator = () => ({
  type: "CustomRoutingAccelerator",
  package: "global-accelerator",
  client: "GlobalAccelerator",
  region: "us-west-2",
  ignoreErrorCodes: ["AcceleratorNotFoundException"],
  inferName: pipe([
    get("Name"),
    tap((Name) => {
      assert(Name);
    }),
  ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findId: () =>
    pipe([
      get("AcceleratorArn"),
      tap((AcceleratorArn) => {
        assert(AcceleratorArn);
      }),
    ]),
  propertiesDefault: { Enabled: true, IpAddressType: "IPV4" },
  omitProperties: [
    "AcceleratorArn",
    "DnsName",
    "Status",
    "CreatedTime",
    "LastModifiedTime",
    "DualStackDnsName",
    "Events",
    "IpSets",
  ],
  dependencies: {
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        get("AcceleratorAttributes.FlowLogsS3Bucket"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#describeCustomRoutingAccelerator-property
  getById: {
    method: "describeCustomRoutingAccelerator",
    getField: "Accelerator",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#listCustomRoutingAccelerators-property
  getList: {
    method: "listCustomRoutingAccelerators",
    getParam: "Accelerators",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#createCustomRoutingAccelerator-property
  create: {
    method: "createCustomRoutingAccelerator",
    pickCreated: ({ payload }) => pipe([get("Accelerator")]),
    isInstanceUp: pipe([eq(get("Status"), "DEPLOYED")]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          tap.if(
            get("AcceleratorAttributes.FlowLogsS3Bucket"),
            pipe([updateAcceleratorAttributes({ endpoint, live })])
          ),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#deleteCustomRoutingAccelerator-property
  destroy: {
    method: "deleteCustomRoutingAccelerator",
    pickId,
    preDestroy: ({ endpoint, getById }) =>
      tap((live) =>
        pipe([
          () => ({
            AcceleratorArn: live.AcceleratorArn,
            Enabled: false,
          }),
          endpoint().updateCustomRoutingAccelerator,
          () =>
            retryCall({
              name: `describeCustomRoutingAccelerator`,
              fn: pipe([() => live, getById]),
              isExpectedResult: eq(get("Status"), "DEPLOYED"),
            }),
        ])()
      ),
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#updateCustomRoutingAccelerator-property
  // TODO
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#updateCustomRoutingAcceleratorAttributes-property
  update:
    ({ endpoint }) =>
    async ({ pickId, payload, diff, live }) =>
      pipe([
        () => diff,
        get("liveDiff.updated"),
        tap.if(
          or([callProp("hasOwnProperty", "Enabled"), get("IpAddressType")]),
          pipe([
            () => payload,
            pick(["Enabled", "IpAddressType"]),
            defaultsDeep({ AcceleratorArn: live.AcceleratorArn }),
            endpoint().updateCustomRoutingAccelerator,
          ])
        ),
        tap.if(
          get("AcceleratorAttributes"),
          pipe([() => payload, updateAcceleratorAttributes({ endpoint, live })])
        ),
      ])(),
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
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
    ])(),
});
