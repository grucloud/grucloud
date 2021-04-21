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
  gte,
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
} = require("./GraphCommon");

const NamespacesHide = ["kube-system", "kube-public", "kube-node-lease"];

const ResourceTypesHide = ["Namespace"];

const nodeNameFromResource = (resource) => resource.name || resource.id;

const buildNode = ({
  namespace,
  options: {
    cluster: { node },
  },
}) => (resource) => `"${resource.type}::${namespace}::${resource.id}" [label=<
  <table color='${node.color}' border="0">
     <tr><td align="text"><FONT color='${node.type.fontColor}' POINT-SIZE="${
  node.type.pointSize
}"><B>${resource.type}</B></FONT><br align="left" /></td></tr>
     <tr><td align="text"><FONT color='${node.name.fontColor}' POINT-SIZE="${
  node.name.pointSize
}">${formatNodeName({
  name: nodeNameFromResource(resource),
})}</FONT><br align="left" /></td></tr>
  </table>>];\n`;

const buildSubGraph = ({ providerName, options, namespace, resources }) =>
  pipe([
    tap((xxx) => {
      assert(options);
    }),
    () => resources,
    map(buildNode({ namespace, options })),
    callProp("join", "\n"),
    tap((xxx) => {
      assert(true);
    }),
    buildSubGraphClusterNamespace({ namespace, providerName, options }),
    tap((xxx) => {
      assert(true);
    }),
  ])();

const resourceNameFilterDefault = and([
  ({ name }) => !name.startsWith("kube"),
  ({ name }) => !name.startsWith("system"),
  //({ name }) => !name.startsWith("default"),
]);

const filterResources = ({
  namespacesHide = NamespacesHide,
  resourceTypesHide = ResourceTypesHide,
  resourceNameFilter = resourceNameFilterDefault,
}) =>
  pipe([
    tap((resources) => {
      logger.debug(`buildSubGraphLive #resources ${size(resources)}`);
    }),
    filter(not(isEmpty)),
    filter(
      and([
        (resource) => not(includes(resource.namespace))(namespacesHide),
        (resource) => not(includes(resource.type))(resourceTypesHide),
        resourceNameFilter,
      ])
    ),
    tap((resources) => {
      logger.debug(`buildSubGraphLive filtered #resources ${size(resources)}`);
    }),
  ]);

exports.buildSubGraphLive = ({ providerName, resourcesPerType, options }) =>
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

const findNamespace = ({ type, id, resourcesPerType }) =>
  pipe([
    () => resourcesPerType,
    find(eq(get("type"), type)),
    get("resources"),
    find(eq(get("id"), id)),
    get("namespace"),
    formatNamespace,
    tap((namespace) => {
      logger.debug(
        `findNamespace type: ${type}, id: ${id}, namespace: ${namespace}`
      );
    }),
  ])();

const nodeFrom = (type, namespace, id) =>
  `"${type}::${formatNamespace(namespace)}::${id}"`;

const associationIdString = ({
  options: { edge },
  type,
  namespace,
  idFrom,
  dependency,
  resourcesPerType,
}) =>
  pipe([
    tap((id) => {
      if (!id) {
        assert(id);
      }
    }),
    (id) =>
      `${nodeFrom(type, namespace, idFrom)} -> "${
        dependency.type
      }::${findNamespace({
        type: dependency.type,
        id,
        resourcesPerType,
      })}::${id}" [color="${edge.color}"];`,
  ]);

const associationIdObject = ({
  options: { edge },
  type,
  idFrom,
  namespaceFrom,
  dependency,
}) =>
  pipe([
    tap((xxx) => {
      assert(true);
    }),
    tap(({ name, namespace }) => {
      assert(name);
      if (!namespace) {
        assert(true);
      }
    }),
    ({ name, namespace }) =>
      `${nodeFrom(type, namespaceFrom, idFrom)} -> "${
        dependency.type
      }::${namespace}::${name}" [color="${edge.color}"];`,
  ]);

exports.buildGraphAssociationLive = ({ resourcesPerType, options }) =>
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
    flatMap(({ providerName, type, namespace, id, dependencies }) =>
      pipe([
        tap(() => {
          logger.debug(
            `${providerName}, type ${type}, id, ${id}, namespace: ${namespace}, #dependencies ${size(
              dependencies
            )}`
          );
        }),
        () => dependencies,
        map((dependency) =>
          pipe([
            tap(() => {
              assert(dependency.type);
              assert(
                Array.isArray(dependency.ids),
                `no ids array in ${JSON.stringify({
                  type,
                  providerName,
                  dependency,
                })}`
              );
              logger.debug(
                `type ${dependency.type}, #ids ${size(dependency.ids)}`
              );
            }),
            () => dependency.ids,
            filter(not(isEmpty)),
            map((dependencyId) =>
              switchCase([
                isString,
                associationIdString({
                  options,
                  type,
                  idFrom: id,
                  namespace,
                  dependency,
                  resourcesPerType,
                }),
                isObject,
                associationIdObject({
                  options,
                  type,
                  idFrom: id,
                  namespaceFrom: namespace,
                  dependency,
                }),
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
