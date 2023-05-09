const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, identity, callProp, last } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const {
  tagResourceIam,
  untagResourceIam,
  ignoreErrorCodes,
} = require("./AwsIamCommon");

const toSAMLProviderArn = pipe([
  tap(({ Arn }) => {
    assert(Arn);
  }),
  ({ Arn, ...other }) => ({
    SAMLProviderArn: Arn,
    ...other,
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#tagUser-property
const tagResource = tagResourceIam({
  field: "SAMLProviderArn",
  method: "tagSAMLProvider",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagUser-property
const untagResource = untagResourceIam({
  field: "SAMLProviderArn",
  method: "untagSAMLProvider",
});

const pickId = pipe([
  tap(({ SAMLProviderArn }) => {
    assert(SAMLProviderArn);
  }),
  pick(["SAMLProviderArn"]),
]);

const arnToId = pipe([callProp("split", `/`), last]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live.SAMLProviderArn);
    }),
    defaultsDeep({ SAMLProviderArn: live.SAMLProviderArn }),
    assign({ Name: pipe([get("SAMLProviderArn"), arnToId]) }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.IAMSAMLProvider = () => ({
  type: "SAMLProvider",
  package: "iam",
  client: "IAM",
  propertiesDefault: {},
  omitProperties: ["CreateDate", "ValidUntil"],
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
      get("SAMLProviderArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#getSAMLProvider-property
  getById: {
    method: "getSAMLProvider",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listSAMLProviders-property
  getList: {
    method: "listSAMLProviders",
    getParam: "SAMLProviderList",
    decorate: ({ getById }) => pipe([toSAMLProviderArn, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createSAMLProvider-property
  create: {
    method: "createSAMLProvider",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#updateSAMLProvider-property
  update: {
    method: "updateSAMLProvider",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteSAMLProvider-property
  destroy: {
    method: "deleteSAMLProvider",
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
