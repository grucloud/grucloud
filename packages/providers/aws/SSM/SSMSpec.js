const assert = require("assert");
const { assign, map, pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, callProp, pluck } = require("rubico/x");
const {
  isOurMinion,
  replaceAccountAndRegion,
  compareAws,
} = require("../AwsCommon");

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
        "Content.assumeRole",
        "Owner",
        "DocumentVersion",
        "CreatedDate",
        "Status",
        "StatusInformation",
        "ReviewStatus",
        "SchemaVersion",
        "Category",
        "CategoryEnum",
        "DefaultVersion",
        "Hash",
        "HashType",
        "LatestVersion",
        "Description",
      ],
      propertiesDefault: { DocumentFormat: "JSON" },
      dependencies: {
        role: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("Content.assumeRole"),
        },
        lambdaFunction: {
          type: "Function",
          group: "Lambda",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("Content.mainSteps"),
              pluck("inputs"),
              pluck("FunctionName"),
            ]),
        },
      },
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          assign({
            Name: pipe([
              get("Name"),
              replaceAccountAndRegion({
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
      dependencies: {
        kmsKey: {
          type: "Key",
          group: "KMS",
          dependencyId: ({ lives, config }) => get("KeyId"),
        },
      },
      omitProperties: [
        "Version",
        "LastModifiedDate",
        "ARN",
        "Tier",
        "LastModifiedUser",
        "KeyId",
        "Policies",
      ],
      inferName: get("properties.Name"),
      filterLive: () =>
        pick([
          "Name",
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
