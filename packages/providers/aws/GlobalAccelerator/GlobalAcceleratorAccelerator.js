const assert = require("assert");
const { pipe, tap, get, pick, eq, or, assign } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { retryCall } = require("@grucloud/core/Retry");

const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./GlobalAcceleratorCommon");

const pickId = pick(["AcceleratorArn"]);

const decorate =
  ({ endpoint }) =>
  (live) =>
    pipe([
      () => live,
      pickId,
      endpoint().describeAcceleratorAttributes,
      pick(["AcceleratorAttributes"]),
      defaultsDeep(live),
      assign({
        Tags: pipe([
          () => ({ ResourceArn: live.AcceleratorArn }),
          endpoint().listTagsForResource,
          get("Tags"),
        ]),
      }),
    ])();

const updateAcceleratorAttributes = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live.AcceleratorArn);
    }),
    get("AcceleratorAttributes"),
    defaultsDeep({ AcceleratorArn: live.AcceleratorArn }),
    endpoint().updateAcceleratorAttributes,
  ]);

const buildArn = () => pipe([get("AcceleratorArn")]);

exports.GlobalAcceleratorAccelerator = () => ({
  type: "Accelerator",
  package: "global-accelerator",
  client: "GlobalAccelerator",
  region: "us-west-2",
  ignoreErrorCodes: ["AcceleratorNotFoundException"],
  inferName: () => get("Name"),
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("AcceleratorArn")]),
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#describeAccelerator-property
  getById: {
    method: "describeAccelerator",
    getField: "Accelerator",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#listAccelerators-property
  getList: {
    method: "listAccelerators",
    getParam: "Accelerators",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#createAccelerator-property
  create: {
    method: "createAccelerator",
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#deleteAccelerator-property
  destroy: {
    method: "deleteAccelerator",
    pickId,
    preDestroy: ({ endpoint, getById }) =>
      tap((live) =>
        pipe([
          () => ({
            AcceleratorArn: live.AcceleratorArn,
            Enabled: false,
          }),
          endpoint().updateAccelerator,
          () =>
            retryCall({
              name: `describeAccelerator`,
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#updateAccelerator-property
  // TODO
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#updateAcceleratorAttributes-property
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
            endpoint().updateAccelerator,
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
          userTags: Tags,
        }),
      }),
    ])(),
});
