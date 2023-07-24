import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";

hljs.registerLanguage("javascript", javascript);

const highlightedTextAws = `
// AWS Vpc and Subnet
exports.createResources = () => [
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-a",
    properties: ({ config }) => ({
      AvailabilityZone: \`\${config.region}a\`,
      NewBits: 4,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc",
    properties: ({}) => ({
      CidrBlock: "192.168.0.0/16",
    }),
  },
];
`;

const highlightedTextGcp = `
// GCP Compute Instance
exports.createResources = () => [
  {
    type: "Instance",
    group: "compute",
    properties: ({}) => ({
      name: "web-server",
      machineType: "f1-micro",
      metadata: {
        items: [
          {
            key: "enable-oslogin",
            value: "True",
          },
        ],
      },
      sourceImage:
        "projects/ubuntu-os-cloud/global/images/ubuntu-2004-focal-v20210927",
    }),
  },
];
`;

export default function (context) {
  const { bau, css } = context;
  const { div, pre } = bau.tags;

  const HighlightContainer = () =>
    div(
      {
        class: css`
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          & pre {
            max-width: 100vw;
            overflow-x: scroll;
            margin: 1rem;
            padding: 0 1rem 0 1rem;
            border-radius: 5px;
          }
        `,
      },
      pre({
        class: "hljs",
        bauCreated: ({ element }) => {
          element.innerHTML = hljs.highlight(highlightedTextAws, {
            language: "js",
          }).value;
        },
      }),
      pre({
        class: "hljs",
        bauCreated: ({ element }) => {
          element.innerHTML = hljs.highlight(highlightedTextGcp, {
            language: "js",
          }).value;
        },
      })
    );

  return HighlightContainer;
}
