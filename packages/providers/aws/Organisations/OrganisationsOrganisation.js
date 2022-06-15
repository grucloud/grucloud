const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./OrganisationsCommon");

const model = ({ config }) => ({
  package: "organizations",
  client: "Organizations",
  ignoreErrorCodes: ["TODO"],
  getById: {
    method: "describeOrganization",
    getField: "Organization",
    pickId: pipe([
      tap(({ Arn }) => {
        assert(Arn);
      }),
      pick(["Arn"]),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#describeOrganization-property
  getList: {
    method: "describeOrganization",
    getParam: "Organization",
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#createOrganization-property
  create: {
    method: "createOrganization",
    pickCreated: ({ payload }) => pipe([get("Organization")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#deleteOrganization-property
  destroy: {
    method: "deleteOrganization",
    pickId: pipe([pick(["Arn"])]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html
exports.OrganisationsOrganisation = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    managedByOther: () => true,
    cannotBeDeleted: () => true,
    findName: pipe([get("live.MasterAccountEmail")]),
    findId: pipe([get("live.Id")]),
    //TODO
    getByName: ({ getList, endpoint }) =>
      pipe([
        getList,
        tap((params) => {
          assert(true);
        }),
        //first,
      ]),
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          name: name,
          tags: buildTags({
            name,
            config,
            namespace,
            userTags: Tags,
          }),
        }),
      ])(),
  });
