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
  size,
  pluck,
  forEach,
  find,
  defaultsDeep,
  isDeepEqual,
  includes,
  identity,
  uniq,
  callProp,
} = require("rubico/x");

const logger = require("./logger")({ prefix: "ProviderCommon" });
const { tos } = require("./tos");

const PlanDirection = {
  UP: 1,
  DOWN: -1,
};

exports.PlanDirection = PlanDirection;

const displayType = ({ group, type }) =>
  `${isEmpty(group) ? "" : `${group}::`}${type}`;

exports.displayType = displayType;

const notAvailable = (name, field) => {
  assert(field);
  return `<< ${field} of ${name} not available yet >>`;
};

exports.notAvailable = notAvailable;

exports.hasResultError = any(get("error"));
exports.nextStateOnError = (error) => (error ? "ERROR" : "DONE");

exports.isValidPlan = not(isEmpty);

exports.mergeConfig = ({ configDefault = {}, config, configs = [] }) =>
  pipe([
    tap(() => {
      assert(true);
    }),
    () => [...configs, config],
    filter((x) => x),
    reduce((acc, config) => defaultsDeep(acc)(config(acc)), configDefault),
    tap((merged) => {
      logger.info(`mergeConfig : ${tos(merged)}`);
    }),
  ])();

exports.getField = ({ resource = {}, live } = {}, field) =>
  get(field, notAvailable(resource.name, field))(live);

exports.findClient = (clients) =>
  pipe([
    tap(({ type, group }) => {
      assert(type);
      //assert(group);
    }),
    ({ type, group }) =>
      pipe([
        () => clients,
        find(and([eq(get("spec.type"), type), eq(get("spec.group"), group)])),
      ])(),
  ]);

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

const findDependentType = ({ type, specs }) =>
  pipe([
    tap(() => {
      assert(type);
    }),
    () => specs,
    find(eq(get("type"), type)),
    get("dependsOn", []),
    flatMap((type) => findDependentType({ type, specs })),
    //TODO prepend
    (results) => [type, ...results],
    tap((results) => {
      //logger.debug(`findDependentTypes ${type}, result: ${results}`);
    }),
  ])();

const findDependentTypes = ({ types, clients }) =>
  pipe([
    tap(() => {
      // logger.debug(
      //   `findDependentTypes #clients ${size(clients)}, types: ${size(types)}`
      // );
    }),
    () => types,
    flatMap((type) =>
      findDependentType({ type, specs: pluck("spec")(clients) })
    ),
    uniq,
    tap((results) => {
      // logger.debug(`findDependentTypes results: ${results}`);
    }),
  ])();

const filterByType = ({ types = [], targetTypes }) =>
  pipe([
    tap((clients) => {
      logger.info(
        `filterByType inputs #clients ${size(clients)}, #targetTypes ${size(
          targetTypes
        )}, #types ${size(types)}`
      );
    }),
    (clients) =>
      filter((client) =>
        pipe([
          () => types,
          switchCase([isEmpty, () => targetTypes, identity]),
          tap(() => {
            assert(client);
            assert(client.spec);
            assert(client.spec.type);
          }),
          switchCase([
            or([
              isEmpty, //TOD never empty
              pipe([
                tap((params) => {
                  assert(true);
                }),
                (types) => findDependentTypes({ types, clients }),
                tap((dependentTypes) => {
                  assert(client);
                  assert(client.spec);
                  assert(client.spec.type);
                }),
                includes(client.spec.type),
                tap((keep) => {
                  logger.debug(
                    `filterByType ${client.spec.groupType}, keep: ${keep}`
                  );
                }),
              ]),
            ]),
            () => true,
            isTypesMatch({ typeToMatch: client.spec.type }),
          ]),
        ])()
      )(clients),
    tap((clients) => {
      logger.info(
        `filterByType result #clients ${pluck("spec.type")(clients)}`
      );
    }),
  ]);

const displayClientsType = pipe([
  pluck("spec"),
  map(displayType),
  callProp("join", ", "),
]);

exports.filterReadClient = ({ options: { types, all } = {}, targetTypes }) =>
  pipe([
    tap((clients) => {
      assert(targetTypes);
      logger.info(
        `filterReadClient types: ${types}, all: ${all}, #clients ${clients.length}, #targets: ${targetTypes.length}`
      );
    }),
    filter(not(get("spec.listHide"))),
    //TODO unless
    switchCase([
      () => all,
      identity,
      filterByType({ types, all, targetTypes }),
    ]),
    tap((clients) => {
      logger.info(
        `filterReadClient types: ${types}, ${size(
          targetTypes
        )} targetTypes: ${targetTypes}`
      );

      logger.info(
        `filterReadClient #clients ${size(
          clients
        )}, final types: ${displayClientsType(clients)}`
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
      filterByType({ types, all, targetTypes }),
    ]),
    filter(and([not(get("spec.singleton")), not(get("spec.listOnly"))])),
    tap((clients) => {
      logger.info(
        `filterReadWriteClient ${types}, result #clients ${
          clients.length
        }, ${displayClientsType(clients)}`
      );
    }),
  ]);

exports.contextFromResource = ({ operation, resource }) => {
  assert(operation);
  assert(resource);
  const { type, group, providerName } = resource;
  assert(type);
  assert(
    providerName,
    `missing provider in resource: ${JSON.stringify(resource)}`
  );

  const uri = `${providerName}::${operation}::${displayType({ group, type })}`;
  const displayText = (state) => {
    if (!state) {
      assert(state, `no state for ${uri}`);
    }
    return `${displayType({ group, type })} ${state.completed}/${state.total}`;
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
  const { type, providerName, group } = client.spec;
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
    uri: `${providerName}::${title}::${displayType({ group, type })}`,
    displayText: () => displayType({ group, type }),
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
  const { provider, type, group, resources } = resourcesPerType;
  assert(Array.isArray(resources), "Array.isArray(resources)");
  return {
    uri: `${provider}::${operation}::${displayType({ group, type })}`,
    displayText: (state) =>
      `${displayType({ group, type })} ${state.completed}/${state.total}`,
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

// Global Hooks
exports.contextFromHookGlobal = ({ hookType }) => {
  assert(hookType);

  return {
    uri: `hookGlobal::${hookType}`,
    displayText: () => `hook::${hookType}`,
  };
};

exports.contextFromHookGlobalInit = ({ hookType }) => {
  assert(hookType);

  return {
    uri: `hookGlobal::init`,
    displayText: () => "Initialising",
  };
};

exports.contextFromHookGlobalAction = ({ hookType, name }) => {
  assert(hookType);
  assert(name);

  return {
    uri: `hookGlobal::${hookType}::${name}`,
    displayText: () => name,
  };
};
