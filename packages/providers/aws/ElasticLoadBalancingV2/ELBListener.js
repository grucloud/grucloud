const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, or, omit } = require("rubico");
const {
  defaultsDeep,
  first,
  isEmpty,
  unless,
  pluck,
  when,
} = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { omitIfEmpty } = require("@grucloud/core/Common");
const { hasDependency } = require("@grucloud/core/generatorUtils");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags, hasKeyInTags } = require("../AwsCommon");

const { tagResource, untagResource } = require("./ELBCommon");

const pickId = pipe([
  tap(({ ListenerArn }) => {
    assert(ListenerArn);
  }),
  pick(["ListenerArn"]),
]);

const certificateProperties = ({ certificate }) =>
  when(
    () => certificate,
    () => ({
      Certificates: [
        {
          CertificateArn: getField(certificate, "CertificateArn"),
        },
      ],
    })
  )();

const targetGroupProperties = ({ targetGroup }) =>
  when(
    () => targetGroup,
    () => ({
      DefaultActions: [
        {
          Type: "forward",
          TargetGroupArn: getField(targetGroup, "TargetGroupArn"),
          Order: 1,
          ForwardConfig: {
            TargetGroups: [
              {
                TargetGroupArn: getField(targetGroup, "TargetGroupArn"),
                Weight: 100,
              },
            ],
            TargetGroupStickinessConfig: {
              DurationSeconds: 3600,
              Enabled: false,
            },
          },
        },
      ],
    })
  )();

const assignTags = ({ endpoint }) =>
  unless(
    isEmpty,
    assign({
      Tags: pipe([
        ({ ListenerArn }) => ({ ResourceArns: [ListenerArn] }),
        endpoint().describeTags,
        get("TagDescriptions"),
        first,
        get("Tags"),
      ]),
    })
  );

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ endpoint }),
  ]);

const managedByOther = () =>
  or([
    hasKeyInTags({
      key: "elbv2.k8s.aws/cluster",
    }),
    hasKeyInTags({
      key: "elasticbeanstalk:environment-id",
    }),
  ]);

const ignoreErrorCodes = ["ListenerNotFound", "ListenerNotFoundException"];

// const findNamespace = findNamespaceInTagsOrEksCluster({
//   config,
//   key: "elbv2.k8s.aws/cluster",
// });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html
exports.ElasticLoadBalancingV2Listener = ({ compare }) => ({
  type: "Listener",
  package: "elastic-load-balancing-v2",
  client: "ElasticLoadBalancingV2",
  inferName:
    ({ dependenciesSpec: { loadBalancer } }) =>
    ({ Protocol, Port }) =>
      pipe([
        tap(() => {
          assert(loadBalancer);
          assert(Protocol);
          assert(Port);
        }),
        () => `listener::${loadBalancer}::${Protocol}::${Port}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(lives);
        }),
        () => live,
        get("LoadBalancerArn"),
        lives.getById({
          type: "LoadBalancer",
          group: "ElasticLoadBalancingV2",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        (name) => `listener::${name}::${live.Protocol}::${live.Port}`,
      ])(),
  findId: () =>
    pipe([
      get("ListenerArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  managedByOther,
  dependencies: {
    loadBalancer: {
      type: "LoadBalancer",
      group: "ElasticLoadBalancingV2",
      parent: true,
      dependencyId: ({ lives, config }) => get("LoadBalancerArn"),
    },
    targetGroup: {
      type: "TargetGroup",
      group: "ElasticLoadBalancingV2",
      dependencyIds: ({ lives, config }) =>
        pipe([get("DefaultActions"), pluck("TargetGroupArn")]),
    },
    certificate: {
      type: "Certificate",
      group: "ACM",
      dependencyIds: ({ lives, config }) =>
        pipe([get("Certificates"), pluck("CertificateArn")]),
    },
  },
  omitProperties: ["ListenerArn", "SslPolicy"],
  managedByOther:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("LoadBalancerArn"),
        lives.getById({
          type: "LoadBalancer",
          group: "ElasticLoadBalancingV2",
          providerName: config.providerName,
        }),
        get("managedByOther"),
      ])(),
  filterLive: pipe([
    ({ resource }) =>
      (live) =>
        pipe([
          () => live,
          when(
            () =>
              hasDependency({
                type: "TargetGroup",
                group: "ElasticLoadBalancingV2",
              })(resource),
            omit(["DefaultActions"])
          ),
          pick(["Port", "Protocol", "DefaultActions"]),
        ])(),
  ]),
  compare: compare({
    filterLive: () => pipe([omitIfEmpty(["AlpnPolicy", "Certificates"])]),
  }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#getListener-property
  getById: {
    pickId: pipe([
      tap(({ ListenerArn }) => {
        assert(ListenerArn);
      }),
      ({ ListenerArn }) => ({ ListenerArns: [ListenerArn] }),
    ]),
    method: "describeListeners",
    getField: "Listeners",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#listListeners-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "LoadBalancer", group: "ElasticLoadBalancingV2" },
          pickKey: pipe([
            tap(({ LoadBalancerArn }) => {
              assert(LoadBalancerArn);
            }),
            pick(["LoadBalancerArn"]),
          ]),
          method: "describeListeners",
          getParam: "Listeners",
          decorate: ({ lives, parent }) =>
            pipe([
              assign({
                Tags: pipe([
                  ({ ListenerArn }) => ({ ResourceArns: [ListenerArn] }),
                  endpoint().describeTags,
                  get("TagDescriptions"),
                  first,
                  get("Tags"),
                ]),
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#createListener-property
  create: {
    method: "createListener",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        get("Listeners"),
        first,
      ]),
    config: { retryCount: 60 * 10, retryDelay: 10e3 },
  },
  update: {
    method: "modifyListener",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ ListenerArn: live.ListenerArn }),
        tap((params) => {
          assert(true);
        }),
        omit(["Tags"]),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#deleteListener-property
  destroy: {
    pickId,
    method: "deleteListener",
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { loadBalancer, certificate, targetGroup },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(loadBalancer);
      }),
      () => ({}),
      defaultsDeep(certificateProperties({ certificate })),
      defaultsDeep(targetGroupProperties({ targetGroup })),
      defaultsDeep(otherProps),
      defaultsDeep({
        LoadBalancerArn: getField(loadBalancer, "LoadBalancerArn"),
        Tags: buildTags({ name, namespace, config, UserTags: Tags }),
      }),
    ])(),
});
