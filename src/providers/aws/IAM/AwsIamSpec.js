const { AwsIamUser } = require("./AwsIamUser");
const { AwsIamGroup, isOurMinionIamGroup } = require("./AwsIamGroup");
const { AwsIamRole } = require("./AwsIamRole");
const {
  AwsIamInstanceProfile,
  isOurMinionInstanceProfile,
} = require("./AwsIamInstanceProfile");
const { AwsIamPolicy, isOurMinionIamPolicy } = require("./AwsIamPolicy");
const { AwsIamPolicyReadOnly } = require("./AwsIamPolicyReadOnly");

const { isOurMinion } = require("../AwsCommon");

module.exports = [
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
    isOurMinion: isOurMinionIamPolicy,
  },
  {
    type: "IamPolicyReadOnly",
    Client: AwsIamPolicyReadOnly,
    listOnly: true,
  },
  {
    type: "IamInstanceProfile",
    dependsOn: ["IamRole"],
    Client: AwsIamInstanceProfile,
    isOurMinion: isOurMinionInstanceProfile,
  },
];
