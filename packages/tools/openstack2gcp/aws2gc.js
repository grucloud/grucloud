#!/usr/bin/env node
const assert = require("assert");
const { createProgramOptions, generatorMain } = require("./generatorUtils");

const { configTpl } = require("./src/configTpl");
const { iacTpl } = require("./src/aws/iacTpl");

const { writeVpcs } = require("./src/aws/ec2/vpcGen");
const { writeSubnets } = require("./src/aws/ec2/subnetGen");
const { writeInstances } = require("./src/aws/ec2/instanceGen");
const { writeKeyPairs } = require("./src/aws/ec2/keyPairGen");
const { writeVolumes } = require("./src/aws/ec2/volumeGen");
const {
  writeElasticIpAddresses,
} = require("./src/aws/ec2/elasticIpAddressGen");
const { writeSecurityGroups } = require("./src/aws/ec2/securityGroupGen");
const { writeInternetGateways } = require("./src/aws/ec2/internetGatewayGen");

const writers = [
  writeVpcs,
  writeSubnets,
  writeKeyPairs,
  writeVolumes,
  writeElasticIpAddresses,
  writeSecurityGroups,
  writeInstances,
  writeInternetGateways,
];

//TODO read version from package.json
const options = createProgramOptions({ version: "1.0" });

generatorMain({ name: "aws2gc", options, writers, iacTpl, configTpl })
  .then(() => {})
  .catch((error) => {
    console.error("error");
    console.error(error);
    throw error;
  });
