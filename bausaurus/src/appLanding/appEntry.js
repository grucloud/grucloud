import layout from "./Layout";
import createContext from "@grucloud/bausaurus-core/context.js";
import { mountApp } from "@grucloud/bausaurus-core/utils.js";

const context = createContext({ window, config: { base: "/" } });

const Layout = layout(context);
mountApp(Layout({}));
