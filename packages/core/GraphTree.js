const assert = require("assert");
const { pipe, map, tap, filter, not, tryCatch, get } = require("rubico");
const { callProp, pluck, groupBy, values, flatten } = require("rubico/x");
const logger = require("./logger")({ prefix: "GraphTree" });
const { tos } = require("./tos");

// https://plantuml.com/mindmap-diagram

const buildPerType = ({ type, resources }) =>
  pipe([
    () => resources,
    pluck("name"),
    map((name) => `+++++ ${name}`),
    (results) => [`++++ ${type}`, ...results],
    tap((names) => {
      assert(names);
    }),
  ])();

const buildPerGroup = ({ options, group = "Default", resources }) =>
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
    (results) => [`+++ ${group}`, ...results],
    tap((result) => {
      assert(result);
    }),
  ])();

const buildPerProvider =
  ({ options }) =>
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
      (result) => `++ ${provider.name}\n${result}`,
    ])();

const doBuildGraphTree = ({ providers, options }) =>
  pipe([
    () => "+ Infra",
    (content) => [content, ...map(buildPerProvider({ options }))(providers)],
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
