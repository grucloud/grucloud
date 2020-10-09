/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
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

import createConsole from "./components/console";
const context = {};
const Console = createConsole(context);

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
  const Console = createConsole(context);

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
      <main>
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
                width: 400px;
              }
            `}
          >
            <LinkLogo Logo={AwsLogo} url="docs/aws/AwsGettingStarted" />
            <LinkLogo Logo={GcpLogo} url="docs/google/GoogleGettingStarted" />
            <LinkLogo Logo={AzureLogo} url="docs/azure/AzureGettingStarted" />
          </div>
          {/*<Console
            css={css`
              border: 1px solid red;
              width: 200px;
              display: block;
            `}
            text={`Ciao\nBello`}
          />*/}
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
      </main>
    </Layout>
  );
}

export default Home;
