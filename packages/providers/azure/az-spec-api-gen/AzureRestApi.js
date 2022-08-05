const assert = require("assert");
const {
  pipe,
  tap,
  filter,
  map,
  tryCatch,
  eq,
  or,
  get,
  flatMap,
  not,
  assign,
  and,
  fork,
  switchCase,
  pick,
  reduce,
  gte,
} = require("rubico");
const {
  append,
  prepend,
  groupBy,
  pluck,
  when,
  callProp,
  find,
  unless,
  isEmpty,
  first,
  last,
  flatten,
  includes,
  keys,
  values,
  size,
  defaultsDeep,
  findIndex,
  identity,
  uniq,
} = require("rubico/x");
const path = require("path");
const fs = require("fs").promises;
const { camelCase, snakeCase } = require("change-case");
const pluralize = require("pluralize");
const SwaggerParser = require("@apidevtools/swagger-parser");

const { omitIfEmpty } = require("@grucloud/core/Common");
const { isSubstituable } = require("../AzureCommon");
const { writeDoc } = require("./AzureDoc");
const { ResourcesExcludes } = require("../AzureResourcesExcludes");
const {
  buildPickPropertiesObject,
  buildPickProperties,
} = require("./buildPickProperties");
const { buildOmitPropertiesObject } = require("./buildOmitProperties");
const { buildDefaultPropertiesObject } = require("./buildDefaultProperties");
const {
  buildDependenciesFromBodyObject,
  PreDefinedDependenciesMap,
} = require("./buildDependenciesFromBody");

const {
  isSecret,
  isPreviousProperties,
  isOmit,
} = require("./AzureRestApiCommon");

const OpertionIdReplaceMap = {
  Servers_Get: "FlexibleServers_Get",
  //Storage
  StorageAccounts_GetProperties: "StorageAccounts_Get",
  TableServices_GetServiceProperties: "TableServices_Get",
  QueueServices_GetServiceProperties: "QueueServices_Get",
  FileServices_GetServiceProperties: "FileServices_Get",
  BlobServices_GetServiceProperties: "BlobServices_Get",
};

const findGroupInPath = pipe([
  callProp("split", "/"),
  find(callProp("startsWith", "Microsoft.")),
  tap((path) => {
    assert(path);
  }),
  callProp("split", "."),
  last,
  tap((params) => {
    assert(true);
  }),
]);

//TODO do we still need this ?
const selectMethod = (methods) =>
  pipe([
    () => methods,
    get("put"),
    when(isEmpty, () => methods.delete),
    tap.if(isEmpty, () => {
      assert("method should have put or delete");
    }),
    tap((params) => {
      assert(true);
    }),
  ])();

const resourceNameFromOperationId = ({ operationId }) =>
  pipe([
    tap((params) => {
      assert(operationId);
    }),
    () => OpertionIdReplaceMap[operationId],
    when(isEmpty, () => operationId),
    callProp("split", "_"),
    fork({
      parentName: pipe([first, pluralize.singular]),
      subName: pipe([last, callProp("replace", "Get", "")]),
    }),
    tap(({ parentName, subName }) => {
      assert(parentName);
    }),
    assign({
      shortName: switchCase([
        get("subName"),
        get("subName"),
        get("parentName"),
      ]),
      type: switchCase([
        ({ parentName, subName }) =>
          subName && includes(pluralize.singular(parentName))(subName),
        ({ subName }) => subName,
        ({ parentName, subName }) => `${parentName}${subName}`,
      ]),
    }),
    tap(({ type }) => {
      assert(type);
    }),
  ])();

const assignSwaggerPaths = pipe([
  get("paths"),
  map.entries(([path, methods]) => [
    path,
    pipe([() => methods, map(assign({ path: () => path }))])(),
  ]),
]);

