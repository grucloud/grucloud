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
const { callProp, isEmpty, size } = require("rubico/x");
const logger = require("./logger")({ prefix: "Graph" });

const { formatNodeName } = require("./GraphCommon");

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

const buildEdge = ({ color }) => ({ resource, dependency }) =>
  `"${resource.type}::${resource.name}" -> "${dependency.type}::${dependency.name}" [color="${color}"];\n`;

const buildSubGraphCluster = ({ fontName, color }) => ({
  providerName,
  assocations,
}) => `subgraph "cluster_${providerName}" {
    fontname=${fontName}
    color="${color}"
    label=<<FONT color='${color}' POINT-SIZE="20"><B>${providerName}</B></FONT>>;
    node [shape=box fontname=${fontName} color="${color}"]
    ${assocations}}
    `;

exports.buildSubGraph = ({ providerName, resources, options }) =>
  pipe([
    tap((xxx) => {
      logger.debug(`buildGraphNode`);
    }),
    () => resources,
    map(buildNode(options)),
    callProp("join", "\n"),
    (assocations) =>
      buildSubGraphCluster(options)({ providerName, assocations }),
    tap((result) => {
      logger.debug(`buildSubGraph ${result}`);
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
