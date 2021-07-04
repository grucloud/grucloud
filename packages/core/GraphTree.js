const assert = require("assert");
const { pipe, map, tap, filter, not, tryCatch, get } = require("rubico");
const { callProp, pluck, groupBy, values, flatten } = require("rubico/x");
const logger = require("./logger")({ prefix: "GraphTree" });
const { tos } = require("./tos");

// https://plantuml.com/mindmap-diagram
const repeat = ({ depth, symbol = "+" }) =>
  new Array(depth).fill(symbol).join("");

const buildPerType = ({ type, depth = 4, symbol, resources }) =>
  pipe([
    () => resources,
    pluck("name"),
    map((name) => `${repeat({ depth: depth + 1, symbol })} ${name}`),
    (results) => [`${repeat({ depth, symbol })} ${type}`, ...results],
    tap((names) => {
      assert(names);
    }),
  ])();

const buildPerGroup = ({
  options,
  group = "Default",
  resources,
  depth = 3,
  symbol,
}) =>
  pipe([
    tap(() => {
      assert(resources);
    }),
    () => resources,
    groupBy("type"),
    map.entries(([type, resourcesPerType]) => [
      type,
      buildPerType({
        options,
        type,
        resources: resourcesPerType,
      }),
    ]),
    values,
    flatten,
    (results) => [`${repeat({ depth, symbol })} ${group}`, ...results],
    tap((result) => {
      assert(result);
    }),
  ])();

const buildPerProvider =
  ({ options, depth = 2, symbol }) =>
  (provider) =>
    pipe([
      tap(() => {
        logger.debug(provider.name);
      }),
      () => provider.getTargetResources(),
      groupBy("group"),
      tap((resources) => {
        assert(resources);
      }),
      map.entries(([group, resources]) => [
        group,
        buildPerGroup({
          group,
          options,
          resources,
        }),
      ]),
      values,
      flatten,
      tap((result) => {
        assert(result);
      }),
      callProp("join", "\n"),
      tap((result) => {
        assert(true);
      }),
      (result) => `${repeat({ depth, symbol })} ${provider.name}\n${result}`,
    ])();

const doBuildGraphTree = ({ providers, options }) =>
  pipe([
    () => ["+ Infra", ...map(buildPerProvider({ options }))(providers)],
    callProp("join", "\n"),
  ])();

exports.buildGraphTree = ({ providers, options }) =>
  pipe([
    tap(() => {
      assert(providers);
      logger.info(`buildGraphTree ${tos(options)}`);
    }),
    () => `@startmindmap
title Resources for project ${options.title}
skinparam monochrome true
${doBuildGraphTree({ providers, options })}
@endmindmap`,
    tap((result) => {
      logger.info(`buildGraphTree done`);
    }),
  ])();
