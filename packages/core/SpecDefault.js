const assert = require("assert");
const { tap, pipe, assign, eq, get, tryCatch } = require("rubico");
const {
  defaultsDeep,
  find,
  when,
  isEmpty,
  unless,
  prepend,
  identity,
} = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");
const { ResourceMaker } = require("./CoreResource");
const { compare } = require("./Common");
const findNamespaceFromProps = (properties) =>
  tryCatch(
    pipe([
      () => properties({ dependencies: {} }),
      get("metadata.namespace", ""),
    ]),
    () => ""
  )();

const findNamespaceFromLive = get("metadata.namespace", "");

const findNamespaceFromDeps = get("namespace.name", "");

const buildNamespaceKey = ({
  properties = () => undefined,
  dependencies = () => undefined,
  live,
}) =>
  pipe([
    () => findNamespaceFromProps(properties),
    when(isEmpty, () => findNamespaceFromLive(live)),
    when(isEmpty, () =>
      tryCatch(
        () => findNamespaceFromDeps(dependencies()),
        () => ""
      )()
    ),
    unless(isEmpty, prepend("::")),
  ])();

const buildGroupKey = unless(isEmpty, prepend("::"));

const resourceKeyDefault = pipe([
  tap((resource) => {
    assert(resource.providerName);
    assert(resource.type);
    assert(resource.name);
  }),
  ({
    providerName,
    type,
    group = "",
    properties,
    name,
    dependencies,
    id,
    live,
  }) =>
    `${providerName}${buildGroupKey(group)}::${type}${buildNamespaceKey({
      properties,
      dependencies,
      live,
      name,
      type,
    })}::${name || id}`,
]);

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
  compare: compare(),
  providerName,
  listOnly: false,
  isOurMinion: () => false,
  propertiesDefault: {},
  resourceKey: resourceKeyDefault,
  transformDependencies: () => identity,
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
