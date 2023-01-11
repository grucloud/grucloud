const assert = require("assert");
const path = require("path");
const fs = require("fs").promises;
const { snakeCase } = require("change-case");
const prettier = require("prettier");
const prompts = require("prompts");
const { ESLint } = require("eslint");
const { deepOmit } = require("./deepOmit");
const { deepOmitDefaults } = require("./deepOmitDefault");

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
  includes,
  isString,
  isObject,
  isFunction,
  unless,
  when,
  append,
  prepend,
} = require("rubico/x");
const Diff = require("diff");

const { resourcesTpl } = require("./resourcesTpl");

exports.filterModel = ({ field }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
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
                  //TODO use Object.entries, Object.fromEntries
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
  dependencyKey,
  list,
  type,
  group,
  resource,
  lives,
  filterDependency = () => () => true,
}) =>
  pipe([
    tap(() => {
      assert(type);
      assert(group);
      assert(lives);
      assert(resource.uri);
      assert(resource.providerName);
      assert(Array.isArray(resource.dependencies));
    }),
    () => resource.dependencies,
    tap((dependencies) => {
      //console.log(resource.uri, "dependencies ", dependencies);
    }),
    find(
      and([
        eq(get("groupType"), `${group}::${type}`),
        switchCase([
          get("dependencyKey"),
          eq(get("dependencyKey"), dependencyKey),
          () => true,
        ]),
      ])
    ),
    unless(isEmpty, ({ ids, providerName }) =>
      pipe([
        () => ids,
        tap((ids) => {
          assert(true);
        }),
        map(
          findLiveById({
            type,
            group,
            lives,
            providerName: resource.providerName,
          })
        ),
        tap((deps) => {
          assert(true);
          //console.log(resource.uri, "#deps ", size(deps));
        }),
        filter(not(isEmpty)),
        filter(filterDependency({ resource })),
        map(
          pipe([
            tap(({ providerName }) => {
              assert(providerName);
            }),
            switchCase([
              eq(get("providerName"), providerName),
              // Same region
              ({ name }) => `${name}`,
              // Cross region
              ({ name, providerName }) => ({ name, provider: providerName }),
            ]),
          ])
        ),
        (dependencyVarNames) => ({ list, dependencyVarNames }),
      ])()
    ),
  ])();

const envVarName = ({ name, suffix }) =>
  pipe([
    tap((params) => {
      assert(suffix);
      assert(name);
    }),
    () => `${snakeCase(name).toUpperCase()}_${snakeCase(suffix).toUpperCase()}`,
  ])();

exports.envVarName = envVarName;

const ignoredTags = [
  "gc-",
  "aws",
  "alpha.eksctl.io",
  "eksctl.cluster.k8s.io",
  "eks",
  "AmazonECSManaged",
  "directconnect",
];

const isNotOurTagKey = not(
  or([
    (tag) =>
      pipe([
        () => ignoredTags,
        any((ignoredTag) => tag.startsWith(ignoredTag)),
      ])(),
    eq(identity, "Name"),
    eq(identity, "fingerprint"), // GCP
  ])
);
const omitDependencyIds =
  ({ dependencies = {} }) =>
  (live) =>
    pipe([
      () => dependencies,
      pluck("pathId"),
      values,
      filter(not(isEmpty)),
      filter(not(includes("[]"))),
      (pathIds) => pipe([() => live, deepOmit(pathIds)])(),
    ])();

const rejectEnvironmentVariable = ({ resource, props, lives }) =>
  pipe([
    switchCase([
      callProp("hasOwnProperty", "rejectEnvironmentVariable"),
      ({ rejectEnvironmentVariable }) =>
        rejectEnvironmentVariable({ resource, lives })(props),
      () => false,
    ]),
  ]);

const omitEnvInFile = ({ resource, props }) =>
  switchCase([
    callProp("hasOwnProperty", "writeInEnvFile"),
    ({ writeInEnvFile }) => writeInEnvFile({ resource })(props),
    callProp("hasOwnProperty", "rejectEnvironmentVariable"),
  ]);

