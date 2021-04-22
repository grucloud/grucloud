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
const changeCase = require("change-case");

const NodeNameMaxLength = 32;

exports.optionsDefault = ({ kind }) => ({
  kind,
  fontName: "Helvetica",
  edge: { color: "#707070" },
  cluster: {
    provider: {
      fontColor: "#383838",
      color: "#f5f5f5",
      fillColor: "#f5f5f5",
      pointSize: 36,
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
});

exports.formatNodeName = ({ name }) =>
  switchCase([
    gte(size, NodeNameMaxLength),
    () => `${name.substring(0, NodeNameMaxLength)}...`,
    identity,
  ])(name);

exports.formatNamespace = switchCase([isEmpty, () => "default", identity]);

const providerTitle = ({ providerName, kind }) =>
  `${changeCase.headerCase(kind)} resources on provider ${providerName}`;

const buildClusterProviderLabel = ({
  options: {
    fontName,
    cluster: { provider },
    kind,
  },
  providerName,
}) =>
  `fontname=${fontName}
  style=filled;
  color="${provider.color}"
  fillcolor="${provider.fillColor}";
  label=<
  <table color='${provider.color}' border="0">
     <tr><td align="text"><FONT color='${provider.fontColor}' POINT-SIZE="${
    provider.pointSize
  }">${providerTitle({
    providerName,
    kind,
  })}</FONT><br align="left" /></td></tr>
  </table>>
`;

exports.buildSubGraphClusterProvider = ({ providerName, options }) => (
  content
) => `subgraph "cluster_${providerName}" {
    ${buildClusterProviderLabel({ options, providerName })};
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
