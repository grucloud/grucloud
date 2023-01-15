const assert = require("assert");
const { pipe, tap, get, tryCatch, assign } = require("rubico");
const { defaultsDeep, callProp, first } = require("rubico/x");

const { createAwsResource } = require("../AwsClient");

const model = {
  package: "cloudfront",
  client: "CloudFront",
  ignoreErrorCodes: ["NoSuchFunctionExists"],
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
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        assign({}),
      ]),
  },
  getList: {
    method: "listFunctions",
    getParam: "FunctionList.Items",
    decorate:
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
  },
  create: {
    method: "createFunction",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => payload,
      ]),
  },
  update: { method: "updateFunction" },
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
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontFunction = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: () =>
      pipe([({ Name, FunctionMetadata: { Stage } }) => `${Name}::${Stage}`]),
    findId: () => pipe([get("FunctionMetadata.FunctionARN")]),
    getByName: ({ getById }) =>
      pipe([
        get("name"),
        callProp("split", "::"),
        ([Name, Stage]) => ({ Name, Stage }),
        tap(({ Stage }) => {
          assert(Stage);
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
