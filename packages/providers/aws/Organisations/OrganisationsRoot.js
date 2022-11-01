const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");

const { createAwsResource } = require("../AwsClient");

const model = ({ config }) => ({
  package: "organizations",
  client: "Organizations",
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#listRoots-property
  getList: {
    method: "listRoots",
    getParam: "Roots",
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html
exports.OrganisationsRoot = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    managedByOther: () => true,
    cannotBeDeleted: () => true,
    findName: pipe([get("live.Name")]),
    findId: pipe([get("live.Id")]),
  });
