const assert = require("assert");
const {
  flatMap,
  assign,
  map,
  pipe,
  tap,
  get,
  not,
  eq,
  filter,
  pick,
} = require("rubico");
const { first, defaultsDeep, isEmpty, pluck, find, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const logger = require("@grucloud/core/logger")({ prefix: "ELBListener" });

const { tos } = require("@grucloud/core/tos");
const {
  ELBv2New,
  buildTags,
  findNamespaceInTags,
  shouldRetryOnException,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.ListenerArn");
const pickId = pick(["ListenerArn"]);
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html

exports.ELBListener = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const elb = ELBv2New(config);
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

  const describeAllListeners = pipe([
    () => elb().describeLoadBalancers({}),
    get("LoadBalancers"),
    pluck("LoadBalancerArn"),
    flatMap(
      pipe([
        (LoadBalancerArn) => elb().describeListeners({ LoadBalancerArn }),
        get("Listeners"),
        map(
          assign({
            Tags: pipe([
              ({ ListenerArn }) =>
                elb().describeTags({ ResourceArns: [ListenerArn] }),
              get("TagDescriptions"),
              first,
              get("Tags"),
            ]),
          })
        ),
      ])
    ),
    filter(not(isEmpty)),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeListeners-property
  const getList = () =>
    pipe([
      tap(() => {
        logger.info(`getList listener`);
      }),
      describeAllListeners,
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeListeners-property
  const getByName = ({ name, lives }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      describeAllListeners,
      find(eq((live) => findName({ live, lives }), name)),
      tap((result) => {
        logger.debug(`getByName ${name}, result: ${tos(result)}`);
      }),
    ])();

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
    shouldRetryOnException: ({ error }) =>
      pipe([
        tap(() => {
          logger.error(`listener create isExpectedException ${tos(error)}`);
        }),
        () => error,
        eq(get("code"), "UnsupportedCertificate"),
      ])(),
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
    shouldRetryOnException,
    managedByOther,
  };
};
