/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import {
  Appear,
  Box,
  CodePane,
  CodeSpan,
  Deck,
  FlexBox,
  FullScreen,
  Grid,
  Heading,
  Image,
  ListItem,
  Markdown,
  Notes,
  OrderedList,
  Progress,
  Slide,
  Stepper,
  Text,
  UnorderedList,
  indentNormalizer,
} from "spectacle";
import lightTheme from "prism-react-renderer/themes/nightOwlLight";
import MainLogo from "./img/gc.svg";
import AwsLogo from "./img/aws.svg";
import GcpLogo from "./img/gcp.svg";
import AzureLogo from "./img/azure.svg";
const theme = {
  colors: {
    primary: "#666666",
    secondary: "#0018A8",
    tertiary: "white",
  },
  fontSizes: {
    header: "52px",
    paragraph: "28px",
    text: "42px",
  },
};

const template = () => (
  <FlexBox
    justifyContent="space-between"
    alignItems="center"
    position="absolute"
    bottom={0}
    width={1}
  >
    <Box padding="0 1em">
      <FullScreen />
    </Box>
    <Box padding="1em">
      <Progress />
    </Box>
  </FlexBox>
);

function App() {
  return (
    <Deck backgroundColor="white" theme={theme} template={template}>
      <Slide backgroundColor="white">
        <FlexBox
          justifyContent="space-between"
          alignItems="center"
          flexDirection="column"
        >
          <MainLogo />
          <Heading>GruCloud</Heading>
          <Text>Infrastructure as Javascript Code</Text>
        </FlexBox>
      </Slide>
      <Slide>
        <Heading>Principles</Heading>
        <UnorderedList>
          <ListItem>
            <Text>Define Infrastructure with Javascript code.</Text>
          </ListItem>
          <ListItem>
            <Text>
              Use the GruCloud CLI to deploy, update and destroy cloud resources
            </Text>
          </ListItem>
          <ListItem>
            <Text>No YAML or Domain Specific language.</Text>
          </ListItem>
        </UnorderedList>
      </Slide>
      <Slide>
        <Grid
          gridTemplateColumns="1fr 1fr 1fr"
          gridTemplateRows="1fr 5fr"
          gridRowGap={1}
          alignItems="center"
        >
          <Text>
            <AwsLogo />
          </Text>
          <Text>
            <GcpLogo />
          </Text>
          <Text>
            <AzureLogo />
          </Text>
          <div>
            <Text>EC2 Instance</Text>
            <Text>S3: Bucket, Object</Text>
            <Text>IAM: User, Group, Policy, Instance Profile</Text>
          </div>
          <div>
            <Text>VM, Address, Network, Security Group</Text>
            <Text>IAM Policy</Text>
          </div>
          <div>
            <Text>
              VM, Network Interface, PublicAddress, Security Group, Resource
              Group
            </Text>
          </div>
        </Grid>
      </Slide>
      <Slide>
        <Heading>Infrastructure Code</Heading>

        <CodePane
          autoFillHeight
          language="javascript"
          theme={lightTheme}
          fontSize="15"
        >
          {`const { GoogleProvider } = require("@grucloud/core");

exports.createStack = async ({ config }) => {
  const provider = await GoogleProvider({ config });

  const server = await provider.makeVmInstance({
    name: "webserver",
    properties: () => ({
      diskSizeGb: "20",
      machineType: "f1-micro",
      sourceImage:
        "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts"
    }),
  });

  return {
    provider,
  };
};
`}
        </CodePane>
      </Slide>
      <Slide>
        <FlexBox
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <div>
            <Heading>Commands</Heading>
            <UnorderedList>
              <ListItem>
                <Text>gc plan</Text>
              </ListItem>
              <ListItem>
                <Text>gc apply</Text>
              </ListItem>
              <ListItem>
                <Text>gc destroy</Text>
              </ListItem>
              <ListItem>
                <Text>gc list</Text>
              </ListItem>
            </UnorderedList>
          </div>
          <div>
            <iframe
              data-autoplay
              src="https://asciinema.org/a/VNjhjXHwRhGkuP6kcMBks3Kmo/embed?autoplay=true&amp;speed=6&amp;loop=true"
              id="asciicast-iframe-13761"
              name="asciicast-iframe-13761"
              scrolling="no"
              style={{ width: "900px", height: "720px" }}
            ></iframe>
          </div>
        </FlexBox>
      </Slide>
    </Deck>
  );
}
export default App;
