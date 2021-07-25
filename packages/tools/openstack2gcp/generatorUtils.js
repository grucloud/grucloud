const assert = require("assert");
const path = require("path");
const fs = require("fs").promises;
const { camelCase } = require("change-case");
const prettier = require("prettier");
const { Command } = require("commander");

const {
  pipe,
  tap,
  get,
  eq,
  map,
  fork,
  filter,
  flatMap,
  switchCase,
  assign,
  not,
  omit,
  or,
  always,
} = require("rubico");

const pick = require("rubico/pick");

const {
  first,
  isEmpty,
  find,
  callProp,
  pluck,
  isFunction,
  identity,
  values,
  isString,
  isObject,
  flatten,
  defaultsDeep,
  forEach,
  size,
} = require("rubico/x");

const ResourceVarNameDefault = pipe([
  tap((name) => {
    assert(name, "missing resource name");
  }),
  (name) => camelCase(name),
]);

exports.ResourceVarNameDefault = ResourceVarNameDefault;

const findDependencyNames = ({
  type,
  resource,
  lives,
  filterDependency = () => () => true,
}) =>
  pipe([
    tap(() => {
      assert(type);
      assert(lives);
    }),
    () => resource.dependencies,
    find(eq(get("type"), type)),
    get("ids"),
    tap((params) => {
      assert(true);
    }),
    map(findLiveById({ type, lives })),
    tap((xxx) => {
      assert(true);
    }),
    filter(not(isEmpty)),
    filter(filterDependency({ resource })),
    tap((params) => {
      assert(true);
    }),
    //TODO openstack should set its group
    map(
      ({ group = "compute", type, name }) =>
        `resources.${group}.${type}.${ResourceVarNameDefault(name)}`
    ),
    tap((xxx) => {
      assert(true);
    }),
  ])();

const buildProperties = ({
  resource,
  dependencies,
  filterLive = () => identity,
}) =>
  pipe([
    tap(() => {
      assert(true);
    }),
    () => resource,
    get("live"),
    filterLive({ resource, dependencies }),
    tap((params) => {
      assert(true);
    }),
    assign({
      Tags: pipe([
        () => resource,
        get("live.Tags", []),
        filter(
          pipe([
            get("Key", ""),
            tap((params) => {
              assert(true);
            }),
            not(or([callProp("startsWith", "gc-"), eq(identity, "Name")])),
            tap((params) => {
              assert(true);
            }),
          ])
        ),
      ]),
    }),
    switchCase([pipe([get("Tags"), isEmpty]), omit(["Tags"]), identity]),
    tap((params) => {
      assert(true);
    }),
  ])();

const configBuildPropertiesDefault = ({
  resource,
  properties,
  hasNoProperty,
}) =>
  pipe([
    tap(() => {
      assert(resource);
    }),
    () =>
      !isEmpty(properties) && !resource.isDefault && !hasNoProperty
        ? `\n,properties: ${JSON.stringify(properties, null, 4)}`
        : "",
  ])();

exports.hasDependency = ({ type }) =>
  pipe([
    get("dependencies"),
    find(eq(get("type"), type)),
    get("ids"),
    not(isEmpty),
  ]);

const configTpl = ({
  resource,
  resourceVarName,
  resourceName,
  properties,
  hasNoProperty,
  configBuildProperties = configBuildPropertiesDefault,
  lives,
  dependencies,
}) =>
  pipe([
    () => `${resourceVarName}: {
      name: "${resourceName}"${configBuildProperties({
      resource,
      properties,
      lives,
      dependencies,
      hasNoProperty: hasNoProperty({ resource }),
    })},
    },`,
    tap((params) => {
      assert(true);
    }),
  ])();

const dependencyValue = ({ key, value }) =>
  switchCase([() => key.endsWith("s"), () => `[${value}]`, () => value])();

const buildDependencies = ({ resource, lives, dependencies = {} }) =>
  pipe([
    tap(() => {
      assert(resource);
      assert(lives);
    }),
    () => dependencies,
    map.entries(([key, dependency]) => [
      key,
      pipe([
        () => dependency,
        defaultsDeep({
          findDependencyNames,
        }),
        ({ findDependencyNames }) =>
          findDependencyNames({ resource, lives, ...dependency }),
      ])(),
    ]),
    tap((params) => {
      assert(true);
    }),
    map.entries(([key, value]) => [
      key,
      !isEmpty(value) && `${key}: ${dependencyValue({ key, value })}`,
    ]),
    values,
    filter(identity),
    switchCase([
      isEmpty,
      () => "",
      (values) => `dependencies: ({resources}) =>({ 
       ${values.join(",\n")}
     }),`,
    ]),
    tap((params) => {
      assert(true);
    }),
  ])();

