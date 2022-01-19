/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Head from "@docusaurus/Head";
import styles from "./styles.module.css";
import AwsLogo from "../img/aws.svg";
import GcpLogo from "../img/gcp.svg";
import AzureLogo from "../img/azure.svg";
import K8sLogo from "../img/k8s.svg";

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";

SyntaxHighlighter.registerLanguage("javascript", js);

const MySEO = () => (
  <>
    <Head>
      <meta
        property="og:description"
        content="Insfrastructure as Javascript Code"
      />
      <meta
        property="og:image"
        content="https://grucloud.com/img/grucloud-logo.png"
      />
      <meta charSet="utf-8" />
      <title>GruCloud</title>
    </Head>
  </>
);

const features = [
  {
    title: <>Features</>,
    description: (
      <>
        <p>Generate Javascript code from live infrastructures.</p>
        <p>Deploy, destroy and list resources on various clouds.</p>
        <p>Share and compose infrastructure.</p>
        <p>Automatic resource dependencies management.</p>
      </>
    ),
  },
  {
    title: <>Benefit</>,
    description: (
      <>
        <p>Skip manually coding your infrastructure.</p>
        <p>Stop paying for ununsed resources. Re-deploy them when necessary.</p>
        <p>Predictable deployment.</p>
        <p>Create various deployment stages: production, uat, test, etc ...</p>
      </>
    ),
  },

  {
    title: <>Tech</>,
    description: (
      <>
        <p>
          Use Javascript, a true programming language, no more YAML or Domain
          Specific language.
        </p>
        <p>Easy to add new resources or new cloud providers.</p>
        <p>Robust against cloud service providers API failures.</p>
        <p>Open Source.</p>
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className="col col--4">
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <div>{description}</div>
    </div>
  );
}
const Features = () => (
  <section
    css={css`
      background-color: #f7f8fa;
    `}
    className={styles.features}
  >
    <div className="container">
      <div className="row">
        {features.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </div>
  </section>
);

const LinkLogo = ({ Logo, url }) => (
  <Link
    className="button button--outline button--secondary button--lg"
    to={useBaseUrl(url)}
  >
    <Logo></Logo>
  </Link>
);

const GettingStarted = () => (
  <section
    css={css`
      text-align: center;
      padding: 30px;
    `}
  >
    <h1>Get Started</h1>
    <div
      css={css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 30px 30px;
        grid-template-areas:
          ". ."
          ". .";

        @media (max-width: 600px) {
          grid-template-columns: 1fr;
          grid-template-rows: 1fr 1fr 1fr 1fr;
          gap: 10px 10px;
          grid-template-areas:
            "."
            "."
            "."
            ".";
        }
        > a {
          margin: 0.5rem 0 0.5rem 0;
          width: 375;
        }
      `}
    >
      <LinkLogo Logo={AwsLogo} url="docs/aws/AwsGettingStarted" />
      <LinkLogo Logo={GcpLogo} url="docs/google/GoogleGettingStarted" />
      <LinkLogo Logo={AzureLogo} url="docs/azure/AzureGettingStarted" />
      <LinkLogo Logo={K8sLogo} url="docs/k8s/K8sGettingStarted" />
    </div>
  </section>
);

const Header = () => (
  <header
    css={css`
      text-align: center;
      background-color: #f7f8fa;
      padding: 1rem;
    `}
  >
    <div
      css={css`
        display: flex;
        justify-items: center;
        justify-content: center;
        align-items: center;
        > * {
          margin: 5px;
        }
      `}
    >
      <MainLogo
        css={css`
          width: 100px;
          height: 100px;
        `}
      />{" "}
      <h1 className="hero__title">GruCloud</h1>
    </div>

    <p className="hero__subtitle">Automatically Generate Infrastructure Code</p>
    <p className="hero__subtitle">Visualize, Deploy, Destroy Cloud Resources</p>
  </header>
);

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const [gcpExample, setGcpExample] = useState("");

  // TODO extract in a component
  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        "https://raw.githubusercontent.com/grucloud/grucloud/main/examples/google/vm-simple/resources.js"
      );
      setGcpExample(result.data);
    }

    fetchData();
  }, []);

  return (
    <main
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <GettingStarted />
      <Features />
      <section
        css={css`
          @media (min-width: 600px) {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 20px 20px;
            grid-template-areas:
              "gencode-text gencode-text gencode-image gencode-image gencode-image"
              "gclist-image gclist-image gclist-image gclist-text gclist-text"
              "gctree-text gctree-text gctree-image gctree-image gctree-image"
              "gccli-image gccli-image gccli-image gccli-text gccli-text";
          }

          > a {
            margin: 0.5rem 0 0.5rem 0;
            width: 375;
          }
          padding: 1rem;
        `}
      >
        <div
          css={css`
            grid-area: gencode-text;
          `}
        >
          <h2>Generate code from a live infrastructure.</h2>
          <p>
            Manually writing infrastructure code is time consuming and require
            expertise. The code generation feature frees you from this tedious
            task.
          </p>
          <p>
            The <code>gc gencode</code> command fetches the current state of the
            infrastructure and generate the <code>resources.js</code> file.
          </p>
        </div>
        <div
          css={css`
            grid-area: gencode-image;
          `}
        >
          <SyntaxHighlighter
            language="javascript"
            wrapLongLines
            style={{
              ...docco,
              hljs: {
                ...docco.hljs,
                //display: "inline-block",
              },
            }}
          >
            {gcpExample}
          </SyntaxHighlighter>
        </div>
        <div
          css={css`
            grid-area: gclist-text;
          `}
        >
          <h2>Visualize the resources</h2>
          <p>
            The <code>gc list --graph</code> command displays a graph of the
            live infrastructure showing the dependencies between resources.
          </p>
        </div>
        <div
          css={css`
            grid-area: gclist-image;
          `}
        >
          <img
            src="https://raw.githubusercontent.com/grucloud/grucloud/main/examples/aws/ec2/ec2-vpc/artifacts/diagram-live.svg"
            alt="graph"
          ></img>
        </div>
        <div
          css={css`
            grid-area: gctree-text;
          `}
        >
          <h2>Visualize as a mindmap</h2>
          <p>
            The <code>gc tree</code> command displays a mindmap resources types.
          </p>
        </div>
        <div
          css={css`
            grid-area: gctree-image;
          `}
        >
          <img
            src="https://raw.githubusercontent.com/grucloud/grucloud/main/examples/aws/ec2/ec2-vpc/artifacts/resources-mindmap.svg"
            alt="graph"
          ></img>
        </div>
        <div
          css={css`
            grid-area: gccli-text;
          `}
        >
          <h2>GruCloud Command Line Interface</h2>
          <p>
            Use the <em>gc</em> command line interface to deploy and destroy the
            infrastructure:
          </p>

          <Link
            css={css`
              width: 300px;
            `}
            to={"https://www.grucloud.com/docs/cli/gc"}
          >
            Visit the GruCloud CLI documentation
          </Link>
        </div>
        <div
          css={css`
            grid-area: gccli-image;
          `}
        >
          <iframe
            data-autoplay
            src="https://asciinema.org/a/VNjhjXHwRhGkuP6kcMBks3Kmo/iframe?autoplay=true&amp;speed=6&amp;loop=true"
            id="asciicast-iframe-13761"
            name="asciicast-iframe-13761"
            scrolling="no"
            style={{ width: "100%", height: "720px" }}
          ></iframe>
        </div>
      </section>
    </main>
  );
}

export default Home;
