const assert = require("assert");
const path = require("path");
const fs = require("fs").promises;
const { camelCase, snakeCase } = require("change-case");
const prettier = require("prettier");

const {
  pipe,
  tap,
  get,
  eq,
  map,
  fork,
  filter,
  tryCatch,
  switchCase,
  assign,
  not,
  omit,
  or,
  always,
  and,
  reduce,
} = require("rubico");

const {
  first,
  isEmpty,
  find,
  callProp,
  pluck,
  identity,
  values,
  flatten,
  defaultsDeep,
  keys,
  includes,
  isString,
  isObject,
  isFunction,
  unless,
  when,
} = require("rubico/x");

const ResourceVarNameDefault = pipe([
  tap((name) => {
    assert(name, "missing resource name");
  }),
  camelCase,
]);

exports.ResourceVarNameDefault = ResourceVarNameDefault;

//TODO group ?
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

const envVarName = ({ resource, envVar }) =>
  `${snakeCase(resource.name).toUpperCase()}_${snakeCase(
    envVar
  ).toUpperCase()}`;

const isNotOurTagKey = not(
  or([callProp("startsWith", "gc-"), eq(identity, "Name")])
);

const buildProperties = ({
  resource,
  dependencies,
  environmentVariables = [],
  filterLive = () => identity,
}) =>
  pipe([
    tap(() => {
      assert(environmentVariables);
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
        switchCase([
          Array.isArray,
          filter(
            and([
              pipe([get("Key", ""), isNotOurTagKey]),
              pipe([get("TagKey", ""), isNotOurTagKey]), //kms.Key
            ])
          ),
          pipe([
            keys,
            filter(
              not(or([callProp("startsWith", "gc-"), eq(identity, "Name")]))
            ),
          ]),
        ]),
      ]),
    }),
    when(pipe([get("Tags"), isEmpty]), omit(["Tags"])),
    tap((params) => {
      assert(true);
    }),
    (props) =>
      pipe([
        () => environmentVariables,
        reduce((acc, envVar) => {
          acc[envVar] = () => `process.env.${envVarName({ resource, envVar })}`;
          return acc;
        }, props),
      ])(),
  ])();

const printPropertiesDo = (value) =>
  pipe([
    () => value,
    switchCase([
      isFunction,
      (fun) =>
        pipe([
          () => fun(),
          tap((params) => {
            assert(true);
          }),
        ])(),
      isString,
      (value) => `"${value}"`,
      Array.isArray,
      pipe([
        map(printPropertiesDo),
        callProp("join", ","),
        (result) => `[${result}]`,
      ]),
      isObject,
      pipe([
        map.entries(([key, value]) => [
          key,
          `"${key}": ${printPropertiesDo(value)},`,
        ]),
        values,
        callProp("join", "\n"),
        (result) => `{\n${result}}`,
      ]),
      identity,
    ]),
    tap((params) => {
      assert(true);
    }),
  ])();

const printProperties = (value) =>
  pipe([
    tap((params) => {
      console.log("In:", JSON.stringify(value, null, 4));
    }),
    () => value,
    printPropertiesDo,
    tap((params) => {
      assert(true);
      console.log("Out", JSON.stringify(params, null, 4));
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
        ? `\n,properties: ${printProperties(properties)}`
        : "",
  ])();

//TODO add group
exports.hasDependency = ({ type }) =>
  pipe([
    get("dependencies"),
    find(eq(get("type"), type)),
    get("ids"),
    not(isEmpty),
  ]);

const envTpl = ({ resource, environmentVariables }) =>
  pipe([
    () => environmentVariables,
    map((envVar) => `${envVarName({ resource, envVar })}=\n`),
    callProp("join", ""),
  ])();

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

const readModel = ({ commandOptions, programOptions }) =>
  pipe([
    tap(() => {
      assert(programOptions.workingDirectory);
    }),
    () =>
      fs.readFile(
        path.resolve(programOptions.workingDirectory, commandOptions.input),
        "utf-8"
      ),
    JSON.parse,
    get("result.results"),
    first,
    get("results"),
  ]);

exports.readModel = readModel;

const readMapping = ({ commandOptions }) =>
  tryCatch(
    pipe([
      tap(() => {
        //console.log("readMapping", options.mapping);
      }),
      () => fs.readFile(path.resolve(options.mapping), "utf-8"),
      JSON.parse,
    ]),
    () => ({})
  );

exports.readMapping = readMapping;

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
      tap((params) => {
        assert(true);
      }),
      fork({
        resourcesVarNames: pluck("resourceVarName"),
        resourcesCode: pipe([pluck("code"), callProp("join", "\n")]),
      }),
      ({ resourcesVarNames, resourcesCode }) =>
        iacTpl({ resourcesVarNames, resourcesCode }),
      writeToFile({ filename }),
    ])();

