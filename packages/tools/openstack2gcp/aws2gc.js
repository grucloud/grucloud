#!/usr/bin/env node
const assert = require("assert");
const { createProgramOptions, generatorMain } = require("./generatorUtils");

const { configTpl } = require("./src/configTpl");
const { iacTpl } = require("./src/aws/iacTpl");

const { writeVpcs } = require("./src/aws/ec2/vpc/vpcGen");
const { writeSubnets } = require("./src/aws/ec2/subnet/subnetGen");
const { writeInstances } = require("./src/aws/ec2/instance/instanceGen");
const { writeKeyPairs } = require("./src/aws/ec2/keyPair/keyPairGen");

const writers = [writeKeyPairs, writeVpcs, writeSubnets, writeInstances];

//TODO read version from package.json
const options = createProgramOptions({ version: "1.0" });

generatorMain({ name: "aws2gc", options, writers, iacTpl, configTpl })
  .then(() => {})
  .catch((error) => {
    console.error("error");
    console.error(error);
    throw error;
  });
