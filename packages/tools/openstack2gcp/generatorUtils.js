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
} = require("rubico/x");

const ResourceVarName = pipe([
  tap((name) => {
    assert(name, "missing resource name");
  }),
  (name) => camelCase(name),
]);

exports.ResourceVarName = ResourceVarName;

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
    map(findLiveById({ type, lives })),
    tap((xxx) => {
      assert(true);
    }),
    filter(not(isEmpty)),
    filter(filterDependency({ resource })),
    tap((params) => {
      assert(true);
    }),
    pluck("name"),
    map(ResourceVarName),
    tap((xxx) => {
      assert(true);
    }),
  ])();

const propertyValue = switchCase([
  isString,
  (value) => `"${value}"`,
  isObject,
  (value) => JSON.stringify(value, null, 4),
  identity,
]);

const buildPropertyList = ({ resource: { live }, pickProperties }) =>
  pipe([
    tap(() => {
      assert(true);
    }),
    () => live,
    pick([...pickProperties, "Tags"]),
    tap((params) => {
      assert(true);
    }),
    assign({
      Tags: pipe([
        get("Tags", []),
        filter(
          pipe([
            get("Key"),
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
    map.entries(([key, value]) => [key, `${key}: ${propertyValue(value)}`]),
    values,
    tap((params) => {
      assert(true);
    }),
  ])();

const configTpl = ({ resourceVarName, resource: { name }, propertyList }) =>
  pipe([
    () => propertyList,
    tap((params) => {
      assert(name);
    }),
    callProp("join", ","),
    (propertyListJoined) => `${resourceVarName}: {
      name: "${name}"${
      !isEmpty(propertyListJoined)
        ? `\n,properties: { 
          ${propertyListJoined} 
        }`
        : ""
    },
    },`,
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
      findDependencyNames({ resource, lives, ...dependency }),
    ]),
    map.entries(([key, value]) => [
      key,
      !isEmpty(value) && `${key}: ${dependencyValue({ key, value })}`,
    ]),
    values,
    filter(identity),
    switchCase([
      isEmpty,
      () => "",
      (values) => `dependencies: { 
       ${values.join(",\n")}
     },`,
    ]),
  ])();

const codeTpl = ({
  group,
  type,
  resourceVarName,
  dependencies,
  resource,
  lives,
  propertyList,
  createPrefix = "make",
}) => `
  const ${resourceVarName} = provider.${group}.${
  resource.isDefault || resource.cannotBeDeleted ? "use" : createPrefix
}${type}({
    name: config.${group}.${type}.${resourceVarName}.name,${
  resource.namespace ? `\nnamespace: ${resource.namespace},` : ""
}${buildDependencies({ resource, lives, dependencies })}${
  !isEmpty(propertyList)
    ? `\nproperties: () => config.${group}.${type}.${resourceVarName}.properties,`
    : ""
}
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
    tap((xxx) => {
      console.log("");
    }),
    get("result.results"),
    first,
    tap((xxx) => {
      console.log("");
    }),
    get("results"),
    tap((xxx) => {
      console.log("");
    }),
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
      tap(() => {
        assert(true);
      }),
      tap((params) => {
        assert(true);
      }),
      pluck("types"),
      flatten,
      tap((params) => {
        assert(true);
      }),
      pluck("resources"),
      flatten,
      tap((params) => {
        assert(true);
      }),
      filter(not(isEmpty)),
      fork({
        resourcesVarNames: pluck("resourceVarName"),
        resourcesCode: pipe([pluck("code"), callProp("join", "\n")]),
      }),
      tap((xxx) => {
        assert(true);
      }),
      ({ resourcesVarNames, resourcesCode }) =>
        iacTpl({ resourcesVarNames, resourcesCode }),
      writeToFile({ filename }),
    ])();

const writeConfig =
  ({ filename, configTpl }) =>
  (resourceMap) =>
    pipe([
      tap(() => {
        assert(true);
      }),
      () => resourceMap,
      map(({ group, types }) =>
        pipe([
          tap(() => {
            assert(group);
            assert(types);
          }),
          () => types,
          map(({ type, resources }) =>
            pipe([
              () => resources,
              pluck("config"),
              filter(not(isEmpty)),
              switchCase([
                isEmpty,
                () => undefined,
                pipe([
                  callProp("join", "\n"),
                  (configs) => `${type}: {
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
        assert(id);
      }),
      () => lives,
      find(eq(get("type"), type)),
      get("resources"),
      find(eq(get("id"), id)),
      tap((xxx) => {
        //console.log(`findName`);
      }),
    ])();

exports.findLiveById = findLiveById;

const writeResource =
  ({
    type,
    group,
    createPrefix,
    pickProperties = always([]),
    dependencies = always({}),
    ignoreResource = () => always(false),
  }) =>
  ({ resource, lives }) =>
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
            resourceVarName: () => ResourceVarName(resource.name),
            propertyList: () =>
              buildPropertyList({
                resource,
                pickProperties: pickProperties({ resource }),
              }),
          }),
          tap((params) => {
            assert(true);
          }),
          ({ resourceVarName, propertyList }) => ({
            resourceVarName,
            config: configTpl({
              resourceVarName,
              resource,
              propertyList,
            }),
            code: codeTpl({
              group,
              type,
              resource,
              resourceVarName,
              propertyList,
              dependencies: dependencies(),
              lives,
              createPrefix,
            }),
          }),
        ]),
      ]),
    ])();

const writeResources =
  ({
    type,
    group,
    pickProperties,
    dependencies,
    createPrefix,
    ignoreResource,
  }) =>
  ({ lives, mapping }) =>
    pipe([
      tap(() => {
        assert(type);
        assert(group);
        //assert(isFunction(pickProperties));
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
              group,
              pickProperties,
              dependencies,
              createPrefix,
              ignoreResource,
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
              resources: pipe([
                () => ({ lives, mapping }),
                writeResources({
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
