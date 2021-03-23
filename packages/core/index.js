/*orts.ScalewayProvider = require("./providers/scaleway/ScalewayProvider").ScalewayProvider;
exports.GoogleProvider = require("./providers/google/GoogleProvider").GoogleProvider;
exports.AwsProvider = require("./providers/aws/AwsProvider").AwsProvider;
exports.AzureProvider = require("./providers/azure/AzureProvider").AzureProvider;
exports.MockProvider = require("./providers/mock/MockProvider").MockProvider;
exports.K8sProvider = require("./providers/k8s/K8sProvider").K8sProvider;
*/
exports.ConfigLoader = require("./ConfigLoader");
exports.Retry = require("./Retry");
exports.tos = require("./tos");
exports.logger = require("./logger");
exports.E2ETestUtils = require("./test/E2ETestUtils");
