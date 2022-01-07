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
  any,
  reduce,
  fork,
  eq,
  not,
  and,
  or,
} = require("rubico");

const {
  isString,
  isEmpty,
  size,
  pluck,
  find,
  defaultsDeep,
  includes,
  identity,
  uniq,
  callProp,
  when,
  unless,
  prepend,
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
    callProp("reverse"),
    reduce(
      (acc, config) =>
        pipe([
          () => config(acc),
          tap((params) => {
            assert(true);
          }),
          defaultsDeep(acc),
          tap((params) => {
            assert(true);
          }),
        ])(),
      configDefault
    ),
    defaultsDeep(configDefault),
    tap((merged) => {
      //logger.info(`mergeConfig : ${tos(merged)}`);
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
        //TODO groupType
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

const findDependentType =
  ({ groupTypesAcc, specs }) =>
  (groupType) =>
    pipe([
      tap(() => {
        assert(isString(groupType));
        assert(Array.isArray(groupTypesAcc));
        // logger.debug(`findDependentType ${groupType} ${size(groupTypesAcc)}`);
        //assert(!includes(groupType)(groupTypesAcc));
      }),
      pipe([
        () => specs,
        find(eq(get("groupType"), groupType)),
        get("dependsOn", []),
        filter(not(eq(identity, groupType))),
        // tap((groupTypes) => {
        //   logger.debug("groupType", groupType, `, groupTypes: ${groupTypes}`);
        // }),
        (groupTypes) =>
          pipe([
            () => groupTypes,
            tap((params) => {
              assert(true);
            }),
            filter(
              not((groupType) =>
                pipe([
                  () => groupTypesAcc,
                  // tap(() => {
                  //   logger.debug(
                  //     `AA ${groupType} ${size(groupTypesAcc)}, ${groupTypesAcc}`
                  //   );
                  // }),
                  any(eq(identity, groupType)),
                  // tap.if(identity, (params) => {
                  //   logger.debug("reject ", groupType);
                  // }),
                ])()
              )
            ),
            tap((params) => {
              assert(true);
            }),
            // tap((groupTypes) => {
            //   logger.debug(
            //     "\ngroupType",
            //     groupType,
            //     `, updated groupTypes: ${groupTypes}`
            //   );
            // }),
            (groupTypes) =>
              pipe([
                () => groupTypes,
                // tap((params) => {
                //   logger.debug(
                //     `BB ${groupType} #groupTypesAcc ${size(
                //       groupTypesAcc
                //     )}, #groupTypes ${size(groupTypes)}`
                //   );
                // }),
                flatMap(
                  findDependentType({
                    groupTypesAcc: [...groupTypesAcc, ...groupTypes],
                    specs,
                  })
                ),
              ])(),
            tap((params) => {
              assert(true);
            }),
            prepend(groupType),
            // tap((results) => {
            //   logger.debug(
            //     `findDependentType ${groupType}, results: ${results}, depth: ${depth}`
            //   );
            // }),
            tap((params) => {
              assert(true);
            }),
          ])(),
      ]),
      // ]),
    ])();

const findDependentTypes = ({ groupTypes, clients }) =>
  pipe([
    // tap(() => {
    //   logger.debug(
    //     `\n\n\nfindDependentTypes #clients ${size(clients)}, groupTypes: ${size(
    //       groupTypes
    //     )}`
    //   );
    // }),
    () => groupTypes,
    flatMap(
      findDependentType({ groupTypesAcc: [], specs: pluck("spec")(clients) })
    ),
    uniq,
    // tap((results) => {
    //   logger.debug(`\n\nfindDependentTypes results: ${results}`);
    // }),
  ])();

//TODO targetTypes => targetGroupTypes
const filterByType =
  ({ types = [], groups = [], targetTypes }) =>
  (clients) =>
    pipe([
      tap(() => {
        logger.debug(
          `filterByType inputs #clients ${size(clients)}, #targetTypes ${size(
            targetTypes
          )}, #types ${size(types)}, #groups ${size(groups)}`
        );
        assert(Array.isArray(clients));
      }),
      () => clients,
      filter((client) =>
        pipe([
          () => types,
          when(isEmpty, () => targetTypes),
          tap((params) => {
            assert(client);
            assert(client.spec);
            assert(client.spec.groupType);
            assert(client.spec.type);
          }),
          switchCase([
            or([
              isEmpty,
              pipe([
                tap((params) => {
                  assert(true);
                }),
                (groupTypes) => findDependentTypes({ groupTypes, clients }),
                tap((dependentTypes) => {
                  assert(dependentTypes);
                }),
                includes(client.spec.groupType),
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
      ),
      tap((clients) => {
        logger.info(
          `filterByType result #clients ${pluck("spec.groupType")(clients)}`
        );
      }),
    ])();

const displayClientsType = pipe([
  pluck("spec"),
  map(displayType),
  callProp("join", ", "),
]);

const findClientByGroupType = (clients) => (groupType) =>
  pipe([
    tap(() => {
      assert(Array.isArray(clients));
      assert(groupType);
    }),
    () => clients,
    find(eq(get("spec.groupType"), groupType)),
    tap((params) => {
      assert(true);
    }),
  ])();

const findClientDependencies =
  ({ clients }) =>
  (client) =>
    pipe([
      tap(() => {
        assert(clients);
        assert(client);
        logger.debug(
          `findClientDependencies groupType: ${
            client.spec.groupType
          }, #clients ${size(clients)}`
        );
      }),
      () => client,
      get("spec.dependsOnList", []),
      tap((params) => {
        assert(true);
      }),
      filter(not(eq(identity, client.spec.groupType))),
      map(findClientByGroupType(clients)),
      tap((params) => {
        assert(true);
      }),
      filter(not(isEmpty)),
      flatMap(findClientDependencies({ clients })),
      prepend(client),
    ])();

const addDependentClients = (clientsAll) => (clients) =>
  pipe([
    tap(() => {
      assert(clients);
      assert(clientsAll);
      logger.debug(
        `addDependentClients #clientsAll ${size(clientsAll)}, #clients ${size(
          clients
        )}`
      );
    }),
    () => clients,
    flatMap(findClientDependencies({ clients: clientsAll })),
    filter(not(isEmpty)),
    uniq,
    tap((clientsDependents) => {
      logger.debug(
        `addDependentClients #clientsAll ${size(
          clientsAll
        )}, #clientsDependents ${size(clientsDependents)}`
      );
    }),
  ])();

exports.filterReadClient =
  ({ options: { types, all, group: groups } = {}, targetTypes }) =>
  (clients) =>
    pipe([
      tap(() => {
        assert(targetTypes);
        logger.info(
          `filterReadClient types: ${types}, all: ${all}, #clients ${size(
            clients
          )}, #targets: ${size(targetTypes)}, groups:${groups} `
        );
      }),
      () => clients,
      filter(not(get("spec.listHide"))),
      unless(() => all, filterByType({ types, groups, all, targetTypes })),
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
      addDependentClients(clients),
    ])();

exports.filterReadWriteClient =
  ({ options: { types, groups, all } = {}, targetTypes }) =>
  (clients) =>
    pipe([
      tap(() => {
        assert(targetTypes);
        logger.info(
          `filterReadWriteClient types: ${types}, all: ${all}, #clients ${size(
            clients
          )}`
        );
      }),
      () => clients,
      unless(() => all, filterByType({ types, all, targetTypes })),
      filter(and([not(get("spec.singleton")), not(get("spec.listOnly"))])),
      tap((clients) => {
        logger.info(
          `filterReadWriteClient ${types}, result #clients ${size(
            clients
          )}, ${displayClientsType(clients)}`
        );
      }),
      addDependentClients(clients),
    ])();

const setCompleted = ({ state, uri, spinnies, spinnerMap, displayText }) => {
  const completed = state.completed + 1;
  const newState = { ...state, completed };
  spinnies.update(uri, {
    text: displayText(newState),
    color: "blue",
    status: "spinning",
  });

  spinnerMap.set(uri, { state: newState });

  if (completed === state.total) {
    spinnies.succeed(uri);
    spinnerMap.delete(uri);
  }
};

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

      setCompleted({ state, uri, spinnies, spinnerMap, displayText });
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

      setCompleted({ state, uri, spinnies, spinnerMap, displayText });
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
