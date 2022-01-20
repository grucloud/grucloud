/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "../components/HomepageFeatures";
import MainLogo from "../img/gc.svg";

const HomepageHeader = () => (
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

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Generate infrastructure code and diagrams."
    >
      <HomepageHeader />
      <HomepageFeatures />
    </Layout>
  );
}
