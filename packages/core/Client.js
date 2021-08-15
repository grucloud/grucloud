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
} = require("rubico");

const {
  isEmpty,
  isString,
  callProp,
  defaultsDeep,
  size,
  includes,
} = require("rubico/x");

const logger = require("./logger")({ prefix: "Client" });
const { tos } = require("./tos");
const { displayType } = require("./ProviderCommon");

const showLive =
  ({ options = {} } = {}) =>
  (resource) =>
    pipe([
      () => resource,
      and([
        (resource) =>
          switchCase([not(isEmpty), includes(resource.type), () => true])(
            options.types
          ),
        (resource) => !includes(resource.type)(options.typesExclude),
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

const decorateLive =
  ({ client, options, lives }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(client);
        assert(client.spec);
        assert(lives);
        assert(live);
      }),
      () => ({
        group: client.spec.group,
        type: client.spec.type,
        name: client.findName({ live, lives }),
        meta: client.findMeta(live),
        id: client.findId({ live, lives }),
        providerName: client.spec.providerName,
        groupType: client.spec.groupType,
        live,
      }),
      assign({
        uri: ({ name, id, meta }) =>
          client.spec.resourceKey({
            live,
            providerName: client.spec.providerName,
            type: client.spec.type,
            group: client.spec.group,
            name,
            meta,
            id,
          }),
        displayName: ({ name, meta }) => client.displayName({ name, meta }),
      }),
      (resource) => ({
        ...resource,
        get cannotBeDeleted() {
          return client.cannotBeDeleted({
            resource,
            live,
            lives,
          });
        },
        //TODO isOurMinion or managedByUs
        get isOurMinion() {
          return client.isOurMinion({ uri: resource.uri, live, lives });
        },
        get managedByUs() {
          return client.isOurMinion({ uri: resource.uri, live, lives });
        },
        get managedByOther() {
          return client.managedByOther({ resource, live, lives });
        },
        get isDefault() {
          return client.isDefault({ live, lives });
        },
        get namespace() {
          return client.findNamespace({ live, lives });
        },
        get dependencies() {
          return pipe([
            () =>
              client.findDependencies({
                live,
                lives,
              }),
            map(
              assign({
                providerName: () => client.spec.providerName,
                groupType: ({ group, type }) => `${group}::${type}`,
                ids: pipe([get("ids"), filter(not(isEmpty))]),
              })
            ),
            filter(pipe([get("ids"), not(isEmpty)])),
          ])();
        },
      }),
      tap((resource) =>
        Object.defineProperty(resource, "show", {
          enumerable: true,
          get: () => showLive({ options: options })(resource),
        })
      ),
    ])();

exports.decorateLive = decorateLive;

const decorateLives = ({ client, config, options, readOnly, lives }) =>
  pipe([
    tap((params) => {
      assert(client);
    }),
    get("items", []), // remove
    filter(not(get("error"))),
    map(decorateLive({ client, config, options, readOnly, lives })),
    tap((results) => {
      assert(Array.isArray(results));
    }),
    callProp("sort", (a, b) =>
      pipe([
        tap(() => {
          assert(a);
          assert(a.name.localeCompare);
          assert(a.name);
          assert(b);
          assert(b.name);
        }),
        () => a.name.localeCompare(b.name),
      ])()
    ),
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