const findGetAllByOutputSchema =
  ({ paths }) =>
  (methods) =>
    pipe([
      tap((params) => {
        assert(methods);
        //console.log(`findGetAllByOutputSchema ${methods.get.operationId}`);
      }),
      () => methods,
      get("get.responses.200.schema"),
      tap((schema) => {
        if (!schema.description) {
          assert(true);
        }
      }),
      (schema) =>
        pipe([
          () => paths,
          filter(
            get("get.responses.200.schema.properties.value.items.description")
          ),
          tap((params) => {
            // console.log("description:", size(schema.description));
            // console.log(schema.description);
            // console.log("descriptions:");
          }),
          // tap(
          //   forEach(
          //     pipe([
          //       get(
          //         "get.responses.200.schema.properties.value.items.description"
          //       ),
          //       tap(console.log),
          //       tap(pipe([size, console.log])),
          //     ])
          //   )
          // ),
          filter(
            eq(
              get(
                "get.responses.200.schema.properties.value.items.description"
              ),
              schema.description
            )
          ),
          tap.if(gte(size, 1), (results) => {
            assert(true);
            // console.log(
            //   `findGetAllByOutputSchema: multiple ${methods.get.operationId}`
            // );
          }),
          keys,
          first,
          get("get"),
          tap.if(isEmpty, () => {
            assert(true);
            // console.error(
            //   `findGetAllByOutputSchema cannot find getAll: ${methods.get.operationId}, description:`
            // );
            // console.error(schema.description);
            // forEach(
            //   pipe([
            //     tap((params) => {
            //       assert(true);
            //     }),
            //     get(
            //       "get.responses.200.schema.properties.value.items.description"
            //     ),
            //     tap(console.log),
            //     tap(pipe([size, console.log])),
            //   ])
            // )(paths);
            //console.log(`done`);
          }),
          tap((params) => {
            assert(true);
          }),
          ,
        ])(),
    ])();

const findGetAllOnSubscription =
  ({ paths, names }) =>
  (methods) =>
    pipe([
      tap((params) => {
        assert(methods);
        assert(paths);
        assert(names);
      }),
      () => methods.get.path,
      callProp("split", "/"),
      (pathArray) =>
        pipe([
          () => pathArray,
          findIndex(eq(identity, "providers")),
          (index) =>
            pipe([
              () => pathArray,
              callProp("slice", index, index + 3),
              tap((params) => {
                assert(true);
              }),
              callProp("join", "/"),
              tap((params) => {
                assert(true);
              }),
              prepend("/subscriptions/{subscriptionId}/"),
              (path) =>
                when(
                  () => path.match(new RegExp(`${names.type}s`, "ig")),
                  pipe([
                    () => paths,
                    filter(
                      pipe([
                        get("get.path", ""),
                        callProp("match", new RegExp(`^${path}$`, "ig")),
                      ])
                    ),
                    values,
                    first,
                    get("get"),
                    tap((params) => {
                      assert(true);
                    }),
                  ])
                )(),
            ])(),
        ])(),
    ])();

const findGetAllByOperationId =
  ({ paths }) =>
  (methods) =>
    pipe([
      tap((params) => {
        assert(methods);
        assert(paths);
      }),
      () => methods.get.operationId,
      callProp("replace", "Get", "List"),
      (operationId) =>
        pipe([
          () => paths,
          filter(
            pipe([
              get("get.operationId", ""),
              callProp("match", new RegExp(`^${operationId}$`, "ig")),
            ])
          ),
          tap.if(gte(size, 2), (results) => {
            assert(true);
            console.log(
              `findGetAllByOperationId: multiple ${operationId}: ${pipe([
                () => results,
                values,
                map(get("get.operationId")),
                tap((params) => {
                  assert(true);
                }),
                callProp("join", ", "),
              ])()}`
            );
          }),
          values,
          first,
          get("get"),
          // tap.if(isEmpty, () => {
          //   assert(true);
          //   console.log(
          //     `findGetAllByOperationId cannot find getAll: ${methods.get.operationId}`
          //   );
          // }),
        ])(),
    ])();

