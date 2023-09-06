import layout from "./Layout";
import createContext from "@grucloud/bausaurus-core/context.js";
import { mountApp } from "@grucloud/bausaurus-core/utils.js";
import { createStyles } from "./style.js";

const context = createContext({ window, config: { base: "/" } });

createStyles(context);

const Layout = layout(context);
mountApp(Layout({}));
