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
  switchCase,
} = require("rubico");
const { pluck, flatten, isEmpty, size, groupBy, values } = require("rubico/x");
const includes = require("rubico/x/includes");

const logger = require("./logger")({ prefix: "Graph" });

const NamespacesHide = ["kube-system", "kube-public", "kube-node-lease"];

const ResourceTypesHide = ["Namespace"];

const color = "#383838";
const colorLigher = "#707070";
const fontName = "Helvetica";

const buildNode = ({ resource, namespace }) => `"${resource.type}::${
  resource.id
}" [label=<
  <table color='${color}' border="0">
     <tr><td align="text"><FONT color='${colorLigher}' POINT-SIZE="16"><B>${
  resource.type
}</B></FONT><br align="left" /></td></tr>
     <tr><td align="text"><FONT color='${color}' POINT-SIZE="18">${
  resource.name || resource.id
}</FONT><br align="left" /></td></tr>
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
  filter(
    and([
      (resource) => not(includes(resource.namespace))(namespacesHide),
      (resource) => not(includes(resource.type))(resourceTypesHide),
      resourceNameFilter,
    ])
  );

exports.buildSubGraphLive = ({ providerName, resourcesPerType, options }) =>
  pipe([
    tap(() => {
      logger.debug(`buildGraphNode`);
      assert(providerName);
      assert(Array.isArray(resourcesPerType));
    }),
    () => resourcesPerType,
    pluck("resources"),
    flatten,
    tap((xxx) => {
      logger.debug(`buildGraphNode`);
      //TODO check error
    }),
    filterResources(options),
    groupBy("namespace"),
    tap((xxx) => {
      logger.debug(`buildGraphNode`);
    }),
    map.entries(([namespace, resources]) => [
      namespace,
      buildSubGraph({ providerName, namespace, resources }),
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
      logger.debug(`buildGraphNode done`);
    }),
  ])();

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
    flatMap(({ providerName, type, id, dependencies }) =>
      pipe([
        tap(() => {
          logger.debug(
            `${providerName}, type ${type}, id, ${id}, #dependencies ${size(
              dependencies
            )}`
          );
        }),
        () => dependencies,
        map((dependency) =>
          pipe([
            tap(() => {
              logger.debug(
                `type ${dependency.type}, #ids ${size(dependency.ids)}`
              );
            }),
            () => dependency.ids,
            map(
              (dependencyId) =>
                `"${type}::${id}" -> "${dependency.type}::${dependencyId}" [color="${color}"];`
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
