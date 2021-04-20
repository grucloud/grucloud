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

const buildNode = ({ colorLigher, color }) => (resource) => `"${
  resource.type
}::${resource.name}" [label=<
  <table title="TOTO" color='${color}' border="0">
     <tr><td align="text"><FONT color='${colorLigher}' POINT-SIZE="10"><B>${
  resource.type
}</B></FONT><br align="left" /></td></tr>
     <tr><td align="text"><FONT color='${color}' POINT-SIZE="13">${formatNodeName(
  { name: resource.name }
)}</FONT><br align="left" /></td></tr>
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

const buildEdge = ({ color }) => ({ resource, dependency }) =>
  `"${resource.type}::${resource.name}" -> "${dependency.type}::${dependency.name}" [color="${color}"];\n`;

const buildSubGraphClusterProvider = ({
  providerName,
  options: { fontName, color },
}) => (content) => `subgraph "cluster_${providerName}" {
    fontname=${fontName}
    color="${color}"
    label=<<FONT color='${color}' POINT-SIZE="20"><B>${providerName}</B></FONT>>;
    node [shape=box fontname=${fontName} color="${color}"]
    ${content}}
    `;

const buildSubGraphClusterNamespace = ({
  options: { fontName, color },
  providerName,
  namespace,
}) => (content) => `subgraph "cluster_${providerName}_${namespace}" {
        fontname=${fontName}
        color="${color}"
        label=<<FONT color='${color}' POINT-SIZE="20"><B>${namespace}</B></FONT>>;
        node [shape=box fontname=${fontName} color="${color}"]
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
