const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html

//const { RedshiftServerlessEndpointAccess } = require("./RedshiftServerlessEndpointAccess");
const {
  RedshiftServerlessNamespace,
} = require("./RedshiftServerlessNamespace");
//const { RedshiftServerlessSnapshot } = require("./RedshiftServerlessSnapshot");
//const { RedshiftServerlessUsageLimit } = require("./RedshiftServerlessUsageLimit");
//const { RedshiftServerlessWorkgroup } = require("./RedshiftServerlessWorkgroup");

const GROUP = "RedshiftServerless";

const tagKeys = "tags";
const compare = compareAws({ tagKeys, key: "key" });

module.exports = pipe([
  () => [
    // RedshiftServerlessEndpointAccess({})
    RedshiftServerlessNamespace({}),
    // RedshiftServerlessSnapshot({})
    // RedshiftServerlessUsageLimit({})
    // RedshiftServerlessWorkgroup({})
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      tagKeys,
      compare: compare({}),
    })
  ),
]);
