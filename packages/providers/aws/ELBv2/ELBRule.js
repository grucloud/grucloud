const assert = require("assert");
const {
  flatMap,
  pipe,
  tap,
  get,
  not,
  eq,
  filter,
  tryCatch,
  switchCase,
  assign,
  map,
} = require("rubico");
const {
  first,
  defaultsDeep,
  isEmpty,
  pluck,
  find,
  identity,
  flatten,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const logger = require("@grucloud/core/logger")({ prefix: "ELBRule" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { isUpByIdCore, isDownByIdCore } = require("@grucloud/core/Common");
const {
  ELBv2New,
  buildTags,
  findNamespaceInTags,
  shouldRetryOnException,
  findNameInTagsOrId,
} = require("../AwsCommon");

const findId = get("RuleArn");
const findName = (item) =>
  switchCase([
    get("IsDefault"),
    () => "default",
    () => findNameInTagsOrId({ item, findId }),
  ])(item);

const { ELBListener } = require("./ELBListener");
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html
exports.ELBRule = ({ spec, config }) => {
  const elb = ELBv2New(config);
  const elbListener = ELBListener({ spec, config });

  const findDependencies = ({ live }) => [
    { type: "Listener", ids: [live.ListenerArn] },
    {
      type: "TargetGroup",
      ids: pipe([
        () => live,
        get("Actions"),
        pluck("TargetGroupArn"),
        filter(not(isEmpty)),
      ])(),
    },
  ];

  // const findNamespace = findNamespaceInTagsOrEksCluster({
  //   config,
  //   key: "elbv2.k8s.aws/cluster",
  // });

  const findNamespaceInListener = (config) => ({ live, lives }) =>
    pipe([
      () => live,
      get("ListenerArn"),
      (ListenerArn) =>
        lives.getById({
          providerName: config.providerName,
          type: "Listener",
          id: ListenerArn,
        }),
      tap((listener) => {
        assert(listener);
      }),
      get("namespace"),
      tap((namespace) => {
        assert(true);
      }),
    ])();

  const findNamespace = ({ live, lives }) =>
    pipe([
      () => findNamespaceInTags(config)({ live }),
      switchCase([
        not(isEmpty),
        identity,
        () => findNamespaceInListener(config)({ live, lives }),
      ]),
      tap((namespace) => {
        logger.debug(`findNamespace rules ${namespace}`);
      }),
    ])();

  const describeAllRules = pipe([
    () => elbListener.getList({}),
    get("items"),
    pluck("ListenerArn"),
    flatMap((ListenerArn) =>
      pipe([
        () => elb().describeRules({ ListenerArn }),
        get("Rules"),
        map(assign({ ListenerArn: () => ListenerArn })),
      ])()
    ),
    filter(not(isEmpty)),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeRules-property
  const getList = async () =>
    pipe([
      tap(() => {
        logger.info(`getList rule`);
      }),
      describeAllRules,
      tap((results) => {
        logger.debug(`getList rule result: ${tos(results)}`);
      }),
      map(
        assign({
          Tags: pipe([
            ({ RuleArn }) => elb().describeTags({ ResourceArns: [RuleArn] }),
            get("TagDescriptions"),
            first,
            get("Tags"),
          ]),
        })
      ),
      (items = []) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList: rule #total: ${total}`);
      }),
    ])();

  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      describeAllRules,
      find(eq(findName, name)),
      tap((result) => {
        logger.debug(`getByName ${name}, result: ${tos(result)}`);
      }),
    ])();

  const getById = ({ id }) =>
    pipe([
      tap(() => {
        logger.info(`getById ${id}`);
      }),
      () => ({ RuleArns: [id] }),
      tryCatch(
        pipe([(params) => elb().describeRules(params), get("Rules"), first]),
        switchCase([
          eq(get("code"), "RuleNotFound"),
          () => undefined,
          (error) => {
            logger.error(`getById describeRules error ${tos(error)}`);
            throw error;
          },
        ])
      ),
      tap((result) => {
        logger.debug(`getById ${id}, result: ${tos(result)}`);
      }),
    ])();

  const isInstanceUp = not(isEmpty);

  const isUpById = isUpByIdCore({ isInstanceUp, getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createRule-property
  const create = async ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create rule : ${name}`);
        logger.debug(`${tos(payload)}`);
      }),
      () => elb().createRule(payload),
      get("Rules"),
      first,
      tap(({ RuleArn }) =>
        retryCall({
          name: `rule isUpById: ${name}, RuleArn: ${RuleArn}`,
          fn: () => isUpById({ name, id: RuleArn }),
          config,
        })
      ),
      tap((result) => {
        logger.info(`created rule ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#deleteRule-property
  const destroy = async ({ live }) =>
    pipe([
      () => ({ id: findId(live), name: findName(live) }),
      ({ id, name }) =>
        pipe([
          tap(() => {
            logger.info(`destroy rule ${JSON.stringify({ id })}`);
          }),
          () => ({
            RuleArn: id,
          }),
          (params) => elb().deleteRule(params),
          tap(() =>
            retryCall({
              name: `rule isDownById: ${id}`,
              fn: () => isDownById({ id, name }),
              config,
            })
          ),
          tap(() => {
            logger.info(`destroyed rule ${JSON.stringify({ id, name })}`);
          }),
        ])(),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createRule-property
  const configDefault = async ({
    name,
    namespace,
    properties,
    dependencies: { listener },
  }) =>
    pipe([
      tap(() => {
        assert(listener);
      }),
      () => properties,
      defaultsDeep({
        ListenerArn: getField(listener, "ListenerArn"),
        Tags: buildTags({ name, namespace, config }),
      }),
    ])();

  const cannotBeDeleted = get("live.IsDefault");

  return {
    type: "Rule",
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
    cannotBeDeleted,
  };
};
