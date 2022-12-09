const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html

//const { TransferAccess } = require("./TransferAccess");
const { TransferServer } = require("./TransferServer");
//const { TransferSshKey } = require("./TransferSshKey");
//const { TransferTag } = require("./TransferTag");
const { TransferUser } = require("./TransferUser");
const { TransferWorkflow } = require("./TransferWorkflow");

const GROUP = "Transfer";

const compare = compareAws({});

module.exports = pipe([
  () => [
    // TransferAccess({})
    TransferServer({}),
    // TransferSshKey({})
    // TransferTag({})
    TransferUser({}),
    TransferWorkflow({}),
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
