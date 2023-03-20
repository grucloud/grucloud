// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "JobTemplate",
    group: "MediaConvert",
    properties: ({}) => ({
      Name: "my-job",
      Settings: {
        Inputs: [
          {
            AudioSelectors: {
              "Audio Selector 1": {
                DefaultSelection: "DEFAULT",
              },
            },
            TimecodeSource: "ZEROBASED",
            VideoSelector: {},
          },
        ],
        OutputGroups: [
          {
            Name: "File Group",
            OutputGroupSettings: {
              FileGroupSettings: {},
              Type: "FILE_GROUP_SETTINGS",
            },
            Outputs: [
              {
                AudioDescriptions: [
                  {
                    CodecSettings: {
                      AacSettings: {
                        Bitrate: 96000,
                        CodingMode: "CODING_MODE_2_0",
                        SampleRate: 48000,
                      },
                      Codec: "AAC",
                    },
                  },
                ],
                ContainerSettings: {
                  Container: "MP4",
                  Mp4Settings: {},
                },
                VideoDescription: {
                  CodecSettings: {
                    Codec: "H_264",
                    H264Settings: {
                      MaxBitrate: 1024,
                      RateControlMode: "QVBR",
                      SceneChangeDetect: "TRANSITION_DETECTION",
                    },
                  },
                },
              },
            ],
          },
        ],
        TimecodeConfig: {
          Source: "ZEROBASED",
        },
      },
      StatusUpdateInterval: "SECONDS_60",
      Type: "CUSTOM",
    }),
  },
  {
    type: "Preset",
    group: "MediaConvert",
    properties: ({}) => ({
      Name: "my-preset",
      Settings: {
        AudioDescriptions: [
          {
            AudioSourceName: "Audio Selector 1",
            CodecSettings: {
              AacSettings: {
                Bitrate: 96000,
                CodingMode: "CODING_MODE_2_0",
                SampleRate: 48000,
              },
              Codec: "AAC",
            },
          },
        ],
        ContainerSettings: {
          Container: "MP4",
          Mp4Settings: {},
        },
        VideoDescription: {
          CodecSettings: {
            Codec: "H_264",
            H264Settings: {
              Bitrate: 1024,
            },
          },
        },
      },
      Type: "CUSTOM",
    }),
  },
  {
    type: "Queue",
    group: "MediaConvert",
    properties: ({}) => ({
      Name: "my-queue",
      PricingPlan: "ON_DEMAND",
    }),
  },
];
