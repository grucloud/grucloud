const { AwsIamUser } = require("./AwsIamUser");
const { AwsIamGroup, isOurMinionIamGroup } = require("./AwsIamGroup");
const { AwsIamRole } = require("./AwsIamRole");
const {
  AwsIamInstanceProfile,
  isOurMinionInstanceProfile,
} = require("./AwsIamInstanceProfile");
const { AwsIamPolicy, isOurMinionIamPolicy } = require("./AwsIamPolicy");

const { isOurMinion } = require("../AwsCommon");

module.exports = [
  {
    type: "IamUser",
    dependsOn: ["IamPolicy", "IamGroup"],
    Client: ({ spec, config }) => AwsIamUser({ spec, config }),
    isOurMinion,
  },
  {
    type: "IamGroup",
    dependsOn: ["IamPolicy"],
    Client: ({ spec, config }) => AwsIamGroup({ spec, config }),
    isOurMinion: isOurMinionIamGroup,
  },
  {
    type: "IamRole",
    dependsOn: ["IamPolicy"],
    Client: ({ spec, config }) => AwsIamRole({ spec, config }),
    isOurMinion,
  },
  {
    type: "IamPolicy",
    Client: ({ spec, config }) => AwsIamPolicy({ spec, config }),
    isOurMinion: isOurMinionIamPolicy,
  },
  {
    type: "IamInstanceProfile",
    dependsOn: ["IamRole"],
    Client: ({ spec, config }) => AwsIamInstanceProfile({ spec, config }),
    isOurMinion: isOurMinionInstanceProfile,
  },
];