const findGetAllByParentPath =
  ({ paths }) =>
  (methods) =>
    pipe([
      tap((params) => {
        assert(methods);
        assert(paths);
      }),
      () => methods.get.path,
      callProp("split", "/"),
      switchCase([
        pipe([last, isSubstituable]),
        pipe([
          callProp("slice", 0, -1), // Remove the last one
          callProp("join", "/"),
          (getAllPath) =>
            pipe([
              () => paths,
              find(eq(get("get.path"), getAllPath)),
              // tap.if(isEmpty, () => {
              //   console.log(
              //     `findGetAllByParentPath cannot find getAll: ${methods.get.path}, ${methods.get.operationId}`
              //   );
              // }),
              get("get"),
            ])(),
        ]),
        () => undefined,
      ]),
    ])();

const makeResourceDir = ({ dir, name }) =>
  pipe([
    () => dir,
    callProp("split", "/"),
    callProp("slice", -5),
    tap((params) => {
      assert(true);
    }),
    callProp("join", "/"),
    append(`/${name}`),
    tap((params) => {
      assert(true);
    }),
  ])();

const findResources = ({
  dir,
  name,
  paths,
  group,
  groupDir,
  apiVersion,
  swagger,
}) =>
  pipe([
    () => paths,
    filter(
      or([and([get("get"), get("put")]), and([get("get"), get("delete")])])
    ),
    tap((params) => {
      assert(true);
    }),
    map((methods) =>
      pipe([
        () => resourceNameFromOperationId(methods.get),
        tap((params) => {
          assert(true);
        }),
        (names) => ({
          ...names,
          group: findGroupInPath(dir),
          groupDir,
          apiVersion,
          methods: pipe([
            () => methods,
            assign({
              getAll: (methods) =>
                pipe([
                  () => methods,
                  findGetAllOnSubscription({ paths, names }),
                  when(isEmpty, () =>
                    findGetAllByOperationId({ paths })(methods)
                  ),
                  when(isEmpty, () =>
                    findGetAllByOutputSchema({ paths })(methods)
                  ),
                  when(isEmpty, () =>
                    findGetAllByParentPath({ paths })(methods)
                  ),
                  tap.if(isEmpty, (params) => {
                    // console.log(
                    //   "no getAll for ",
                    //   methods.get.operationId,
                    //   methods.get.path
                    // );
                  }),
                ])(),
            }),
          ])(),
          dir: makeResourceDir({ dir, name }),
          swagger,
        }),
      ])()
    ),
    values,
    tap((params) => {
      assert(true);
    }),
  ])();

const processSwagger =
  ({ dir, group, groupDir, apiVersion }) =>
  ({ name }) =>
    pipe([
      tap(() => {
        assert(dir);
        assert(name);
      }),
      () => path.resolve(dir, name),
      tap((filename) => {
        assert(filename);
        //console.log(`parsing ${filename}`);
      }),
      (filename) => SwaggerParser.dereference(filename, {}),
      (swagger) =>
        pipe([
          () => swagger,
          assignSwaggerPaths,
          tap((params) => {
            assert(true);
          }),
          (paths) =>
            findResources({
              dir,
              name,
              paths,
              swagger,
              apiVersion: swagger.info.version,
            }),
        ])(),
      tap((params) => {
        assert(true);
      }),
    ])();

exports.processSwagger = processSwagger;

const walkDir = () => (dir) =>
  pipe([
    tap(() => {
      assert(dir);
    }),
    () => fs.readdir(dir, { withFileTypes: true }),
    flatMap(
      switchCase([
        callProp("isDirectory"),
        // Directory
        pipe([
          switchCase([
            pipe([get("name"), includes("example")]),
            () => undefined,
            pipe([({ name }) => path.resolve(dir, name), walkDir()]),
          ]),
        ]),
        // is json ?
        pipe([get("name"), callProp("endsWith", ".json")]),
        pipe([
          processSwagger({
            dir,
          }),
        ]),
        () => undefined,
      ])
    ),
  ])();

