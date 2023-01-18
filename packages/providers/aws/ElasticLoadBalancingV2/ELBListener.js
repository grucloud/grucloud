const assert = require("assert");
const { pipe, tap, get, omit, pick, assign } = require("rubico");
const { defaultsDeep, first, when, pluck } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { tagResource, untagResource } = require("./ELBCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html
const ignoreErrorCodes = ["ListenerNotFound", "ListenerNotFoundException"];

const findId = () => get("ListenerArn");
const pickId = pick(["ListenerArn"]);

const { createAwsResource } = require("../AwsClient");

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

// const findNamespaceInLoadBalancer = ({ live, lives }) =>
//   pipe([
//     () =>
//       lives.getById({
//         type: "LoadBalancer",
//         group: "ElasticLoadBalancingV2",
//         providerName,
//         id: live.LoadBalancerArn,
//       }),
//     get("namespace"),
//   ])();

// const findNamespace = (param) =>
//   pipe([
//     () => [
//       findNamespaceInLoadBalancer(param),
//       findNamespaceInTags(config)(param),
//     ],
//     find(not(isEmpty)),
//     tap((namespace) => {
//       logger.debug(`findNamespace ${namespace}`);
//     }),
//   ])();

const model = ({ config }) => ({
  package: "elastic-load-balancing-v2",
  client: "ElasticLoadBalancingV2",
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#describeControlPanel-property
  getById: {
    pickId: ({ ListenerArn }) => ({ ListenerArns: [ListenerArn] }),
    method: "describeListeners",
    getField: "Listeners",
    ignoreErrorCodes,
  },
  create: {
    method: "createListener",
    pickCreated: () => pipe([get("Listeners"), first]),
    shouldRetryOnExceptionCodes: ["UnsupportedCertificate"],
    config: { retryCount: 40 * 10, retryDelay: 10e3 },
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
  destroy: { pickId, method: "deleteListener", ignoreErrorCodes },
});

exports.ELBListener = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
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
    findId,
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
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#listControlPanels-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        () =>
          client.getListWithParent({
            parent: { type: "LoadBalancer", group: "ElasticLoadBalancingV2" },
            pickKey: pick(["LoadBalancerArn"]),
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
            config,
          }),
      ])(),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
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
