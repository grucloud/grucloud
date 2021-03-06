const assert = require("assert");
const {
  pipe,
  get,
  tap,
  eq,
  switchCase,
  assign,
  or,
  pick,
  and,
  not,
  omit,
} = require("rubico");
const { find, first, isEmpty, isFunction, identity } = require("rubico/x");
const fs = require("fs");
const https = require("https");
const { detailedDiff } = require("deep-object-diff");
const logger = require("@grucloud/core/logger")({ prefix: "K8sCommon" });
const { tos } = require("@grucloud/core/tos");
const AxiosMaker = require("@grucloud/core/AxiosMaker");
const { isOurMinionObject } = require("@grucloud/core/Common");

const getNamespace = pipe([
  switchCase([isEmpty, () => `default`, get("name")]),
  tap((namespaceName) => {
    //logger.debug(`getNamespace namespaceName: ${namespaceName}`);
    assert(namespaceName);
  }),
]);

exports.getNamespace = getNamespace;

const pickCompare = ({ metadata, spec, data }) => ({
  metadata: pick(["annotations", "labels"])(metadata),
  spec,
  data,
});
const filterTarget = ({ config, target }) =>
  pipe([() => target, pickCompare])();

const filterLive = ({ live }) => pipe([() => live, pickCompare])();

exports.compare = pipe([
  assign({
    target: filterTarget,
    live: filterLive,
  }),
  ({ target, live }) => ({
    targetDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
    ])(),
    liveDiff: pipe([
      () => detailedDiff(live, target),
      omit(["deleted"]),
      switchCase([
        pipe([get("added.metadata.annotations"), isEmpty]),
        omit(["added.metadata.annotations"]),
        identity,
      ]),
    ])(),
  }),
  tap((diff) => {
    logger.debug(`compare k8s ${tos(diff)}`);
  }),
]);

exports.resourceKeyDefault = pipe([
  tap((resource) => {
    assert(resource.providerName);
    assert(resource.type);
    assert(resource.name);
  }),
  ({ providerName, type, name }) => `${providerName}::${type}::${name}`,
]);

exports.resourceKeyNamespace = pipe([
  tap((resource) => {
    assert(resource.providerName);
    assert(resource.type);
    assert(resource.name);
    //assert(resource.properties);
  }),
  ({ providerName, type, properties, name, live }) =>
    `${providerName}::${type}::${get("metadata.namespace")(
      properties ? properties({ dependencies: {} }) : live
    )}::${name}`,
]);

exports.displayNameResourceDefault = ({ name }) => name;
exports.displayNameResourceNamespace = ({ name, dependencies, properties }) =>
  pipe([
    tap(() => {
      assert(name);
      assert(isFunction(properties));
    }),
    () => ({
      namespaceDependencies: get("namespace.name")(dependencies),
      namespaceProperties: get("metadata.namespace")(
        properties({ dependencies: {} })
      ),
    }),
    find(not(isEmpty)),
    (namespace) => `${namespace}::${name}`,
  ])();

exports.displayNameDefault = pipe([
  tap((xxx) => {
    assert(true);
  }),
  get("name"),
]);
exports.displayNameNamespace = ({ name, meta }) =>
  pipe([
    tap(() => {
      assert(meta);
      assert(name);
      assert(meta.namespace);
    }),
    switchCase([
      () => isEmpty(meta.namespace),
      () => name,
      () => `${meta.namespace}::${name}`,
    ]),
    tap((name) => {
      assert(name);
    }),
  ])();

exports.shouldRetryOnException = ({ error, name }) => {
  logger.error(`k8s shouldRetryOnException ${tos({ name, error })}`);
  return false;
};

exports.getServerUrl = (kubeConfig) =>
  pipe([
    tap((kubeConfig) => {
      //logger.debug("getServerUrl");
      assert(kubeConfig);
    }),
    get("clusters"),
    find(eq(get("name"), kubeConfig["current-context"])),
    get("cluster.server"),
    tap.if(isEmpty, () => {
      throw Error(`missing clusters[0].server ${tos({ kubeConfig })}`);
    }),
    tap((server) => {
      logger.debug(`getServerUrl ${server}`);
    }),
  ])(kubeConfig);

exports.createAxiosMakerK8s = ({ config, contentType }) =>
  pipe([
    () => config.kubeConfig(),
    (kubeConfig) =>
      pipe([
        get("users"),
        find(eq(get("name"), kubeConfig["current-context"])),
        get("user"),
      ])(kubeConfig),
    (user) => ({
      rejectUnauthorized: false,
      ...(user["client-certificate"] && {
        cert: fs.readFileSync(user["client-certificate"]),
      }),
      ...(user["client-key"] && { key: fs.readFileSync(user["client-key"]) }),
    }),
    tap(({ cert, key }) => {
      logger.debug(
        `createAxiosMakerK8s agentParam hasCert ${!!cert}, hasKey ${!!key}`
      );
    }),
    (agentParam) => new https.Agent(agentParam),
    (httpsAgent) =>
      AxiosMaker({
        contentType,
        httpsAgent,
        onHeaders: pipe([
          tap(() => {
            assert(config.accessToken, "config.accessToken function not set");
          }),
          () => config.accessToken(),
          switchCase([
            isEmpty,
            () => ({}),
            (accessToken) => ({
              Authorization: `Bearer ${accessToken}`,
            }),
          ]),
        ]),
      }),
  ])();

exports.isOurMinion = ({ live, lives, config }) =>
  or([
    () => isOurMinionObject({ tags: live.metadata.annotations, config }),
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`isOurMinion ${live.metadata.name}`);
      }),
      () => first(live.metadata.ownerReferences),
      switchCase([
        not(isEmpty),
        ({ kind, uid }) =>
          pipe([
            () =>
              lives.getByType({
                providerName: config.providerName,
                type: kind,
              }),
            find(eq(get("live.metadata.uid"), uid)),
            get("managedByUs"),
            tap((result) => {
              logger.info(`isOurMinion ${live.metadata?.name}: ${result}`);
            }),
          ])(),
        () => false,
      ]),
    ]),
  ])();
