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
  omit,
} = require("rubico");
const { identity } = require("rubico/x");
const fs = require("fs").promises;
const path = require("path");

const { ApisIncludes } = require("./GcpApiIncludes");
const { buildDependenciesObject } = require("./GcpBuildDependencies");

const { discoveryDereference } = require("./GcpDiscoveryDereference");
const DiscoveryUrl =
  "https://discovery.googleapis.com/discovery/v1/apis?parameters";

const assignDependencies = assign({
  dependencies: pipe([
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
    get("resources"),
    filter(get("methods.delete")),
    map(
      pipe([
        assignDependencies,
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
  "version",
  "id",
  "rootUrl",
  "basePath",
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
  filename = path.resolve(process.cwd(), "../schema/GoogleSpec.json"),
}) =>
  pipe([
    tap((params) => {
      assert(true);
      console.log(`Saving to ${filename}`);
    }),
    (json) => JSON.stringify(json, null, 4),
    (content) => fs.writeFile(filename, content),
  ]);

const downloadDiscovery = () =>
  pipe([
    () => DiscoveryUrl,
    Axios.get,
    get("data.items"),
    //TODO rubico isIn
    filter(({ id }) => pipe([() => ApisIncludes, any(eq(identity, id))])()),
    map.pool(5, downloadRest),
    tap((params) => {
      assert(true);
    }),
    tap(saveToFile({})),
  ])();

exports.downloadDiscovery = downloadDiscovery;
