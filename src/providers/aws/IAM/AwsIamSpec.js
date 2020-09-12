const { AwsIamUser } = require("./AwsIamUser");
const { AwsIamRole } = require("./AwsIamRole");
const { AwsIamPolicy, isOurMinionIamPolicy } = require("./AwsIamPolicy");

const { isOurMinion } = require("../AwsCommon");

module.exports = [
  {
    type: "IamUser",
    Client: ({ spec, config }) => AwsIamUser({ spec, config }),
    isOurMinion,
  },
  {
    type: "IamRole",
    Client: ({ spec, config }) => AwsIamRole({ spec, config }),
    isOurMinion,
  },
  {
    type: "IamPolicy",
    Client: ({ spec, config }) => AwsIamPolicy({ spec, config }),
    isOurMinion: isOurMinionIamPolicy,
  },
];
