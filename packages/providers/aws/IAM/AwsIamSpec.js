const { AwsIamUser } = require("./AwsIamUser");
const { AwsIamGroup, isOurMinionIamGroup } = require("./AwsIamGroup");
const { AwsIamRole } = require("./AwsIamRole");
const {
  AwsIamInstanceProfile,
  isOurMinionInstanceProfile,
} = require("./AwsIamInstanceProfile");
const { AwsIamPolicy } = require("./AwsIamPolicy");
const {
  AwsIamPolicyReadOnly,
  isOurMinionIamPolicyReadOnly,
} = require("./AwsIamPolicyReadOnly");
const {
  AwsIamOpenIDConnectProvider,
} = require("./AwsIamOpenIDConnectProvider");

const { isOurMinion } = require("../AwsCommon");

module.exports = [
  {
    type: "IamOpenIDConnectProvider",
    Client: AwsIamOpenIDConnectProvider,
    isOurMinion,
  },
  {
    type: "IamUser",
    dependsOn: ["IamPolicy", "IamGroup"],
    Client: AwsIamUser,
    isOurMinion,
  },
  {
    type: "IamGroup",
    dependsOn: ["IamPolicy"],
    Client: AwsIamGroup,
    isOurMinion: isOurMinionIamGroup,
  },
  {
    type: "IamRole",
    dependsOn: ["IamPolicy"],
    Client: AwsIamRole,
    isOurMinion,
  },
  {
    type: "IamPolicy",
    Client: AwsIamPolicy,
    isOurMinion,
  },
  {
    type: "IamPolicyReadOnly",
    Client: AwsIamPolicyReadOnly,
    listOnly: true,
    isOurMinion: isOurMinionIamPolicyReadOnly,
  },
  {
    type: "IamInstanceProfile",
    dependsOn: ["IamRole"],
    Client: AwsIamInstanceProfile,
    isOurMinion: isOurMinionInstanceProfile,
  },
];
