const assert = require("assert");
const fs = require("fs").promises;
const path = require("path");
const yaml = require("js-yaml");
const { pipe, tap } = require("rubico");
const { createResources } = require("./resources");
const hooks = [require("./hook")];

exports.hooks = hooks;
exports.config = () => ({});

const loadManifest = pipe([
  tap((params) => {
    assert(true);
  }),
  () => fs.readFile(path.join(__dirname, "./cert-manager.yaml")),
  yaml.loadAll,
  tap((params) => {
    assert(true);
  }),
]);

exports.loadManifest = loadManifest;

exports.createResources = createResources;

exports.isProviderUp = ({ resources }) =>
  pipe([
    () =>
      resources.certificaterequestsCertManagerIoCustomResourceDefinition.getLive(),
  ])();
