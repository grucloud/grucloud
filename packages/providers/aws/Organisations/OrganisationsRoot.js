const assert = require("assert");
const { pipe, tap, get } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html
exports.OrganisationsRoot = ({}) => ({
  type: "Root",
  package: "organizations",
  client: "Organizations",
  omitProperties: ["Arn", "Id"],
  inferName: get("properties.Name"),
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("Id")]),
  managedByOther: () => () => true,
  cannotBeDeleted: () => () => true,
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
