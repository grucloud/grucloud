/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

let App = () => <div></div>;

import MainLogo from "../img/gc.svg";

if (ExecutionEnvironment.canUseDOM) {
  const {
    Box,
    Deck,
    FlexBox,
    FullScreen,
    Markdown,
    Heading,
    ListItem,
    Progress,
    Slide,
    Text,
    UnorderedList,
    Image,
  } = require("spectacle");

  const theme = {
    colors: {
      primary: "#666666",
      secondary: "#0018A8",
      tertiary: "white",
    },
    fontSizes: {
      header: "48px",
      paragraph: "28px",
      text: "38px",
    },
  };

  const template = ({ slideNumber, numberOfSlides }) => (
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
        <Progress color="black" />
      </Box>
    </FlexBox>
  );

  const SlideIntro = () => (
    <Slide>
      <FlexBox
        justifyContent="space-between"
        alignItems="center"
        flexDirection="column"
      >
        <MainLogo />
        <Heading>GruCloud</Heading>
        <Text>Infrastructure as (Generated) Code</Text>
      </FlexBox>
    </Slide>
  );

  const SlideProblem = () => (
    <Slide>
      <FlexBox
        justifyContent="space-between"
        alignItems="center"
        flexDirection="column"
      >
        <Heading>Problem</Heading>
        <Text>Writing cloud infrastructure code:</Text>
        <UnorderedList>
          <ListItem>
            <Text>Time consuming</Text>
          </ListItem>
          <ListItem>
            <Text>Costly</Text>
          </ListItem>
          <ListItem>
            <Text>Hard to find skilled engineers</Text>
          </ListItem>
        </UnorderedList>
      </FlexBox>
    </Slide>
  );

  const SlideSolution = () => (
    <Slide>
      <FlexBox
        justifyContent="space-between"
        alignItems="center"
        flexDirection="column"
      >
        <Heading>Solution</Heading>
        <Text>Automatically write infrastructure:</Text>
        <UnorderedList>
          <ListItem>
            <Text>Code</Text>
          </ListItem>
          <ListItem>
            <Text>Diagrams</Text>
          </ListItem>
        </UnorderedList>
      </FlexBox>
    </Slide>
  );

  const SlideMarket = () => (
    <Slide>
      <FlexBox flexDirection="column">
        <Image
          maxHeight="90%"
          src="https://regmedia.co.uk/2022/05/02/supplied_synergy_research_cloud_market_share_q1_2022.jpg"
        />
      </FlexBox>
    </Slide>
  );

  const SlideCompetition = () => (
    <Slide>
      <FlexBox
        justifyContent="space-between"
        alignItems="center"
        flexDirection="column"
      >
        <Heading>Competition</Heading>
        <UnorderedList>
          <ListItem>
            <Text>Terraform</Text>
          </ListItem>
          <ListItem>
            <Text>Pulumi</Text>
          </ListItem>
          <ListItem>
            <Text>AWS CDK, Azure Biceps</Text>
          </ListItem>
        </UnorderedList>
      </FlexBox>
    </Slide>
  );

  const SlideProgress = () => (
    <Slide>
      <FlexBox
        //justifyContent="space-between"
        //alignItems="center"
        flexDirection="column"
      >
        <Heading>Progress</Heading>
        <Markdown>
          {`
          | Provider              | Resources |  
          |-----------------|-----------|
          | AWS          | 150       | 
          | Azure          | 40       | 
          | Google           | 20       | 
          | Kubernetes | All        |     
        `}
        </Markdown>
      </FlexBox>
    </Slide>
  );

  const SlideMarketing = () => (
    <Slide>
      <FlexBox
        justifyContent="space-between"
        alignItems="center"
        flexDirection="column"
      >
        <Heading>Marketing Strategy</Heading>
        <UnorderedList>
          <ListItem>
            <Text>YouTube channel</Text>
          </ListItem>
          <ListItem>
            <Text>Blogs: dev.to, medium</Text>
          </ListItem>
          <ListItem>
            <Text>Partnership with consultancy company</Text>
          </ListItem>
        </UnorderedList>
      </FlexBox>
    </Slide>
  );

  App = () => {
    return (
      <Deck theme={theme} template={template}>
        <SlideIntro />
        <SlideProblem />
        <SlideSolution />
        <SlideMarket />
        <SlideCompetition />
        <SlideMarketing />
        <SlideProgress />
      </Deck>
    );
  };
}
export default App;
