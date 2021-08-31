const assert = require("assert");
const { pipe, assign, map, tap, get } = require("rubico");
const { when, isString, prepend } = require("rubico/x");

const { AwsIamUser } = require("./AwsIamUser");
const { AwsIamGroup, isOurMinionIamGroup } = require("./AwsIamGroup");
const { AwsIamRole } = require("./AwsIamRole");
const { AwsIamInstanceProfile } = require("./AwsIamInstanceProfile");
const { AwsIamPolicy, isOurMinionIamPolicy } = require("./AwsIamPolicy");

const {
  AwsIamOpenIDConnectProvider,
} = require("./AwsIamOpenIDConnectProvider");
const { compare } = require("@grucloud/core/Common");

const { isOurMinion } = require("../AwsCommon");

const GROUP = "IAM";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "OpenIDConnectProvider",
      Client: AwsIamOpenIDConnectProvider,
      isOurMinion,
      compare: compare({
        filterLive: pipe([
          assign({ Url: pipe([get("Url"), prepend("https://")]) }),
          tap((params) => {
            assert(true);
          }),
        ]),
      }),
    },
    {
      type: "User",
      dependsOn: ["IAM::Policy", "IAM::Group"],
      Client: AwsIamUser,
      isOurMinion,
    },
    {
      type: "Group",
      dependsOn: ["IAM::Policy"],
      Client: AwsIamGroup,
      isOurMinion: isOurMinionIamGroup,
    },
    {
      type: "Role",
      dependsOn: ["IAM::Policy"],
      Client: AwsIamRole,
      isOurMinion,
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
          tap((params) => {
            assert(true);
          }),
        ]),
    },
    {
      type: "Policy",
      Client: AwsIamPolicy,
      isOurMinion: isOurMinionIamPolicy,
    },
    {
      type: "InstanceProfile",
      dependsOn: ["IAM::Role"],
      Client: AwsIamInstanceProfile,
      isOurMinion,
    },
  ]);
