const assert = require("assert");
const { pipe, tap, get, pick, assign, eq, or } = require("rubico");
const { defaultsDeep, callProp, first } = require("rubico/x");

const cannotBeDeleted = () => pipe([eq(get("FunctionMetadata.Stage"), "LIVE")]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assign({
      FunctionCode: ({ FunctionCode }) =>
        pipe([
          tap((params) => {
            assert(FunctionCode);
          }),
          () => Buffer.from(FunctionCode, "base64"),
          callProp("toString"),
        ])(),
    }),
    defaultsDeep(live),
  ]);

const filterPayload = pipe([
  tap(({ FunctionCode }) => {
    assert(FunctionCode);
  }),
  assign({
    FunctionCode: ({ FunctionCode }) => Buffer.from(FunctionCode, "utf8"),
    FunctionConfig: pipe([
      get("FunctionConfig"),
      assign({
        Comment: ({ Comment = "" }) => Comment,
      }),
    ]),
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontFunction = ({ compare }) => ({
  type: "Function",
  package: "cloudfront",
  client: "CloudFront",
  ignoreErrorCodes: ["NoSuchFunctionExists"],
  inferName:
    () =>
    ({ Name, FunctionMetadata }) =>
      pipe([
        () => FunctionMetadata,
        get("Stage", "DEVELOPMENT"),
        (Stage) => `${Name}::${Stage}`,
      ])(),
  findName: () =>
    pipe([
      tap(({ Name, FunctionMetadata: { Stage } }) => {
        assert(Name);
        assert(Stage);
      }),
      ({ Name, FunctionMetadata: { Stage } }) => `${Name}::${Stage}`,
    ]),
  findId: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      get("FunctionMetadata"),
      ({ FunctionARN, Stage }) => `${FunctionARN}::${Stage}`,
      tap((FunctionARN) => {
        assert(FunctionARN);
      }),
    ]),
  omitProperties: ["ContentType", "ETag", "FunctionMetadata"],
  //compare: compare,
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  getById: {
    method: "getFunction",
    pickId: pipe([
      ({ Name, FunctionMetadata: { Stage } }) => ({ Name, Stage }),
      tap(({ Name, Stage }) => {
        assert(Name);
        assert(Stage);
      }),
    ]),
    decorate,
  },
  getList: {
    method: "listFunctions",
    getParam: "FunctionList.Items",
    decorate: ({ getById }) => pipe([getById]),
  },
  create: {
    filterPayload,
    method: "createFunction",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        get("FunctionSummary"),
      ]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          tap((params) => {
            assert(created.ETag);
            assert(payload.Name);
          }),
          () => payload,
          pick(["Name"]),
          defaultsDeep({ IfMatch: created.ETag }),
          endpoint().publishFunction,
          tap((params) => {
            assert(true);
          }),
        ])(),
  },
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        tap((params) => {
          assert(live.ETag);
        }),
        () => diff,
        tap.if(
          or([get("liveDiff.updated.FunctionCode")]),
          pipe([
            () => payload,
            filterPayload,
            defaultsDeep({ IfMatch: live.ETag }),
            endpoint().updateFunction,
            tap((params) => {
              assert(true);
            }),
            ({ ETag }) => ({ IfMatch: ETag, Name: payload.Name }),
            endpoint().publishFunction,
            tap((params) => {
              assert(true);
            }),
          ])
        ),
      ])(),
  destroy: {
    method: "deleteFunction",
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      ({ Name, ETag }) => ({ Name, IfMatch: ETag }),
      tap(({ Name, IfMatch }) => {
        assert(Name);
        assert(IfMatch);
      }),
    ]),
  },
  getByName: ({ getById }) =>
    pipe([
      get("name"),
      tap((params) => {
        assert(true);
      }),
      callProp("split", "::"),
      ([Name, Stage]) => ({ Name, FunctionMetadata: { Stage } }),
      tap(({ Stage }) => {
        //assert(Stage);
      }),
      getById({}),
    ]),
  configDefault: ({
    name,
    namespace,
    properties: {
      FunctionCode,
      FunctionConfig: { Runtime, Comment },
    },
    config,
  }) =>
    pipe([
      () => name,
      callProp("split", "::"),
      first,
      (Name) => ({
        Name,
        FunctionCode,
        FunctionConfig: { Runtime, Comment },
      }),
    ])(),
});