const listPerGroup =
  ({ directorySpec }) =>
  (groupDir) =>
    pipe([
      tap(() => {
        assert(directorySpec);
        assert(groupDir);
      }),
      () => path.resolve(directorySpec, groupDir, "resource-manager"),
      walkDir(),
      filter(not(isEmpty)),
      tap((params) => {
        assert(true);
      }),
      //private ?
      filter(not(pipe([get("apiVersion"), includes("preview")]))),
      reduce((myMap, resource) => {
        myMap.set(resource.type, resource);
        return myMap;
      }, new Map()),
      tap((params) => {
        assert(true);
      }),
      (myMap) => [...myMap.values()],
      tap((params) => {
        assert(true);
      }),
      callProp("sort", (a, b) => a.type.localeCompare(b.type)),
    ])();

const addResourceGroupDependency = pipe([
  tap((params) => {
    assert(true);
  }),
  get("get.parameters"),
  filter(get("required")),
  switchCase([
    find(eq(get("name"), "resourceGroupName")),
    () => ({
      resourceGroup: {
        type: "ResourceGroup",
        group: "Resources",
        name: "resourceGroupName",
        parent: true,
      },
    }),
    () => undefined,
  ]),
]);

const addManagedIdentityDependency = pipe([
  get("put.parameters"),
  find(eq(get("in"), "body")),
  get("schema.properties.identity.properties.userAssignedIdentities"),
  unless(isEmpty, () => ({
    managedIdentities: {
      type: "UserAssignedIdentity",
      group: "ManagedIdentity",
      createOnly: true,
      list: true,
    },
  })),
]);

const findIndexOfParams = ({ name }) =>
  pipe([
    tap((path) => {
      assert(path);
      assert(name);
    }),
    callProp("split", "/"),
    findIndex(includes(`{${name}}`)),
  ]);

const findResourcesByParentPath = ({ path, resources, index }) =>
  pipe([
    () => path,
    callProp("split", "/"),
    callProp("slice", 0, index + 1),
    callProp("join", "/"),
    tap((params) => {
      assert(true);
    }),
    (pathParent) =>
      pipe([() => resources, find(eq(get("methods.get.path"), pathParent))])(),
  ])();

const findResourcesByParameterType = ({ path, group, resources, index }) =>
  pipe([
    tap(() => {
      assert(index > 0);
      //console.log(`findResourcesByParameterType ${path}`);
    }),
    () => path,
    callProp("split", "/"),
    (arr) => arr[index - 1], //TODO use slice or at ?
    tap((paramType) => {
      //assert(paramType, `not paramType in ${path}, index: ${index}`);
    }),
    unless(
      isEmpty,
      pipe([
        pluralize.singular,
        (paramType) =>
          pipe([
            () => resources,
            filter(
              pipe([
                and([
                  pipe([
                    get("parentName", ""),
                    callProp("match", new RegExp(paramType, "gi")),
                  ]),
                  eq(get("group"), group),
                ]),
              ])
            ),
            tap((params) => {
              assert(true);
            }),
            first,
          ])(),
      ])
    ),
  ])();

const findParameterTypeFromPath =
  ({ resources, group, method: { path, operationId } }) =>
  ({ name }) =>
    pipe([
      tap(() => {
        assert(resources);
        assert(operationId);
      }),
      () => path,
      findIndexOfParams({ name }),
      (index) =>
        pipe([
          () => findResourcesByParentPath({ path, resources, index }),
          tap((params) => {
            assert(true);
          }),
          when(isEmpty, () =>
            findResourcesByParameterType({ path, resources, index, group })
          ),
          tap.if(isEmpty, (params) => {
            assert(true);
          }),
        ])(),
    ])();

const isParamLastOfUrl =
  ({ path }) =>
  (name) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => path,
      callProp("split", "/"),
      last,
      includes(name),
    ])();

