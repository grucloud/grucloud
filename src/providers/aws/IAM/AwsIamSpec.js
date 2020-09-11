const { AwsIamUser } = require("./AwsIamUser");
const { isOurMinion } = require("./AwsIamTags");

module.exports = [
  {
    type: "IamUser",
    Client: ({ spec, config }) => AwsIamUser({ spec, config }),
    isOurMinion,
  },
];
