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
  any,
  and,
  fork,
  switchCase,
  pick,
  reduce,
  gt,
  gte,
} = require("rubico");
const {
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
  values,
  size,
  defaultsDeep,
  findIndex,
} = require("rubico/x");
const path = require("path");
const fs = require("fs").promises;
const pluralize = require("pluralize");

const SwaggerParser = require("@apidevtools/swagger-parser");

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
    () => operationId,
    tap((params) => {
      assert(true);
    }),
    callProp("split", "_"),
    fork({
      parentName: pipe([first /*singularize*/]),
      subName: pipe([last, callProp("replace", "Get", "")]),
    }),
    tap(({ parentName, subName }) => {
      assert(parentName);
      //assert(subName);
    }),
    assign({
      shortName: switchCase([
        get("subName"),
        get("subName"),
        get("parentName"),
      ]),
      name: switchCase([
        ({ parentName, subName }) =>
          subName && includes(pluralize.singular(parentName))(subName),
        ({ subName }) => subName,
        ({ parentName, subName }) => `${parentName}${subName}`,
      ]),
    }),
    tap(({ name }) => {
      assert(name);
    }),
    assign({ singular: pipe([get("name"), pluralize.singular]) }),
  ])();

const getSwaggerPaths = pipe([
  get("paths"),
  map.entries(([path, methods]) => [
    path,
    pipe([() => methods, map(assign({ path: () => path }))])(),
  ]),
]);

const findResources = ({ paths, swagger, group, groupDir, versionDir }) =>
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
        () => ({
          ...resourceNameFromOperationId(methods.get),
          group,
          groupDir,
          versionDir,
          methods: pipe([
            () => methods,
            assign({
              getAll: (ops) =>
                pipe([
                  tap((params) => {
                    assert(ops);
                  }),
                  () => ops.get.operationId,
                  callProp("replace", "Get", "List"),
                  (operationId) =>
                    pipe([
                      () => paths,
                      filter(
                        pipe([get("get.operationId"), includes(operationId)])
                      ),
                      tap.if(gte(size, 2), (results) => {
                        assert(true);
                      }),
                      values,
                      first,
                      get("get"),
                      tap((params) => {
                        assert(true);
                      }),
                      tap.if(isEmpty, () => {
                        assert(true);
                        //console.log(`cannot find getAll: ${operationId}`);
                        //assert(getAll, `cannot find ${operationId}`);
                      }),
                    ])(),
                ])(),
            }),
          ])(),
        }),
      ])()
    ),
    values,
  ])();

const processSwagger =
  ({ dir, group, groupDir, versionDir }) =>
  ({ name }) =>
    pipe([
      tap(() => {
        assert(dir);
        assert(group);
        assert(groupDir);
        assert(name);
      }),
      () => path.resolve(dir, name),
      (filename) =>
        SwaggerParser.dereference(filename, {
          dereference: {
            //circular: "ignore",
          },
        }),
      tap((params) => {
        assert(true);
      }),
      (swagger) =>
        pipe([
          () => swagger,
          getSwaggerPaths,
          (paths) =>
            findResources({ paths, swagger, group, groupDir, versionDir }),
          (resources) => ({
            name,
            group,
            groupDir,
            versionDir,
            //swagger,
            resources,
          }),
        ])(),
    ])();

exports.processSwagger = processSwagger;

const listPerGroup =
  ({ baseDir }) =>
  (groupDir) =>
    pipe([
      tap(() => {
        assert(baseDir);
        assert(groupDir);
      }),
      () => path.resolve(baseDir, groupDir, "resource-manager"),
      (dir) =>
        tryCatch(
          pipe([
            () => fs.readdir(dir, { withFileTypes: true }),
            filter(callProp("isDirectory")),
            tap((params) => {
              assert(true);
            }),
            filter(pipe([get("name"), callProp("startsWith", "Microsoft.")])),
            flatMap(({ name: group }) =>
              pipe([
                () => path.resolve(dir, group),
                (specDir) => fs.readdir(specDir, { withFileTypes: true }),
                find(eq(get("name"), "stable")),
                unless(
                  isEmpty,
                  pipe([
                    ({ name }) => path.resolve(dir, group, name),
                    (dir) =>
                      pipe([
                        () => fs.readdir(dir, { withFileTypes: true }),
                        filter(callProp("isDirectory")),
                        last,
                        ({ name: versionDir }) =>
                          pipe([
                            () => path.resolve(dir, versionDir),
                            (dir) =>
                              pipe([
                                () => fs.readdir(dir, { withFileTypes: true }),
                                filter(callProp("isFile")),
                                filter(
                                  pipe([
                                    get("name"),
                                    callProp("endsWith", ".json"),
                                  ])
                                ),
                                map(
                                  processSwagger({
                                    dir,
                                    group,
                                    groupDir,
                                    versionDir,
                                  })
                                ),
                              ])(),
                          ])(),
                      ])(),
                  ])
                ),
              ])()
            ),
            filter(not(isEmpty)),
          ]),
          (error) => {
            console.error(error);
          }
        )(),
    ])();

const addResourceGroupDependency = pipe([
  tap((params) => {
    assert(true);
  }),
  get("get.parameters"),
  filter(get("required")),
  switchCase([
    find(eq(get("name"), "resourceGroupName")),
    () => ({ resourceGroup: { type: "ResourceGroup", group: "Resources" } }),
    () => undefined,
  ]),
]);