const addDependencyFromPath = ({
  resources,
  methods,
  group,
  method: { parameters, path },
}) =>
  pipe([
    tap((params) => {
      assert(resources);
      assert(path);
      assert(group);
    }),
    () => parameters,
    filter(get("required")),
    filter(eq(get("in"), "path")),
    filter(not(eq(get("name"), "resourceGroupName"))),
    filter(not(eq(get("name"), "subscriptionId"))),
    filter(not(eq(get("name"), "scope"))),
    filter(not(pipe([get("name"), isParamLastOfUrl({ path })]))),
    tap((params) => {
      assert(true);
    }),
    switchCase([
      eq(size, 0),
      () => {
        // assert(false, "should have size >= 1");
      },
      // eq(size, 1),
      // () => undefined,
      pipe([
        tap((params) => {
          assert(true);
        }),
        //callProp("slice", 0, -1),
        map(
          assign({
            parameterType: findParameterTypeFromPath({
              resources,
              group,
              method: selectMethod(methods),
            }),
          })
        ),
        filter(get("parameterType")),
        reduce(
          (acc, { name, parameterType }) =>
            pipe([
              tap((params) => {
                assert(parameterType, `no parameterType ${name}`);
              }),
              () => name,
              callProp("replace", "Name", ""),
              (varName) => ({
                ...acc,
                [varName]: {
                  type: parameterType.type,
                  group: parameterType.group,
                  name,
                  parent: true,
                },
              }),
            ])(),
          {}
        ),
        tap((params) => {
          assert(true);
        }),
      ]),
    ]),
  ])();

const findDependenciesSameGroupStrict = ({ depName, group }) =>
  pipe([
    filter((resource) =>
      pipe([
        and([
          () => depName.match(new RegExp(`${resource.type}$`, "ig")),
          () => group === resource.group,
        ]),
      ])()
    ),
    tap.if(gte(size, 2), (results) => {
      console.log(
        "findDependenciesSameGroupStrict Mutiple dependencies ",
        results
      );
    }),
    first,
  ]);

const findDependenciesDepMatchesResource = ({ depName, group, type }) =>
  pipe([
    filter((resource) =>
      pipe([
        and([
          () => depName.match(new RegExp(`${resource.type}`, "ig")),
          eq(group, resource.group),
        ]),
      ])()
    ),
    tap.if(gte(size, 2), (results) => {
      //TODO
      // console.log(
      //   "findDependenciesDepMatchesResource Mutiple dependencies ",
      //   depName,
      //   group,
      //   type,
      //   results
      // );
    }),
    switchCase([eq(size, 1), first, () => undefined]),
  ]);

const findDependenciesSameGroup = ({ depName, group, type }) =>
  pipe([
    filter((resource) =>
      pipe([
        and([
          or([() => resource.type.match(new RegExp(depName, "ig"))]),
          eq(group, resource.group),
        ]),
      ])()
    ),
    tap.if(gte(size, 2), (results) => {
      //TODO
      // console.log(
      //   "findDependenciesSameGroup Mutiple dependencies ",
      //   depName,
      //   group,
      //   type,
      //   results
      // );
    }),
    switchCase([eq(size, 1), first, () => undefined]),
  ]);

const findDependenciesAllGroup = ({ depName }) =>
  pipe([
    filter((resource) =>
      pipe([() => depName.match(new RegExp(`^${resource.type}$`, "ig"))])()
    ),
    tap.if(gte(size, 2), (results) => {
      //TODO
      //console.log("findDependenciesAllGroup Mutiple dependencies ", results);
    }),
    first,
  ]);

const findDependenciesFromResources = ({
  resources,
  type,
  group,
  depId,
  pathId,
}) =>
  pipe([
    tap(() => {
      assert(type);
      assert(group);
      assert(depId);
      assert(pathId);
      assert(resources);
    }),
    () => depId,
    callProp("replace", /Id$/gi, ""),
    callProp("replace", /Resource$/i, ""),
    tap((params) => {
      assert(true);
    }),
    unless(isEmpty, (depName) =>
      pipe([
        () => resources,
        filter(not(eq(get("type"), type))),
        (resources) => {
          for (fn of [
            findDependenciesSameGroupStrict,
            findDependenciesDepMatchesResource,
            findDependenciesSameGroup,
            findDependenciesAllGroup,
          ]) {
            const dep = fn({ depName, depId, type, group })(resources);
            if (!isEmpty(dep)) {
              return dep;
            }
          }
        },
        pick(["group", "type", "parent"]),
        tap((params) => {
          assert(true);
        }),
        unless(isEmpty, defaultsDeep({ pathId })),
      ])()
    ),
  ])();

