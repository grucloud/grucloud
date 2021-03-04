const assert = require("assert");
const {
  pipe,
  tap,
  map,
  flatMap,
  filter,
  tryCatch,
  switchCase,
  get,
  assign,
  any,
  reduce,
  fork,
  eq,
  not,
  and,
  or,
  transform,
  omit,
} = require("rubico");

const {
  first,
  isEmpty,
  isString,
  flatten,
  pluck,
  forEach,
  find,
  defaultsDeep,
  isDeepEqual,
  includes,
} = require("rubico/x");

const logger = require("../logger")({ prefix: "ProviderCommon" });
const { tos } = require("../tos");

const PlanDirection = {
  UP: 1,
  DOWN: -1,
};

exports.PlanDirection = PlanDirection;

const notAvailable = (name, field) => {
  assert(field);
  return `<< ${field} of ${name} not available yet >>`;
};

exports.notAvailable = notAvailable;

exports.hasResultError = any(get("error"));
exports.nextStateOnError = (error) => (error ? "ERROR" : "DONE");

exports.isValidPlan = (plan) => !isEmpty(plan.plans) && !plan.error;

exports.getField = ({ resource, live }, field) =>
  get(field, notAvailable(resource.name, field))(live);

exports.clientByType = ({ type }) => find(eq(get("spec.type"), type));

const liveToUri = ({ client, live }) =>
  client.resourceKey({
    providerName: client.spec.providerName,
    type: client.spec.type,
    name: client.findName(live),
    meta: client.findMeta(live),
    id: client.findId(live),
  });

exports.liveToUri = liveToUri;

const isTypesMatch = ({ typeToMatch }) =>
  switchCase([
    isEmpty,
    () => true,
    any((type) => isTypeMatch({ type, typeToMatch })),
  ]);
exports.isTypesMatch = isTypesMatch;

const isTypeMatch = ({ type, typeToMatch }) =>
  new RegExp(`^${type}`, "i").test(typeToMatch);

exports.isTypeMatch = isTypeMatch;

const findDependentType = ({ clients }) =>
  pipe([
    tap((types) => {
      //logger.debug(`findDependentType ${types}`);
    }),
    flatMap(
      pipe([
        (type) =>
          filter((client) =>
            isTypeMatch({ type, typeToMatch: client.spec.type })
          )(clients),
        pluck("spec.listDependsOn"),
        flatten,
      ])
    ),
    tap((types) => {
      logger.debug(`findDependentType ${types}`);
    }),
  ]);

const filterByType = ({ types }) =>
  pipe([
    (clients) =>
      filter((client) =>
        pipe([
          tap(() => {
            assert(client);
            assert(client.spec);
            assert(client.spec.type);
          }),
          switchCase([
            or([
              isEmpty,
              pipe([
                findDependentType({ clients }),
                tap(() => {
                  assert(client);
                  assert(client.spec);
                  assert(client.spec.type);
                }),
                includes(client.spec.type),
              ]),
            ]),
            () => true,
            isTypesMatch({ typeToMatch: client.spec.type }),
          ]),
        ])(types)
      )(clients),
  ]);

exports.filterReadClient = ({ types, all } = {}) =>
  pipe([
    tap((clients) => {
      logger.debug(
        `filterReadClient types: ${types}, #clients ${clients.length}`
      );
    }),
    filterByType({ types }),
    filter((client) => all || !client.spec.listHide),
    tap((clients) => {
      logger.debug(`filterReadClient #clients ${clients.length}`);
    }),
  ]);

exports.filterReadWriteClient = ({ types } = {}) =>
  pipe([
    tap((clients) => {
      logger.debug(
        `filterReadWriteClient types: ${types}, #clients ${clients.length}`
      );
    }),
    filterByType({ types }),
    filter((client) => !client.spec.singleton),
    filter((client) => !client.spec.listOnly),
    tap((clients) => {
      logger.debug(`filterReadWriteClient result #clients ${clients.length}`);
    }),
  ]);

exports.contextFromResource = ({ operation, resource }) => {
  assert(operation);
  assert(resource);
  const { type, providerName } = resource;
  assert(type);
  assert(
    providerName,
    `missing provider in resource: ${JSON.stringify(resource)}`
  );

  const uri = `${providerName}::${operation}::${type}`;
  const displayText = (state) => {
    if (!state) {
      assert(state, `no state for ${uri}`);
    }
    return `${type} ${state.completed}/${state.total}`;
  };

  return {
    uri,
    displayText,
    onErrorDefault: ({ spinnerMap, spinnies }) => {},
    onDone: ({ state, spinnerMap, spinnies }) => {
      if (!state) {
        assert(state, `no state for ${uri}`);
      }
      const completed = state.completed + 1;
      const newState = { ...state, completed };
      spinnies.update(uri, {
        text: displayText(newState),
        color: "greenBright",
        status: "spinning",
      });

      spinnerMap.set(uri, { state: newState });

      if (completed === state.total) {
        spinnies.succeed(uri);
        spinnerMap.delete(uri);
      }
    },
  };
};

