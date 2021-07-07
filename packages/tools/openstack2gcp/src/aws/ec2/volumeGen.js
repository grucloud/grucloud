const assert = require("assert");
const { pipe, tap, get, eq, map, switchCase, or, not, any } = require("rubico");
const { find, pluck, size, includes } = require("rubico/x");
const identity = require("rubico/x/identity");

const {
  writeResources,
  ResourceVarName,
  findDependencyNames,
  findLiveById,
  configTpl,
  codeTpl,
} = require("../../../generatorUtils");
const pickProperties = ["Size", "VolumeType", "Device"];

const ResourceVarNameVolume = (resource) => `${ResourceVarName(resource.name)}`;

const isRootDevice = ({ lives }) =>
  pipe([
    get("live.Attachments"),
    map(({ Device, InstanceId }) =>
      pipe([
        () => InstanceId,
        findLiveById({ type: "Instance", lives }),
        eq(get("live.RootDeviceName"), Device),
      ])()
    ),
    any(identity),
  ]);

exports.isRootDevice;

const writeVolume = ({ resource, lives }) =>
  pipe([
    () => resource,
    switchCase([
      isRootDevice({ lives }),
      () => {
        //console.log("volume has root device");
      },
      pipe([
        () => ResourceVarNameVolume(resource),
        (resourceVarName) => ({
          resourceVarName,
          config: configTpl({
            resourceVarName,
            resource,
            pickProperties,
          }),
          code: codeTpl({
            group: "ec2",
            type: "Volume",
            resource,
            resourceVarName,
          }),
        }),
      ]),
    ]),
  ])();

exports.writeVolumes = writeResources({
  type: "Volume",
  writeResource: writeVolume,
});
