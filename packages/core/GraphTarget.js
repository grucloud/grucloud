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
const {
  pluck,
  flatten,
  isEmpty,
  size,
  groupBy,
  values,
  find,
  identity,
  isString,
  isObject,
  includes,
} = require("rubico/x");
const logger = require("./logger")({ prefix: "Graph" });

const color = "#383838";
const colorLigher = "#707070";
const fontName = "Helvetica";

exports.buildSubGraph = ({ providerName, resources, options }) =>
  pipe([
    tap((xxx) => {
      logger.debug(`buildGraphNode`);
    }),
    () => resources,
    reduce(
      (acc, resource) =>
        `${acc}"${resource.type}::${resource.name}" [label=<
          <table color='${color}' border="0">
             <tr><td align="text"><FONT color='${colorLigher}' POINT-SIZE="10"><B>${resource.type}</B></FONT><br align="left" /></td></tr>
             <tr><td align="text"><FONT color='${color}' POINT-SIZE="13">${resource.name}</FONT><br align="left" /></td></tr>
          </table>>];\n`,
      ""
    ),
    (result) =>
      `subgraph "cluster_${providerName}" {
fontname=${fontName}
color="${color}"
label=<<FONT color='${color}' POINT-SIZE="20"><B>${providerName}</B></FONT>>;
node [shape=box fontname=${fontName} color="${color}"]
${result}}
`,
    tap((result) => {
      logger.debug(`buildSubGraph ${result}`);
    }),
  ])();

exports.buildGraphAssociation = ({ resources, options }) =>
  pipe([
    () => resources,
    reduce(
      (acc, resource) =>
        `${acc}${map(
          (deps) =>
            `"${resource.type}::${resource.name}" -> "${deps.type}::${deps.name}" [color="${color}"];\n`
        )(resource.getDependencyList()).join("\n")}`,
      ""
    ),
    tap((result) => {
      logger.debug(`buildGraphAssociation ${result}`);
    }),
  ])();