const codeBuildName = ({ group, type, resourceVarName }) =>
  pipe([
    tap(() => {
      assert(group);
      assert(type);
      assert(resourceVarName);
    }),
    () => `name: config.${group}.${type}.${resourceVarName}.name,`,
  ])();

const codeBuildNamespace = ({ namespace }) =>
  pipe([() => (namespace ? `\nnamespace: "${namespace}",` : "")])();

const codeBuildPropertiesDefault = ({
  group,
  type,
  resourceVarName,
  properties,
  resource,
  hasNoProperty,
}) =>
  pipe([
    tap(() => {
      assert(true);
    }),
    () =>
      !isEmpty(properties) && !resource.isDefault && !hasNoProperty
        ? `\nproperties: () => config.${group}.${type}.${resourceVarName}.properties,`
        : "",
  ])();

const buildPrefix = switchCase([
  get("isDefault"),
  () => "useDefault",
  get("cannotBeDeleted"),
  () => "use",
  get("managedByOther"),
  () => "use",
  () => "make",
]);

const codeTpl = ({
  group,
  type,
  resourceVarName,
  dependencies,
  resource,
  lives,
  properties,
  hasNoProperty,
  codeBuildProperties = codeBuildPropertiesDefault,
}) => `
  provider.${group}.${buildPrefix(resource)}${type}({
  ${codeBuildName({ group, type, resourceVarName })}${codeBuildNamespace(
  resource
)}${buildDependencies({ resource, lives, dependencies })}${codeBuildProperties({
  group,
  type,
  resource,
  resourceVarName,
  properties,
  hasNoProperty: hasNoProperty({ resource }),
})}
  });
`;

const writeToFile =
  ({ filename }) =>
  (content) =>
    pipe([
      tap(() => {
        assert(filename);
        assert(content);
      }),
      () => prettier.format(content, { parser: "babel" }),
      (formatted) => fs.writeFile(filename, formatted),
      tap(() => {
        console.log(`written to ${filename}`);
      }),
    ])();

exports.writeToFile = writeToFile;

const readModel = (options) =>
  pipe([
    tap(() => {
      console.log(`readModel`, options);
    }),
    () => fs.readFile(path.resolve(options.input), "utf-8"),
    JSON.parse,
    get("result.results"),
    first,
    get("results"),
  ]);

exports.readModel = readModel;

const readMapping = (options) =>
  pipe([
    tap(() => {
      console.log("readMapping", options.mapping);
    }),
    () => fs.readFile(path.resolve(options.mapping), "utf-8"),
    JSON.parse,
  ]);

exports.readMapping = readMapping;

exports.createProgramOptions = ({ version }) => {
  const program = new Command();
  program.storeOptionsAsProperties(false);
  program.allowUnknownOption(); // For testing
  program.version(version);
  program.requiredOption("-i, --input <file>", "lives resources");
  program.option("-o, --outputCode <file>", "iac.js output", "iac.js");
  program.option("-c, --outputConfig <file>", "config.js output", "config.js");
  program.option("-m, --mapping <file>", "mapping file", "mapping.json");

  program.parse(process.argv);

  return program.opts();
};

const writeIac =
  ({ filename, iacTpl }) =>
  (resourceMap) =>
    pipe([
      () => resourceMap,
      pluck("types"),
      flatten,
      pluck("resources"),
      flatten,
      filter(not(isEmpty)),
      fork({
        resourcesVarNames: pluck("resourceVarName"),
        resourcesCode: pipe([pluck("code"), callProp("join", "\n")]),
      }),
      ({ resourcesVarNames, resourcesCode }) =>
        iacTpl({ resourcesVarNames, resourcesCode }),
      writeToFile({ filename }),
    ])();

const writeConfig =
  ({ filename, configTpl }) =>
  (resourceMap) =>
    pipe([
      () => resourceMap,
      map(({ group, types }) =>
        pipe([
          tap(() => {
            assert(group);
            assert(types);
          }),
          () => types,
          map(({ type, typeTarget, resources }) =>
            pipe([
              () => resources,
              pluck("config"),
              filter(not(isEmpty)),
              switchCase([
                isEmpty,
                () => undefined,
                pipe([
                  callProp("join", "\n"),
                  (configs) => `${typeTarget || type}: {
                    ${configs}
                    },`,
                ]),
              ]),
            ])()
          ),
          filter(not(isEmpty)),
          switchCase([
            isEmpty,
            () => undefined,
            pipe([
              callProp("join", "\n"),
              (configs) => `${group}: {
                ${configs}
              }`,
            ]),
          ]),
        ])()
      ),
      filter(not(isEmpty)),
      tap((params) => {
        assert(true);
      }),
      configTpl,
      writeToFile({ filename }),
    ])();

