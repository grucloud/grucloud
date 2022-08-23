const assert = require("assert");
const {
  flatMap,
  pipe,
  tap,
  map,
  assign,
  eq,
  get,
  filter,
  and,
  not,
} = require("rubico");
const { callProp, find } = require("rubico/x");
const GcpCompute = require("./resources/compute");
const GcpIam = require("./resources/iam");
const GcpStorage = require("./resources/storage");
const GcpDns = require("./resources/dns");
const GcpRun = require("./resources/run");

const Schema = require("./schema/GoogleSpec.json");

const createSpecsOveride = (config) =>
  pipe([
    () => [
      //
      GcpStorage,
      GcpIam,
      GcpCompute,
      GcpDns,
      GcpRun,
    ],
    flatMap((spec) => spec({ config })),
    tap((params) => {
      assert(true);
    }),
  ])();

const findByGroupAndType = ({ group, type }) =>
  pipe([
    tap((params) => {
      assert(type);
      assert(group);
    }),
    find(and([eq(get("group"), group), eq(get("type"), type)])),
  ]);

const mergeSpec = ({ specsGen, specsOveride }) =>
  pipe([
    tap((params) => {
      assert(Array.isArray(specsGen));
      assert(Array.isArray(specsOveride));
    }),
    () => specsOveride,
    map((overideSpec) =>
      pipe([
        () => specsGen,
        tap((params) => {
          assert(true);
        }),

        findByGroupAndType(overideSpec),
        (found) => ({ ...found, ...overideSpec }),
        tap((params) => {
          assert(true);
        }),
      ])()
    ),
    tap((params) => {
      assert(true);
    }),
  ])();

exports.fnSpecs = (config) =>
  pipe([
    assign({
      specsOveride: () => createSpecsOveride(config),
      specsGen: pipe([() => Schema]),
    }),
    // assign({
    //   specsOveride: mergeSpec,
    // }),
    // assign({
    //   specsGen: ({ specsGen, specsOveride }) =>
    //     pipe([
    //       () => specsGen,
    //       filter(
    //         not((spec) =>
    //           pipe([() => specsOveride, findByGroupAndType(spec)])()
    //         )
    //       ),
    //     ])(),
    // }),
    //({ specsGen, specsOveride }) => [...specsGen, ...specsOveride],
    ({ specsOveride }) => [...specsOveride],
    map(
      assign({ groupType: pipe([({ group, type }) => `${group}::${type}`]) })
    ),
    callProp("sort", (a, b) => a.groupType.localeCompare(b.groupType)),
    //addDefaultSpecs,
    tap((params) => {
      assert(true);
    }),
  ])();
