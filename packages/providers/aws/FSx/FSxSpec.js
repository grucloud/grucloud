const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html

//const { FSxBackup } = require("./FSxBackup");
//const { FSxDataRepositoryAssociation} = require("./FSxDataRepositoryAssociation");
//const { FSxFileCache } = require("./FSxFileCache");
//const { FSxLustreFileSystem } = require("./FSxLustreFileSystem");
//const { FSxOpenzfsFileSystem } = require("./FSxOpenzfsFileSystem");
//const { FSxOpenzfsSnapshot } = require("./FSxOpenzfsSnapshot");
//const { FSxOpenzfsVolume } = require("./FSxOpenzfsVolume");
//const { FSxWindowsFileSystem } = require("./FSxWindowsFileSystem");

const GROUP = "FSx";
const compare = compareAws({});

module.exports = pipe([
  () => [
    // FSxBackup({})
    // FSxDataRepositoryAssociation({})
    // FSxFileCache({})
    // FSxLustreFileSystem({})
    // FSxOpenzfsFileSystem({})
    // FSxOpenzfsSnapshot({})
    // FSxOpenzfsVolume({})
    // FSxWindowsFileSystem({})
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
