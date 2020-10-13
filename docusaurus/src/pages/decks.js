import React from "react";
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

const theme = {
  colors: {
    primary: "black",
    primary: "white",
    secondary: "white",
  },
  fontSizes: {
    header: "64px",
    paragraph: "28px",
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
    <Deck theme={theme} template={template}>
      <Slide>
        <FlexBox
          justifyContent="space-between"
          alignItems="center"
          flexDirection="column"
        >
          <MainLogo />
          <Heading>GruCloud</Heading>
          <Heading>Infrastructure as Javascript Code</Heading>
        </FlexBox>
      </Slide>
      <Slide>
        <Heading>Principles</Heading>
        <UnorderedList>
          <ListItem>
            <Text>Codify deployment in Javascript code.</Text>
          </ListItem>
          <ListItem>
            <Text>No YAML or Domain Specific language.</Text>
          </ListItem>
          <ListItem>
            <Text>
              Use the GruCloud CLI to deploy, update and destroy cloud resources
            </Text>
          </ListItem>
        </UnorderedList>
      </Slide>
      <Slide>
        <Heading>Cloud Providers</Heading>
        <UnorderedList>
          <ListItem>
            <Text>Aws</Text>
          </ListItem>
          <ListItem>
            <Text>Google Cloud</Text>
          </ListItem>
          <ListItem>
            <Text>Microsoft Azure</Text>
          </ListItem>
        </UnorderedList>
      </Slide>
      <Slide>
        <Heading>Infrastructure Code</Heading>

        <CodePane
          autoFillHeight="true"
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
    </Deck>
  );
}
export default App;
