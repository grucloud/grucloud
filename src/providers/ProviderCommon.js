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

exports.isValidPlan = not(isEmpty);

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
      logger.info(
        `findDependentType #clients ${clients.length}, types: ${types}`
      );
    }),
    flatMap(
      pipe([
        (type) =>
          filter((client) =>
            isTypeMatch({ type, typeToMatch: client.spec.type })
          )(clients),
        tap((xxx) => {
          //logger.debug(`findDependentType`);
        }),
        pluck("spec.dependsOn"),
        flatten,
      ])
    ),
    tap((types) => {
      logger.info(`findDependentType result: ${types}`);
    }),
  ]);

const filterByType = ({ types = [], targetTypes }) =>
  pipe([
    tap((clients) => {
      logger.info(
        `filterByType inputs #clients ${clients.length}, #targetTypes ${targetTypes.length}, #types ${types.length}`
      );
    }),
    (clients) =>
      filter((client) =>
        pipe([
          () => types,
          switchCase([isEmpty, () => targetTypes, (types) => types]),
          tap(() => {
            assert(client);
            assert(client.spec);
            assert(client.spec.type);
          }),
          switchCase([
            or([
              isEmpty, //TOD never empty
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
        ])()
      )(clients),
    tap((clients) => {
      logger.info(`filterByType result #clients ${clients.length}`);
    }),
  ]);

exports.filterReadClient = ({ options: { types, all } = {}, targetTypes }) =>
  pipe([
    tap((clients) => {
      assert(targetTypes);
      logger.info(
        `filterReadClient types: ${types}, #clients ${clients.length}, #targets: ${targetTypes.length}`
      );
    }),
    filter(not(get("spec.listHide"))),
    switchCase([
      () => all,
      (clients) => clients,
      filterByType({ types, targetTypes }),
    ]),
    tap((clients) => {
      logger.info(
        `filterReadClient types: ${types}, targetTypes: ${targetTypes} #clients ${clients.length}`
      );
    }),
  ]);

exports.filterReadWriteClient = ({
  options: { types, all } = {},
  targetTypes,
}) =>
  pipe([
    tap((clients) => {
      assert(targetTypes);
      logger.info(
        `filterReadWriteClient types: ${types}, all: ${all}, #clients ${clients.length}`
      );
    }),
    switchCase([
      () => all,
      (clients) => clients,
      filterByType({ types, targetTypes }),
    ]),
    filter(and([not(get("spec.singleton")), not(get("spec.listOnly"))])),
    tap((clients) => {
      logger.info(
        `filterReadWriteClient ${types}, result #clients ${clients.length}`
      );
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

const contextFromProvider = ({ providerName }) => {
  assert(providerName);
  return {
    uri: providerName,
    displayText: () => providerName,
  };
};
exports.contextFromProvider = contextFromProvider;

exports.providerRunning = ({ onStateChange, providerName }) =>
  tap(() =>
    onStateChange({
      context: contextFromProvider({ providerName }),
      nextState: "RUNNING",
    })
  );

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
