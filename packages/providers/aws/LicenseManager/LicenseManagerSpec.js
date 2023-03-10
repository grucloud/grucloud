const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

// const {
//   LicenseManagerAssociation,
// } = require("./LicenseManagerAssociation");
// const {
//   LicenseManagerGrant,
// } = require("./LicenseManagerGrant");
// const {
//   LicenseManagerGrantAccepter,
// } = require("./LicenseManagerGrantAccepter");
// const {
//   LicenseManagerLicenseConfiguration,
// } = require("./LicenseManagerLicenseConfiguration");

//  https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
const GROUP = "LicenseManager";
const tagsKey = "Tags";

const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    // LicenseManagerAssociation({}),
    // LicenseManagerGrant({}),
    // LicenseManagerGrantAccepter({}),
    // LicenseManagerLicenseConfiguration({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        compare: compare({}),
      }),
    ])
  ),
]);
