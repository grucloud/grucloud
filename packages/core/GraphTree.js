const assert = require("assert");
const { pipe, map, tap, fork, switchCase } = require("rubico");
const {
  callProp,
  pluck,
  groupBy,
  values,
  flatten,
  isEmpty,
  identity,
  size,
} = require("rubico/x");
const logger = require("./logger")({ prefix: "GraphTree" });
const { tos } = require("./tos");

// https://plantuml.com/mindmap-diagram
const repeat = ({ depth, symbol = "+" }) =>
  new Array(depth).fill(symbol).join("");

const buildPerType = ({ options, type, depth = 4, symbol, resources }) =>
  pipe([
    () => resources,
    fork({
      typeLabel: (resources) =>
        `${repeat({ depth, symbol })} ${type} (${size(resources)})`,
      resourcesLabel: pipe([
        pluck("name"),
        map((name) => `${repeat({ depth: depth + 1, symbol })} ${name}`),
      ]),
    }),
    switchCase([
      () => options.full,
      ({ typeLabel, resourcesLabel }) => [typeLabel, ...resourcesLabel],
      ({ typeLabel }) => [typeLabel],
    ]),
    tap((xxx) => {
      assert(true);
    }),
  ])();

const buildPerGroup = ({ options, group, resources, depth = 3, symbol }) =>
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
        depth: depth + 1,
        symbol,
        resources: resourcesPerType,
      }),
    ]),
    values,
    flatten,
    switchCase([
      () => isEmpty(group),
      identity,
      (results) => [`${repeat({ depth, symbol })} ${group}`, ...results],
    ]),
    tap((result) => {
      assert(result);
    }),
  ])();

const buildPerProvider =
  ({ options, depth = 2, symbol, index }) =>
  (provider) =>
    pipe([
      tap(() => {
        logger.debug(`${provider.name} ${index}`);
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
          depth: depth + (isEmpty(group) ? 0 : 1),
          symbol,
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

const doBuildGraphTree = ({ root = "Infra", providers, options }) =>
  pipe([
    () => [
      `+ ${root}`,
      ...map.withIndex((provider, index) =>
        buildPerProvider({ options, depth: 2, symbol: index % 2 ? "-" : "+" })(
          provider
        )
      )(providers),
    ],
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
