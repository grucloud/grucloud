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
  any,
  or,
  eq,
  flatMap,
  all,
} = require("rubico");

const {
  flatten,
  when,
  uniq,
  isEmpty,
  isString,
  isObject,
  defaultsDeep,
  includes,
  isFunction,
  unless,
  pluck,
  callProp,
} = require("rubico/x");
const memoize = require("lodash/memoize");
const logger = require("./logger")({ prefix: "Client" });
const { tos } = require("./tos");

const showLive =
  ({ options = {} } = {}) =>
  (resource) =>
    pipe([
      tap(() => {
        assert(resource);
      }),
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
        not(
          and([
            get("managedByOther"),
            pipe([callProp("usedBy"), all(get("managedByOther"))]),
          ])
        ),
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
        //logger.debug(`showLive ${resource.name} show: ${show}`);
      }),
    ])();

const buildGroupType = switchCase([
  get("group"),
  ({ group, type }) => `${group}::${type}`,
  ({ type }) => type,
]);
exports.buildGroupType = buildGroupType;

const defaultMemoizeResolver = () => "k";

const findUsedBy =
  ({ lives, config }) =>
  ({ id, groupType }) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(config);
        assert(id);
        assert(groupType);
      }),
      () => config,
      lives.getByProvider,
      pluck("resources"),
      flatten,
      filter(
        pipe([
          get("dependencies"),
          any(
            and([
              pipe([get("ids"), includes(id)]),
              eq(get("groupType"), groupType),
            ])
          ),
        ])
      ),
      flatMap((dep) => [dep, ...findUsedBy({ lives, config })(dep)]),
      uniq,
    ])();

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
          `live is not an object, groupType: ${client.spec.groupType},`
        );
        if (isFunction(live)) {
          assert(true);
        }
        assert(config);
      }),
      () => ({
        memoFindName: memoize(
          pipe([
            () => live,
            client.findName({ lives, config }),
            tap((name) => {
              if (!isString(name)) {
                logger.error(
                  `no name in ${tos({ live })}, ${client.spec.groupType}`
                );
                assert(
                  false,
                  `no name in  ${client.spec.groupType} ${tos({ live })}`
                );
              }
            }),
          ]),
          defaultMemoizeResolver
        ),
        memoFindId: memoize(
          pipe([
            () => live,
            client.findId({ lives, config }),
            tap((id) => {
              if (!isString(id)) {
                assert(
                  isString(id),
                  `no id in live for type ${groupType}: ${JSON.stringify(
                    live,
                    null,
                    4
                  )}`
                );
              }
            }),
          ]),
          defaultMemoizeResolver
        ),
        memoFindMeta: memoize(
          pipe([() => live, client.findMeta({ lives, config })]),
          defaultMemoizeResolver
        ),
        memoIsDefault: memoize(
          pipe([() => live, client.isDefault({ lives, config })]),
          defaultMemoizeResolver
        ),
        memoDependencies: memoize(
          pipe([
            () =>
              client.findDependencies({
                live,
                lives,
                config,
              }),
            tap((ids) => {
              assert(
                Array.isArray(ids),
                `no ids in findDependencies for ${client.spec.groupType}`
              );
            }),
            filter(not(isEmpty)),
            when(and([() => !isEmpty(client.spec.dependencies)]), (deps = []) =>
              pipe([
                () => client.spec,
                get("dependencies", {}),
                tap((dependencies) => {
                  assert(!Array.isArray(dependencies));
                }),
                Object.entries,
                map(
                  ([
                    dependencyKey,
                    { dependencyId, dependencyIds, type, group },
                  ]) =>
                    pipe([
                      tap(() => {
                        assert(dependencyKey);
                        assert(type);
                      }),
                      () => live,
                      switchCase([
                        () => dependencyId,
                        pipe([
                          dependencyId
                            ? dependencyId({
                                lives,
                                config,
                              })
                            : () => false,
                          (id) => [id],
                        ]),
                        () => dependencyIds,
                        pipe([
                          dependencyIds
                            ? dependencyIds({
                                lives,
                                config,
                              })
                            : () => false,
                        ]),
                        () => {},
                      ]),
                      tap((params) => {
                        assert(true);
                      }),
                      (ids) => ({ type, group, dependencyKey, ids }),
                    ])()
                ),
                filter(pipe([get("ids"), not(isEmpty)])),
                (additionalDeps) => [...deps, ...additionalDeps],
              ])()
            ),
            tap((params) => {
              assert(true);
            }),
            filter(pipe([get("ids", []), not(isEmpty)])),
            map(
              pipe([
                tap(({ type, group, ids }) => {
                  if (!type) {
                    assert(type);
                  }
                }),
                assign({
                  providerName: () => client.spec.providerName,
                  groupType: buildGroupType,
                  ids: pipe([get("ids", []), filter(not(isEmpty)), uniq]),
                }),
              ])
            ),
            tap((params) => {
              assert(true);
            }),
          ]),
          defaultMemoizeResolver
        ),
      }),
      assign({
        memoUsedBy: ({ memoFindId }) =>
          memoize(
            pipe([
              tap((params) => {
                assert(memoFindId);
              }),
              () => ({ id: memoFindId(), groupType: client.spec.groupType }),
              findUsedBy({ lives, config }),
            ]),
            defaultMemoizeResolver
          ),
      }),
      ({
        memoFindName,
        memoFindId,
        memoFindMeta,
        memoIsDefault,
        //memoFindNamespace,
        memoDependencies,
        memoUsedBy,
      }) => ({
        groupType: client.spec.groupType,
        group: client.spec.group,
        type: client.spec.type,
        providerName: client.spec.providerName,
        live,
        get name() {
          return memoFindName();
        },
        get id() {
          return memoFindId();
        },
        get meta() {
          return memoFindMeta();
        },
        get isDefault() {
          return memoIsDefault();
        },
        get namespace() {
          return "";
          //TODO
          //return memoFindNamespace();
        },
        displayResource() {
          return client.spec.displayResource({ lives, config })(live);
        },
        hideResource() {
          return client.spec.hideResource({ lives, config })(live);
        },
        get dependencies() {
          return memoDependencies();
        },
        usedBy: memoUsedBy,
      }),
      tap((resource) =>
        Object.defineProperty(resource, "show", {
          enumerable: true,
          get: () => showLive({ lives, options })(resource),
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
          get: pipe([
            () =>
              client.isOurMinion({
                uri: resource.uri,
                resource,
                lives,
                config,
              })(live),
            tap((params) => {
              assert(true);
            }),
          ]),
        })
      ),
      tap((resource) =>
        Object.defineProperty(resource, "cannotBeDeleted", {
          enumerable: true,
          get: pipe([
            tap((params) => {
              assert(
                isFunction(client.cannotBeDeleted({ resource, lives, config })),
                `no cannotBeDeleted for ${client.spec.groupType}`
              );
            }),
            () => live,
            client.cannotBeDeleted({ resource, lives, config }),
          ]),
        })
      ),
      tap((resource) =>
        Object.defineProperty(resource, "managedByOther", {
          enumerable: true,
          get: pipe([
            () => live,
            client.managedByOther({ resource, lives, config }),
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
      assert(Array.isArray(results), `no results for ${client.spec.groupType}`);
    }),
  ]);

const createClient = ({
  spec,
  providerName,
  config,
  getResource,
  //Remove getResourcesByType and getListHof
  getResourcesByType,
  getListHof,
  lives,
  getContext,
}) =>
  pipe([
    tap((params) => {
      assert(spec.Client, `missing Client for ${spec.groupType}`);
      assert(lives);
      assert(getContext);
      //TODO
      // assert(provider)
    }),
    () => spec.Client({ providerName, spec, config, lives, getContext }),
    tap((client) => {
      //assert(getResourcesByType);
      assert(providerName);
      assert(client.spec);
      assert(client.findName);
      //assert(client.getByName);
      assert(client.getList);
    }),
    (client) =>
      pipe([
        () => spec,
        pick(["cannotBeDeleted", "isDefault", "managedByOther"]),
        tap((params) => {
          assert(true);
        }),

        defaultsDeep(client),
      ])(),
    defaultsDeep({
      retryConfigs: { isUp: { retryDelay: 10e3, retryCount: 6 * 25 } },
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
      findMeta: () => () => undefined,
      findDependencies: () => [],
      findNamespace: () => () => "",
      findNamespaceFromTarget: get("namespace"),
      cannotBeDeleted: () => (live) => false,
      isDefault: () => (live) => false,
      managedByOther: () => (live) => false,
      isOurMinion:
        ({ uri, resource, lives }) =>
        (live) =>
          !!getResource(resource),
      configDefault: get("properties"),
      isInstanceUp: not(isEmpty),
      isInstanceError: () => false,
      providerName,
    }),
    assign({
      getList: ({ getList }) => getListHof({ getList, spec }),
      //TODO
      //getList: ({ getList }) => provider.getListHof({ getList, spec }),
      cannotBeDeleted:
        ({ cannotBeDeleted }) =>
        ({ resource, lives }) =>
          cannotBeDeleted({
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
                (params) =>
                  client.getList({
                    options,
                    lives,
                    config,
                    deep: true,
                    params,
                    // resources: provider.getResourcesByType(client.spec),
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
                  // logger.info(
                  //   `getLives ${client.spec.groupType} #resources ${size(
                  //     resources
                  //   )}`
                  // );
                }),
                tap((resources) =>
                  lives.addResources({
                    groupType: client.spec.groupType,
                    resources,
                  })
                ),
                (resources) => ({ resources }),
              ])(),
            pipe([
              tap((error) => {
                logger.error(
                  `list error ${client.spec.groupType}, ${error.stack} `
                );
              }),
              pick(["message", "code", "stack", "config", "response"]),
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