const addEnvironmentVariables =
  ({ resource, environmentVariables, lives }) =>
  (props) =>
    pipe([
      tap((params) => {
        assert(props);
      }),
      () => environmentVariables,
      filter(not(rejectEnvironmentVariable({ resource, props, lives }))),
      tap.if(not(isEmpty), (params) => {
        assert(true);
      }),
      reduce(
        (acc, { path, suffix, array }) =>
          pipe([
            () => acc,
            unless(
              pipe([get(path), isFunction]),
              set(path, () =>
                pipe([
                  () =>
                    `process.env.${envVarName({
                      name: resource.name,
                      suffix,
                    })}`,
                  when(
                    () => array,
                    pipe([prepend("JSON.parse("), append(")")])
                  ),
                ])
              )
            ),
            ,
          ])(),
        props
      ),
    ])();

const buildProperties = ({
  providerConfig,
  lives,
  resource,
  dependencies,
  environmentVariables = [],
  commandOptions,
  programOptions,
  filterLive = () => identity,
  spec: {
    tagsKey = "Tags",
    propertiesDefault,
    propertiesDefaultArray = [],
    omitProperties = [],
    omitPropertiesExtra = [],
    pickPropertiesCreate = [],
    filterLiveExtra = () => identity,
  },
}) =>
  pipe([
    tap(() => {
      assert(environmentVariables);
      assert(filterLive);
      assert(pickPropertiesCreate);
      assert(resource);
      //assert(propertiesDefault);
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
      omitProperties,
      pickPropertiesCreate,
    }),
    omitDependencyIds({ dependencies }),
    addEnvironmentVariables({ resource, environmentVariables, lives }),
    filterLiveExtra({
      providerConfig,
      lives,
      resource,
      dependencies,
      programOptions,
      commandOptions,
      omitProperties,
      pickPropertiesCreate,
    }),
    tap((params) => {
      assert(Array.isArray(omitProperties));
    }),
    when(() => isEmpty(pickPropertiesCreate), pipe([deepOmit(omitProperties)])),
    deepOmit(omitPropertiesExtra),
    differenceObject(propertiesDefault),
    deepOmitDefaults(propertiesDefaultArray),
    tap((params) => {
      assert(true);
    }),
    assign({
      [tagsKey]: pipe([
        () => resource,
        tap((params) => {
          assert(tagsKey);
        }),
        get("live"),
        get(tagsKey, []),
        switchCase([
          Array.isArray,
          pipe([
            filter((tag) =>
              pipe([
                () => ["Key", "key", "TagKey"],
                all(pipe([(key) => get(key, "")(tag), isNotOurTagKey])),
              ])()
            ),
            filter(
              pipe([
                when(get("key"), pipe([assign({ Key: get("key") })])),
                when(get("TagKey"), pipe([assign({ Key: get("TagKey") })])),
                providerConfig.filterTags,
              ])
            ),
            map(pipe([map(pipe([replaceRegion({ providerConfig })]))])),
          ]),
          // tags as objects
          pipe([
            Object.entries,
            filter(([key, value]) => isNotOurTagKey(key)),
            filter(([Key, Value]) => providerConfig.filterTags({ Key, Value })),
            Object.fromEntries,
          ]),
        ]),
      ]),
    }),
    tap((params) => {
      assert(true);
    }),
    omitIfEmpty([tagsKey]),
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
      pipe([
        switchCase([
          and([includes("\n"), includes("${"), not(includes("/**"))]),
          pipe([(value) => `multiline(()=>{/*\n${value}\n*/})`]),
          includes("\n"),
          pipe([callProp("replaceAll", "`", "\\`"), (value) => `\`${value}\``]),
          (value) => JSON.stringify(value),
        ]),
      ]),
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
  providerConfig,
}) =>
  pipe([
    tap(() => {
      assert(resource);
      assert(providerConfig);
    }),
    () => properties,
    providerConfig.transformResource({ resource }),
    switchCase([
      and([not(isEmpty), () => !resource.isDefault, () => !hasNoProperty]),
      pipe([
        printProperties,
        prepend(
          "\nproperties: ({config, getId, generatePassword, multiline}) => ("
        ),
        append("),"),
      ]),
      pipe([() => ""]),
    ]),
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
    filter(and([eq(get("type"), type), eq(get("group"), group)])),
    pluck("ids"),
    flatten,
    not(isEmpty),
  ]);

const envTpl = ({ resource, environmentVariables = [], lives }) =>
  pipe([
    () => environmentVariables,
    filter(
      or([
        not(
          rejectEnvironmentVariable({ resource, props: resource.live, lives })
        ),
        omitEnvInFile({ resource, props: resource.live }),
      ])
    ),
    map(({ suffix }) => `${envVarName({ name: resource.name, suffix })}=\n`),
    callProp("join", ""),
  ])();

