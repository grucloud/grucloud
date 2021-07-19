const assert = require("assert");
const { tap, pipe, assign } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");
const { ResourceMaker } = require("./CoreResource");

const SpecDefault = ({ providerName }) => ({
  compare: detailedDiff,
  providerName,
  listOnly: false,
  isOurMinion: () => false,
  propertiesDefault: {},
  makeResource:
    ({ provider, spec }) =>
    ({
      name,
      meta,
      namespace,
      config: configUser = {},
      dependencies,
      properties,
      attributes,
      filterLives,
    }) =>
      pipe([
        () =>
          ResourceMaker({
            name,
            meta,
            namespace,
            filterLives,
            properties,
            attributes,
            dependencies,
            spec,
            provider,
            config: defaultsDeep(provider.config)(configUser),
          }),
        tap((resource) => provider.targetResourcesAdd(resource)),
        identity,
      ])(),
  useResource:
    ({ provider, spec }) =>
    ({
      name,
      meta,
      namespace,
      config: configUser = {},
      dependencies,
      properties,
      attributes,
      filterLives,
    }) =>
      pipe([
        () =>
          ResourceMaker({
            name,
            meta,
            namespace,
            filterLives,
            properties,
            attributes,
            dependencies,
            readOnly: true,
            spec,
            provider,
            config: defaultsDeep(provider.config)(configUser),
          }),
        tap((resource) => provider.targetResourcesAdd(resource)),
        identity,
      ])(),
});

exports.createSpec =
  ({ config, defaultOptions = {} }) =>
  (spec) =>
    pipe([
      () => defaultOptions,
      assign({
        groupType: () => `${spec.group ? `${spec.group}::` : ""}${spec.type}`,
      }),
      defaultsDeep(spec),
      defaultsDeep(SpecDefault(config)),
      tap((params) => {
        assert(true);
      }),
    ])();