const findByOperationId = ({ operationId }) =>
  pipe([
    filter(({ name }) =>
      pipe([() => operationId, callProp("split", "_"), eq(first, name)])()
    ),
    tap((params) => {
      assert(true);
    }),
  ]);

const findByParamType = ({ paramType }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    filter(({ singular }) => paramType.match(new RegExp(`${singular}$`, "gi"))),
    tap((params) => {
      assert(true);
    }),
  ]);

const findByParamTypeIncluded = ({ paramType }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    filter(({ singular }) => singular.match(new RegExp(`${paramType}$`, "gi"))),
    tap((params) => {
      assert(true);
    }),
  ]);

const findResourceByParameter =
  ({ resources, name, path, operationId }) =>
  (paramType = "") =>
    pipe([
      () => {
        assert(resources);
        const fns = [
          findByParamType({ paramType }),
          findByParamTypeIncluded({ paramType }),
          findByOperationId({ operationId }),
        ];
        for (fn of fns) {
          const results = fn(resources);
          if (size(results) > 1) {
            console.info(
              `Multiple dependencies ${paramType} ${name}, ${path}, ${operationId}, #results ${size(
                results
              )}`
            );
          }
          if (!isEmpty(results)) {
            return pipe([
              () => results,
              first,
              pick(["name", "singular", "group"]),
              tap((params) => {
                assert(true);
              }),
            ])();
          }
        }
      },
      tap((params) => {
        assert(true);
      }),
      tap.if(isEmpty, () => {
        console.info(
          `Cannot find the dependency ${paramType} ${name}, ${path}, ${operationId}`
        );
      }),
    ])();

const findParameterTypeFromPath =
  ({ resources, method: { path, operationId } }) =>
  ({ name }) =>
    pipe([
      tap(() => {
        assert(path);
        assert(name);
        assert(resources);
      }),
      () => path,
      callProp("split", "/"),
      (splitted) =>
        pipe([
          () => splitted,
          findIndex(includes(`{${name}}`)),
          (index) =>
            pipe([
              () => splitted,
              callProp("slice", 0, index + 1),
              callProp("join", "/"),
              tap((params) => {
                assert(true);
              }),
              (pathParent) =>
                pipe([
                  tap((params) => {
                    assert(pathParent);
                  }),
                  () => resources,
                  find(eq(get("methods.get.path"), pathParent)),
                  tap.if(isEmpty, () => {
                    // assert(false);
                    console.error(
                      `Cannot find path ${pathParent}, original path: ${path}`
                    );
                  }),
                ])(),
            ])(),
          // (index) => splitted[index - 1],
          // tap((param) => {
          //   //assert(param, `no param ${name}, ${path}`);
          // }),
          // pluralize.singular,
          // findResourceByParameter({ name, path, resources, operationId }),
          //
          tap((params) => {
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
  method: { parameters, path },
}) =>
  pipe([
    tap((params) => {
      assert(resources);
      assert(path);
    }),
    () => parameters,
    filter(get("required")),
    filter(eq(get("in"), "path")),
    filter(not(eq(get("name"), "resourceGroupName"))),
    filter(not(eq(get("name"), "subscriptionId"))),
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
                  type: parameterType.singular,
                  group: parameterType.group,
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

const addDependencies = ({ resources }) =>
  assign({
    dependencies: ({ methods }) =>
      pipe([
        tap(() => {
          assert(resources);
        }),
        () => ({}),
        defaultsDeep(addResourceGroupDependency(methods)),
        defaultsDeep(
          addDependencyFromPath({ resources, methods, method: methods.get })
        ),
        tap((params) => {
          assert(true);
        }),
      ])(),
  });
const pickResourceInfo = pipe([
  pick(["name", "dependencies", "group", "methods"]),
  assign({
    methods: pipe([
      get("methods"),
      map.entries(([key, value]) => [
        key,
        pipe([() => value, pick(["path", "operationId"])])(),
      ]),
      tap((params) => {
        assert(true);
      }),
    ]),
  }),
]);

const listSwaggerFiles = ({
  directory,
  specPath = "azure-rest-api-specs/specification",
  filterDirs = [],
}) =>
  pipe([
    tap((params) => {
      assert(directory);
    }),
    () => path.resolve(directory, specPath),
    (baseDir) =>
      pipe([
        () => fs.readdir(baseDir, { withFileTypes: true }),
        filter(callProp("isDirectory")),
        filter(
          or([
            () => isEmpty(filterDirs),
            ({ name }) => pipe([() => filterDirs, includes(name)])(),
          ])
        ),
        map(pipe([get("name"), listPerGroup({ baseDir })])),
        flatten,
        filter(pipe([get("resources"), not(isEmpty)])),
        pluck("resources"),
        flatten,
        (resources) =>
          pipe([() => resources, map(addDependencies({ resources }))])(),
        tap((params) => {
          assert(true);
        }),
        map(pickResourceInfo),
        tap((params) => {
          assert(true);
        }),
        (json) => JSON.stringify(json, null, 4),
        (content) =>
          fs.writeFile(path.resolve(directory, "AzureSwagger.json"), content),
      ])(),
  ])();

exports.listSwaggerFiles = listSwaggerFiles;
