const assert = require("assert");
const { pipe, tap, assign, omit, get, eq, or } = require("rubico");
const { find, when, callProp, defaultsDeep } = require("rubico/x");
const { createTagger } = require("../AwsTagger");

const { createEndpoint } = require("../AwsCommon");

exports.createRDS = createEndpoint("rds", "RDS");

const isAuroraEngine = pipe([get("Engine"), callProp("startsWith", "aurora")]);
exports.isAuroraEngine = isAuroraEngine;

const isNeptune = pipe([get("Engine"), callProp("startsWith", "neptune")]);
exports.isNeptune = isNeptune;

exports.assignManageMasterUserPassword = pipe([
  tap((params) => {
    assert(true);
  }),
  when(
    get("MasterUserSecret"),
    pipe([
      defaultsDeep({ ManageMasterUserPassword: true }),
      omit(["MasterUserSecret", "MasterUserPassword"]),
    ])
  ),
]);
exports.environmentVariables = [
  { path: "MasterUsername", suffix: "MASTER_USERNAME" },
  { path: "MasterUserPassword", suffix: "MASTER_USER_PASSWORD" },
];

exports.omitAllocatedStorage = pipe([
  when(or([isAuroraEngine, isNeptune]), omit(["AllocatedStorage"])),
]);

exports.omitDBClusterParameterGroupDefault = pipe([
  when(
    pipe([
      get("DBClusterParameterGroup", ""),
      callProp("startsWith", "default."),
    ]),
    omit(["DBClusterParameterGroup"])
  ),
]);

exports.omitUsernamePassword = when(
  isNeptune,
  omit(["MasterUsername", "MasterUserPassword"])
);

// TODO
// When MultiAZ = true, here is the error:
// AutoMinorVersionUpgrade can only be specified for a Multi-AZ DB cluster. You can use CreateDBInstance to set AutoMinorVersionUpgrade for a DB instance in a different type of DB cluster.
// For now, omit omitAutoMinorVersionUpgrade
exports.omitAutoMinorVersionUpgrade = pipe([
  when(() => true /*not(get("MultiAZ"))*/, omit(["AutoMinorVersionUpgrade"])),
]);

exports.Tagger = createTagger({
  methodTagResource: "addTagsToResource",
  methodUnTagResource: "removeTagsFromResource",
  ResourceArn: "ResourceName",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.renameTagList = pipe([
  assign({ Tags: get("TagList") }),
  omit(["TagList"]),
]);

exports.findDependenciesSecret =
  ({ secretField, rdsUsernameField }) =>
  ({ lives, config }) =>
  (live) =>
    pipe([
      lives.getByType({
        type: "Secret",
        group: "SecretsManager",
        providerName: config.providerName,
      }),
      find(eq(get(`live.SecretString.${secretField}`), live[rdsUsernameField])),
    ])();
