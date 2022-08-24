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
} = require("rubico");
const { identity, callProp, first, isEmpty, includes } = require("rubico/x");
const { pascalCase } = require("change-case");
const pluralize = require("pluralize");
const fs = require("fs").promises;
const path = require("path");

const { ApisIncludes, ResourcesExcludes } = require("./GcpApiIncludes");
const { buildDependenciesObject } = require("./GcpBuildDependencies");

const { discoveryDereference } = require("./GcpDiscoveryDereference");
const DiscoveryUrl =
  "https://discovery.googleapis.com/discovery/v1/apis?parameters";

const assignDependenciesPaths = assign({
  dependenciesPaths: pipe([
    get("methods.get.response"),
    tap((response) => {
      assert(response);
    }),
    buildDependenciesObject({ inventory: {} }),
    tap((params) => {
      assert(true);
    }),
  ]),
});

const assignMethods = assign({
  methods: pipe([
    get("methods"),
    tap((params) => {
      assert(true);
    }),
    map(pick(["path", "parameterOrder", "httpMethod"])),
  ]),
});

const assignResources = assign({
  resources: pipe([
    tap((params) => {
      assert(true);
    }),
    // TODO recursive
    get("resources"),
    tap((params) => {
      assert(true);
    }),
    filter(and([get("methods.delete"), get("methods.list")])),
    map(
      pipe([
        assignDependenciesPaths,
        tap((params) => {
          assert(true);
        }),
        assignMethods,
      ])
    ),
  ]),
});

const pickInventoryProperties = pick([
  "name",
  "baseUrl",
  "version",
  "id",
  "resources",
]);

const processRest = pipe([
  discoveryDereference,
  tap((params) => {
    assert(true);
  }),
  // Add dependencies to resources
  assignResources,
  tap((params) => {
    assert(true);
  }),
  pickInventoryProperties,
]);

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
            tap((params) => {
              assert(true);
            }),
            get("dependenciesPaths"),
            reduce(
              (acc, dep) =>
                pipe([
                  tap((params) => {
                    assert(dep.depId);
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
          ]),
        }),
      ])
    ),
  ])();

const processSchema = pipe([
  tap((params) => {
    assert(true);
  }),
  flatMap(({ resources, name, id, version, ...other }) =>
    pipe([
      () => resources,
      Object.entries,
      map(([key, resource]) =>
        pipe([
          () => key,
          pluralize.singular,
          pascalCase,
          (type) => ({
            groupType: `${name}::${type}`,
            group: name,
            type,
            ...other,
            ...resource,
          }),
        ])()
      ),
    ])()
  ),
  callProp("sort", (a, b) => a.groupType.localeCompare(b.groupType)),
  filter(({ groupType }) =>
    pipe([
      tap((params) => {
        assert(true);
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