const findLiveById =
  ({ lives, type }) =>
  (id) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(type);
        assert(id, `no id for ${type}, id: ${id},`);
      }),
      () => lives,
      find(eq(get("type"), type)),
      get("resources"),
      find(eq(get("id"), id)),
      tap((live) => {
        if (!live) {
          assert(live, `no live for ${type}, id: ${id},`);
        }
      }),
    ])();

exports.findLiveById = findLiveById;

const writeResource =
  ({
    type,
    typeTarget,
    group,
    resourceVarName = ResourceVarNameDefault,
    resourceName = identity,
    filterLive,
    codeBuildProperties,
    configBuildProperties,
    hasNoProperty,
    properties = always({}),
    dependencies = always({}),
    ignoreResource = () => () => false,
  }) =>
  ({ resource, lives, mapping }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => resource,
      switchCase([
        ignoreResource({ lives }),
        () => {
          assert(true);
        },
        pipe([
          tap((params) => {
            assert(true);
          }),
          fork({
            resourceVarName: () => resourceVarName(resource.name),
            resourceName: () => resourceName(resource.name),
            properties: pipe([
              () => properties({ resource, mapping }),
              defaultsDeep(
                buildProperties({
                  resource,
                  filterLive,
                  dependencies: dependencies(),
                })
              ),
            ]),
          }),
          tap((params) => {
            assert(true);
          }),
          ({ resourceVarName, resourceName, properties }) => ({
            resourceVarName,
            config: configTpl({
              type: typeTarget || type,
              resourceName,
              resourceVarName,
              resource,
              properties,
              dependencies: dependencies(),
              configBuildProperties,
              hasNoProperty,
              lives,
            }),
            code: codeTpl({
              group,
              type: typeTarget || type,
              resource,
              resourceVarName,
              dependencies: dependencies(),
              lives,
              hasNoProperty,
              properties,
              codeBuildProperties,
            }),
          }),
        ]),
      ]),
    ])();

const writeResources =
  ({
    type,
    typeTarget,
    group,
    filterLive,
    properties,
    dependencies,
    ignoreResource,
    resourceVarName,
    resourceName,
    codeBuildProperties,
    configBuildProperties,
    hasNoProperty = () => false,
  }) =>
  ({ lives, mapping }) =>
    pipe([
      tap(() => {
        assert(type);
        assert(group);
      }),
      () => lives,
      find(eq(get("type"), type)),
      get("resources"),
      map(
        pipe([
          tap((params) => {
            assert(true);
          }),
          (resource) =>
            writeResource({
              type,
              typeTarget,
              group,
              properties,
              filterLive,
              dependencies,
              ignoreResource,
              resourceVarName,
              resourceName,
              codeBuildProperties,
              configBuildProperties,
              hasNoProperty,
            })({
              resource,
              lives,
              mapping,
            }),
        ])
      ),
    ])();

exports.generatorMain = ({ name, options, writersSpec, iacTpl, configTpl }) =>
  pipe([
    tap((xxx) => {
      console.log(name);
    }),
    fork({ lives: readModel(options), mapping: readMapping(options) }),
    ({ lives, mapping }) =>
      pipe([
        () => writersSpec,
        tap((params) => {
          assert(true);
        }),
        map(({ group, types }) => ({
          group,
          types: pipe([
            () => types,
            tap((params) => {
              assert(true);
            }),
            map((spec) => ({
              type: spec.type,
              typeTarget: spec.typeTarget,
              resources: pipe([
                () => ({ lives, mapping }),
                writeResources({
                  mapping,
                  group,
                  ...spec,
                }),
                filter(not(isEmpty)),
              ])(),
            })),
          ])(),
        })),
        tap((params) => {
          assert(true);
        }),
      ])(),
    tap((xxx) => {
      assert(true);
    }),
    fork({
      iac: writeIac({ filename: options.outputCode, iacTpl }),
      config: writeConfig({ filename: options.outputConfig, configTpl }),
    }),
  ])();
