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
  any,
} = require("rubico");

const {
  size,
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

const omitPathIfEmpty = (path) => (obj) =>
  pipe([() => obj, when(pipe([get(path), isEmpty]), omit([path]))])();

exports.omitIfEmpty = (paths) => (obj) =>
  pipe([
    () => paths,
    reduce((acc, path) => pipe([() => acc, omitPathIfEmpty(path)])(), obj),
    tap((params) => {
      assert(true);
    }),
  ])();

const findDependencyNames = ({
  type,
  group,
  providerName,
  resource,
  lives,
  filterDependency = () => () => true,
}) =>
  pipe([
    tap(() => {
      assert(type);
      assert(group);
      assert(lives);
      assert(providerName);
      assert(resource.uri);
      assert(Array.isArray(resource.dependencies));
    }),
    () => resource.dependencies,
    find(eq(get("groupType"), `${group}::${type}`)),
    get("ids"),
    map(findLiveById({ type, group, lives, providerName })),
    filter(not(isEmpty)),
    filter(filterDependency({ resource })),
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
      (fun) => pipe([() => fun()])(),
      isString,
      //TODO check if string has single or double quote
      (value) => `'${value}'`,
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
    tap(() => {
      //console.log("In:", JSON.stringify(value, null, 4));
    }),
    () => value,
    printPropertiesDo,
    tap((params) => {
      assert(true);
      //console.log("Out", JSON.stringify(params, null, 4));
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

exports.hasDependency = ({ type, group }) =>
  pipe([
    tap(() => {
      assert(type);
      assert(group);
    }),
    get("dependencies"),
    find(and([eq(get("type"), type), eq(get("group"), group)])),
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
  pipe([
    tap(() => {
      assert(Array.isArray(value));
    }),
    () => value,
    callProp("sort", (a, b) => a.localeCompare(b)),
    when(
      () => key.endsWith("s"),
      (value) => `[${value}]`
    ),
  ])();

const buildDependencies = ({
  providerName,
  resource,
  lives,
  dependencies = {},
}) =>
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
        tap((params) => {
          assert(true);
        }),
        defaultsDeep({
          findDependencyNames,
        }),
        ({ findDependencyNames }) =>
          findDependencyNames({ providerName, resource, lives, ...dependency }),
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
    () => `name: get("config.${group}.${type}.${resourceVarName}.name"),`,
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
        ? `\nproperties: get("config.${group}.${type}.${resourceVarName}.properties"),`
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
  providerName,
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
)}${codeBuildProperties({
  group,
  type,
  resource,
  resourceVarName,
  properties,
  hasNoProperty: hasNoProperty({ resource }),
})}
${buildDependencies({
  providerName,
  resource,
  lives,
  dependencies,
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

const hasResourceInDependency = (resource) =>
  pipe([
    tap((resourceIn) => {
      assert(resource);
      assert(resource.id);
      assert(resourceIn.id);
    }),
    get("dependencies"),
    find(
      and([
        eq(get("type"), resource.type),
        eq(get("group"), resource.group),
        eq(get("providerName"), resource.providerName),
      ])
    ),
    get("ids"),
    includes(resource.id),
  ]);

const findResourceSpec =
  ({ writersSpec }) =>
  ({ group, type }) =>
    pipe([
      tap(() => {
        assert(writersSpec);
        assert(group);
        assert(type);
      }),
      () => writersSpec,
      find(eq(get("group"), group)),
      get("types"),
      find(eq(get("type"), type)),
    ])();

const findDependencySpec =
  ({ writersSpec, resource }) =>
  (dependency) =>
    pipe([
      tap(() => {
        assert(writersSpec);
        assert(resource.id);
        assert(dependency.type);
        assert(dependency.group);
      }),
      () => resource,
      findResourceSpec({ writersSpec }),
      switchCase([
        get("dependencies"),
        pipe([
          callProp("dependencies"),
          values,
          filter(
            and([
              eq(get("type"), dependency.type),
              eq(get("group"), dependency.group),
            ])
          ),
        ]),
        () => undefined,
      ]),
    ])();

const findUsedBy =
  ({ lives, writersSpec }) =>
  (resource) =>
    pipe([
      tap(() => {
        assert(resource);
        assert(resource.id);
        assert(writersSpec);
      }),
      () => lives,
      filter(hasResourceInDependency(resource)),
      tap((params) => {
        assert(true);
      }),
      filter(
        pipe([
          tap(({ group, type }) => {
            assert(group);
            assert(type);
          }),
          findResourceSpec({ writersSpec }),
          tap((result) => {
            assert(true);
          }),
          switchCase([
            get("dependencies"),
            pipe([
              callProp("dependencies"),
              values,
              any(
                and([
                  eq(get("type"), resource.type),
                  eq(get("group"), resource.group),
                ])
              ),
            ]),
            () => false,
          ]),
        ])
      ),
    ])();

// TODO split in 2
const removeDefaultDependencies =
  ({ writersSpec }) =>
  (lives) =>
    pipe([
      tap(() => {
        assert(writersSpec);
      }),
      () => lives,
      map(
        assign({
          dependencies: pipe([
            get("dependencies"),
            map(
              assign({
                ids: ({ group, type, ids, providerName }) =>
                  pipe([
                    tap(() => {
                      assert(group);
                      assert(type);
                      assert(providerName);
                    }),
                    () => ids,
                    when(
                      or([
                        //group and type not in writersSpec, i.e NetworkInterface
                        pipe([
                          () => ({ group, type }),
                          findResourceSpec({ writersSpec }),
                          isEmpty,
                        ]),
                        // Remove ids if there is only one and it is a default.
                        and([
                          eq(size, 1),
                          pipe([
                            first,
                            findLiveById({
                              lives,
                              type,
                              group,
                              providerName,
                            }),
                            get("isDefault"),
                          ]),
                        ]),
                      ]),
                      () => []
                    ),
                  ])(),
              })
            ),
          ]),
        })
      ),
      map(
        assign({
          dependencies: (resource) =>
            pipe([
              tap(() => {
                assert(resource.uri);
              }),
              () => resource,
              get("dependencies"),
              map(
                assign({
                  ids: ({ group, type, ids, providerName }) =>
                    pipe([
                      tap(() => {
                        assert(type);
                        assert(group);
                        assert(providerName);
                        assert(ids);
                      }),
                      () => ids,
                      filter(
                        pipe([
                          tap((id) => {
                            assert(id);
                          }),
                          findLiveById({
                            lives,
                            type,
                            group,
                            providerName,
                          }),
                          switchCase([
                            isEmpty,
                            pipe([() => true]),
                            (dependency) =>
                              pipe([
                                () => dependency,
                                findDependencySpec({ writersSpec, resource }),
                                any(
                                  pipe([
                                    get("filterDependency"),
                                    switchCase([
                                      isFunction,
                                      (filterDependency) =>
                                        filterDependency({ resource })(
                                          dependency
                                        ),
                                      () => true,
                                    ]),
                                  ])
                                ),
                              ])(),
                          ]),
                        ])
                      ),
                    ])(),
                })
              ),
              tap((params) => {
                assert(true);
              }),
            ])(),
        })
      ),
    ])();

const addUsedBy =
  ({ writersSpec }) =>
  (lives) =>
    pipe([
      tap(() => {
        assert(writersSpec);
        assert(lives);
      }),
      () => lives,
      map(
        assign({
          usedBy: findUsedBy({ lives, writersSpec }),
        })
      ),
    ])();

const readModel = ({
  writersSpec,
  commandOptions,
  programOptions,
  filterModel,
}) =>
  pipe([
    tap(() => {
      assert(writersSpec);
      assert(programOptions.workingDirectory);
    }),
    () =>
      fs.readFile(
        path.resolve(programOptions.workingDirectory, commandOptions.input),
        "utf-8"
      ),
    JSON.parse,
    get("result"),
    tap.if(get("error"), () => {
      throw Error("input inventory has errors, aborting");
    }),
    get("results"),
    pluck("results"),
    flatten,
    pluck("resources"),
    flatten,
    tap((params) => {
      assert(true);
    }),
    filterModel,
    tap((params) => {
      assert(true);
    }),
    removeDefaultDependencies({ writersSpec }),
    addUsedBy({ writersSpec }),
    //TODO handle multi provider
    tap((params) => {
      assert(true);
    }),
  ]);

exports.readModel = readModel;

const readMapping = ({ commandOptions, programOptions }) =>
  tryCatch(
    pipe([
      tap(() => {
        //console.log("readMapping", options.mapping);
      }),
      () =>
        fs.readFile(
          path.resolve(programOptions.workingDirectory, options.mapping),
          "utf-8"
        ),
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
      unless(isEmpty, (formatted) =>
        pipe([
          tap(() => {
            assert(programOptions.workingDirectory);
            assert(filename);
          }),
          () => path.resolve(programOptions.workingDirectory, filename),
          tap((filenameResolved) => {
            console.log(`Env file written to ${filenameResolved}`);
          }),
          (filenameResolved) => fs.writeFile(filenameResolved, formatted),
        ])()
      ),
    ])();

const isEqualById = ({ type, group, providerName, id }) =>
  and([
    eq(get("id"), id),
    eq(get("type"), type),
    eq(get("group"), group),
    eq(get("providerName"), providerName),
  ]);

const findLiveById =
  ({ lives, type, group, providerName }) =>
  (id) =>
    pipe([
      tap(() => {
        assert(providerName);
        assert(group);
        assert(lives);
        assert(type);
        assert(id, `no id for ${type}, id: ${id},`);
      }),
      () => lives,
      find(isEqualById({ type, group, providerName, id })),
      tap((live) => {
        if (!live) {
          console.error(`no live for ${type}, id: ${id},`);
          //assert(live, `no live for ${type}, id: ${id},`);
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
      or([
        get("isDefault"),
        and([
          get("managedByOther"),
          pipe([get("usedBy"), not(find(eq(get("managedByOther"), false)))]),
        ]),
      ]),
    ])();

const writeResource =
  ({
    providerName,
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
      tap(() => {
        assert(providerName);
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
              providerName,
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
              providerName,
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
    providerName,
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
        assert(lives);
        assert(type);
        assert(group);
        assert(providerName);
      }),
      () => lives,
      filter(
        and([
          eq(get("providerName"), providerName),
          eq(get("type"), type),
          eq(get("group"), group),
        ])
      ),
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
              providerName,
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
  providerType,
  iacTpl,
  configTpl,
  filterModel,
}) =>
  pipe([
    tap((xxx) => {
      console.log(name, commandOptions, programOptions);
    }),
    fork({
      lives: readModel({
        commandOptions,
        programOptions,
        writersSpec,
        filterModel,
      }),
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
                  providerName: providerType, //TODO
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
