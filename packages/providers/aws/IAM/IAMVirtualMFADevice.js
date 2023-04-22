const assert = require("assert");
const { pipe, tap, get, pick, eq, assign } = require("rubico");
const { defaultsDeep, last, find, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { tagResourceIam, untagResourceIam } = require("./AwsIamCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#tagMFADevice-property
const tagResource = tagResourceIam({
  field: "SerialNumber",
  method: "tagMFADevice",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagMFADevice-property
const untagResource = untagResourceIam({
  field: "SerialNumber",
  method: "untagMFADevice",
});

const pickId = pipe([
  tap(({ SerialNumber }) => {
    assert(SerialNumber);
  }),
  pick(["SerialNumber"]),
]);

const serialNumberToName = pipe([callProp("split", "mfa/"), last]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      VirtualMFADeviceName: pipe([get("SerialNumber"), serialNumberToName]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.IAMVirtualMFADevice = () => ({
  type: "VirtualMFADevice",
  package: "iam",
  client: "IAM",
  propertiesDefault: {},
  omitProperties: ["Base32StringSeed", "QRCodePNG", "User"],
  inferName: () =>
    pipe([
      get("VirtualMFADeviceName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("VirtualMFADeviceName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("SerialNumber"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NoSuchEntityException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#getVirtualMFADevice-property
  getById: {
    method: "listVirtualMFADevices",
    pickId,
    decorate: ({ live }) =>
      pipe([
        tap((params) => {
          assert(live.SerialNumber);
        }),
        get("VirtualMFADevices"),
        find(eq(get("SerialNumber"), live.SerialNumber)),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listVirtualMFADevices-property
  getList: {
    method: "listVirtualMFADevices",
    getParam: "VirtualMFADevices",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createVirtualMFADevice-property
  create: {
    method: "createVirtualMFADevice",
    pickCreated: ({ payload }) => pipe([get("VirtualMFADevice")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteVirtualMFADevice-property
  destroy: {
    // deactivateMFADevice
    method: "deleteVirtualMFADevice",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource,
    untagResource,
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
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
