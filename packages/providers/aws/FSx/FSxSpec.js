const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html

//const { FSxBackup } = require("./FSxBackup");
//const { FSxDataRepositoryAssociation} = require("./FSxDataRepositoryAssociation");
//const { FSxOpenzfsSnapshot } = require("./FSxOpenzfsSnapshot");

const { FSxFileSystem } = require("./FSxFileSystem");
const { FSxStorageVirtualMachine } = require("./FSxStorageVirtualMachine");
const { FSxVolume } = require("./FSxVolume");

const GROUP = "FSx";
const compare = compareAws({});

module.exports = pipe([
  () => [
    // FSxBackup({})
    // FSxDataRepositoryAssociation({})
    // FSxFileCache({})
    // FSxOpenzfsSnapshot({})
    FSxFileSystem({}),
    FSxStorageVirtualMachine({}),
    FSxVolume({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
