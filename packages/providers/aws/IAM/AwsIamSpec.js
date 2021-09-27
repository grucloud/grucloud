const assert = require("assert");
const { pipe, assign, map, tap, get, pick, omit } = require("rubico");
const { when, isString, prepend } = require("rubico/x");
const { compare } = require("@grucloud/core/Common");

const { AwsIamUser } = require("./AwsIamUser");
const { AwsIamGroup, isOurMinionIamGroup } = require("./AwsIamGroup");
const { AwsIamRole } = require("./AwsIamRole");
const { AwsIamInstanceProfile } = require("./AwsIamInstanceProfile");
const { AwsIamPolicy, isOurMinionIamPolicy } = require("./AwsIamPolicy");

const {
  AwsIamOpenIDConnectProvider,
} = require("./AwsIamOpenIDConnectProvider");

const { isOurMinion } = require("../AwsCommon");

const GROUP = "IAM";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "OpenIDConnectProvider",
      Client: AwsIamOpenIDConnectProvider,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["Tags"])]),
        filterLive: pipe([
          assign({ Url: pipe([get("Url"), prepend("https://")]) }),
          omit(["ThumbprintList", "CreateDate", "Arn", "Tags"]),
        ]),
      }),
    },
    {
      type: "User",
      dependsOn: ["IAM::Policy", "IAM::Group"],
      Client: AwsIamUser,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["Tags"])]),
        filterLive: pipe([
          omit([
            "UserId",
            "Arn",
            "CreateDate",
            "LoginProfile",
            "Policies",
            "AttachedPolicies",
            "Groups",
            "Tags",
            "AccessKeys",
          ]),
        ]),
      }),
    },
    {
      type: "Group",
      dependsOn: ["IAM::Policy"],
      Client: AwsIamGroup,
      isOurMinion: isOurMinionIamGroup,
      compare: compare({
        filterTarget: pipe([omit(["Tags"])]),
        filterLive: pipe([
          omit([
            "GroupId",
            "Arn",
            "CreateDate",
            "Policies",
            "AttachedPolicies",
          ]),
        ]),
      }),
    },
    {
      type: "Role",
      dependsOn: ["IAM::Policy"],
      Client: AwsIamRole,
      isOurMinion,
      compare: compare({
        filterAll: pipe([pick(["AssumeRolePolicyDocument"])]),
      }),
      transformDependencies: ({ provider }) =>
        pipe([
          assign({
            policies: pipe([
              get("policies", []),
              map(
                when(isString, (name) =>
                  provider.IAM.usePolicy({
                    name: name.replace("arn:aws:iam::aws:policy/", ""),
                    properties: () => ({
                      Arn: name,
                    }),
                  })
                )
              ),
            ]),
          }),
        ]),
    },
    {
      type: "Policy",
      Client: AwsIamPolicy,
      isOurMinion: isOurMinionIamPolicy,
      compare: compare({
        filterAll: pipe([
          tap((params) => {
            assert(true);
          }),
          //TODO description
          pick(["PolicyDocument"]),
        ]),
      }),
    },
    {
      type: "InstanceProfile",
      dependsOn: ["IAM::Role"],
      Client: AwsIamInstanceProfile,
      isOurMinion,
      compare: compare({
        filterAll: pipe([omit(["Tags"])]),
        filterLive: pipe([
          omit(["Path", "InstanceProfileId", "Arn", "CreateDate", "Roles"]),
        ]),
      }),
    },
  ]);
