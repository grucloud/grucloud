const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const managedByOther = () => pipe([eq(get("Type"), "NONE")]);

const pickId = pipe([
  tap((param) => {
    assert(true);
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const isInstanceUp = pipe([eq(get("Status"), "ACTIVE")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html
exports.XRayEncryptionConfig = () => ({
  type: "EncryptionConfig",
  package: "xray",
  client: "XRay",
  propertiesDefault: {},
  omitProperties: ["KeyId", "Status"],
  inferName: () => pipe([() => "default"]),
  findName: () => pipe([() => "default"]),
  findId: () => pipe([() => "default"]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  managedByOther,
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) => pipe([get("KeyId")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#getGroup-property
  getById: {
    method: "getEncryptionConfig",
    getField: "EncryptionConfig",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#listGroups-property
  getList: {
    method: "getEncryptionConfig",
    getParam: "EncryptionConfig",
    decorate,
  },
  // No Create
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#putEncryptionConfig-property
  update: {
    method: "putEncryptionConfig",
    isInstanceUp,
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        tap((params) => {
          assert(true);
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#putEncryptionConfig-property
  destroy: {
    method: "putEncryptionConfig",
    pickId: pipe([() => ({ Type: "NONE" })]),
    isInstanceDown: isInstanceUp,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      when(
        () => kmsKey,
        defaultsDeep({
          KeyId: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