const replaceRegion = ({ providerConfig, asFunction = true }) =>
  switchCase([
    pipe([
      tap((resource) => {
        if (!isString(resource)) {
          assert(isString(resource));
        }
      }),
      or([
        includes(providerConfig.region),
        includes(providerConfig.accountId && providerConfig.accountId()),
      ]),
    ]),
    pipe([
      callProp("replaceAll", providerConfig.region, "${config.region}"),
      callProp(
        "replaceAll",
        providerConfig.accountId && providerConfig.accountId(),
        "${config.accountId()}"
      ),
      switchCase([
        () => asFunction,
        (resource) => () => "`" + resource + "`",
        (resource) => "`" + resource + "`",
      ]),
    ]),
    pipe([
      tap((params) => {
        assert(true);
      }),
    ]),
  ]);

const dependencyValue = ({ key, list, resource, providerConfig }) =>
  pipe([
    tap((dependencyVarNames) => {
      if (!Array.isArray(dependencyVarNames)) {
        assert(Array.isArray(dependencyVarNames));
      }
      assert(providerConfig);
      if (!list) {
        if (size(dependencyVarNames) > 1) {
          assert(key);
          assert(resource);
          assert(
            false,
            `key ${key} has multiple dependencies for ${resource.groupType}`
          );
        }
      }
    }),
    callProp("sort"),
    map(
      pipe([
        tap((params) => {
          assert(true);
        }),
        switchCase([
          isString,
          pipe([
            replaceRegion({ providerConfig, asFunction: false }),
            unless(includes("`"), pipe([prepend('"'), append('"')])),
          ]),
          pipe([JSON.stringify]),
        ]),
        providerConfig.transformResourceName({ resource }),
      ])
    ),
    when(() => list, pipe([(values) => `[${values}]`])),
  ]);

