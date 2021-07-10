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
  tryCatch,
  switchCase,
} = require("rubico");
const { first, defaultsDeep, isEmpty, pluck, find } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const logger = require("@grucloud/core/logger")({ prefix: "ELBListener" });

const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { isUpByIdCore, isDownByIdCore } = require("@grucloud/core/Common");
const {
  ELBv2New,
  buildTags,
  findNamespaceInTags,
  findNameInTagsOrId,
  shouldRetryOnException,
} = require("../AwsCommon");

const findId = get("live.ListenerArn");
const findName = findNameInTagsOrId({ findId });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html

exports.ELBListener = ({ spec, config }) => {
  const elb = ELBv2New(config);
  const { providerName } = config;

  const findNamespaceInLoadBalancer = ({ live, lives }) =>
    pipe([
      () =>
        lives.getById({
          type: "LoadBalancer",
          providerName,
          id: live.LoadBalancerArn,
        }),
      tap((xxx) => {
        logger.debug(``);
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
      ids: [live.LoadBalancerArn],
    },
    {
      type: "Certificate",
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
  const getList = async () =>
    pipe([
      tap(() => {
        logger.info(`getList listener`);
      }),
      describeAllListeners,
      tap((results) => {
        logger.debug(`getList listener result: ${tos(results)}`);
      }),
      (items = []) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList: listener #total: ${total}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeListeners-property
  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      describeAllListeners,
      find(eq((live) => findName({ live }), name)),
      tap((result) => {
        logger.debug(`getByName ${name}, result: ${tos(result)}`);
      }),
    ])();

  const getById = ({ id }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.info(`getById ${id}`);
        }),
        () => ({ ListenerArns: [id] }),
        (params) => elb().describeListeners(params),
        get("Listeners"),
        first,
        tap((result) => {
          logger.debug(`getById ${id}, result: ${tos(result)}`);
        }),
      ]),
      switchCase([
        eq(get("code"), "ListenerNotFound"),
        () => false,
        (error) => {
          logger.error(`getById ${id}, error: ${tos(error)}`);
          throw error;
        },
      ])
    )();

  const isInstanceUp = not(isEmpty);

  const isUpById = isUpByIdCore({ isInstanceUp, getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createListener-property
  const create = async ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create listener : ${name}`);
        logger.debug(`${tos(payload)}`);
      }),
      () => elb().createListener(payload),
      get("Listeners"),
      first,
      tap(({ ListenerArn }) =>
        retryCall({
          name: `listener isUpById: ${name}, ListenerArn:${ListenerArn}`,
          fn: () => isUpById({ name, id: ListenerArn }),
          config,
        })
      ),
      tap((result) => {
        logger.info(`created listener ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#deleteListener-property
  const destroy = async ({ live }) =>
    pipe([
      () => ({ id: findId({ live }), name: findName({ live }) }),
      ({ id, name }) =>
        pipe([
          tap(() => {
            logger.info(`destroy listener ${JSON.stringify({ id })}`);
          }),
          () => ({
            ListenerArn: id,
          }),
          (params) => elb().deleteListener(params),
          tap(() =>
            retryCall({
              name: `listener isDownById: ${id}`,
              fn: () => isDownById({ id }),
              config,
            })
          ),
          tap(() => {
            logger.info(`destroyed listener ${JSON.stringify({ name })}`);
          }),
        ])(),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createListener-property
  const configDefault = async ({
    name,
    namespace,
    properties,
    dependencies: { loadBalancer },
  }) =>
    pipe([
      tap(() => {
        assert(loadBalancer);
      }),
      () => properties,
      defaultsDeep({
        LoadBalancerArn: getField(loadBalancer, "LoadBalancerArn"),
        Tags: buildTags({ name, namespace, config }),
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
  };
};
