/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const Console = (context) => ({ text, ...other }) => (
  <div {...other}>
    <header>Header</header>
    {text.split("\n").map((item, i) => (
      <p
        css={css`
          margin: 0;
        `}
        key={i}
      >
        {item}
      </p>
    ))}
  </div>
);

export default Console;
