const assert = require("assert");

const {
  pipe,
  tap,
  map,
  filter,
  tryCatch,
  switchCase,
  get,
  assign,
  not,
  and,
  pick,
  fork,
  any,
  or,
} = require("rubico");

const {
  isEmpty,
  isString,
  isObject,
  defaultsDeep,
  size,
  includes,
  isFunction,
  unless,
} = require("rubico/x");

const logger = require("./logger")({ prefix: "Client" });
const { tos } = require("./tos");

const showLive =
  ({ options = {} } = {}) =>
  (resource) =>
    pipe([
      () => resource,
      and([
        (resource) =>
          pipe([
            () => options.types,
            switchCase([
              not(isEmpty),
              any((type) => pipe([() => resource.groupType, includes(type)])()),
              () => true,
            ]),
          ])(),
        pipe([get("groupType"), not(includes(options.typesExclude))]),
        (resource) => (options.defaultExclude ? !resource.isDefault : true),
        (resource) => (options.our ? resource.managedByUs : true),
        (resource) => (options.name ? resource.name === options.name : true),
        (resource) => (options.id ? resource.id === options.id : true),
        (resource) =>
          options.providerName && !isEmpty(options.providerNames)
            ? includes(resource.providerName)(options.providerNames)
            : true,
        (resource) => (options.canBeDeleted ? !resource.cannotBeDeleted : true),
      ]),
      tap((show) => {
        logger.debug(`showLive ${resource.name} show: ${show}`);
      }),
    ])();

const buildGroupType = switchCase([
  get("group"),
  ({ group, type }) => `${group}::${type}`,
  ({ type }) => type,
]);
exports.buildGroupType = buildGroupType;

const decorateLive =
  ({ client, options, lives, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(client);
        assert(client.spec);
        assert(lives);
        assert(
          isObject(live),
          `live is not an object, groupType: ${client.spec.groupType}`
        );
        if (isFunction(live)) {
          assert(true);
        }
        assert(config);
      }),
      () => ({
        groupType: client.spec.groupType,
        group: client.spec.group,
        type: client.spec.type,
        providerName: client.spec.providerName,
        live,
      }),
      (resource) => ({
        ...resource,
        get name() {
          return pipe([
            () => client.findName({ live, lives, config }),
            tap((name) => {
              if (!isString(name)) {
                logger.error(`no name in ${tos(live)}`);
                assert(false, `no name in ${tos(live)}`);
              }
            }),
          ])();
        },
        get id() {
          return pipe([
            () => client.findId({ live, lives, config }),
            tap((id) => {
              if (!isString(id)) {
                assert(
                  isString(id),
                  `no id in live: ${JSON.stringify(live, null, 4)}`
                );
              }
            }),
          ])();
        },
        get meta() {
          return client.findMeta({ live, lives, config });
        },

        get isDefault() {
          return client.isDefault({ live, lives, config });
        },
        get namespace() {
          return client.findNamespace({ live, lives, config });
        },
        displayResource() {
          return client.spec.displayResource({ lives, config })(live);
        },
        get dependencies() {
          return pipe([
            () =>
              client.findDependencies({
                live,
                lives,
              }),
            tap((ids) => {
              assert(Array.isArray(ids));
            }),
            map(
              pipe([
                tap(({ type, group }) => {
                  assert(type);
                  //assert(group);
                }),
                assign({
                  providerName: () => client.spec.providerName,
                  groupType: buildGroupType,
                  ids: pipe([get("ids"), filter(not(isEmpty))]),
                }),
              ])
            ),
            tap((params) => {
              assert(true);
            }),
          ])();
        },
      }),
      tap((resource) =>
        Object.defineProperty(resource, "show", {
          enumerable: true,
          get: () => showLive({ options })(resource),
        })
      ),
      tap((resource) =>
        Object.defineProperty(resource, "uri", {
          enumerable: true,
          get: () =>
            client.spec.resourceKey({
              live,
              providerName: client.spec.providerName,
              type: client.spec.type,
              group: client.spec.group,
              name: resource.name,
              meta: resource.meta,
              id: resource.id,
              config,
            }),
        })
      ),
      tap((resource) =>
        Object.defineProperty(resource, "managedByUs", {
          enumerable: true,
          get: () =>
            client.isOurMinion({ uri: resource.uri, live, lives, config }),
        })
      ),
      tap((resource) =>
        Object.defineProperty(resource, "cannotBeDeleted", {
          enumerable: true,
          get: () =>
            client.cannotBeDeleted({
              resource,
              live,
              lives,
              config,
            }),
        })
      ),
      tap((resource) =>
        Object.defineProperty(resource, "managedByOther", {
          enumerable: true,
          get: pipe([
            () => client.managedByOther({ resource, live, lives, config }),
            tap((params) => {
              assert(true);
            }),
          ]),
        })
      ),
      tap((resource) =>
        Object.defineProperty(resource, "displayName", {
          enumerable: true,
          get: () => client.displayName(resource),
        })
      ),
    ])();

