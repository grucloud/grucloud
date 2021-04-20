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
} = require("rubico/x");
const logger = require("./logger")({ prefix: "Graph" });

const { formatNodeName, formatNamespace } = require("./GraphCommon");

const NamespacesHide = ["kube-system", "kube-public", "kube-node-lease"];

const ResourceTypesHide = ["Namespace"];

const color = "#383838";
const colorLigher = "#707070";
const fontName = "Helvetica";

const nodeNameFromResource = (resource) => resource.name || resource.id;

const buildNode = ({ resource, namespace }) => `"${
  resource.type
}::${namespace}::${resource.id}" [label=<
  <table color='${color}' border="0">
     <tr><td align="text"><FONT color='${colorLigher}' POINT-SIZE="16"><B>${
  resource.type
}</B></FONT><br align="left" /></td></tr>
     <tr><td align="text"><FONT color='${color}' POINT-SIZE="18">${formatNodeName(
  { name: nodeNameFromResource(resource) }
)}</FONT><br align="left" /></td></tr>
  </table>>];\n`;

const buildSubGraph = ({ providerName, namespace, resources }) =>
  pipe([
    () => resources,
    map((resource) => buildNode({ resource, namespace })),
    (nodes) => nodes.join("\n"),
    tap((xxx) => {
      logger.debug(`buildSubGraph`, xxx);
    }),
    (result) =>
      `subgraph "cluster_${providerName}_${namespace}" {
            fontname=${fontName}
            color="${color}"
            label=<<FONT color='${color}' POINT-SIZE="20"><B>${namespace}</B></FONT>>;
            node [shape=box fontname=${fontName} color="${color}"]
            ${result}}
            `,
    tap((xxx) => {
      logger.debug(`buildSubGraph`, xxx);
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
        namespace: formatNamespace(namespace),
        resources,
      }),
    ]),
    values,
    switchCase([
      isEmpty,
      () => "",
      pipe([
        (results) => results.join("\n"),
        (result) =>
          `subgraph "cluster_${providerName}" {
          fontname=${fontName}
          color="${color}"
          label=<<FONT color='${color}' POINT-SIZE="20"><B>${providerName}</B></FONT>>;
          node [shape=box fontname=${fontName} color="${color}"]
          ${result}}
          `,
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
      })}::${id}" [color="${color}"];`,
  ]);

const associationIdObject = ({ type, idFrom, dependency }) =>
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
      `${nodeFrom(type, namespace, idFrom)} -> "${
        dependency.type
      }::${namespace}::${name}" [color="${color}"];`,
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
              assert(Array.isArray(dependency.ids)),
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
                  type,
                  idFrom: id,
                  namespace,
                  dependency,
                  resourcesPerType,
                }),
                isObject,
                associationIdObject({ type, idFrom: id, dependency }),
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
    (result) => result.join("\n"),
    tap((result) => {
      logger.debug(`buildGraphAssociationLive done`);
    }),
  ])();
