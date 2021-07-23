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
  size,
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

const findId = get("live.RuleArn");

const { ELBListener } = require("./ELBListener");
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html
exports.ELBRule = ({ spec, config }) => {
  const elb = ELBv2New(config);
  const elbListener = ELBListener({ spec, config });
  const { providerName } = config;

  const findName = ({ live, lives }) =>
    pipe([
      tap((params) => {
        assert(lives);
        assert(live.ListenerArn);
      }),
      () => ({ live, lives }),
      switchCase([
        //get("live.IsDefault"),
        () => false,
        pipe([
          tap((params) => {
            assert(true);
          }),
          () =>
            lives.getById({
              type: "Listener",
              group: "elb",
              id: live.ListenerArn,
              providerName,
            }),
          tap((listener) => {
            assert(listener);
          }),
          get("name"),
          tap((listenerName) => {
            assert(listenerName);
          }),
          (listenerName) => `rule-default-${listenerName}`,
        ]),
        findNameInTagsOrId({ findId }),
      ]),
      tap((params) => {
        assert(true);
      }),
    ])();

  const managedByOther = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(live.ListenerArn);
      }),
      () =>
        lives.getById({
          type: "Listener",
          group: "elb",
          providerName,
          id: live.ListenerArn,
        }),
      tap((listener) => {
        assert(listener);
      }),
      get("live.LoadBalancerArn"),
      tap((LoadBalancerArn) => {
        assert(LoadBalancerArn);
      }),
      (LoadBalancerArn) =>
        lives.getById({
          type: "LoadBalancer",
          group: "elb",
          providerName,
          id: LoadBalancerArn,
        }),
      get("managedByOther"),
    ])();

  const findDependencies = ({ live }) => [
    { type: "Listener", group: "elb", ids: [live.ListenerArn] },
    {
      type: "TargetGroup",
      group: "elb",
      ids: pipe([
        () => live,
        get("Actions"),
        pluck("TargetGroupArn"),
        filter(not(isEmpty)),
      ])(),
    },
  ];

  const findNamespaceInListener =
    (config) =>
    ({ live, lives }) =>
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
      (items = []) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList: rule #total: ${total}`);
      }),
    ])();

  const getByName = ({ name, lives }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      describeAllRules,
      tap((rules) => {
        logger.debug(`getByName rules ${name}, #rules: ${tos(rules)}`);
      }),
      find(eq((live) => findName({ live, lives }), name)),
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
  const destroy = async ({ live, lives }) =>
    pipe([
      () => ({ id: findId({ live }), name: findName({ live, lives }) }),
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

  const targetGroupProperties = ({ targetGroup }) =>
    switchCase([
      () => targetGroup,
      () => ({
        Actions: [
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
      }),
      identity,
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createRule-property
  const configDefault = async ({
    name,
    namespace,
    properties,
    dependencies: { listener, targetGroup },
  }) =>
    pipe([
      tap(() => {
        assert(listener);
      }),
      () => ({}),
      defaultsDeep(targetGroupProperties({ targetGroup })),
      defaultsDeep(properties),
      defaultsDeep({
        ListenerArn: getField(listener, "ListenerArn"),
        Tags: buildTags({ name, namespace, config }),
      }),
    ])();

  const isDefault = get("live.IsDefault");
  const cannotBeDeleted = isDefault;

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
    cannotBeDeleted,
    managedByOther,
  };
};
