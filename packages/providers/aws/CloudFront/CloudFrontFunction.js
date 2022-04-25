const assert = require("assert");
const { pipe, tap, get, tryCatch, assign } = require("rubico");
const { defaultsDeep, callProp, first } = require("rubico/x");

const { createAwsResource } = require("../AwsClient");

const model = {
  package: "cloudfront",
  client: "CloudFront",
  ignoreErrorCodes: ["NoSuchFunctionExists"],
  getById: { method: "getFunction" },
  getList: { method: "listFunctions", getParam: "FunctionList.Items" },
  create: { method: "createFunction" },
  update: { method: "updateFunction" },
  destroy: { method: "deleteFunction" },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontFunction = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: pipe([
      get("live"),
      ({ Name, FunctionMetadata: { Stage } }) => `${Name}::${Stage}`,
    ]),
    findId: pipe([get("live.FunctionMetadata.FunctionARN")]),
    decorateList:
      ({ getById }) =>
      (live) =>
        pipe([
          //({ Name, FunctionMetadata: { Stage } }) => ({ Name, Stage }),
          () => live,
          getById,
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
          tap((params) => {
            assert(true);
          }),
        ])(),
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        assign({}),
      ]),
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
    pickIdDestroy: pipe([
      tap((params) => {
        assert(true);
      }),
      ({ Name, ETag }) => ({ Name, IfMatch: ETag }),
      tap(({ Name, IfMatch }) => {
        assert(Name);
        assert(IfMatch);
      }),
    ]),
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => payload,
      ]),
    getByName: ({ getById }) =>
      pipe([
        get("name"),
        callProp("split", "::"),
        ([Name, Stage]) => ({ Name, Stage }),
        getById,
      ]),
    configDefault: ({
      name,
      namespace,
      properties: {
        FunctionCode,
        FunctionConfig: { Runtime, Comment },
      },
    }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => name,
        callProp("split", "::"),
        first,
        (Name) => ({
          Name,
          FunctionCode: Buffer.from(FunctionCode, "utf8"),
          FunctionConfig: { Runtime, Comment: Comment || name },
        }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  });
