const assert = require("assert");
const path = require("path");
const fs = require("fs").promises;
const { snakeCase } = require("change-case");
const prettier = require("prettier");
const { differenceObject } = require("./Common");
const {
  pipe,
  tap,
  set,
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
  flatMap,
} = require("rubico");

const {
  uniq,
  size,
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
  append,
} = require("rubico/x");

const { resourcesTpl } = require("./resourcesTpl");

const ResourceVarNameDefault = pipe([
  tap((name) => {
    assert(name, "missing resource name");
  }),
  identity,
]);

exports.ResourceVarNameDefault = ResourceVarNameDefault;

const findDependencyNames = ({
  list,
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
    tap((dependencies) => {
      //console.log(resource.uri, "dependencies ", dependencies);
    }),
    find(eq(get("groupType"), `${group}::${type}`)),
    get("ids"),
    tap((ids) => {
      //console.log(resource.uri, "#ids ", size(ids));
    }),
    map(findLiveById({ type, group, lives, providerName })),
    tap((deps) => {
      //console.log(resource.uri, "#deps ", size(deps));
    }),
    filter(not(isEmpty)),
    filter(filterDependency({ resource })),
    //TODO openstack should set its group
    map(
      ({ group = "compute", type, name }) =>
        `resources.${group}.${type}['${name}']`
    ),
    tap((params) => {
      assert(true);
    }),
    (dependencyVarNames) => ({ list, dependencyVarNames }),
  ])();

const envVarName = ({ resource, suffix }) =>
  `${snakeCase(resource.name).toUpperCase()}_${snakeCase(
    suffix
  ).toUpperCase()}`;

const isNotOurTagKey = not(
  or([callProp("startsWith", "gc-"), eq(identity, "Name")])
);

const buildProperties = ({
  providerConfig,
  lives,
  resource,
  dependencies,
  environmentVariables = [],
  commandOptions,
  programOptions,
  filterLive = () => identity,
  propertiesDefault = {},
}) =>
  pipe([
    tap(() => {
      assert(environmentVariables);
    }),
    () => resource,
    get("live"),
    filterLive({
      providerConfig,
      lives,
      resource,
      dependencies,
      programOptions,
      commandOptions,
    }),
    tap((params) => {
      assert(true);
    }),
    differenceObject(propertiesDefault),
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
    tap((params) => {
      assert(true);
    }),
    when(pipe([get("Tags"), isEmpty]), omit(["Tags"])),
    tap((params) => {
      assert(true);
    }),
    (props) =>
      pipe([
        () => environmentVariables,
        reduce(
          (acc, { path, suffix }) =>
            set(
              path,
              () => `process.env.${envVarName({ resource, suffix })}`
            )(acc),
          props
        ),
      ])(),
  ])();

const isNumeric = (num) =>
  (typeof num === "number" || (typeof num === "string" && num.trim() !== "")) &&
  !isNaN(num);

const printPropertiesDo = (value) =>
  pipe([
    () => value,
    switchCase([
      isFunction,
      (fun) => pipe([() => fun()])(),
      isString,
      pipe([(value) => JSON.stringify(value)]),
      isNumeric,
      pipe([identity]),
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
      pipe([identity]),
    ]),
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
        ? `\nproperties: ({config}) => (${printProperties(properties)}),`
        : "",
    tap((params) => {
      assert(true);
    }),
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
    map(({ suffix }) => `${envVarName({ resource, suffix })}=\n`),
    callProp("join", ""),
  ])();

const dependencyValue = ({ key, list, resource }) =>
  pipe([
    tap((dependencyVarNames) => {
      assert(Array.isArray(dependencyVarNames));
      if (!list) {
        if (size(dependencyVarNames) > 1) {
          assert(key);
          assert(resource);
          assert(false);
        }
      }
    }),
    callProp("sort"),
    when(
      () => list,
      (values) => `[${values}]`
    ),
  ]);

const buildDependencies = ({
  providerName,
  resource,
  lives,
  dependencies = {},
}) =>
  switchCase([
    () => /*resource.managedByOther*/ false,
    () => "",
    pipe([
      tap(() => {
        assert(resource);
        assert(lives);
        //console.log(`${resource.name} : ${JSON.stringify(dependencies)}`);
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
            findDependencyNames({
              providerName,
              resource,
              lives,
              ...dependency,
            }),
          tap((deps) => {
            // console.log(
            //   `buildDependencies ${resource.name} : ${JSON.stringify(
            //     dependency
            //   )}, ${JSON.stringify(deps)}`
            // );
          }),
        ])(),
      ]),
      tap((params) => {
        assert(true);
      }),
      filter(not(isEmpty)),
      map.entries(([key, { list, dependencyVarNames }]) => [
        key,
        !isEmpty(dependencyVarNames) &&
          `${key}: ${dependencyValue({ key, list, resource })(
            dependencyVarNames
          )}`,
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
        //console.log(params);
      }),
    ]),
  ])();