const findPreDefinedDependencies = ({ depId, pathId }) =>
  pipe([
    tap(() => {
      assert(depId);
    }),
    () => PreDefinedDependenciesMap[depId],
    tap((params) => {
      assert(true);
    }),
    unless(
      isEmpty,
      pipe([
        tap((params) => {
          assert(true);
        }),
        defaultsDeep({ pathId }),
      ])
    ),
  ])();

const addDependencyFromBody = ({ resources, type, group, method, swagger }) =>
  pipe([
    tap(() => {
      assert(resources);
      assert(group);
      assert(swagger);
    }),
    () => method,
    get("parameters"),
    find(eq(get("in"), "body")),
    get("schema"),
    tap((params) => {
      assert(true);
    }),
    (schema) =>
      pipe([
        () => schema,
        buildDependenciesFromBodyObject({ swagger }),
        tap((deps) => {
          assert(true);
        }),
        map(({ depId, pathId }) =>
          pipe([
            () => findPreDefinedDependencies({ depId, pathId }),
            tap((params) => {
              assert(true);
            }),
            when(isEmpty, () =>
              findDependenciesFromResources({
                resources,
                type,
                group,
                depId,
                pathId,
              })
            ),
            tap((params) => {
              assert(true);
            }),
          ])()
        ),
        filter(not(isEmpty)),
        tap((params) => {
          assert(true);
        }),
        reduce(
          (acc, { group, type, pathId }) =>
            pipe([
              tap((params) => {
                assert(group);
              }),
              () => type,
              camelCase,
              (varName) => ({
                ...acc,
                [varName]: pipe([
                  () => ({
                    type,
                    group,
                    createOnly: true,
                    pathId,
                  }),
                  when(
                    pipe([() => pathId, includes("[]")]),
                    defaultsDeep({ list: true })
                  ),
                ])(),
              }),
            ])(),
          {}
        ),
        tap((params) => {
          assert(true);
        }),
      ])(),
  ])();

