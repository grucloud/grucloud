/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React, { useState, useEffect } from "react";
import axios from "axios";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import AwsLogo from "./img/aws.svg";
import GcpLogo from "./img/gcp.svg";
import AzureLogo from "./img/azure.svg";
import MainLogo from "./img/gc.svg";

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";

SyntaxHighlighter.registerLanguage("javascript", js);

const features = [
  {
    title: <>Cloud Resources</>,
    //imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Code you infrastructure for predictable deployment, manages the
        dependencies between cloud resources
      </>
    ),
  },
  {
    title: <>Multi Cloud</>,
    //imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Grucloud supports the major Cloud Providers such as Amazon Web Service,
        Google Could and Microsoft Azure.
      </>
    ),
  },
  {
    title: <>Javascript</>,
    //imageUrl: "img/undraw_docusaurus_tree.svg",
    description: (
      <>
        Every Software that can be written in Javascript will be eventually
        written in Javascript. Infrastrucure as Code is not an exception
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

const LinkLogo = ({ Logo, url }) => (
  <Link
    className={classnames(
      "button button--outline button--secondary button--lg",
      styles.getStarted
    )}
    to={useBaseUrl(url)}
  >
    <Logo></Logo>
  </Link>
);

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const [gcpExample, setGcpExample] = useState("");

  // TODO exrract in a component
  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        "https://raw.githubusercontent.com/grucloud/grucloud/main/examples/google/vm-simple/iac.js"
      );
      setGcpExample(result.data);
    }

    fetchData();
  }, []);

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Deploy, Update and Destroy Infrastructures as Code"
    >
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
          <h1 className="hero__title">{siteConfig.title}</h1>
        </div>

        <p className="hero__subtitle">Infrastructure as Code in Javascript</p>
        <p className="hero__subtitle">Deploy and Destroy Cloud Resources </p>
      </header>
      <main
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <section
          css={css`
            text-align: center;
            padding: 30px;
          `}
        >
          <h1>Get Started</h1>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              > a {
                margin: 0.5rem 0 0.5rem 0;
                width: 320px;
              }
            `}
          >
            <LinkLogo Logo={AwsLogo} url="docs/aws/AwsGettingStarted" />
            <LinkLogo Logo={GcpLogo} url="docs/google/GoogleGettingStarted" />
            <LinkLogo Logo={AzureLogo} url="docs/azure/AzureGettingStarted" />
          </div>
        </section>
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
        <section
          css={css`
            display: flex;
            flex-direction: column;
            padding: 1rem;
            max-width: 100vw;
          `}
        >
          <h2 css={css``}>Infrastructure file</h2>
          <p>Simple example of a virtual machine deployed on Google Cloud:</p>
          <div
            css={css`
              overflow: scroll;
            `}
          >
            <SyntaxHighlighter
              language="javascript"
              style={{
                ...docco,
                hljs: {
                  ...docco.hljs,
                  display: "inline-block",
                },
              }}
            >
              {gcpExample}
            </SyntaxHighlighter>
          </div>
        </section>
        <section
          css={css`
            background-color: #f7f8fa;
            padding: 1rem;

            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          `}
        >
          <div>
            <h2>GC Command Line Interface</h2>
            <p>
              Use the <em>gc</em> command line interface to deploy and destroy
              the infrastructure:
            </p>
            <iframe
              data-autoplay
              src="https://asciinema.org/a/VNjhjXHwRhGkuP6kcMBks3Kmo/embed?autoplay=true&amp;speed=6&amp;loop=true"
              id="asciicast-iframe-13761"
              name="asciicast-iframe-13761"
              scrolling="no"
              style={{ width: "100%", height: "720px" }}
            ></iframe>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
