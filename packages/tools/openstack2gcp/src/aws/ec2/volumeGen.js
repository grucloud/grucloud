const { pipe, tap, get, eq, map, switchCase, or, not, any } = require("rubico");
const { identity } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
  findLiveById,
  configTpl,
  codeTpl,
} = require("../../../generatorUtils");
const pickProperties = ["Size", "VolumeType", "Device"];

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
        () => ResourceVarName(resource.name),
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
