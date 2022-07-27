const assert = require("assert");
const { pipe, tap, get, pick, assign, omit } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./NetworkFirewallCommon");

const pickId = pipe([pick(["FirewallPolicyArn"])]);

const createModel = ({ config }) => ({
  package: "network-firewall",
  client: "NetworkFirewall",
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "InvalidFirewallPolicyID.NotFound",
  ],
  getById: {
    method: "describeFirewallPolicy",
    decorate:
      ({ endpoint, live }) =>
      ({ FirewallPolicy, FirewallPolicyResponse }) =>
        pipe([
          () => ({ FirewallPolicy, ...FirewallPolicyResponse }),
          tap((params) => {
            assert(true);
          }),
        ])(),
    pickId,
  },
  getList: {
    method: "listFirewallPolicies",
    getParam: "FirewallPolicies",
    decorate: ({ endpoint, getById }) =>
      pipe([({ Arn }) => ({ FirewallPolicyArn: Arn }), getById]),
  },
  create: {
    method: "createFirewallPolicy",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        get("FirewallPolicyResponse"),
      ]),
  },
  //TODO update test
  update: { method: "updateFirewallPolicy" },
  destroy: {
    method: "deleteFirewallPolicy",
    pickId,
    shouldRetryOnExceptionMessages: [
      "Unable to delete the object because it is still in use",
    ],
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkFirewallPolicy.html
exports.FirewallPolicy = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: pipe([get("live.FirewallPolicyName")]),
    findId: pipe([get("live.FirewallPolicyArn")]),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      //TODO
      dependencies: { kmskey },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({ config, namespace, name, UserTags: Tags }),
        }),
      ])(),
  });
