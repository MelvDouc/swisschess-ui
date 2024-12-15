import "reactfree-jsx";
import App from "$src/App.js";

declare global {
  const Fragment: typeof import("reactfree-jsx").Fragment;
}

document.body.append(App());