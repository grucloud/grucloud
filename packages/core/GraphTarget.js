const { AssertionError } = require("assert");
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
  reduce,
} = require("rubico");
const { callProp, isEmpty, size, groupBy, values } = require("rubico/x");
const logger = require("./logger")({ prefix: "Graph" });

const { formatNodeName, formatNamespace } = require("./GraphCommon");

const buildNode = ({ cluster }) => (resource) => `"${resource.type}::${
  resource.name
}" [fillcolor="${cluster.node.fillColor}" color="${
  cluster.node.color
}" style=filled label=<
  <table color='${cluster.node.color}' border="0">
     <tr><td align="text"><FONT color='${
       cluster.node.type.fontColor
     }' POINT-SIZE="${cluster.node.type.pointSize}"><B>${
  resource.type
}</B></FONT><br align="left" /></td></tr>
     <tr><td align="text"><FONT color='${
       cluster.node.name.fontColor
     }' POINT-SIZE="${cluster.node.name.pointSize}">${formatNodeName({
  name: resource.name,
})}</FONT><br align="left" /></td></tr>
  </table>>];\n`;

const buildNodes = ({ options }) =>
  pipe([
    tap((resources) => {
      assert(true);
    }),
    map(buildNode(options)),
    callProp("join", "\n"),
    tap((nodes) => {
      assert(true);
    }),
  ]);

const buildEdge = ({ edge }) => ({ resource, dependency }) =>
  `"${resource.type}::${resource.name}" -> "${dependency.type}::${dependency.name}" [color="${edge.color}"];\n`;

const buildSubGraphClusterProvider = ({
  providerName,
  options: { fontName, cluster },
}) => (content) => `subgraph "cluster_${providerName}" {
    fontname=${fontName}
    style=filled;
    color="${cluster.provider.color}"
    fillcolor="${cluster.provider.fillColor}";
    label=<<FONT color='${cluster.provider.fontColor}' POINT-SIZE="${
  cluster.provider.pointSize
}"><B>${providerName.toUpperCase()}</B></FONT>>;
    ${content}}
    `;

const buildSubGraphClusterNamespace = ({
  options: { fontName, cluster },
  providerName,
  namespace,
}) => (content) => `subgraph "cluster_${providerName}_${namespace}" {
        fontname=${fontName}
        style=filled;
        color="${cluster.namespace.color}";
        fillcolor="${cluster.namespace.fillColor}";
        label=<<FONT color='${cluster.namespace.fontColor}' POINT-SIZE="${cluster.namespace.pointSize}"><B>${namespace}</B></FONT>>;
        node [shape=box style=filled fontname=${fontName} fillcolor="${cluster.node.fillColor}" color="${cluster.node.color}"]
        ${content}}
        `;

const buildNamespaceGraph = ({ options, providerName, namespace, resources }) =>
  pipe([
    tap(() => {
      assert(true);
    }),
    () => resources,
    buildNodes({ options, namespace }),
    buildSubGraphClusterNamespace({ namespace, providerName, options }),
    tap((xxx) => {
      assert(true);
    }),
  ])();

exports.buildSubGraph = ({ providerName, resources, options }) =>
  pipe([
    tap((xxx) => {
      logger.debug(`buildSubGraph`);
    }),
    () => resources,
    groupBy("namespace"),
    tap((xxx) => {
      logger.debug(`buildSubGraph`);
    }),
    map.entries(([namespace, resources]) => [
      namespace,
      buildNamespaceGraph({
        providerName,
        options,
        namespace: formatNamespace(namespace),
        resources,
      }),
    ]),
    values,
    tap((xxx) => {
      assert(true);
    }),
    //callProp("reverse"),
    callProp("join", "\n"),
    buildSubGraphClusterProvider({ options, providerName }),
    tap((result) => {
      assert(true);
    }),
  ])();

exports.buildGraphAssociation = ({ resources, options }) =>
  pipe([
    tap(() => {
      logger.debug(`buildGraphAssociation `);
      assert(Array.isArray(resources));
    }),
    () => resources,
    map((resource) =>
      pipe([
        () => resource.getDependencyList(),
        tap((result) => {
          assert(true);
        }),
        map((dependency) => buildEdge(options)({ resource, dependency })),
        callProp("join", "\n"),
      ])()
    ),
    filter(not(isEmpty)),
    tap((result) => {
      logger.debug(`buildGraphAssociation ${result}`);
    }),
    callProp("join", "\n"),
    tap((result) => {
      logger.debug(`buildGraphAssociation ${result}`);
    }),
  ])();
