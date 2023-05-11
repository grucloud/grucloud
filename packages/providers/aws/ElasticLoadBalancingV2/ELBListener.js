const assert = require("assert");
const { pipe, tap, get, pick, map, assign, or, omit } = require("rubico");
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
const { replaceWithName } = require("@grucloud/core/Common");

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

const assignTags = ({ endpoint }) =>
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
  ]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ endpoint }),
    omitIfEmpty(["AlpnPolicy", "Certificates"]),
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
    targetGroups: {
      type: "TargetGroup",
      group: "ElasticLoadBalancingV2",
      list: true,
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
  omitProperties: [
    "ListenerArn",
    "SslPolicy",
    "LoadBalancerArn",
    "Certificates",
  ],
  managedByOther: ({ lives, config }) =>
    pipe([
      get("LoadBalancerArn"),
      lives.getById({
        type: "LoadBalancer",
        group: "ElasticLoadBalancingV2",
        providerName: config.providerName,
      }),
      get("managedByOther"),
    ]),
  filterLive: pipe([
    ({ providerConfig, lives }) =>
      pipe([
        assign({
          DefaultActions: pipe([
            get("DefaultActions"),
            map(
              pipe([
                when(
                  get("ForwardConfig.TargetGroups"),
                  assign({
                    ForwardConfig: pipe([
                      get("ForwardConfig"),
                      assign({
                        TargetGroups: pipe([
                          get("TargetGroups"),
                          map(
                            assign({
                              TargetGroupArn: pipe([
                                get("TargetGroupArn"),
                                replaceWithName({
                                  groupType:
                                    "ElasticLoadBalancingV2::TargetGroup",
                                  path: "id",
                                  providerConfig,
                                  lives,
                                }),
                              ]),
                            })
                          ),
                        ]),
                      }),
                    ]),
                  })
                ),
                assign({
                  TargetGroupArn: pipe([
                    get("TargetGroupArn"),
                    replaceWithName({
                      groupType: "ElasticLoadBalancingV2::TargetGroup",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                }),
              ])
            ),
          ]),
        }),
      ]),
  ]),
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
            pipe([decorate({ endpoint, config })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#createListener-property
  create: {
    method: "createListener",
    pickCreated: ({ payload }) => pipe([get("Listeners"), first]),
    config: { retryCount: 60 * 10, retryDelay: 10e3 },
  },
  update: {
    method: "modifyListener",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ ListenerArn: live.ListenerArn }),
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
    dependencies: { loadBalancer, certificate },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(loadBalancer);
      }),
      () => ({}),
      defaultsDeep(certificateProperties({ certificate })),
      defaultsDeep(otherProps),
      defaultsDeep({
        LoadBalancerArn: getField(loadBalancer, "LoadBalancerArn"),
        Tags: buildTags({ name, namespace, config, UserTags: Tags }),
      }),
    ])(),
});
