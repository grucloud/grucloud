const assert = require("assert");
const {
  pipe,
  map,
  flatMap,
  and,
  tap,
  filter,
  get,
  not,
  eq,
  any,
  switchCase,
} = require("rubico");
const {
  pluck,
  flatten,
  isEmpty,
  size,
  groupBy,
  values,
  find,
  identity,
  isString,
  isObject,
  includes,
  callProp,
} = require("rubico/x");
const logger = require("./logger")({ prefix: "Graph" });

const {
  formatNodeName,
  formatNamespace,
  buildSubGraphClusterNamespace,
  buildSubGraphClusterProvider,
  buildGraphRootLabel,
} = require("./GraphCommon");

const NamespacesHide = ["kube-system", "kube-public", "kube-node-lease"];

const ResourceTypesHide = ["Namespace"];

const matchId = (idToMatch) =>
  pipe([
    tap(() => {
      assert(idToMatch);
    }),
    get("id"),
    tap((id) => {
      assert(id);
    }),
    eq(callProp("toUpperCase"), idToMatch.toUpperCase()),
  ]);

const nodeNameFromResource = (resource) => resource.name || resource.id;

const buildNode =
  ({
    namespace,
    options: {
      cluster: { node },
    },
  }) =>
  (resource) =>
    pipe([
      tap(() => {
        if (!resource.id) {
          assert(resource.id, `no id`);
        }
      }),
      () =>
        `"${resource.type}::${namespace}::${nodeNameFromResource(
          resource
        )}" [label=<
  <table color='${node.color}' border="0">
     <tr><td align="text"><FONT color='${node.type.fontColor}' POINT-SIZE="${
          node.type.pointSize
        }"><B>${resource.groupType}</B></FONT><br align="left" /></td></tr>
     <tr><td align="text"><FONT color='${node.name.fontColor}' POINT-SIZE="${
          node.name.pointSize
        }">${formatNodeName({
          name: nodeNameFromResource(resource),
        })}</FONT><br align="left" /></td></tr>
  </table>>];\n`,
    ])();

const buildSubGraph = ({ providerName, options, namespace, resources }) =>
  pipe([
    tap(() => {
      assert(options);
    }),
    () => resources,
    map(buildNode({ namespace, options })),
    callProp("join", "\n"),
    buildSubGraphClusterNamespace({ namespace, providerName, options }),
  ])();

//TODO
const resourceNameFilterDefault = pipe([
  get("name"),
  tap((name) => {
    assert(name);
    if (!name.startsWith) {
      assert(false);
    }
  }),
  and([
    //({ name }) => !name.startsWith("kube"),
    (name) => !name.startsWith("system"),
    //({ name }) => !name.startsWith("default"),
  ]),
]);

const filterResources =
  ({
    namespacesHide = NamespacesHide,
    resourceTypesHide = ResourceTypesHide,
    resourceNameFilter = resourceNameFilterDefault,
  }) =>
  (resources) =>
    pipe([
      tap(() => {
        logger.debug(`filterResources #resources ${size(resources)}`);
      }),
      () => resources,
      filter(not(isEmpty)),
      filter(
        and([
          get("show"),
          (resource) => not(includes(resource.namespace))(namespacesHide),
          (resource) => not(includes(resource.type))(resourceTypesHide),
          resourceNameFilter,
        ])
      ),
      tap((filteredResources) => {
        logger.debug(
          `filterResources filtered #resources ${size(resources)} to ${size(
            filteredResources
          )}`
        );
      }),
    ])();

const buildSubGraphLive = ({ providerName, resourcesPerType, options }) =>
  pipe([
    tap(() => {
      logger.debug(`buildSubGraphLive`);
      assert(providerName);
      assert(Array.isArray(resourcesPerType));
    }),
    () => resourcesPerType,
    pluck("resources"),
    flatten,
    filter(not(isEmpty)),
    tap((xxx) => {
      logger.debug(`buildSubGraphLive`);
      //TODO check error
    }),
    filterResources(options),
    groupBy("namespace"),
    tap((xxx) => {
      logger.debug(`buildGraphNode`);
    }),
    map.entries(([namespace, resources]) => [
      namespace,
      buildSubGraph({
        providerName,
        options,
        namespace: formatNamespace(namespace),
        resources,
      }),
    ]),
    values,
    switchCase([
      isEmpty,
      () => "",
      pipe([
        callProp("join", "\n"),
        buildSubGraphClusterProvider({ options, providerName }),
      ]),
    ]),
    tap((result) => {
      logger.debug(`buildSubGraphLive done`);
    }),
  ])();

const findNamespace = ({ type, id, resources }) =>
  pipe([
    () => resources,
    find(matchId(id)),
    get("namespace"),
    formatNamespace,
    tap((namespace) => {
      // logger.debug(
      //   `findNamespace type: ${type}, id: ${id}, namespace: ${namespace}`
      // );
    }),
  ])();

const buildNodeFrom = ({ type, namespaceFrom, idFrom, nameFrom }) =>
  `${type}::${formatNamespace(namespaceFrom)}::${nameFrom || idFrom}`;

const buildNodeToId = ({ dependency, idTo, nameTo, resources }) =>
  `${dependency.type}::${findNamespace({
    type: dependency.type,
    id: idTo,
    resources,
  })}::${nameTo || idTo}`;

