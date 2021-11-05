const fs = require("fs").promises;
const yaml = require("js-yaml");
const { pipe } = require("rubico");
const path = require("path");

const Prometheus = require("./resources");

exports.config = () => ({});

exports.hooks = [];

exports.loadManifest = pipe([
  () => fs.readFile(path.join(__dirname, "./prometheus.yaml")),
  yaml.loadAll,
]);

exports.createResources = ({ provider }) =>
  Prometheus.createResources({ provider });
