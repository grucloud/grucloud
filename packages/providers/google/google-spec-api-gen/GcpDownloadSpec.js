const assert = require("assert");
const Axios = require("axios");
const { pipe, tap, get, filter, any, eq, map, assign } = require("rubico");
const { identity } = require("rubico/x");

const DiscoveryUrl =
  "https://discovery.googleapis.com/discovery/v1/apis?parameters";

const ApisIncludes = [
  //
  "compute:v1",
  //"container:v1",
];

// const isResourcesReadWrite = pipe([
//   tap((params) => {
//     assert(true);
//   }),
//   get("methods.delete"),
// ]);

const downloadRest = pipe([
  get("discoveryRestUrl"),
  tap((discoveryRestUrl) => {
    assert(discoveryRestUrl);
  }),
  Axios.get,
  get("data"),
  tap((params) => {
    assert(true);
  }),
  assign({
    resources: pipe([get("resources"), filter(get("methods.delete"))]),
  }),
  tap((params) => {
    assert(true);
  }),
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
  ])();

exports.downloadDiscovery = downloadDiscovery;
