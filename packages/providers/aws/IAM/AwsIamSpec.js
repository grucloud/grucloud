const assert = require("assert");
const { pipe, assign, map, tap, get } = require("rubico");
const { when, isString } = require("rubico/x");

const { AwsIamUser } = require("./AwsIamUser");
const { AwsIamGroup, isOurMinionIamGroup } = require("./AwsIamGroup");
const { AwsIamRole } = require("./AwsIamRole");
const { AwsIamInstanceProfile } = require("./AwsIamInstanceProfile");
const { AwsIamPolicy, isOurMinionIamPolicy } = require("./AwsIamPolicy");

const {
  AwsIamOpenIDConnectProvider,
} = require("./AwsIamOpenIDConnectProvider");

const { isOurMinion } = require("../AwsCommon");

const GROUP = "iam";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "OpenIDConnectProvider",
      Client: AwsIamOpenIDConnectProvider,
      isOurMinion,
    },
    {
      type: "User",
      dependsOn: ["iam::Policy", "iam::Group"],
      Client: AwsIamUser,
      isOurMinion,
    },
    {
      type: "Group",
      dependsOn: ["iam::Policy"],
      Client: AwsIamGroup,
      isOurMinion: isOurMinionIamGroup,
    },
    {
      type: "Role",
      dependsOn: ["iam::Policy"],
      Client: AwsIamRole,
      isOurMinion,
      transformDependencies: ({ provider }) =>
        pipe([
          assign({
            policies: pipe([
              get("policies", []),
              map(
                when(isString, (name) =>
                  provider.iam.usePolicy({
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
      dependsOn: ["iam::Role"],
      Client: AwsIamInstanceProfile,
      isOurMinion,
    },
  ]);
