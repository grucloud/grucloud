const assert = require("assert");
const { pipe, map, flatMap, reduce, tap, filter, get, not } = require("rubico");
const { pluck, flatten, isEmpty, size } = require("rubico/x");

const logger = require("./logger")({ prefix: "Graph" });

const color = "#383838";
const colorLigher = "#707070";
const fontName = "Helvetica";

exports.buildSubGraphLive = ({ providerName, resourcesPerType }) =>
  pipe([
    tap(() => {
      logger.debug(`buildGraphNode`);
      assert(providerName);
      assert(Array.isArray(resourcesPerType));
    }),
    () => resourcesPerType,
    pluck("resources"),
    flatten,
    tap(() => {
      logger.debug(`buildGraphNode`);
      //TODO check error
    }),
    reduce(
      (acc, resource) =>
        `${acc}"${resource.type}::${resource.id}" [label=<
         <table color='${color}' border="0">
            <tr><td align="text"><FONT color='${colorLigher}' POINT-SIZE="16"><B>${
          resource.type
        }</B></FONT><br align="left" /></td></tr>
            <tr><td align="text"><FONT color='${color}' POINT-SIZE="18">${
          resource.name || resource.id
        }</FONT><br align="left" /></td></tr>
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
      logger.debug(`buildGraphNode done`);
    }),
  ])();

exports.buildGraphAssociationLive = ({ resourcesPerType }) =>
  pipe([
    tap(() => {
      logger.debug(`buildGraphAssociationLive`);
      assert(Array.isArray(resourcesPerType));
    }),
    () => resourcesPerType,
    pluck("resources"),
    flatten,
    filter(pipe([get("dependencies"), not(isEmpty)])),
    flatMap(({ providerName, type, id, dependencies }) =>
      pipe([
        tap(() => {
          logger.debug(
            `${providerName}, type ${type}, id, ${id}, #dependencies ${size(
              dependencies
            )}`
          );
        }),
        () => dependencies,
        map((dependency) =>
          pipe([
            tap(() => {
              logger.debug(
                `type ${dependency.type}, #ids ${size(dependency.ids)}`
              );
            }),
            () => dependency.ids,
            map(
              (dependencyId) =>
                `"${type}::${id}" -> "${dependency.type}::${dependencyId}" [color="${color}"];`
            ),
          ])()
        ),
      ])()
    ),
    flatten,
    (result) => result.join("\n"),
    tap((result) => {
      logger.debug(`buildGraphAssociationLive done`);
    }),
  ])();
