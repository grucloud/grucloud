const assert = require("assert");
const { map, tap, pipe, assign, eq, get, filter, not, and } = require("rubico");
const {
  defaultsDeep,
  find,
  when,
  isEmpty,
  unless,
  prepend,
  identity,
  values,
} = require("rubico/x");

const logger = require("./logger")({
  prefix: "Spec",
});

const { ResourceMaker } = require("./CoreResource");

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
  }) => `${providerName}${buildGroupKey(group)}::${type}::${name || id}`,
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
  providerName,
  listOnly: false,
  isOurMinion: () => false,
  propertiesDefault: {},
  propertiesDefaultArray: [],
  omitProperties: [],
  omitPropertiesExtra: [],
  dependencies: {},
  resourceKey: resourceKeyDefault,
  transformDependencies: () => identity,
  postCreate: () => identity,
  postDestroy: () => identity,
  displayResource: () => identity,
  managedByOther: () => false,
  cannotBeDeleted: () => false,
  findResource: ({ resources, name, lives }) =>
    pipe([
      tap((params) => {
        assert(resources);
        assert(name);
      }),
      () => resources,
      //TODO check for multiple default and assert
      find(and([eq(get("name"), name), get("live")])),
      tap.if(isEmpty, () => {
        // logger.info(
        //   `findResource: Cannot find resource '${name}', ${JSON.stringify(
        //     resources,
        //     null,
        //     4
        //   )}`
        // );
      }),
    ])(),
  findDefault: ({ resources }) =>
    pipe([
      () => resources,
      //TODO check for multiple default and assert
      find(get("isDefault")),
      tap((live) => {
        assert(live, `Cannot find default resource`);
      }),
    ])(),
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
        defaultsDeep({
          filterLives: spec.findResource,
        }),
        ResourceMaker,
        tap(provider.targetResourcesAdd),
      ])(),
  useDefaultResource:
    ({ provider, spec, programOptions }) =>
    (params) =>
      pipe([
        () => ({ params, provider, programOptions, spec }),
        useParams,
        defaultsDeep({
          filterLives: spec.findDefault,
        }),
        ResourceMaker,
        tap(provider.targetResourcesAdd),
      ])(),
});
const buildGroupType = ({ group, type }) => `${group}::${type}`;

exports.createSpec =
  ({ config, defaultOptions = { group: "" } }) =>
  (spec) =>
    pipe([
      () => spec,
      defaultsDeep(defaultOptions),
      assign({
        groupType: buildGroupType,
      }),
      unless(
        get("dependsOn"),
        assign({
          dependsOn: pipe([get("dependencies"), values, map(buildGroupType)]),
        })
      ),
      unless(
        get("dependsOnList"),
        assign({
          dependsOnList: pipe([
            get("dependencies"),
            filter(get("parent")),
            values,
            map(buildGroupType),
          ]),
        })
      ),
      assign({
        dependsOnType: pipe([
          get("dependencies"),
          filter(get("dependsOnTypeOnly")),
          values,
          map(buildGroupType),
        ]),
      }),
      assign({
        dependsOnTypeDestroy: pipe([
          get("dependencies"),
          filter(not(get("ignoreOnDestroy"))),
          values,
          map(buildGroupType),
        ]),
      }),
      defaultsDeep(SpecDefault(config)),
      tap((params) => {
        assert(true);
      }),
    ])();
