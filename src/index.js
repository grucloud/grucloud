exports.ScalewayProvider = require("./providers/scaleway/ScalewayProvider");
exports.GoogleProvider = require("./providers/google/GoogleProvider").GoogleProvider;
exports.AwsProvider = require("./providers/aws/AwsProvider");
exports.AzureProvider = require("./providers/azure/AzureProvider");

exports.MockProvider = require("./providers/mock/MockProvider");

exports.ConfigLoader = require("./ConfigLoader");
exports.Retry = require("./providers/Retry");