exports.contextFromClient = ({ client, title }) => {
  assert(client, "client");
  const { type, providerName } = client.spec;
  assert(providerName);

  assert(type, "client.spec.type");
  assert(title, "title");
  const uri = `${providerName}::${title}`;

  const displayText = (state) => {
    assert(state, `no state for ${uri}`);
    const text = `${title} ${state.completed}/${state.total}`;
    logger.debug(`contextFromClient ${text}`);
    return text;
  };

  return {
    hide: true,
    uri: `${providerName}::${title}::${type}`,
    displayText: () => type,
    onDone: ({ spinnerMap, spinnies }) => {
      const context = spinnerMap.get(uri);
      if (!context) {
        assert(context, `no context for ${uri}`);
      }
      const { state } = context;
      assert(state);
      const completed = state.completed + 1;
      const newState = { ...state, completed };
      spinnies.update(uri, {
        text: displayText(newState),
        color: "greenBright",
        status: "spinning",
      });

      spinnerMap.set(uri, { state: newState });

      if (completed === state.total) {
        spinnies.succeed(uri);
        spinnerMap.delete(uri);
      }
    },
  };
};

exports.contextFromProvider = ({ providerName }) => {
  assert(providerName);
  return {
    uri: providerName,
    displayText: () => providerName,
  };
};

exports.contextFromProviderInit = ({ providerName }) => {
  assert(providerName);
  return {
    uri: `${providerName}::start`,
    displayText: () => "Initialising",
  };
};

exports.contextFromResourceType = ({ operation, resourcesPerType }) => {
  assert(operation);
  const { provider, type, resources } = resourcesPerType;
  assert(Array.isArray(resources), "Array.isArray(resources)");
  return {
    uri: `${provider}::${operation}::${type}`,
    displayText: (state) => `${type} ${state.completed}/${state.total}`,
    state: { completed: 0, total: resources.length },
  };
};

exports.contextFromPlanner = ({ providerName, title, total = 0 }) => {
  assert(providerName);
  assert(title);
  const uri = `${providerName}::${title}`;

  return {
    uri,
    state: { completed: 0, total },

    displayText: (state) => {
      assert(state, `no state for ${uri}`);
      return total ? `${title} ${state.completed}/${state.total}` : `${title}`;
    },
  };
};

exports.contextFromHook = ({ providerName, hookType, hookName }) => {
  assert(providerName);
  assert(hookType);
  assert(hookName);

  return {
    uri: `${providerName}::${hookName}::${hookType}`,
    displayText: () => `${hookName}::${hookType}`,
  };
};

exports.contextFromHookAction = ({
  providerName,
  hookType,
  hookName,
  name,
}) => {
  assert(providerName);
  assert(hookType);
  assert(hookName);
  assert(name);

  return {
    uri: `${providerName}::${hookName}::${hookType}::${name}`,
    displayText: () => name,
  };
};
//TODO
exports.filterClient = async ({
  result,
  client,
  options: { our, name, id, canBeDeleted, provider: providerName },
  lives,
  getProvider,
}) =>
  switchCase([
    get("error"),
    () => result,
    pipe([
      tap((result) => {
        logger.info(
          `filterClient ${tos({
            our,
            name,
            id,
            canBeDeleted,
            providerName,
            type: client.spec.type,
          })}`
        );
      }),
      get("items"),
      filter(not(get("error"))),
      map((live) => ({
        uri: liveToUri({ client, live }),
        name: client.findName(live),
        displayName: client.displayName({
          name: client.findName(live),
          meta: client.findMeta(live),
        }),
        meta: client.findMeta(live),
        id: client.findId(live),
        managedByUs: client.spec.isOurMinion({
          resource: live,
          lives,
          resourceNames: getProvider(client).resourceNames(),
          config: getProvider(client).config(),
        }),
        providerName: client.spec.providerName,
        type: client.spec.type,
        live,
        cannotBeDeleted: client.cannotBeDeleted({
          resource: live,
          name: client.findName(live),
          resourceNames: getProvider(client).resourceNames(),
          config: getProvider(client).config(),
        }),
      })),
      filter((item) => (our ? item.managedByUs : true)),
      filter((item) => (name ? item.name === name : true)),
      filter((item) => (id ? item.id === id : true)),
      filter((item) =>
        providerName ? item.providerName === providerName : true
      ),
      filter((item) => (canBeDeleted ? !item.cannotBeDeleted : true)),
      (resources) => ({
        type: client.spec.type,
        resources,
        providerName: client.providerName,
      }),
      tap((x) => {
        assert(x);
      }),
    ]),
  ])(result);
