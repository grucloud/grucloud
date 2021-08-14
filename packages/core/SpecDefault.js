const assert = require("assert");
const { tap, pipe, assign, eq, get } = require("rubico");
const { defaultsDeep, find, when, isEmpty } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");
const { ResourceMaker } = require("./CoreResource");

const defaultConfig = ({ config = {}, provider }) =>
  pipe([() => config, defaultsDeep(provider.getConfig())])();

const useParams = ({ params, provider, programOptions, spec }) => ({
  ...params,
  spec,
  readOnly: true,
  spec: assign({ listOnly: () => true })(spec),
  provider,
  config: defaultConfig({ provider, config: params.config }),
  programOptions,
});

const SpecDefault = ({ providerName }) => ({
  compare: detailedDiff,
  providerName,
  listOnly: false,
  isOurMinion: () => false,
  propertiesDefault: {},
  makeResource:
    ({ provider, spec, programOptions }) =>
    (params) =>
      pipe([
        () => ({
          ...params,
          spec,
          provider,
          config: defaultConfig({ provider, config: params.config }),
          programOptions,
        }),
        ResourceMaker,
        tap(provider.targetResourcesAdd),
      ])(),
  useResource:
    ({ provider, spec, programOptions }) =>
    (params) =>
      pipe([
        () => ({ params, provider, programOptions, spec }),
        useParams,
        ResourceMaker,
        tap(provider.targetResourcesAdd),
      ])(),
  useDefaultResource:
    ({ provider, spec, programOptions }) =>
    (params) =>
      pipe([
        () => ({ params, provider, programOptions, spec }),
        useParams,
        assign({
          filterLives:
            () =>
            ({ resources }) =>
              pipe([
                () => resources,
                find(eq(get("isDefault"), true)),
                tap((live) => {
                  assert(live, `Cannot find default resource ${spec.type}`);
                }),
              ])(),
        }),
        ResourceMaker,
        tap(provider.targetResourcesAdd),
      ])(),
});

exports.createSpec =
  ({ config, defaultOptions = { group: "" } }) =>
  (spec) =>
    pipe([
      () => spec,
      defaultsDeep(defaultOptions),
      assign({
        groupType: ({ group, type }) => `${group}::${type}`,
      }),
      defaultsDeep(SpecDefault(config)),
      tap((params) => {
        assert(true);
      }),
    ])();
