const { tap, pipe } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");
const { ResourceMaker } = require("./CoreResource");

exports.SpecDefault = ({ providerName }) => ({
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
            spec: spec,
            provider,
            config: defaultsDeep(provider.config)(configUser),
          }),
        tap((resource) => provider.targetResourcesAdd(resource)),
        identity,
      ])(),
});