const buildPrefix = switchCase([
  get("isDefault"),
  () => "useDefault",
  get("managedByOther"),
  () => "use",
  () => "make",
]);

const buildName = ({ inferName, resourceName }) =>
  switchCase([() => inferName, () => "", () => `name: "${resourceName}",`])();

const codeTpl = ({
  providerName,
  group,
  type,
  resourceVarName,
  inferName,
  resourceName,
  dependencies,
  resource,
  lives,
  properties,
  hasNoProperty,
  additionalCode = "",
}) =>
  pipe([
    () => "provider.",
    append(group),
    append("."),
    append(buildPrefix(resource)),
    append(type),
    append("({\n"),
    append(buildName({ inferName, resourceName })),
    switchCase([
      () => additionalCode,
      append(additionalCode),
      pipe([
        append(
          configBuildPropertiesDefault({
            resource,
            properties,
            hasNoProperty: hasNoProperty({ resource }),
          })
        ),
        append(
          buildDependencies({
            providerName,
            resource,
            lives,
            dependencies,
          })
        ),
      ]),
    ]),
    append("});\n"),
  ])();

const writeToFile =
  ({ filename, programOptions }) =>
  (content) =>
    pipe([
      tap(() => {
        assert(filename);
        assert(content);
        assert(programOptions);
      }),
      assign({
        filenameResolved: () =>
          path.resolve(programOptions.workingDirectory, filename),
        contentFormated: () => prettier.format(content, { parser: "babel" }),
      }),
      tryCatch(
        pipe([
          ({ filenameResolved, contentFormated }) =>
            fs.writeFile(filenameResolved, contentFormated),
        ]),
        (error) =>
          pipe([
            tap(() => {
              console.error(`Cannot write to file '${filename}`);
              console.error(error);
            }),
            () => {
              throw error;
            },
          ])()
      ),
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
    map(when(isObject, get("id"))),
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
        pipe([
          tap((params) => {
            console.error("cannot find dependency: ", resource.id);
          }),
          () => [],
        ]),
      ]),
    ])();

const findUsedBy =
  ({ lives, writersSpec }) =>
  (resource) =>
    pipe([
      tap(() => {
        assert(resource);
        assert(resource.id);
        assert(resource.groupType);
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
      flatMap((dep) => [dep, ...findUsedBy({ lives, writersSpec })(dep)]),
      uniq,
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
          dependencies: (resource) =>
            pipe([
              () => resource.dependencies,
              map(
                assign({
                  ids: ({ group, type, ids, providerName }) =>
                    pipe([
                      tap(() => {
                        assert(group);
                        assert(type);
                        assert(providerName);
                      }),
                      () => ({ group, type }),
                      findResourceSpec({ writersSpec }),
                      switchCase([
                        isEmpty,
                        () => [],
                        pipe([
                          () => resource,
                          findResourceSpec({ writersSpec }),
                          tap((params) => {
                            assert(true);
                          }),
                          switchCase([
                            get("includeDefaultDependencies"),
                            () => ids,
                            pipe([
                              () => ids,
                              filter(
                                pipe([
                                  findLiveById({
                                    lives,
                                    type,
                                    group,
                                    providerName,
                                  }),
                                  tap((params) => {
                                    assert(true);
                                  }),
                                  //TODO isDefault ?
                                  not(get("managedByOther")),
                                ])
                              ),
                            ]),
                          ]),
                        ]),
                      ]),
                    ])(),
                })
              ),
            ])(),
        })
      ),
      tap((params) => {
        assert(true);
      }),
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
                      filter((id) =>
                        pipe([
                          () => id,
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
                                filter(not(isEmpty)),
                                any((spec) =>
                                  switchCase([
                                    () => isFunction(spec.filterDependency),
                                    pipe([
                                      () =>
                                        spec.filterDependency({ resource })(
                                          dependency
                                        ),
                                    ]),
                                    () => true,
                                  ])()
                                ),
                                tap.if(isEmpty, () => {
                                  console.log(`Ignoring dependency ${id}`);
                                }),
                              ])(),
                          ]),
                        ])()
                      ),
                    ])(),
                })
              ),
            ])(),
        })
      ),
      tap((params) => {
        assert(true);
      }),
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
      tap((params) => {
        assert(true);
      }),
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
      assert(programOptions);
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

