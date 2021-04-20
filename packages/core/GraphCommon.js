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
