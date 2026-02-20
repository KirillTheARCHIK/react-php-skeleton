import type { BunPlugin } from "bun";
import fs from "node:fs";

export const svgLoaderPlugin: BunPlugin = {
  name: "Custom SVG loader",
  setup(build) {
    if (build.onLoad) {
      build.onResolve({ filter: /\.svg/, namespace: "file" }, (args) => {
        // console.log(`${args.namespace} | ${args.importer} | ${args.kind} | ${args.resolveDir} | ${args.path}`);
        return {
          path: __dirname.replace("plugins", args.path),
          namespace: args.kind === "internal" ? args.namespace : "reactSVG",
        };
      });
      build.onLoad({ filter: /\.svg/, namespace: "reactSVG" }, (args) => {
        // console.log(`${args.namespace} | ${args.loader} | ${args.path}`);
        const content = fs
          .readFileSync(args.path, { encoding: "utf8" })
          //Преобразование kebab-case аттрибутов в camelCase
          .replaceAll(/ \w+-\w+="/g, (match) => {
            return match.replace(/-./g, (x) => x[1].toUpperCase());
          })
          //Для прокидывания пропсов в svg
          .replace(">", " {...props}>");
        return {
          contents: `
            import React from "react";
            
            export default (props: React.SVGProps<SVGSVGElement>) => {
              return (
                ${content}
              );
            };
          `,
          loader: "tsx",
        };
      });
    }
  },
};
