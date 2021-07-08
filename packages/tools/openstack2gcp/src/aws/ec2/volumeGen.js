const { pipe, tap, get, eq, map, switchCase, fork, any } = require("rubico");
const { identity } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
  findLiveById,
  configTpl,
  codeTpl,
  buildPropertyList,
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
            type: "Volume",
            resource,
            resourceVarName,
            propertyList,
          }),
        }),
      ]),
    ]),
  ])();

exports.writeVolumes = writeResources({
  type: "Volume",
  writeResource: writeVolume,
});
