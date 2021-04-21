const { AssertionError } = require("assert");
const assert = require("assert");
const { pipe, map, tap, filter, not } = require("rubico");
const { callProp, isEmpty, groupBy, values } = require("rubico/x");
const logger = require("./logger")({ prefix: "Graph" });

const {
  formatNodeName,
  formatNamespace,
  buildSubGraphClusterNamespace,
  buildSubGraphClusterProvider,
} = require("./GraphCommon");

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

const buildEdge = ({ options: { edge }, resource }) => (dependency) =>
  `"${resource.type}::${resource.name}" -> "${dependency.type}::${dependency.name}" [color="${edge.color}"];\n`;

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
        map(buildEdge({ options, resource })),
        callProp("join", "\n"),
      ])()
    ),
    filter(not(isEmpty)),
    callProp("join", "\n"),
    tap((result) => {
      logger.debug(`buildGraphAssociation ${result}`);
    }),
  ])();
