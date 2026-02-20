import type { BunPlugin } from "bun";
import { compile } from "sass";

export const sassLoaderPlugin: BunPlugin = {
  name: "Custom Sass loader",
  setup(build) {
    if (build.onLoad) {
      build.onLoad({ filter: /\.scss/, namespace: "file" }, (args) => {
        const compiledSass = compile(args.path, {
          quietDeps: true,
          //Не показывать предупреждения в консоли
          silenceDeprecations: ["global-builtin", "mixed-decls", "slash-div", "color-functions", "import"],
        });
        return {
          contents: compiledSass.css,
          loader: "css",
        };
      });
    }
  },
};