const writeResourcesToFile =
  ({ filename, resourcesTpl, programOptions }) =>
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
      ({ resourcesCode }) => resourcesTpl({ resourcesCode }),
      writeToFile({ filename, programOptions }),
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
    or([eq(get("id"), id), eq(get("id"), id?.id)]),
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
      and([
        get("managedByOther"),
        pipe([get("usedBy", []), not(find(eq(get("managedByOther"), false)))]),
      ]),
      tap.if(identity, (xxx) => {
        console.log("ignoreDefault", resource.name);
      }),
    ])();

const writeResource =
  ({
    providerName,
    providerConfig,
    type,
    typeTarget,
    group,
    resourceVarName = ResourceVarNameDefault,
    resourceName = identity,
    filterLive,
    propertiesDefault,
    codeBuildProperties,
    hasNoProperty,
    inferName,
    properties = always({}),
    dependencies = always({}),
    addCode = always(""),
    environmentVariables = always([]),
    ignoreResource = () => () => false,
    options,
    commandOptions,
    programOptions,
  }) =>
  ({ resource, lives, mapping }) =>
    pipe([
      tap(() => {
        assert(providerName);
      }),
      () => resource,
      switchCase([
        or([ignoreResource({ lives }), ignoreDefault({ lives })]),
        (resource) => {
          assert(true);
          console.log(" Ignore", resource.name);
        },
        pipe([
          tap((params) => {
            assert(true);
          }),
          fork({
            resourceVarName: () => resourceVarName(resource.name),
            resourceName: () => resourceName(resource.name),
            properties: pipe([
              () =>
                buildProperties({
                  providerConfig,
                  lives,
                  resource,
                  filterLive,
                  propertiesDefault,
                  dependencies: dependencies(),
                  environmentVariables: environmentVariables(),
                  commandOptions,
                  programOptions,
                }),
              (props) =>
                pipe([
                  () => properties({ resource, mapping }),
                  defaultsDeep(props),
                ])(),
            ]),
            additionalCode: () => addCode({ resource, lives }),
          }),
          tap((params) => {
            assert(true);
          }),
          ({ resourceVarName, resourceName, properties, additionalCode }) => ({
            resourceVarName,
            env: envTpl({
              options,
              resource,
              environmentVariables: environmentVariables(),
            }),
            code: codeTpl({
              providerName,
              group,
              type: typeTarget || type,
              resource,
              resourceVarName,
              resourceName,
              inferName,
              dependencies: dependencies(),
              lives,
              hasNoProperty,
              properties,
              codeBuildProperties,
              additionalCode,
            }),
          }),
          tap((params) => {
            assert(true);
          }),
        ]),
      ]),
    ])();

const writeResources =
  ({
    commandOptions,
    programOptions,
    providerConfig,
    type,
    typeTarget,
    group,
    providerName,
    filterLive,
    propertiesDefault,
    properties,
    dependencies,
    environmentVariables,
    ignoreResource,
    inferName,
    resourceVarName,
    resourceName,
    codeBuildProperties,
    configBuildProperties,
    hasNoProperty = () => false,
    addCode,
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
      tap.if(not(isEmpty), (resources) => {
        console.log(`Resources ${group}::${type} #${size(resources)}`);
      }),
      map(
        tryCatch(
          pipe([
            tap((params) => {
              assert(true);
            }),
            (resource) =>
              writeResource({
                providerConfig,
                environmentVariables,
                commandOptions,
                programOptions,
                type,
                typeTarget,
                group,
                providerName,
                properties,
                filterLive,
                propertiesDefault,
                inferName,
                dependencies,
                ignoreResource,
                resourceVarName,
                resourceName,
                codeBuildProperties,
                configBuildProperties,
                hasNoProperty,
                addCode,
              })({
                resource,
                lives,
                mapping,
              }),
          ]),
          (error) => {
            console.error("Error ", error);
            throw error;
          }
        )
      ),
    ])();

exports.generatorMain = ({
  name,
  providerConfig,
  commandOptions,
  programOptions,
  writersSpec,
  providerType,
  iacTpl,
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
                  providerConfig,
                  mapping,
                  commandOptions,
                  programOptions,
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
          resources: writeResourcesToFile({
            filename: commandOptions.outputCode,
            resourcesTpl,
            programOptions,
          }),
          env: writeEnv({
            filename: commandOptions.outputEnv,
            programOptions,
          }),
        }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  ])();
