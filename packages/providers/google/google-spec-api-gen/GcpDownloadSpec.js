const assert = require("assert");
const Axios = require("axios");
const {
  pipe,
  tap,
  get,
  filter,
  any,
  eq,
  map,
  assign,
  pick,
  flatMap,
  reduce,
  switchCase,
  and,
  not,
  fork,
} = require("rubico");
const {
  last,
  pluck,
  flatten,
  identity,
  callProp,
  first,
  isEmpty,
  includes,
  find,
  values,
  unless,
  defaultsDeep,
} = require("rubico/x");
const { pascalCase } = require("change-case");
const pluralize = require("pluralize");
const fs = require("fs").promises;
const path = require("path");

const { ApisIncludes, ResourcesExcludes } = require("./GcpApiIncludes");
const { buildDependenciesObject } = require("./GcpBuildDependencies");
const { getResourcesDeep } = require("./GcpGetResourcesDeep");
const { buildOmitPropertiesObject } = require("./GcpBuildOmitProperties");

const { discoveryDereference } = require("./GcpDiscoveryDereference");
const DiscoveryUrl =
  "https://discovery.googleapis.com/discovery/v1/apis?parameters";

const assignAdditionalProperties = assign({
  omitProperties: ({ methods }) =>
    pipe([
      () => methods,
      switchCase([
        get("get.response"),
        pipe([
          get("get.response"),
          buildOmitPropertiesObject({ inventory: {} }),
          map(callProp("join", ".")),
          callProp("sort"),
        ]),
        pipe([() => []]),
      ]),
    ])(),
  dependenciesPaths: ({ methods }) =>
    pipe([
      tap((params) => {
        assert(methods);
      }),
      () => methods,
      switchCase([
        get("get.response"),
        pipe([get("get.response"), buildDependenciesObject({ inventory: {} })]),
        pipe([() => []]),
      ]),
      callProp("sort", (a, b) => a.pathId.localeCompare(b.pathId)),
    ])(),
});

const assignMethods = assign({
  methods: pipe([
    get("methods"),
    tap((methods) => {
      assert(methods);
    }),
    map(
      pipe([
        assign({
          path: switchCase([get("flatPath"), get("flatPath"), get("path")]),
        }),
        pick(["id", "path", "httpMethod"]),
      ])
    ),
  ]),
});

const sortMethods = assign({
  methods: pipe([
    get("methods"),
    Object.entries,
    callProp("sort", (a, b) => a[0].localeCompare(b[0])),
    Object.fromEntries,
  ]),
});

const filterMethods = pipe([
  tap(({ methods }) => {
    assert(methods);
  }),
  get("methods"),
  pluck("httpMethod"),
  values,
  and([
    // TODO
    find(includes("GET")),
    find(includes("POST")),
  ]),
]);

const processRest = (inventory) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    () => inventory,
    getResourcesDeep(),
    discoveryDereference(inventory),
    filter(filterMethods),
    map(sortMethods),
    // Add dependencies to resources
    map(assignAdditionalProperties),
    map(assignMethods),
    map(
      assign({
        type: pipe([
          get("typeFull"),
          callProp("split", "."),
          last,
          pluralize.singular,
          pascalCase,
        ]),
        groupType: ({ typeFull }) => `${inventory.name}::${typeFull}`,
        group: () => inventory.name,
        baseUrl: () => inventory.baseUrl,
      })
    ),
    callProp("sort", (a, b) => a.groupType.localeCompare(b.groupType)),
    tap((params) => {
      assert(true);
    }),
  ])();

const downloadRest = pipe([
  get("discoveryRestUrl"),
  tap((discoveryRestUrl) => {
    assert(discoveryRestUrl);
  }),
  Axios.get,
  get("data"),
  processRest,
]);

const saveToFile = ({
  filename = path.resolve(process.cwd(), "../schema/GoogleSchema.json"),
}) =>
  pipe([
    tap((params) => {
      assert(true);
      console.log(`Saving to ${filename}`);
    }),
    (json) => JSON.stringify(json, null, 4),
    (content) => fs.writeFile(filename, content),
  ]);
// Common
const getListMethod = pipe([
  switchCase([
    get("list"),
    get("list"),
    get("aggregatedList"),
    get("aggregatedList"),
    get("search"),
    get("search"),
    (methods) => {
      //assert(false, `no list or aggregatedList in  ${JSON.stringify(methods)}`);
    },
  ]),
]);

