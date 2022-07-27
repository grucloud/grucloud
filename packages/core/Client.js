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
} = require("rubico");

const {
  when,
  uniq,
  isEmpty,
  isString,
  isObject,
  defaultsDeep,
  size,
  includes,
  isFunction,
  unless,
} = require("rubico/x");
const { memoize } = require("lodash");
const util = require("util");
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
          `live is not an object, groupType: ${
            client.spec.groupType
          }, live: ${util.inspect(live)}`
        );
        if (isFunction(live)) {
          assert(true);
        }
        assert(config);
      }),
      () => ({
        memoFindName: memoize(
          pipe([
            () => ({ live, lives, config }),
            client.findName,
            tap((name) => {
              if (!isString(name)) {
                logger.error(`no name in ${tos(live)}`);
                assert(false, `no name in ${tos(live)}`);
              }
            }),
          ]),
          defaultMemoizeResolver
        ),
        memoFindId: memoize(
          pipe([
            () => client.findId({ live, lives, config }),
            tap((id) => {
              if (!isString(id)) {
                assert(
                  isString(id),
                  `no id in live: ${JSON.stringify(live, null, 4)}`
                );
              }
            }),
          ]),
          defaultMemoizeResolver
        ),
        memoFindMeta: memoize(
          pipe([() => client.findMeta({ live, lives, config })]),
          defaultMemoizeResolver
        ),
        memoIsDefault: memoize(
          pipe([() => client.isDefault({ live, lives, config })]),
          defaultMemoizeResolver
        ),
        memoFindNamespace: memoize(
          pipe([() => client.findNamespace({ live, lives, config })]),
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
            when(
              and([isEmpty, () => !isEmpty(client.spec.dependencies)]),
              pipe([
                () => client.spec,
                get("dependencies", {}),
                tap((params) => {
                  assert(true);
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
                        // assert(
                        //   isFunction(dependencyId) || isFunction(dependencyIds)
                        // );
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
                          tap((id) => {
                            // assert(isObject(id));
                          }),
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
                          tap((ids) => {
                            // assert(
                            //   Array.isArray(ids),
                            //   `ids not an array for type: ${type}, ${client.spec.groupType}`
                            // );
                          }),
                        ]),
                        () => {
                          // assert(
                          //   false,
                          //   `missing dependencyId or  dependencyIds`
                          // );
                        },
                      ]),
                      (ids) => ({ type, group, dependencyKey, ids }),
                    ])()
                ),
              ])
            ),
            filter(pipe([get("ids", []), filter(not(isEmpty))])),
            map(
              pipe([
                tap(({ type, group, ids }) => {
                  if (!type) {
                    assert(type);
                  }
                  // assert(
                  //   Array.isArray(ids),
                  //   `no ids in dependency type ${type}, client ${client.spec.groupType}`
                  // );
                  //assert(group);
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
      ({
        memoFindName,
        memoFindId,
        memoFindMeta,
        memoIsDefault,
        memoFindNamespace,
        memoDependencies,
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
          return memoFindNamespace();
        },
        displayResource() {
          return client.spec.displayResource({ lives, config })(live);
        },
        get dependencies() {
          return memoDependencies();
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
            client.isOurMinion({
              uri: resource.uri,
              resource,
              live,
              lives,
              config,
            }),
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
      assert(Array.isArray(results), `no results for ${client.spec.groupType}`);
    }),
  ]);

const createClient = ({
  //provider,
  spec,
  providerName,
  config,
  getResource,
  //Remove getResourcesByType and getListHof
  getResourcesByType,
  getResourceFromLive,
  getListHof,
  lives,
}) =>
  pipe([
    tap((params) => {
      assert(spec.Client, `missing Client for ${spec.groupType}`);
      assert(lives);
      //TODO
      // assert(provider)
    }),
    () => spec.Client({ providerName, spec, config, lives }),
    tap((client) => {
      //assert(getResourcesByType);
      assert(providerName);
      assert(client.spec);
      assert(client.findName);
      //assert(client.getByName);
      assert(client.getList);
    }),
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

      findMeta: () => undefined,
      findDependencies: () => [],
      findNamespace: () => "",
      findNamespaceFromTarget: get("namespace"),
      cannotBeDeleted: () => false,
      isDefault: () => false,
      managedByOther: () => false,
      isOurMinion: ({ uri, resource, live, lives }) => !!getResource(resource),
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
        ({ live, resource, lives }) =>
          cannotBeDeleted({
            live,
            lives,
            //TODO
            //resources: provider.getResourcesByType(spec),
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
                  logger.info(
                    `getLives ${client.spec.groupType} #resources ${size(
                      resources
                    )}`
                  );
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
