import { sassLoaderPlugin } from "plugins/sassLoader";
import { svgLoaderPlugin } from "plugins/svgLoader";
import { build } from "utils/builder";

build({
  entrypoints: ["src/index.tsx"],
  outdir: "build",
  minify: process.env.NODE_ENV == "production",
  plugins: [sassLoaderPlugin, svgLoaderPlugin],
  target: "bun",
  splitting: true,
  sourcemap: "external",
  watchPath: process.env.FRONT_WATCH ? "src/" : undefined,
  naming: {
    entry: "[name]-[hash].[ext]",
    asset: "[name]-[hash].[ext]",
  },
  assetFoldersNaming: {
    public: "[name].[ext]",
  },
});
