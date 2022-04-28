const assert = require("assert");
const { assign, map, pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const { isOurMinion, replaceAccount, compareAws } = require("../AwsCommon");

const { SSMParameter } = require("./SSMParameter");
const { SSMDocument } = require("./SSMDocument");

const GROUP = "SSM";
const compareSSM = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "Document",
      Client: SSMDocument,
      inferName: ({ properties, dependenciesSpec }) =>
        pipe([
          () => properties,
          get("Name"),
          tap((Name) => {
            assert(Name);
          }),
        ])(),
      omitProperties: [
        "Owner",
        "DocumentVersion",
        "CreatedDate",
        "Status",
        "StatusInformation",
        "ReviewStatus",
        "SchemaVersion",
      ],
      dependencies: {
        role: { type: "Role", group: "IAM" },
        lambdaFunction: { type: "Function", group: "Lambda" },
      },
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          assign({
            Name: pipe([
              get("Name"),
              replaceAccount({
                providerConfig,
                lives,
              }),
            ]),
          }),
        ]),
    },
    {
      type: "Parameter",
      Client: SSMParameter,
      ignoreResource: () =>
        pipe([get("name"), callProp("startsWith", "/cdk-bootstrap/")]),
      dependencies: { kmsKey: { type: "Key", group: "KMS" } },
      omitProperties: [
        "Version",
        "LastModifiedDate",
        "ARN",
        "Description", //TODO
        "Tier",
      ],
      filterLive: () =>
        pick([
          "Type",
          "Value",
          "Description",
          "Tier",
          //"Policies",
          "DataType",
        ]),
    },
  ],
  map(defaultsDeep({ group: GROUP, isOurMinion, compare: compareSSM({}) })),
]);
