const assert = require("assert");
const { pipe, tap, get, omit, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
  //assignTags,
} = require("./WAFV2Common");

const findId = pipe([get("live.Arn")]);

const decorate = ({ endpoint }) =>
  pipe([
    /*assignTags({ endpoint, findId })*/
    tap((params) => {
      assert(true);
    }),
  ]);

const model = ({ config }) => ({
  package: "wafv2",
  client: "WAFV2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#getWebACL-property
  getById: {
    method: "getWebACL",
    pickId: pipe([
      pick(["Id", "LockToken", "Name", "Scope"]),
      tap(({ Id }) => {
        assert(Id);
      }),
    ]),
    getField: "WebACL",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#listWebACLs-property
  getList: {
    method: "listWebACLs",
    enhanceParams: () => () => ({ Scope: "REGIONAL" }),
    getParam: "WebACLs",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#createWebACL-property
  create: {
    method: "createWebACL",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        get("Summary"),
      ]),
    //isInstanceUp: eq(get("Status"), "DEPLOYED"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#updateWebACL-property
  update: {
    method: "updateWebACL",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep(
          pipe([() => live, pick(["Id", "LockToken", "Name", "Scope"])])()
        ),
        omit(["Tags"]),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#deleteWebACL-property
  destroy: {
    method: "deleteWebACL",
    pickId: pipe([
      pick(["Id", "LockToken", "Name", "Scope"]),
      tap(({ Id }) => {
        assert(Id);
      }),
    ]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html
exports.WAFV2WebAcl = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.Name")]),
    findId,
    getByName: getByNameCore,
    tagResource: tagResource({ findId }),
    untagResource: untagResource({ findId }),
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({ name, config, namespace, userTags: Tags }),
        }),
      ])(),
  });
