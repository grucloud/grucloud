const assert = require("assert");
const path = require("path");
const fs = require("fs").promises;
const { snakeCase } = require("change-case");
const prettier = require("prettier");
const prompts = require("prompts");
const { ESLint } = require("eslint");

const { differenceObject, omitIfEmpty } = require("./Common");
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
  all,
} = require("rubico");

const {
  first,
  uniq,
  size,
  isEmpty,
  find,
  callProp,
  pluck,
  identity,
  values,
  groupBy,
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
const Diff = require("diff");
const { resourcesTpl } = require("./resourcesTpl");

exports.filterModel = ({ field }) =>
  pipe([
    map(
      assign({
        live: pipe([
          get("live"),
          when(
            get(field),
            assign({
              [field]: pipe([
                get(field),
                unless(
                  isEmpty,
                  pipe([
                    map.entries(([key, value]) => [
                      key,
                      key.startsWith("gc-") ? undefined : value,
                    ]),
                    filter(not(isEmpty)),
                  ])
                ),
              ]),
            })
          ),
          omitIfEmpty([field]),
        ]),
      })
    ),
    tap((params) => {
      assert(true);
    }),
  ]);

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
      assert(true);
      //console.log(resource.uri, "#ids ", size(ids));
    }),
    map(findLiveById({ type, group, lives, providerName })),
    tap((deps) => {
      assert(true);
      //console.log(resource.uri, "#deps ", size(deps));
    }),
    filter(not(isEmpty)),
    filter(filterDependency({ resource })),
    tap((params) => {
      assert(true);
    }),
    map(({ name }) => `'${name}'`),
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
  omitProperties = [],
  pickPropertiesCreate = [],
  spec: { tagsKey = "Tags", pickProperties },
}) =>
  pipe([
    tap(() => {
      assert(environmentVariables);
      assert(filterLive);
      assert(pickPropertiesCreate);
      assert(resource);
      //assert(spec);
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
      pickPropertiesCreate,
    }),
    tap((params) => {
      assert(true);
    }),
    //TODO
    //when(() => pickProperties, pick(pickProperties)),
    omit(omitProperties),
    differenceObject(propertiesDefault),
    tap((params) => {
      assert(true);
    }),
    assign({
      [tagsKey]: pipe([
        () => resource,
        get("live"),
        get(tagsKey, []),
        switchCase([
          Array.isArray,
          filter((tag) =>
            pipe([
              () => ["Key", "key", "TagKey"],
              all(pipe([(key) => get(key, "")(tag), isNotOurTagKey])),
            ])()
          ),
          pipe([
            map.entries(([key, value]) => [
              key,
              isNotOurTagKey(key) ? value : undefined,
            ]),
            filter(not(isEmpty)),
          ]),
        ]),
      ]),
    }),
    tap((params) => {
      assert(true);
    }),
    omitIfEmpty([tagsKey]),
    (props) =>
      pipe([
        () => environmentVariables,
        tap.if(not(isEmpty), (params) => {
          assert(true);
        }),
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
        ? `\nproperties: ({config, getId}) => (${printProperties(properties)}),`
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

const envTpl = ({ resource, environmentVariables = [] }) =>
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
    when(() => list, pipe([(values) => `[${values}]`])),
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
        assert(dependencies);
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
        (values) => `dependencies: () =>({ 
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
  () => "isDefault: true,",
  get("managedByOther"),
  () => "readOnly:true,",
  () => "",
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
    tap((params) => {
      assert(true);
    }),
    () => "{",
    append("type:'"),
    append(type),
    append("',"),
    append("group:'"),
    append(group),
    append("',"),
    append(buildName({ inferName, resourceName })),
    append(buildPrefix(resource)),
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
    append("},"),
    tap((params) => {
      assert(true);
    }),
  ])();

const displayDiff = pipe([
  get("hunks"),
  map(({ lines, newLines }) =>
    pipe([
      tap((params) => {
        console.log(`New lines ${newLines}`);
      }),
      () => lines,
      map((line) => {
        console.log(line);
      }),
    ])()
  ),
]);

const promptSave =
  ({ commandOptions }) =>
  ({ contentFormated, contentOld }) =>
    pipe([
      tap((params) => {
        assert(contentFormated);
        assert(contentOld);
      }),
      () =>
        Diff.structuredPatch(
          "resources.js.old",
          "resources.js.new",
          contentOld,
          contentFormated,
          "old",
          "new"
        ),
      tap((params) => {
        assert(true);
      }),
      switchCase([
        pipe([get("hunks"), isEmpty]),
        pipe([
          tap((params) => {
            console.log("Infrastructure has not changed.");
          }),
          () => false,
        ]), // No diff, do not save
        pipe([
          tap((params) => {
            console.log(
              `Some changes has been detected between the lives resources and the target code.`
            );
          }),
          displayDiff,
          switchCase([
            () => commandOptions.prompt,
            pipe([
              () => ({
                type: "confirm",
                name: "confirmWrite",
                message: `Write new infrastructure to resource.js`,
                initial: false,
              }),
              prompts,
              get("confirmWrite"),
            ]),
            () => true,
          ]),
        ]),
      ]),
    ])();

const writeToFile =
  ({ filename, programOptions, commandOptions }) =>
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
        contentFormated: pipe([
          () =>
            new ESLint({
              fix: true,
              plugins: {
                autofix: require("eslint-plugin-autofix"),
              },
              baseConfig: {
                env: {
                  es6: true,
                  node: true,
                },
                parserOptions: {
                  ecmaVersion: 2017,
                },
                extends: ["eslint:recommended"],
                plugins: ["autofix"],
                rules: {
                  "autofix/no-unused-vars": "warn",
                },
              },
            }),
          (eslint) =>
            pipe([
              () => eslint.lintText(content),
              tap((params) => {
                assert(true);
              }),
              first,
              switchCase([
                get("fatalErrorCount"),
                pipe([
                  tap((result) => {
                    console.log("Error linting");
                    console.log(content);
                    console.log(JSON.stringify(result, null, 4));
                  }),
                  () => content,
                ]),
                get("output"),
              ]),
              tryCatch(
                (output) => prettier.format(output, { parser: "babel" }),
                (error) =>
                  pipe([
                    tap(() => {
                      console.error(error);
                      console.error(content);
                    }),
                    () => {
                      throw error;
                    },
                  ])()
              ),
            ])(),
        ]),
      }),
      tap((params) => {
        assert(true);
      }),
      assign({
        contentOld: tryCatch(
          pipe([
            tap((params) => {
              assert(true);
            }),
            ({ filenameResolved }) => fs.readFile(filenameResolved, "utf-8"),
            tap((params) => {
              assert(true);
            }),
          ]),
          (error) => {
            //Ignore error
          }
        ),
      }),
      assign({
        doSave: pipe([
          switchCase([
            get("contentOld"),
            promptSave({ commandOptions }),
            () => true,
          ]),
        ]),
      }),
      tap.if(
        get("doSave"),
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
        )
      ),
    ])();

exports.writeToFile = writeToFile;

const hasResourceInDependency = (resource) =>
  pipe([
    tap((resourceIn) => {
      assert(resource);
      assert(resource.id);
      assert(resourceIn.id);
      //console.log("resource", resource.id, resourceIn.id);
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
          get("dependencies"),
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
            //console.error("cannot find dependency: ", resource.id);
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
        //console.log("findUsedBy", resource.id);
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
              get("dependencies"),
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
                        if (!ids) {
                          //assert(ids);
                        }
                        //assert(ids);
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
                                  //console.log(`Ignoring dependency ${id}`);
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
      assert(programOptions.workingDirectory);
      assert(commandOptions.inventory);
    }),
    () =>
      fs.readFile(
        path.resolve(programOptions.workingDirectory, commandOptions.inventory),
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
  ({ filename, resourcesTpl, programOptions, commandOptions }) =>
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
      writeToFile({ filename, programOptions, commandOptions }),
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
          //TODO do not override
          tap((filenameResolved) => {
            console.log(`Env file written to ${filenameResolved}`);
          }),
          (filenameResolved) => fs.writeFile(filenameResolved, formatted),
        ])()
      ),
    ])();

const matchId = (idToMatch) =>
  switchCase([
    () => isString(idToMatch),
    pipe([
      tap((params) => {}),
      fork({
        id: pipe([get("id"), callProp("toUpperCase")]),
        idToMatchUC: pipe([() => idToMatch.toUpperCase()]),
      }),
      ({ id, idToMatchUC }) => id === idToMatchUC,
    ]),
    () => false,
  ]);

const isEqualById = ({ type, group, providerName, id }) =>
  pipe([
    tap((params) => {
      assert(id);
    }),
    and([
      //TODO
      //or([and([() => isString(id), matchId(id)]), matchId(id?.id)]),
      or([matchId(id), matchId(id?.id)]),
      eq(get("type"), type),
      eq(get("group"), group),
      eq(get("providerName"), providerName),
    ]),
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
          assert(true);
          //console.error(`no live for ${type}, id: ${id},`);
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
        and([
          or([get("managedByOther") /*, get("cannotBeDeleted")*/]),
          pipe([
            get("usedBy", []),
            not(find(eq(get("managedByOther"), false))),
          ]),
        ]),
        pipe([get("name"), callProp("startsWith", "mc_")]),
      ]),
      tap.if(identity, (xxx) => {
        // console.log(
        //   "ignoreDefault",
        //   resource.name,
        //   " #usedBy",
        //   size(resource.usedBy)
        // );
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
    omitProperties,
    tagsKey,
    pickPropertiesCreate,
    codeBuildProperties,
    hasNoProperty,
    inferName,
    properties = always({}),
    dependencies = {},
    addCode = always(""),
    environmentVariables = [],
    ignoreResource = () => () => false,
    options,
    commandOptions,
    programOptions,
    spec,
  }) =>
  ({ resource, lives, mapping }) =>
    pipe([
      tap(() => {
        assert(providerName);
        assert(spec);
      }),
      () => resource,
      switchCase([
        or([ignoreResource({ lives }), ignoreDefault({ lives })]),
        (resource) => {
          assert(true);
          //console.log(" Ignore", resource.name);
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
                  omitProperties,
                  pickPropertiesCreate,
                  tagsKey,
                  propertiesDefault,
                  dependencies,
                  environmentVariables,
                  commandOptions,
                  programOptions,
                  spec,
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
              environmentVariables,
            }),
            code: codeTpl({
              providerName,
              group,
              type: typeTarget || type,
              resource,
              resourceVarName,
              resourceName,
              inferName,
              dependencies,
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
    omitProperties,
    tagsKey,
    pickPropertiesCreate,
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
    spec,
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
                omitProperties,
                propertiesDefault,
                pickPropertiesCreate,
                inferName,
                dependencies,
                ignoreResource,
                resourceVarName,
                resourceName,
                codeBuildProperties,
                configBuildProperties,
                hasNoProperty,
                addCode,
                spec,
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

const createWritersSpec = pipe([
  groupBy("group"),
  tap((params) => {
    assert(true);
  }),
  map.entries(([group, value]) => [group, { group, types: value }]),
  values,
]);
exports.createWritersSpec = createWritersSpec;

exports.generatorMain = ({
  name,
  providerConfig,
  commandOptions,
  programOptions,
  specs,
  providerType,
  iacTpl,
  filterModel,
}) =>
  tryCatch(
    pipe([
      tap((xxx) => {
        assert(specs);
      }),
      fork({
        lives: readModel({
          commandOptions,
          programOptions,
          writersSpec: createWritersSpec(specs),
          filterModel,
        }),
        mapping: readMapping({ commandOptions, programOptions }),
      }),
      ({ lives, mapping }) =>
        pipe([
          () => specs,
          createWritersSpec,
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
                    spec,
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
              commandOptions,
            }),
            env: writeEnv({
              filename: commandOptions.outputEnv,
              programOptions,
              commandOptions,
            }),
          }),
          tap((params) => {
            assert(true);
          }),
        ])(),
    ]),
    (error) => {
      //TODO handle that upper in the stack
      error.stack && console.log(error.stack);
      throw error;
    }
  )();
