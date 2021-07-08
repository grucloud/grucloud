const assert = require("assert");
const { pipe, tap, get, fork, map, switchCase, not } = require("rubico");
const { pluck, includes } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
  findDependencyNames,
  configTpl,
  codeTpl,
  buildPropertyList,
} = require("../../../generatorUtils");

const pickProperties = [
  "InstanceType",
  "ImageId",
  "Placement.AvailabilityZone",
];

const writeInstance = ({ resource, lives }) =>
  pipe([
    fork({
      resourceVarName: () => ResourceVarName(resource.name),
      propertyList: () => buildPropertyList({ resource, pickProperties }),
    }),
    ({ resourceVarName, propertyList }) => ({
      resourceVarName,
      config: configTpl({
        resourceVarName,
        resource,
        propertyList,
      }),
      code: codeTpl({
        group: "ec2",
        type: "Instance",
        resource,
        resourceVarName,
        propertyList,
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
          eip: findDependencyNames({
            type: "ElasticIpAddress",
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
