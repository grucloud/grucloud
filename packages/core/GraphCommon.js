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
  color: "#383838",
  colorLigher: "#707070",
  fontName: "Helvetica",
};

exports.formatNodeName = ({ name }) =>
  switchCase([
    gte(size, NodeNameMaxLength),
    () => `${name.substring(0, NodeNameMaxLength)}...`,
    identity,
  ])(name);

exports.formatNamespace = switchCase([isEmpty, () => "default", identity]);