const writeConfig =
  ({ filename, configTpl, commandOptions }) =>
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
      (content) =>
        configTpl({ content, projectName: commandOptions.projectName }),
      writeToFile({ filename }),
    ])();

const writeEnv =
  ({ filename, programOptions }) =>
  (resourceMap) =>
    pipe([
      () => resourceMap,
      map(({ group, types }) =>
        pipe([
          () => types,
          map(({ resources }) =>
            pipe([
              () => resources,
              pluck("env"),
              filter(not(isEmpty)),
              unless(isEmpty, pipe([callProp("join", "\n")])),
            ])()
          ),
          filter(not(isEmpty)),
        ])()
      ),
      filter(not(isEmpty)),
      callProp("join", "\n"),
      tap((params) => {
        console.log(`Env file written to ${filename}`);
      }),
      (formatted) => fs.writeFile(filename, formatted),
    ])();

//TODO group
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

const ignoreDefault =
  ({ lives }) =>
  (resource) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(resource);
      }),
      () => resource,
      switchCase([
        get("isDefault"),
        pipe([
          () => lives,
          pluck("resources"),
          flatten,
          filter(
            pipe([
              get("dependencies"),
              find(
                and([
                  eq(get("type"), resource.type),
                  eq(get("group"), resource.group),
                ])
              ),
              get("ids"),
              includes(resource.id),
            ])
          ),
          filter(not(get("isDefault"))),
          isEmpty,
        ]),
        () => false,
      ]),
    ])();

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
    environmentVariables = always([]),
    ignoreResource = () => () => false,
    options,
  }) =>
  ({ resource, lives, mapping }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => resource,
      switchCase([
        or([ignoreResource({ lives }), ignoreDefault({ lives })]),
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
                  environmentVariables: environmentVariables(),
                })
              ),
            ]),
          }),
          tap((params) => {
            assert(true);
          }),
          ({ resourceVarName, resourceName, properties }) => ({
            resourceVarName,
            env: envTpl({
              options,
              resource,
              environmentVariables: environmentVariables(),
            }),
            config: configTpl({
              options,
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
    options,
    type,
    typeTarget,
    group,
    filterLive,
    properties,
    dependencies,
    environmentVariables,
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
      find(and([eq(get("type"), type), eq(get("group"), group)])),
      get("resources"),
      map(
        pipe([
          tap((params) => {
            assert(true);
          }),
          (resource) =>
            writeResource({
              environmentVariables,
              options,
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

exports.generatorMain = ({
  name,
  commandOptions,
  programOptions,
  writersSpec,
  iacTpl,
  configTpl,
}) =>
  pipe([
    tap((xxx) => {
      console.log(name, commandOptions, programOptions);
    }),
    fork({
      lives: readModel({ commandOptions, programOptions }),
      mapping: readMapping({ commandOptions, programOptions }),
    }),
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
                  commandOptions,
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
        fork({
          iac: writeIac({ filename: commandOptions.outputCode, iacTpl }),
          config: writeConfig({
            filename: commandOptions.outputConfig,
            commandOptions,
            configTpl,
          }),
          env: writeEnv({
            filename: commandOptions.outputEnv,
            programOptions,
          }),
        }),
        tap(() => {
          assert(true);
        }),
      ])(),
  ])();
