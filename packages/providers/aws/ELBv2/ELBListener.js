const assert = require("assert");
const { assign, pipe, tap, get, not, eq, pick } = require("rubico");
const { first, defaultsDeep, isEmpty, pluck, find, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const logger = require("@grucloud/core/logger")({ prefix: "ELBListener" });
const { getByNameCore } = require("@grucloud/core/Common");

const { tos } = require("@grucloud/core/tos");
const { buildTags, findNamespaceInTags } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createELB } = require("./ELBCommon");

const findId = get("live.ListenerArn");
const pickId = pick(["ListenerArn"]);
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html

exports.ELBListener = ({ spec, config }) => {
  const elb = createELB(config);
  const client = AwsClient({ spec, config })(elb);

  const { providerName } = config;

  const findName = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(lives);
      }),
      () =>
        lives.getById({
          id: live.LoadBalancerArn,
          type: "LoadBalancer",
          group: "ELBv2",
          providerName: config.providerName,
        }),
      get("name"),
      tap((name) => {
        assert(name);
      }),
      (name) => `listener::${name}::${live.Protocol}::${live.Port}`,
    ])();

  const managedByOther = ({ live, lives }) =>
    pipe([
      () =>
        lives.getById({
          type: "LoadBalancer",
          group: "ELBv2",
          providerName,
          id: live.LoadBalancerArn,
        }),
      get("managedByOther"),
    ])();

  const findNamespaceInLoadBalancer = ({ live, lives }) =>
    pipe([
      () =>
        lives.getById({
          type: "LoadBalancer",
          group: "ELBv2",
          providerName,
          id: live.LoadBalancerArn,
        }),
      get("namespace"),
    ])();

  const findNamespace = (param) =>
    pipe([
      () => [
        findNamespaceInLoadBalancer(param),
        findNamespaceInTags(config)(param),
      ],
      find(not(isEmpty)),
      tap((namespace) => {
        logger.debug(`findNamespace ${namespace}`);
      }),
    ])();

  const findDependencies = ({ live }) => [
    {
      type: "LoadBalancer",
      group: "ELBv2",
      ids: [live.LoadBalancerArn],
    },
    {
      type: "TargetGroup",
      group: "ELBv2",
      ids: pipe([() => live, get("DefaultActions"), pluck("TargetGroupArn")])(),
    },
    {
      type: "Certificate",
      group: "ACM",
      ids: pipe([() => live, get("Certificates"), pluck("CertificateArn")])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeListeners-property
  const getList = client.getListWithParent({
    parent: { type: "LoadBalancer", group: "ELBv2" },
    pickKey: pick(["LoadBalancerArn"]),
    method: "describeListeners",
    getParam: "Listeners",
    config,
    decorate: ({ lives, parent }) =>
      pipe([
        assign({
          Tags: pipe([
            ({ ListenerArn }) => ({ ResourceArns: [ListenerArn] }),
            elb().describeTags,
            get("TagDescriptions"),
            first,
            get("Tags"),
          ]),
        }),
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeListeners-property
  const getByName = getByNameCore({ getList, findName });

  const getById = client.getById({
    pickId: ({ ListenerArn }) => ({ ListenerArns: [ListenerArn] }),
    method: "describeListeners",
    getField: "Listeners",
    ignoreErrorCodes: ["ListenerNotFound"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createListener-property
  const create = client.create({
    method: "createListener",
    pickId,
    getById,
    config,
    pickCreated: () => pipe([get("Listeners"), first]),
    shouldRetryOnExceptionCodes: ["UnsupportedCertificate"],
    config: { retryCount: 40 * 10, retryDelay: 10e3 },
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#deleteListener-property
  const destroy = client.destroy({
    pickId,
    method: "deleteListener",
    getById,
    ignoreErrorCodes: ["ListenerNotFound"],
    config,
  });

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
            ForwardConfig: {
              TargetGroups: [
                {
                  TargetGroupArn: getField(targetGroup, "TargetGroupArn"),
                  Weight: 1,
                },
              ],
              TargetGroupStickinessConfig: {
                Enabled: false,
              },
            },
          },
        ],
      })
    )();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createListener-property
  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { loadBalancer, certificate, targetGroup },
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
    ])();

  return {
    spec,
    findId,
    findDependencies,
    findNamespace,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    managedByOther,
  };
};
