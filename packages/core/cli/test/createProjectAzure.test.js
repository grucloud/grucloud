const assert = require("assert");
const { pipe, tap, tryCatch } = require("rubico");
const { consentPermission } = require("../providers/createProjectAzure");

assert(process.env.AZURE_SUBSCRIPTION_ID);

describe("createProjectAzure", function () {
  before(async function () {
    if (process.env.CONTINUOUS_INTEGRATION) {
      this.skip();
    }
  });
  it.skip("consentPermission", async function () {
    await consentPermission({
      // AZURE_CLIENT_ID=6bbaf556-3069-4fa1-80fb-3fed05806432
      // az ad sp show --id $AZURE_CLIENT_ID --query "id"
      principalId: "c4d5c68e-539d-4962-bbae-508a495f87ec",
      // az ad sp show --id 00000003-0000-0000-c000-000000000000 --query "objectId"
      resourceId: "0634c5d2-bee3-4819-98b5-4a0af28ad81d",
      // az ad sp show --id 00000003-0000-0000-c000-000000000000 --query "appRoles[?value=='Directory.ReadWrite.All']"
      appRoleId: "9a5d68dd-52b0-4cc2-bd40-abcf44ac3a30",
    });
  });
});
