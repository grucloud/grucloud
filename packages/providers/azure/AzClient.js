const assert = require("assert");
const {
  tap,
  get,
  eq,
  reduce,
  pipe,
  or,
  switchCase,
  map,
  not,
  filter,
  and,
} = require("rubico");
const {
  callProp,
  identity,
  first,
  last,
  append,
  values,
  find,
  when,
  size,
  prepend,
  findIndex,
  isEmpty,
} = require("rubico/x");
const CoreClient = require("@grucloud/core/CoreClient");

const {
  isInstanceUp: isInstanceUpDefault,
  AZURE_MANAGEMENT_BASE_URL,
  isSubstituable,
  configDefaultGeneric,
  findDependenciesUserAssignedIdentity,
  createAxiosAzure,
  shortName,
} = require("./AzureCommon");

const queryParameters = (apiVersion) => `?api-version=${apiVersion}`;

const onResponseListDefault = () => get("value", []);

const verbCreateFromMethods = switchCase([
  get("post"),
  () => "POST",
  () => "PUT",
]);

const verbUpdateFromMethods = switchCase([
  get("patch"),
  () => "PATCH",
  () => "PUT",
]);

module.exports = AzClient = ({
  lives,
  spec,
  isInstanceUp = isInstanceUpDefault,
  config,
  findTargetId = ({ path }) =>
    (result) =>
      pipe([
        () => result,
        get("id"),
        when(
          isEmpty,
          pipe([() => path, callProp("split", "?api-version"), first])
        ),
      ])(),
  pathUpdate = ({ id }) => `${id}${queryParameters(spec.apiVersion)}`,
}) => {
  assert(lives);
  assert(spec);
  const { methods, apiVersion, dependencies = {} } = spec;
  if (!methods) {
    assert(methods);
  }
  if (!dependencies) {
    assert(dependencies);
  }
  assert(apiVersion);
  assert(spec.cannotBeDeleted);
  assert(spec.managedByOther);

  const cannotBeDeleted = pipe([
    tap((params) => {
      assert(true);
    }),
    or([
      spec.managedByOther,
      spec.cannotBeDeleted,
      pipe([() => methods, get("delete"), isEmpty]),
    ]),
    tap((params) => {
      assert(true);
    }),
  ]);

  assert(spec.type);
  assert(config);
  assert(config.bearerToken);

  const findIdfromPath = ({ path, id, name, type }) =>
    pipe([
      tap((params) => {
        assert(path);
        assert(name, `no name in path ${path}, id ${id}`);
        assert(id);
      }),
      () => path,
      callProp("split", "/"),
      findIndex(eq(identity, `{${name}}`)),
      tap((index) => {
        assert(
          index >= 1,
          `findIdfromPath ${path}, ${id}, ${name}, type ${type}`
        );
      }),
      (index) =>
        pipe([
          () => id,
          callProp("split", "/"),
          callProp("slice", 0, index + 1),
          callProp("join", "/"),
          callProp("replace", "resourcegroups", "resourceGroups"),
        ])(),
      tap((params) => {
        assert(true);
      }),
    ])();

  const findDependenciesFromList = ({ live, lives }) =>
    pipe([
      tap((params) => {
        assert(dependencies);
      }),
      () => dependencies,
      filter(not(get("createOnly"))),
      map.entries(([key, { group, type, name }]) => [
        key,
        {
          group,
          type,
          ids: [
            findIdfromPath({
              id: live.id,
              path: methods.get.path,
              name: name || key,
              group,
              type,
            }),
          ],
        },
      ]),
      values,
      tap((params) => {
        assert(true);
      }),
    ])();

  const findDependenciesFromCreate = ({ live, lives }) =>
    pipe([
      tap((params) => {
        assert(dependencies);
        //console.log(dependencies);
      }),
      () => dependencies,
      filter(get("pathId")),
      map.entries(([key, { group, type, pathId }]) => [
        key,
        pipe([
          tap((params) => {
            assert(true);
          }),
          () => live,
          get(pathId),
          (id) => ({
            group,
            type,
            ids: [id],
          }),
        ])(),
      ]),
      values,
      tap((params) => {
        assert(true);
      }),
    ])();

  const findDependenciesDefault = ({ live, lives }) =>
    pipe([
      () => [
        ...findDependenciesFromList({ live, lives }),
        findDependenciesUserAssignedIdentity({ live, lives }),
        ...findDependenciesFromCreate({ live, lives }),
      ],
      filter(not(isEmpty)),
      tap((params) => {
        assert(true);
      }),
    ])();

  const pathGet = ({ id }) => `${id}${queryParameters(apiVersion)}`;

  const substituteDependency =
    ({ dependencies }) =>
    (paramName) =>
      pipe([
        tap(() => {
          assert(dependencies);
        }),
        () => dependencies,
        map.entries(([varName, resource]) => [varName, { varName, resource }]),
        values,
        find(eq(pipe([({ varName }) => `{${varName}Name}`]), paramName)),
        tap((resource) => {
          assert(resource);
        }),
        get("resource.name"),
        shortName,
      ])();

  const substituteSubscriptionId = () =>
    map(
      when(
        eq(identity, "{subscriptionId}"),
        () => process.env.AZURE_SUBSCRIPTION_ID
      )
    );
  const substituteScope = ({ payload }) =>
    pipe([
      tap((params) => {
        // assert(payload);
        //assert(payload.properties.scope);
      }),
      map(
        when(
          eq(identity, "{scope}"),
          pipe([
            () => payload,
            get("properties.scope"),
            callProp("substring", 1), //remove first slash
          ])
        )
      ),
      tap((params) => {
        assert(true);
      }),
    ]);

  const substitutePath = ({ dependencies }) =>
    map(when(isSubstituable, substituteDependency({ dependencies })));

  const pathCreate = ({ dependencies, name, payload }) =>
    pipe([
      () => methods,
      get("get.path"),
      tap((path) => {
        assert(name);
        assert(path);
      }),
      callProp("split", "/"),
      tap(
        pipe([last, isSubstituable], (isParam) => {
          assert(isParam, "last part of the path must be a substituable");
        })
      ),
      callProp("slice", 0, -1),
      substituteSubscriptionId(),
      substituteScope({ payload }),
      tap((params) => {
        assert(true);
      }),
      substitutePath({ dependencies }),
      callProp("join", "/"),
      append("/"),
      append(shortName(name)),
      append(queryParameters(apiVersion)),
      tap((params) => {
        assert(true);
      }),
    ])();

  const pathDelete = ({ id }) => `${id}${queryParameters(apiVersion)}`;

  const getPathsListNoDeps = ({ methods }) =>
    pipe([
      tap(() => {
        assert(methods.getAll);
      }),
      () => methods,
      get("getAll.path"),
      tap((path) => {
        assert(path);
      }),
      //TODO common
      callProp(
        "replace",
        "{subscriptionId}",
        process.env.AZURE_SUBSCRIPTION_ID
      ),
      //TODO wrong
      callProp(
        "replace",
        "{scope}",
        `subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}`
      ),
      append(queryParameters(apiVersion)),
      tap((params) => {
        assert(true);
      }),
      (url) => [url],
    ]);

  const getPathsListWithDeps = ({ lives, config, methods }) =>
    pipe([
      tap(({ type, group }) => {
        assert(type);
        assert(group);
        assert(lives);
        assert(methods);
      }),
      ({ type, group }) =>
        lives.getByType({
          providerName: config.providerName,
          type,
          group,
        }),
      tap((params) => {
        assert(true);
      }),
      map(({ id }) =>
        pipe([
          tap((params) => {
            assert(id);
          }),
          () => methods,
          get("getAll.path", methods.get.path),
          tap((path) => {
            assert(path, `no getAll or get`);
          }),
          callProp("split", "/"),
          callProp("slice", size(id.split("/"))),
          callProp("join", "/"),
          prepend(`${id}/`),
          append(queryParameters(apiVersion)),
        ])()
      ),
      tap((params) => {
        assert(true);
      }),
    ]);

  const numberOfDependenciesInPath = (path = "") =>
    pipe([
      () => path,
      callProp("split", "/"),
      reduce(
        (acc, value) =>
          pipe([
            () => value,
            switchCase([
              and([
                not(eq(value, "{subscriptionId}")),
                not(eq(value, "{scope}")),
                callProp("startsWith", "{"),
              ]),
              () => acc + 1,
              () => acc,
            ]),
          ])(),
        0
      ),
      tap((params) => {
        assert(true);
      }),
    ])();

  const pathList = ({ lives }) =>
    pipe([
      tap((params) => {
        assert(methods);
        assert(lives);
        assert(dependencies);
      }),
      () => methods,
      switchCase([
        and([
          get("getAll.path"),
          pipe([get("getAll.path"), eq(numberOfDependenciesInPath, 0)]),
        ]),
        getPathsListNoDeps({ methods }),
        pipe([
          () => dependencies,
          values,
          filter(not(get("createOnly"))),
          last,
          tap((dep) => {
            if (!dep) {
              assert(dep);
            }
          }),
          getPathsListWithDeps({ lives, config, methods }),
        ]),
      ]),
      tap((params) => {
        assert(true);
      }),
    ])();

  const axios = createAxiosAzure({
    baseURL: AZURE_MANAGEMENT_BASE_URL,
    bearerToken: () => config.bearerToken(AZURE_MANAGEMENT_BASE_URL),
  });

  return CoreClient({
    type: "azure",
    lives,
    spec,
    config,
    findName: spec.findName,
    findDependencies: spec.findDependencies || findDependenciesDefault,
    onResponseCreate: spec.onResponseCreate,
    onResponseList: spec.onResponseList || onResponseListDefault,
    decorate: spec.decorate,
    configDefault: spec.configDefault || configDefaultGeneric,
    pathGet,
    pathCreate,
    pathUpdate,
    pathDelete,
    pathList,
    findTargetId,
    verbCreate: verbCreateFromMethods(methods),
    verbUpdate: verbUpdateFromMethods(methods),
    isInstanceUp,
    isDefault: spec.isDefault,
    cannotBeDeleted,
    managedByOther: spec.managedByOther,
    axios,
  });
};
