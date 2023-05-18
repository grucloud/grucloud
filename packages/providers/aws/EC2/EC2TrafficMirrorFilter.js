const assert = require("assert");
const { pipe, tap, get, pick, fork, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { updateResourceArray } = require("@grucloud/core/updateResourceArray");

const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { tagResource, untagResource } = require("./EC2Common");

const findId = () =>
  pipe([
    get("TrafficMirrorFilterId"),
    tap((id) => {
      assert(id);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const createTrafficMirrorFilterRules = ({
  endpoint,
  live,
  TrafficDirection,
  rules,
}) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live.TrafficMirrorFilterId);
    }),
    get(rules),
    map(
      pipe([
        defaultsDeep({
          TrafficDirection,
          TrafficMirrorFilterId: live.TrafficMirrorFilterId,
        }),
        endpoint().createTrafficMirrorFilterRule,
      ])
    ),
  ]);

const createTrafficMirrorFilterRule =
  ({ TrafficDirection }) =>
  ({ endpoint, live }) =>
    pipe([
      tap(({ RuleNumber }) => {
        assert(RuleNumber);
        assert(live.TrafficMirrorFilterId);
        assert(endpoint);
        assert(TrafficDirection);
      }),
      defaultsDeep({
        TrafficDirection,
        TrafficMirrorFilterId: live.TrafficMirrorFilterId,
      }),
      endpoint().createTrafficMirrorFilterRule,
    ]);

const deleteTrafficMirrorFilterRule =
  () =>
  ({ endpoint, live }) =>
    pipe([
      tap(() => {
        assert(live.TrafficMirrorFilterId);
        assert(endpoint);
      }),
      () => ({
        TrafficMirrorFilterId: live.TrafficMirrorFilterId,
      }),
      endpoint().deleteTrafficMirrorFilterRule,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TrafficMirrorFilter = () => ({
  type: "TrafficMirrorFilter",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: [
    "TrafficMirrorFilterId",
    "EgressFilterRules[].TrafficDirection",
    "EgressFilterRules[].TrafficMirrorFilterId",
    "EgressFilterRules[].TrafficMirrorFilterRuleId",
    "IngressFilterRules[].TrafficDirection",
    "IngressFilterRules[].TrafficMirrorFilterId",
    "IngressFilterRules[].TrafficMirrorFilterRuleId",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: [
    "InvalidTrafficMirrorFilterId.NotFound",
    "InvalidParameterValue",
  ],
  dependencies: {},
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTrafficMirrorFilters-property
  getById: {
    method: "describeTrafficMirrorFilters",
    getField: "TrafficMirrorFilters",
    pickId: pipe([
      tap(({ TrafficMirrorFilterId }) => {
        assert(TrafficMirrorFilterId);
      }),
      ({ TrafficMirrorFilterId }) => ({
        TrafficMirrorFilterIds: [TrafficMirrorFilterId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTrafficMirrorFilters-property
  getList: {
    method: "describeTrafficMirrorFilters",
    getParam: "TrafficMirrorFilters",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createTrafficMirrorFilter-property
  create: {
    method: "createTrafficMirrorFilter",
    pickCreated: ({ payload }) => pipe([get("TrafficMirrorFilter")]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          fork({
            egress: createTrafficMirrorFilterRules({
              endpoint,
              live,
              TrafficDirection: "egress",
              rules: "EgressFilterRules",
            }),
            ingress: createTrafficMirrorFilterRules({
              endpoint,
              live,
              TrafficDirection: "ingress",
              rules: "IngressFilterRules",
            }),
          }),
        ])(),
  },
  update:
    ({ endpoint }) =>
    ({ name, diff, payload, live }) =>
      pipe([
        () => ({ payload, live, diff }),
        updateResourceArray({
          endpoint,
          arrayPath: "EgressFilterRules",
          onAdd: createTrafficMirrorFilterRule({ TrafficDirection: "egress" }),
          onRemove: deleteTrafficMirrorFilterRule({}),
        }),
        () => ({ payload, live, diff }),
        updateResourceArray({
          endpoint,
          arrayPath: "IngressFilterRules",
          onAdd: createTrafficMirrorFilterRule({ TrafficDirection: "ingress" }),
          onRemove: deleteTrafficMirrorFilterRule({}),
        }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteTrafficMirrorFilter-property
  destroy: {
    method: "deleteTrafficMirrorFilter",
    pickId: pipe([
      pick(["TrafficMirrorFilterId"]),
      tap(({ TrafficMirrorFilterId }) => {
        assert(TrafficMirrorFilterId);
      }),
    ]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource, untagResource }),
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
        TagSpecifications: [
          {
            ResourceType: "traffic-mirror-filter",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
