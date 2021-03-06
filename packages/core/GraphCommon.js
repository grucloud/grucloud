const assert = require("assert");
const { gte, switchCase } = require("rubico");
const { size, identity, isEmpty } = require("rubico/x");
const changeCase = require("change-case");

const NodeNameMaxLength = 32;

exports.optionsDefault = ({ kind }) => ({
  kind,
  fontName: "Helvetica",
  edge: { color: "#707070" },
  cluster: {
    root: {
      bgColor: "#fafafa",
      fillColor: "#f5f5f5",
    },
    titleLabel: {
      fontColor: "#383838",
      pointSize: 22,
    },
    titleKind: {
      fontColor: "#707070",
      pointSize: 16,
    },
    provider: {
      fontColor: "#707070",
      color: "#f5f5f5",
      fillColor: "#f5f5f5",
      pointSize: 20,
    },
    namespace: {
      fontColor: "#383838",
      color: "#eeeeee",
      fillColor: "#eeeeee",
      pointSize: 20,
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

exports.formatNamespace = switchCase([isEmpty, () => "", identity]);

const rootTitle = ({ titleLabel, title, titleKind, kind }) =>
  !isEmpty(title)
    ? `label=<<table border="0">
  <tr>
  <td align="text"><FONT color='${titleLabel.fontColor}' POINT-SIZE="${
        titleLabel.pointSize
      }"><B>Project ${title}</B></FONT><br align="left" />
  </td>
</tr>
<tr><td align="text"><FONT color='${titleKind.fontColor}' POINT-SIZE="${
        titleKind.pointSize
      }"><B>${changeCase.pascalCase(
        kind
      )} Diagram</B></FONT><br align="left" /></td></tr>
  </table>>
  `
    : "";

const providerTitle = ({ providerName }) => `Provider ${providerName}`;

exports.buildGraphRootLabel = ({
  options: {
    fontName,
    title,
    cluster: { root, titleKind, titleLabel },
    kind,
  },
}) =>
  `rankdir=LR; 
    labelloc=t;
    fontname=${fontName};
    bgcolor="${root.bgColor}";
    ${rootTitle({ titleLabel, title, titleKind, kind })}
   `;

const buildClusterProviderLabel = ({
  options: {
    fontName,
    cluster: { provider },
  },
  providerName,
}) =>
  `fontname=${fontName}
  style=filled;
  labelloc=b;
  color="${provider.color}"
  fillcolor="${provider.fillColor}";
  label=<
  <table color='${provider.color}' border="0">
     <tr><td align="text"><FONT color='${provider.fontColor}' POINT-SIZE="${
    provider.pointSize
  }"><B>${providerTitle({
    providerName,
  })}</B></FONT><br align="left" /></td></tr>
  </table>>`;

exports.buildSubGraphClusterProvider =
  ({ providerName, options }) =>
  (content) =>
    `subgraph "cluster_${providerName}" {
    ${buildClusterProviderLabel({ options, providerName })};
    ${content}}
`;
const labelClusterNamespace = ({ namespace, options: { cluster } }) =>
  isEmpty(namespace)
    ? `label=<<FONT color='${
        cluster.namespace.fontColor
      }' POINT-SIZE="${1}"> </FONT>>;`
    : `label=<<FONT color='${cluster.namespace.fontColor}' POINT-SIZE="${cluster.namespace.pointSize}"><B>${namespace}</B></FONT>>;`;

exports.buildSubGraphClusterNamespace =
  ({ options: { fontName, cluster }, providerName, namespace }) =>
  (content) =>
    `subgraph "cluster_${providerName}_${namespace}" {
        fontname=${fontName}
        style=filled;
        color="${cluster.namespace.color}";
        fillcolor="${cluster.namespace.fillColor}";
        ${labelClusterNamespace({ options: { fontName, cluster }, namespace })}
        node [shape=box style=filled fontname=${fontName} fillcolor="${
      cluster.node.fillColor
    }" color="${cluster.node.color}"]
        ${content}}
        `;
