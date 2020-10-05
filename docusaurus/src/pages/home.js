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

const features = [
  {
    title: <>Easy to Use</>,
    //imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Grucloud was designed from the ground up to be easily installed and used
        to get your infrastrucure up and running quickly.
      </>
    ),
  },
  {
    title: <>Multi Cloud</>,
    //imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: <>Grucloud supports the major Cloud Providers</>,
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
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header
        css={css`
          text-align: center;
        `}
      >
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <h2>Get Started</h2>
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
      </header>
      <main>
        <section className={styles.features}>
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
