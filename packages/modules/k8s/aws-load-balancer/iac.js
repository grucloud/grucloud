const fs = require("fs").promises;
const yaml = require("js-yaml");
const path = require("path");
const { pipe, tap } = require("rubico");

const LoadBalancerResources = require("./resources");

exports.config = () => ({});

exports.createResources = LoadBalancerResources.createResources;

const loadManifest = pipe([
  () =>
    fs.readFile(path.join(__dirname, "./aws-load-balancer-controller.yaml")),
  yaml.loadAll,
]);

exports.loadManifest = loadManifest;