exports.decorateLive = decorateLive;

const decorateLives = ({ client, config, options, readOnly, lives }) =>
  pipe([
    tap((params) => {
      assert(client);
      assert(config);
    }),
    get("items", []), // remove
    map(
      unless(
        or([get("error"), get("errors")]),
        decorateLive({ client, config, options, readOnly, lives })
      )
    ),
    tap((results) => {
      assert(Array.isArray(results));
    }),
  ]);

const createClient = ({
  spec,
  providerName,
  config,
  getResourcesByType,
  getResourceFromLive,
  getListHof,
}) =>
  pipe([
    tap((params) => {
      assert(getListHof);
    }),
    () => spec.Client({ providerName, spec, config }),
    tap((client) => {
      assert(getResourcesByType);
      assert(getResourceFromLive);
      assert(providerName);
      assert(client.spec);
      assert(client.findName);
      assert(client.getList);
    }),
    defaultsDeep({
      retryConfigs: { isUp: { retryDelay: 10e3, retryCount: 6 * 20 } },
      displayName: pipe([
        tap((xxx) => {
          assert(true);
        }),
        get("name"),
      ]),
      displayNameResource: pipe([
        tap((xxx) => {
          assert(true);
        }),
        get("name"),
      ]),

      findMeta: () => undefined,
      findDependencies: () => [],
      findNamespace: () => "",
      findNamespaceFromTarget: get("namespace"),
      cannotBeDeleted: () => false,
      isDefault: () => false,
      managedByOther: () => false,
      isOurMinion: ({ uri, live, lives }) =>
        pipe([
          fork({
            resource: () =>
              getResourceFromLive({
                uri,
                live,
                lives,
              }),
            resources: () => getResourcesByType(spec),
          }),
          ({ resource, resources }) =>
            spec.isOurMinion({
              resource,
              resources,
              live,
              lives,
              config,
            }),
        ])(),

      configDefault: () => ({}),
      isInstanceUp: not(isEmpty),
      providerName,
    }),
    assign({
      getList: ({ getList }) => getListHof({ getList, spec }),
      cannotBeDeleted:
        ({ cannotBeDeleted }) =>
        ({ live, resource, lives }) =>
          cannotBeDeleted({
            live,
            lives,
            resources: getResourcesByType(spec),
            resource,
            config,
          }),
    }),
    assign({
      getLives: (client) =>
        pipe([
          tryCatch(
            ({ lives, options }) =>
              pipe([
                () =>
                  client.getList({
                    lives,
                    deep: true,
                    resources: getResourcesByType(client.spec),
                  }),
                tap((params) => {
                  assert(true);
                }),
                decorateLives({
                  client,
                  config,
                  options,
                  lives,
                }),
                tap((resources) => {
                  logger.debug(
                    `getLives ${client.spec.groupType} #resources ${size(
                      resources
                    )}`
                  );
                }),
                tap((resources) =>
                  lives.addResources({
                    ...client.spec,
                    resources,
                  })
                ),
                (resources) => ({ resources }),
              ])(),
            pipe([
              pick(["message", "code", "stack", "config", "response"]),
              tap((error) => {
                logger.error(`list error ${error.stack} `);
              }),
              (error) => ({ error }),
            ])
          ),
        ]),
    }),
    tap((params) => {
      assert(true);
    }),
  ])();

exports.createClient = createClient;