const addDependencies = ({ resources }) =>
  assign({
    dependencies: ({ methods, type, group, swagger }) =>
      pipe([
        tap(() => {
          assert(resources);
          assert(swagger);
        }),
        () => ({
          ...addResourceGroupDependency(methods),
          ...addManagedIdentityDependency(methods),
          ...addDependencyFromBody({
            swagger,
            resources,
            method: methods.put,
            type,
            group,
          }),
          ...addDependencyFromPath({
            resources,
            group,
            methods,
            method: methods.get,
          }),
        }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  });

const buildOmitReadOnly =
  ({ parentPath = [], accumulator = [] }) =>
  (properties = {}) =>
    pipe([
      () => properties,
      map.entries(([key, obj]) => [
        key,
        pipe([
          () => obj,
          switchCase([
            isPreviousProperties({ parentPath, key }),
            pipe([() => undefined]),
            isOmit({ key, obj }),
            pipe([() => [[...parentPath, key]]]),
            pipe([
              get("properties"),
              buildOmitReadOnly({
                parentPath: [...parentPath, key],
                accumulator,
              }),
            ]),
          ]),
        ])(),
      ]),
      values,
      filter(not(isEmpty)),
      flatten,
      (results) => [...accumulator, ...results],
    ])();

const buildEnvironmentVariables =
  ({ parentPath = [], accumulator = [] }) =>
  (properties = {}) =>
    pipe([
      () => properties,
      map.entries(([key, obj]) => [
        key,
        pipe([
          () => obj,
          switchCase([
            isSecret(key),
            pipe([() => [[...parentPath, key]]]),
            isPreviousProperties({ parentPath, key }),
            pipe([() => undefined]),
            pipe([
              get("properties"),
              buildEnvironmentVariables({
                parentPath: [...parentPath, key],
                accumulator,
              }),
            ]),
          ]),
        ])(),
      ]),
      values,
      filter(not(isEmpty)),
      flatten,
      (results) => [...accumulator, ...results],
    ])();

const getParentPath = ({ obj, key, parentPath }) =>
  pipe([
    tap((params) => {
      assert(key);
    }),
    () => obj,
    switchCase([
      or([
        get("x-ms-client-flatten"),
        and([() => key === "properties", () => !isEmpty(parentPath)]),
      ]),
      () => parentPath,
      () => [...parentPath, key],
    ]),
  ])();

const getSchemaFromMethods = ({ method }) =>
  pipe([
    get("methods"),
    tap((methods) => {
      assert(methods);
    }),
    get(method),
    tap((method) => {
      assert(method);
    }),
    get("responses.200.schema"),
    tap((schema) => {
      assert(schema);
    }),
    (schema) =>
      pipe([
        () => schema,
        switchCase([
          eq(get("properties"), undefined),
          get("allOf[1].properties"),
          get("properties"),
        ]),
        //TODO
        // tap.if(
        //   (properties) => !properties,
        //   (properties) => {
        //     assert(
        //       properties,
        //       `no properties: schema: ${JSON.stringify(schema, null, 4)}`
        //     );
        //   }
        // ),
        tap((params) => {
          assert(true);
        }),
      ])(),
  ]);

const pickPropertiesGet =
  ({ swagger }) =>
  (resource) =>
    pipe([
      () => resource,
      getSchemaFromMethods({ method: "get" }),
      buildPickProperties({ swagger }),
      tap((params) => {
        assert(Array.isArray(params));
      }),
      map(
        pipe([
          tap((params) => {
            assert(
              Array.isArray(params),
              `not an array:${JSON.stringify(params)}`
            );
          }),
          callProp("join", "."),
        ])
      ),
    ])();

const pickResourceInfo = ({ swagger, ...other }) =>
  pipe([
    tap(() => {
      assert(other);
      assert(swagger);
    }),
    () => other,
    pick(["type", "group", "apiVersion", "dependencies", "methods"]),
    assign({
      omitProperties: pipe([
        get("methods"),
        tap((methods) => {
          assert(methods);
        }),
        //TODO get or put
        get("get"),
        tap((method) => {
          assert(method);
        }),
        get("responses.200.schema"),
        tap((schema) => {
          assert(schema);
        }),
        buildOmitPropertiesObject({
          swagger,
          parentPath: [],
          accumulator: [],
        }),
        map(callProp("join", ".")),
        uniq,
      ]),
      //pickProperties: pickPropertiesGet({ swagger }),
      pickPropertiesCreate: (resource) =>
        pipe([
          () => resource,
          get("methods.put"),
          get("parameters"),
          find(eq(get("in"), "body")),
          switchCase([
            isEmpty,
            () => pickPropertiesGet({ swagger })(resource),
            pipe([
              get("schema"),
              tap((schema) => {
                assert(schema);
              }),
              buildPickPropertiesObject({
                swagger,
                parentPath: [],
                accumulator: [],
              }),
              map(callProp("join", ".")),
            ]),
          ]),
          uniq,
        ])(),
      environmentVariables: pipe([
        getSchemaFromMethods({ method: "get" }),
        buildEnvironmentVariables({}),
        map(
          fork({
            path: pipe([callProp("join", ".")]),
            suffix: pipe([last, snakeCase, callProp("toUpperCase")]),
          })
        ),
      ]),
      propertiesDefaultArray: (resource) =>
        pipe([
          () => resource,
          get("methods.put"),
          get("parameters"),
          find(eq(get("in"), "body")),
          tap((params) => {
            assert(true);
          }),
          get("schema"),
          when(
            isEmpty,
            pipe([
              () => resource,
              get("methods"),
              tap((methods) => {
                assert(methods);
              }),
              get("get"),
              tap((method) => {
                assert(method);
              }),
              get("responses.200.schema"),
              tap((schema) => {
                assert(schema);
              }),
            ])
          ),
          buildDefaultPropertiesObject({
            swagger,
            parentPath: [],
            accumulator: [],
          }),
          tap((params) => {
            assert(true);
          }),
          filter(([keys, defaultValue]) => defaultValue != null),
          map(([keys, defaultValue]) =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => keys,
              callProp("join", "."),
              (path) => [path, defaultValue],
            ])()
          ),
          tap((params) => {
            assert(true);
          }),
        ])(),
      methods: pipe([
        get("methods"),
        map.entries(([key, value]) => [
          key,
          pipe([
            () => value,
            tap((params) => {
              assert(true);
            }),
            pick(["path", "operationId"]),
          ])(),
        ]),
        tap((params) => {
          assert(true);
        }),
      ]),
    }),
    omitIfEmpty([
      "environmentVariables",
      "omitProperties",
      "propertiesDefaultArray",
    ]),
    tap((params) => {
      assert(true);
    }),
  ])();

const filterGetAll = ({ name, dependencies, methods }) =>
  pipe([
    fork({
      dependenciesCountComputed: pipe([() => dependencies, size]),
      dependenciesCountInPath: pipe([
        () => methods,
        get("getAll.parameters"),
        when(isEmpty, () => get("get.parameters")(methods)),
        tap.if(isEmpty, () => {
          //assert(false, "no get or getAll parameter");
        }),
        filter(
          and([
            eq(get("in"), "path"),
            get("required"),
            not(eq(get("name"), "subscriptionId")),
            not(eq(get("name"), "scope")),
          ])
        ),
        size,
      ]),
    }),
    ({ dependenciesCountComputed, dependenciesCountInPath }) =>
      dependenciesCountComputed >= dependenciesCountInPath,
    tap.if(eq(identity, false), () => {
      //TODO
      // console.log(
      //   `filterGetAll mismatch deps ${methods.get.operationId}, ${methods.get.path} `
      // );
    }),
  ])();

//const filterNoDependency = pipe([get("dependencies"), not(isEmpty)]);

const filterExclusion = ({ group, type }) =>
  pipe([
    tap(() => {
      assert(group);
      assert(type);
    }),
    () => ResourcesExcludes,
    not(includes(`${group}::${type}`)),
  ])();

//TODO
const filterNoSubscription = ({ methods }) =>
  pipe([
    tap(() => {
      assert(methods);
    }),
    get("get.path", ""),
    callProp("startsWith", "/subscription/"),
  ])();

const writeSchema = ({ outputSchemaFile }) =>
  pipe([
    tap((params) => {
      assert(outputSchemaFile);
    }),
    map(pickResourceInfo),
    tap((params) => {
      assert(true);
    }),
    (json) => JSON.stringify(json, null, 4),
    //TODO prettier
    (content) => fs.writeFile(outputSchemaFile, content),
  ]);

const processSwaggerFiles = ({
  directorySpec = path.resolve(
    process.cwd(),
    "azure-rest-api-specs/specification"
  ),
  directoryDoc = path.resolve(
    process.cwd(),
    "../../../docusaurus/docs/azure/resources/"
  ),
  outputSchemaFile,
  filterDirs = [],
}) =>
  pipe([
    tap((params) => {
      assert(directorySpec);
    }),
    () => fs.readdir(directorySpec, { withFileTypes: true }),
    filter(callProp("isDirectory")),
    filter(
      or([
        () => isEmpty(filterDirs),
        ({ name }) => pipe([() => filterDirs, includes(name)])(),
      ])
    ),
    flatMap(pipe([get("name"), listPerGroup({ directorySpec })])),
    filter(not(isEmpty)),
    //filter(filterNoSubscription),
    filter(filterExclusion),
    tap((params) => {
      assert(true);
    }),
    (resources) =>
      pipe([() => resources, map(addDependencies({ resources }))])(),
    //filter(filterNoDependency),
    filter(filterGetAll),
    tap((params) => {
      assert(true);
    }),
    fork({
      doc: writeDoc({ directoryDoc }),
      schema: writeSchema({ outputSchemaFile }),
    }),
  ])();

exports.processSwaggerFiles = processSwaggerFiles;
