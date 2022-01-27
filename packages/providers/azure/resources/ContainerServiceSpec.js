const assert = require("assert");
const fs = require("fs").promises;
const path = require("path");
const {
  pipe,
  assign,
  get,
  tap,
  map,
  pick,
  fork,
  switchCase,
} = require("rubico");
const { defaultsDeep, callProp, flatten, prepend } = require("rubico/x");

const { findDependenciesResourceGroup } = require("../AzureCommon");

const group = "ContainerService";

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "ManagedCluster",
      },
    ],
    map(defaultsDeep({ group })),
  ])();
