import { join } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsxInject: "import {h, Fragment} from 'reactfree-jsx';",
  },
  resolve: {
    alias: {
      "$src": join(process.cwd(), "src")
    }
  }
});