const dependenciesFromName = ({ specs, list }) =>
  pipe([
    tap((depName) => {
      assert(specs);
      assert(depName);
      assert(list);
    }),
    callProp("replace", "{", ""),
    callProp("replace", "}", ""),
    callProp("replace", new RegExp("Id$"), ""),
    pluralize.singular,
    (resourceName) =>
      pipe([
        () => specs,
        find(
          pipe([
            get("type"),
            callProp("match", new RegExp(`^${resourceName}$`, "i")),
          ])
        ),
        switchCase([
          isEmpty,
          () => {
            assert(resourceName);
          },
          pipe([
            pick(["type", "group"]),
            defaultsDeep({ parent: true, resourceName }),
          ]),
        ]),
      ])(),
  ]);

const buildDependenciesFromPath = ({ specs }) =>
  pipe([
    tap((params) => {
      assert(specs);
    }),
    get("methods"),
    getListMethod,
    unless(isEmpty, (list) =>
      pipe([
        () => list,
        get("path"),
        tap((path) => {
          assert(path);
        }),
        callProp("split", "/"),
        filter(
          and([
            callProp("startsWith", "{"),
            not((pathElem) =>
              pipe([
                () => [
                  "{project}",
                  "{projectId}",
                  "{projectsId}",
                  "{region}",
                  "{locationsId}",
                  "{namespacesId}",
                  "{zone}",
                ],
                includes(pathElem),
              ])()
            ),
          ])
        ),
        map(dependenciesFromName({ specs, list })),
        filter(not(isEmpty)),
        reduce(
          (acc, value) =>
            pipe([
              tap((params) => {
                assert(value);
              }),
              () => ({ ...acc, [value.resourceName]: value }),
            ])(),
          {}
        ),
      ])()
    ),
  ]);

const buildDependenciesFromBody = ({ specs }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    get("dependenciesPaths"),
    reduce(
      (acc, dep) =>
        pipe([
          tap((params) => {
            if (!dep.depId) {
              assert(dep.depId);
            }
          }),
          () => specs,
          filter(
            pipe([
              get("type"),
              callProp("match", new RegExp(`^${dep.depId}$`, "ig")),
            ])
          ),
          tap((params) => {
            assert(true);
          }),
          first,
          get("group"),
          switchCase([
            isEmpty,
            () => acc,
            (group) => ({
              ...acc,
              [dep.depId]: {
                type: dep.depId,
                group,
                pathId: dep.pathId,
              },
            }),
          ]),
        ])(),
      {}
    ),
    tap((params) => {
      assert(true);
    }),
  ]);

const addDependencies = (specs) =>
  pipe([
    () => specs,
    map(
      pipe([
        tap((params) => {
          assert(true);
        }),
        assign({
          dependencies: pipe([
            fork({
              dependenciesFromBody: buildDependenciesFromBody({ specs }),
              dependenciesFromPath: buildDependenciesFromPath({ specs }),
            }),
            ({ dependenciesFromBody = {}, dependenciesFromPath = {} }) => ({
              ...dependenciesFromPath,
              ...dependenciesFromBody,
            }),
          ]),
        }),
      ])
    ),
  ])();

const processSchema = pipe([
  tap((params) => {
    assert(true);
  }),
  flatten,
  callProp("sort", (a, b) => a.groupType.localeCompare(b.groupType)),
  filter(({ groupType }) =>
    pipe([
      tap((params) => {
        assert(groupType);
      }),
      () => ResourcesExcludes,
      not(includes(groupType)),
    ])()
  ),
  addDependencies,
]);

const mergeRest = pipe([
  tap((params) => {
    assert(true);
  }),
  processSchema,
  tap((params) => {
    assert(true);
  }),
]);

const downloadDiscovery = () =>
  pipe([
    () => DiscoveryUrl,
    Axios.get,
    get("data.items"),
    tap((params) => {
      assert(true);
    }),
    //TODO rubico isIn
    filter(({ id }) => pipe([() => ApisIncludes, any(eq(identity, id))])()),
    map.pool(5, downloadRest),
    tap((params) => {
      assert(true);
    }),
    mergeRest,
    tap(saveToFile({})),
  ])();

exports.downloadDiscovery = downloadDiscovery;
