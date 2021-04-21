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
const { size, identity, isEmpty } = require("rubico/x");

const logger = require("./logger")({ prefix: "Graph" });

const NodeNameMaxLength = 32;

exports.optionsDefault = {
  fontName: "Helvetica",
  edge: { color: "#707070" },
  cluster: {
    provider: {
      fontColor: "#383838",
      color: "#f5f5f5",
      fillColor: "#f5f5f5",
      pointSize: 42,
    },
    namespace: {
      fontColor: "#383838",
      color: "#eeeeee",
      fillColor: "#eeeeee",
      pointSize: 24,
    },
    node: {
      color: "#dddddd",
      fillColor: "#e5e5e5",
      type: { fontColor: "#707070", pointSize: 16 },
      name: { fontColor: "#383838", pointSize: 16 },
    },
  },
};

exports.formatNodeName = ({ name }) =>
  switchCase([
    gte(size, NodeNameMaxLength),
    () => `${name.substring(0, NodeNameMaxLength)}...`,
    identity,
  ])(name);

exports.formatNamespace = switchCase([isEmpty, () => "default", identity]);

exports.buildSubGraphClusterProvider = ({
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
exports.buildSubGraphClusterNamespace = ({
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