const associationIdString = ({
  options: { edge },
  type,
  namespace: namespaceFrom,
  idFrom,
  idTo,
  nameFrom,
  nameTo,
  dependency,
  resources,
}) =>
  pipe([
    tap(() => {
      assert(idTo);
      assert(nameFrom);
      assert(nameTo);
      logger.debug(
        `associationIdString ${JSON.stringify({
          nameFrom,
          nameTo,
          type,
          namespaceFrom,
          idFrom,
          idTo,
        })}`
      );
    }),
    () => resources,
    switchCase([
      pipe([find(matchId(idTo)), get("show")]),
      pipe([
        () => ({
          nodeFrom: buildNodeFrom({ type, namespaceFrom, idFrom, nameFrom }),
          nodeTo: buildNodeToId({
            dependency,
            resources,
            idTo,
            nameTo,
          }),
        }),
        ({ nodeFrom, nodeTo }) =>
          `"${nodeFrom}" -> "${nodeTo}" [color="${edge.color}"];`,
      ]),
      pipe([
        tap(() => {
          console.error(`Ignore ${nameFrom} ${nameTo}`);
        }),
        () => "",
      ]),
    ]),
  ])();

const associationIdObject = ({
  options: { edge },
  type,
  idFrom,
  namespaceFrom,
  dependencyId,
  dependency,
  resources,
}) =>
  pipe([
    tap((id) => {
      //assert(resources);
    }),
    () => resources,
    switchCase([
      pipe([
        find(
          and([
            eq(get("name"), dependencyId.name),
            eq(get("namespace"), dependencyId.namespace),
          ])
        ),
        get("show"),
      ]),
      pipe([
        () => ({
          nodeFrom: `"${buildNodeFrom({ type, namespaceFrom, idFrom })}"`,
          nodeTo: `"${dependency.type}::${dependencyId.namespace}::${dependencyId.name}"`,
        }),
        ({ nodeFrom, nodeTo }) =>
          `${nodeFrom} -> ${nodeTo} [color="${edge.color}"];`,
        tap((xx) => {
          logger.debug(``);
        }),
      ]),
      () => "",
    ]),
    tap((xxx) => {
      logger.debug(``);
    }),
  ]);
const getResourceByType = ({ resourcesPerType, groupType }) =>
  pipe([
    () => resourcesPerType,
    find(eq(get("groupType"), groupType)),
    get("resources"),
  ])();

const buildGraphAssociationLive = ({ resourcesPerType, options }) =>
  pipe([
    tap(() => {
      logger.debug(`buildGraphAssociationLive`);
      assert(Array.isArray(resourcesPerType));
    }),
    () => resourcesPerType,
    pluck("resources"),
    flatten,
    filterResources(options),
    filter(pipe([get("dependencies"), not(isEmpty)])),
    flatMap(
      ({ providerName, type, group, namespace, id, name, dependencies }) =>
        pipe([
          tap(() => {
            logger.debug(
              `buildGraphAssociationLive ${providerName}, type ${type}, name: ${name}, namespace: ${namespace}, #dependencies ${size(
                dependencies
              )}, id, ${id}`
            );
            assert(id);
            assert(name);
          }),
          () => dependencies,
          map((dependency) =>
            pipe([
              tap(() => {
                assert(dependency.type);
                assert(dependency.groupType);
                logger.debug(
                  `dependency type ${dependency.type}, #ids ${size(
                    dependency.ids
                  )}`
                );
              }),
              () => dependency,
              get("ids", []),
              filter(not(isEmpty)),
              map((dependencyId) =>
                switchCase([
                  isString,
                  (idTo) =>
                    pipe([
                      () => resourcesPerType,
                      find(eq(get("groupType"), dependency.groupType)),
                      get("resources"),
                      find(matchId(idTo)),
                      tap.if(isEmpty, () => {
                        console.error(
                          `no resource for id: ${idTo}, type: ${dependency.groupType}, from ${name}, type: ${type}`
                        );
                      }),
                      get("name"),
                      switchCase([
                        isEmpty,
                        () => "",
                        (nameTo) =>
                          associationIdString({
                            options,
                            type,
                            idFrom: id,
                            nameFrom: name,
                            idTo,
                            nameTo,
                            namespace,
                            dependency,
                            resources: getResourceByType({
                              resourcesPerType,
                              groupType: dependency.groupType,
                            }),
                          }),
                      ]),
                    ])(),
                  isObject,
                  (dependencyId) =>
                    associationIdObject({
                      options,
                      type,
                      idFrom: id,
                      namespaceFrom: namespace,
                      dependency,
                      dependencyId,
                      resources: getResourceByType({
                        resourcesPerType,
                        groupType: dependency.groupType,
                      }),
                    })(),
                  (dependencyId) => {
                    assert(
                      false,
                      `dependencyId not valid: ${JSON.stringify({
                        type,
                        namespace,
                        id,
                        dependencyId,
                      })}`
                    );
                  },
                ])(dependencyId)
              ),
            ])()
          ),
        ])()
    ),
    flatten,
    callProp("join", "\n"),
    tap((result) => {
      logger.debug(`buildGraphAssociationLive done`);
    }),
  ])();

exports.buildGraphLive = ({ lives, options }) =>
  pipe([
    tap(() => {
      logger.info(`buildGraphLive`);
    }),
    () => `digraph graphname {
  ${buildGraphRootLabel({ options })}

  # Nodes
  ${pipe([
    map(({ providerName, results }) =>
      buildSubGraphLive({ providerName, resourcesPerType: results, options })
    ),
    callProp("join", "\n"),
  ])(lives)}
  # Association
  ${pipe([
    map(({ results }) =>
      buildGraphAssociationLive({ resourcesPerType: results, options })
    ),
    callProp("join", "\n"),
  ])(lives)}
}`,
    tap((result) => {
      logger.info(`buildGraphLive done`);
    }),
  ])();
