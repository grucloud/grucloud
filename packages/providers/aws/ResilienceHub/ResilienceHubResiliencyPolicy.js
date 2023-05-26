const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./ResilienceHubCommon");

const buildArn = () =>
  pipe([
    get("policyArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ policyArn }) => {
    assert(policyArn);
  }),
  pick(["policyArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Resiliencehub.html
exports.ResilienceHubResiliencyPolicy = () => ({
  type: "ResiliencyPolicy",
  package: "resiliencehub",
  client: "Resiliencehub",
  propertiesDefault: {},
  omitProperties: ["policyArn", "creationTime"],
  inferName: () =>
    pipe([
      get("policyName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("policyName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("policyArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Resiliencehub.html#describeResiliencyPolicy-property
  getById: {
    method: "describeResiliencyPolicy",
    getField: "policy",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Resiliencehub.html#listResiliencyPolicies-property
  getList: {
    method: "listResiliencyPolicies",
    getParam: "resiliencyPolicies",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Resiliencehub.html#createResiliencyPolicy-property
  create: {
    method: "createResiliencyPolicy",
    pickCreated: ({ payload }) => pipe([get("policy")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Resiliencehub.html#updateResiliencyPolicy-property
  update: {
    method: "updateResiliencyPolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Resiliencehub.html#deleteResiliencyPolicy-property
  destroy: {
    method: "deleteResiliencyPolicy",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
