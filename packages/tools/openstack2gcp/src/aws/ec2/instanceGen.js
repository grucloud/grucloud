const assert = require("assert");
const { pipe, tap, get, eq, map, switchCase, not } = require("rubico");
const { find, pluck, size, includes } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
  findDependencyNames,
  configTpl,
  codeTpl,
} = require("../../../generatorUtils");

const pickProperties = [
  "InstanceType",
  "ImageId",
  "Placement.AvailabilityZone",
];

const ResourceVarNameInstance = (resource) =>
  `${ResourceVarName(resource.name)}`;

const writeInstance = ({ resource, lives }) =>
  pipe([
    () => ResourceVarNameInstance(resource),
    (resourceVarName) => ({
      resourceVarName,
      config: configTpl({
        resourceVarName,
        resource,
        pickProperties,
      }),
      code: codeTpl({
        group: "ec2",
        type: "Instance",
        resource,
        resourceVarName,
        dependencies: {
          subnet: findDependencyNames({
            type: "Subnet",
            resource,
            lives,
          }),
          keyPair: findDependencyNames({
            type: "KeyPair",
            resource,
            lives,
          }),
          securityGroups: findDependencyNames({
            type: "SecurityGroup",
            resource,
            lives,
          }),
          iamInstanceProfile: findDependencyNames({
            type: "InstanceProfile",
            resource,
            lives,
          }),
          volumes: findDependencyNames({
            type: "Volume",
            resource,
            lives,
            filterDependency: pipe([
              get("live.Attachments"),
              pluck("Device"),
              not(includes(resource.live.RootDeviceName)),
            ]),
          }),
        },
      }),
    }),
  ])();

exports.writeInstances = writeResources({
  type: "Instance",
  writeResource: writeInstance,
});
