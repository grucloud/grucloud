const assert = require("assert");
const { pipe, tap, get, pick, assign, eq, or, switchCase } = require("rubico");
const {
  defaultsDeep,
  callProp,
  first,
  when,
  append,
  prepend,
} = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const managedByOther = () =>
  pipe([eq(get("FunctionMetadata.Stage"), "DEVELOPMENT")]);

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

const findName = () =>
  pipe([
    ({ Name, FunctionMetadata }) =>
      pipe([
        tap((params) => {
          assert(Name);
        }),
        () => FunctionMetadata,
        get("Stage", "LIVE"),
        switchCase([
          (Stage) => Stage === "DEVELOPMENT",
          () => "::DEVELOPMENT",
          () => "",
        ]),
        prepend(Name),
        tap((params) => {
          assert(true);
        }),
      ])(),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontFunction = ({ compare }) => ({
  type: "Function",
  package: "cloudfront",
  client: "CloudFront",
  ignoreErrorCodes: ["NoSuchFunctionExists"],
  inferName: findName,
  findName,
  findId: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      tap(({ FunctionMetadata }) => {
        assert(FunctionMetadata);
      }),
      get("FunctionMetadata"),
      ({ FunctionARN, Stage }) =>
        pipe([
          () => FunctionARN,
          when(() => Stage === "DEVELOPMENT", append("::DEVELOPMENT")),
        ])(),
      tap((FunctionARN) => {
        assert(FunctionARN);
      }),
    ]),
  omitProperties: ["ContentType", "ETag", "FunctionMetadata"],
  //compare: compare,
  //cannotBeDeleted,
  managedByOther,
  getById: {
    method: "getFunction",
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteFunction-property
  destroy: {
    method: "deleteFunction",
    pickId: pipe([
      tap(({ Name, ETag }) => {
        assert(Name);
        assert(ETag);
      }),
      ({ Name, ETag }) => ({ Name, IfMatch: ETag }),
      tap(({ Name, IfMatch }) => {
        assert(Name);
        assert(IfMatch);
      }),
    ]),
  },
  getByName: getByNameCore,
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