const buildDependencies = ({
  providerConfig,
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
        assert(providerConfig);
      }),
      () => dependencies,
      map.entries(([dependencyKey, dependency]) => [
        dependencyKey,
        pipe([
          () => dependency,
          defaultsDeep({ dependencyKey }),
          tap((params) => {
            assert(true);
          }),
          defaultsDeep({
            findDependencyNames,
          }),
          ({ findDependencyNames }) =>
            findDependencyNames({
              dependencyKey,
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
      map.entries(([key, { list, dependencyVarNames, providerName }]) => [
        key,
        !isEmpty(dependencyVarNames) &&
          `${key}: ${dependencyValue({ key, list, resource, providerConfig })(
            dependencyVarNames
          )}`,
      ]),
      values,
      filter((x) => x),
      tap((params) => {
        assert(true);
      }),
      switchCase([
        isEmpty,
        () => "",
        (values) => `dependencies: ({ config }) =>({ 
       ${values.join(",\n")}
     }),`,
      ]),
      tap((params) => {
        assert(true);
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

const transformName = ({ providerConfig, resource }) =>
  pipe([
    providerConfig.transformResourceName({ resource }),
    switchCase([
      pipe([includes(providerConfig.region)]),
      pipe([
        replaceRegion({ providerConfig, asFunction: false }),
        prepend("name: ({config}) => "),
        append(","),
      ]),
      pipe([prepend('name: "'), append('",')]),
    ]),
  ]);

const buildName = ({ spec, resourceName, resource, providerConfig }) =>
  pipe([
    tap((params) => {
      assert(providerConfig);
    }),
    switchCase([
      () => spec.getResourceName,
      pipe([
        () => spec.getResourceName({ providerConfig })(resource.live),
        tap((params) => {
          assert(true);
        }),
        switchCase([
          isEmpty,
          () => "",
          transformName({ providerConfig, resource }),
        ]),
      ]),
      and([() => spec.inferName, () => !resource.managedByOther]),
      () => "",
      pipe([() => resourceName, transformName({ providerConfig, resource })]),
    ]),
  ])();

const codeTpl = ({
  providerName,
  providerConfig,
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
  spec,
}) =>
  pipe([
    tap((params) => {
      assert(resource);
      assert(providerConfig);
    }),
    () => "{",
    append("type:'"),
    append(type),
    append("',"),
    append("group:'"),
    append(group),
    append("',"),
    append(
      buildName({ spec, inferName, resourceName, resource, providerConfig })
    ),
    append(buildPrefix(resource)),
    switchCase([
      () => additionalCode,
      append(additionalCode),
      pipe([
        append(
          configBuildPropertiesDefault({
            resource,
            properties,
            providerConfig,
            hasNoProperty: hasNoProperty({ resource }),
          })
        ),
      ]),
    ]),
    append(
      buildDependencies({
        providerConfig,
        resource,
        lives,
        dependencies,
      })
    ),
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
  ({ commandOptions, filename }) =>
  ({ contentFormated, contentOld }) =>
    pipe([
      tap((params) => {
        assert(contentFormated);
        assert(contentOld);
      }),
      () =>
        Diff.structuredPatch(
          `${filename}.old`,
          `${filename}.new`,
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
            console.log(`Infrastructure has not changed in ${filename}`);
          }),
          () => false,
        ]), // No diff, do not save
        pipe([
          tap((params) => {
            console.log(
              `Some changes has been detected between the lives resources and the target code in ${filename}`
            );
          }),
          displayDiff,
          switchCase([
            () => commandOptions.prompt,
            pipe([
              () => ({
                type: "confirm",
                name: "confirmWrite",
                message: `Write new infrastructure to ${filename}`,
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

const createESLint = () =>
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
  });

const formatContent = ({ content }) =>
  pipe([
    tap((params) => {
      assert(content);
    }),
    () => createESLint(),
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
          (error, output) =>
            pipe([
              tap(() => {
                console.error(error);
                console.error(output);
              }),
              () => {
                throw error;
              },
            ])()
        ),
      ])(),
  ]);

const loadCurrentAndTarget =
  ({ filename, programOptions, commandOptions }) =>
  (content) =>
    pipe([
      tap(() => {
        assert(filename);
        assert(content);
      }),
      assign({
        filenameResolved: () => filename,
        contentFormated: formatContent({ content }),
      }),
      assign({
        contentOld: tryCatch(
          pipe([
            ({ filenameResolved }) => fs.readFile(filenameResolved, "utf-8"),
          ]),
          (error) => {
            //Ignore error
          }
        ),
      }),
      tap((params) => {
        assert(true);
      }),
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
      () => content,
      loadCurrentAndTarget({ filename, programOptions, commandOptions }),
      assign({
        doSave: pipe([
          switchCase([
            get("contentOld"),
            promptSave({ commandOptions, filename }),
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
      // console.log(
      //   "resource",
      //   resource.name,
      //   resource.id,
      //   resourceIn.name,
      //   resourceIn.id
    }),
    get("dependencies"),
    filter(
      and([
        eq(get("type"), resource.type),
        eq(get("group"), resource.group),
        eq(get("providerName"), resource.providerName),
      ])
    ),
    pluck("ids"),
    flatten,
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
      filter(
        not(
          and([
            eq(get("id"), resource.id),
            eq(get("groupType"), resource.groupType),
          ])
        )
      ),
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
              tap((params) => {
                assert(true);
              }),
              any(
                //TODO groupType
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
                          () => ({ group, type }),
                          findDependencySpec({ writersSpec, resource }),
                          first,
                          switchCase([
                            isEmpty,
                            tap((params) => {
                              assert(true);
                            }),
                            ({ excludeDefaultDependencies }) =>
                              pipe([
                                () => ids,
                                filter(
                                  not(
                                    pipe([
                                      findLiveById({
                                        lives,
                                        type,
                                        group,
                                        providerName,
                                      }),
                                      //TODO isDefault ?
                                      and([
                                        or([
                                          get("managedByOther"),
                                          //get("isDefault"),
                                        ]),
                                        () => excludeDefaultDependencies,
                                      ]),
                                    ])
                                  )
                                ),
                              ])(),
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
    tap((params) => {
      assert(true);
    }),
    tap.if(get("error"), () => {
      throw Error("input inventory has errors, aborting");
    }),
    get("lives.results"),
    pluck("results"),
    flatten,
    pluck("resources"),
    flatten,
    filterModel,
    removeDefaultDependencies({ writersSpec }),
    addUsedBy({ writersSpec }),
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

const buildFilename = ({
  providerName,
  providers,
  commandOptions: { outputDir, outputFile },
  workingDirectory,
}) =>
  pipe([
    tap((params) => {
      assert(outputFile);
      assert(workingDirectory);
    }),
    () => providers,
    find(eq(get("name"), providerName)),
    tap((provider) => {
      assert(provider);
    }),
    get("directory"),
    (directory) =>
      path.resolve(workingDirectory, outputDir, directory, `${outputFile}.js`),
    tap((fileName) => {
      assert(fileName);
    }),
  ])();

const writeResourcesToFile =
  ({ providers, providerName, resourcesTpl, programOptions, commandOptions }) =>
  (resourceMap) =>
    pipe([
      tap((params) => {
        assert(providers);
        assert(providerName);
      }),
      () => resourceMap,
      pluck("types"),
      flatten,
      pluck("resources"),
      flatten,
      filter(not(isEmpty)),
      filter(eq(get("providerName"), providerName)),
      fork({
        resourcesVarNames: pluck("resourceVarName"),
        resourcesCode: pipe([pluck("code"), callProp("join", "\n")]),
      }),
      ({ resourcesCode }) => resourcesTpl({ resourcesCode }),
      writeToFile({
        filename: buildFilename({
          providerName,
          commandOptions,
          providers,
          //providersCount: size(providers),
          workingDirectory: programOptions.workingDirectory,
        }),
        programOptions,
        commandOptions,
      }),
    ])();

const writeEnv =
  ({ filename, programOptions }) =>
  (resourceMap) =>
    pipe([
      () => resourceMap,
      tap((params) => {
        assert(true);
      }),
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
      flatten,
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
      // check id?.providerName
      or([matchId(id), matchId(id?.id)]),
      eq(get("type"), type),
      eq(get("group"), group),
      // Do not check by providerName, search in all providers.
    ]),
  ]);

const findLiveById =
  ({ lives, type, group, providerName }) =>
  (id) =>
    pipe([
      tap(() => {
        if (!providerName) {
          assert(providerName);
        }
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
            tap((params) => {
              assert(true);
            }),
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
    providerType,
    providerConfig,
    type,
    typeTarget,
    group,
    resourceVarName = ResourceVarNameDefault,
    resourceName = identity,
    filterLive,
    propertiesDefault,
    tagsKey,
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
        assert(resource.providerName);
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
            // console.log(" Writing", resource.name);
          }),
          fork({
            providerName: () => resource.providerName,
            resourceVarName: () => resourceVarName(resource.name),
            resourceName: () => resourceName(resource.name),
            properties: pipe([
              () =>
                buildProperties({
                  providerConfig,
                  lives,
                  resource,
                  filterLive,
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
          ({
            providerName,
            resourceVarName,
            resourceName,
            properties,
            additionalCode,
          }) => ({
            providerName,
            resourceVarName,
            env: envTpl({
              options,
              resource,
              environmentVariables,
              lives,
            }),
            code: codeTpl({
              providerType,
              providerConfig,
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
              spec,
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
    providerType,
    filterLive,
    tagsKey,
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
        assert(providerType);
      }),
      () => lives,
      filter(and([eq(get("type"), type), eq(get("group"), group)])),
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
                providerType,
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
  map.entries(([group, value]) => [group, { group, types: value }]),
  values,
]);
exports.createWritersSpec = createWritersSpec;

const providersToSpecs = pipe([
  flatMap(callProp("getSpecs")),
  groupBy("groupType"),
  (groupTypeMap) => [...groupTypeMap.values()],
  map(first),
]);

exports.generatorMain = ({
  providers,
  providerName,
  providerConfig,
  commandOptions,
  programOptions,
  providerType,
  filterModel,
}) =>
  tryCatch(
    pipe([
      tap((xxx) => {
        assert(providers);
        assert(providerName);
      }),
      fork({
        lives: readModel({
          commandOptions,
          programOptions,
          writersSpec: createWritersSpec(providersToSpecs(providers)),
          filterModel,
        }),
        mapping: readMapping({ commandOptions, programOptions }),
        providerConfig: pipe([
          () => providerConfig,
          defaultsDeep({
            transformResourceName: ({ resource }) => identity,
            transformResource: ({ resource }) => identity,
            filterTags: (tags) => identity,
          }),
        ]),
      }),
      ({ lives, mapping, providerConfig }) =>
        pipe([
          () => providers,
          filter(eq(get("name"), providerName)),
          providersToSpecs,
          createWritersSpec,
          tap((params) => {
            assert(true);
          }),

          map(({ group, types }) => ({
            group,
            types: pipe([
              () => types,
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
                    providerType,
                    ...spec,
                    spec,
                  }),
                  filter(not(isEmpty)),
                ])(),
              })),
            ])(),
          })),
          fork({
            resources: writeResourcesToFile({
              providers,
              providerName,
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
        ])(),
    ]),
    (error) => {
      //TODO handle that upper in the stack
      error.stack && console.log(error.stack);
      throw error;
    }
  )();
