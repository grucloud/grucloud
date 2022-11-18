const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html

//const { GrafanaLicenseAssociation } = require("./GrafanaLicenseAssociation");
//const { GrafanaRoleAssociation } = require("./GrafanaRoleAssociation");
//const { GrafanaWorkspace } = require("./GrafanaWorkspace");
//const { GrafanaWorkspaceApiKey } = require("./GrafanaWorkspaceApiKey");
//const { GrafanaWorkspaceSamlConfiguration } = require("./GrafanaWorkspaceSamlConfiguration");

const GROUP = "Grafana";

const compare = compareAws({});

module.exports = pipe([
  () => [
    // GrafanaLicenseAssociation({})
    // GrafanaRoleAssociation({})
    // GrafanaWorkspace({})
    // GrafanaWorkspaceApiKey({})
    // GrafanaWorkspaceSamlConfiguration({})
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
