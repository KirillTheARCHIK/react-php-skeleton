import type { BuildOutput } from "bun";
import fs from "node:fs";
import { join } from "node:path";

type BuildConfig = Parameters<typeof Bun.build>[0] & {
  outdir: string; // output directory
  watchPath?: string;
  onRebuild?: (output: BuildOutput) => void;
  assetFoldersNaming?: Record<string, string>;
};

const buildFront = async (config: BuildConfig) => {
  fs.rmSync(config.outdir, { recursive: true, force: true });
  //Копирование ассетов в папку бандла
  if (config.assetFoldersNaming) {
    for (const folderPath in config.assetFoldersNaming) {
      const files = fs.readdirSync(folderPath, {
        recursive: true,
      });
      for (const file of files.filter((f) => typeof f === "string")) {
        const fileName = file.split("/").findLast(() => true)!;
        const match = fileName.match(/^(?<name>[^.]*?)\.(?<ext>.+)$/);
        if (match) {
          fs.cpSync(
            `${folderPath}/${file}`,
            `${config.outdir}/${config.assetFoldersNaming[folderPath]
              .replace("[name]", match.groups!.name)
              .replace("[ext]", match.groups!.ext)}`
          );
        }
      }
    }
  }
  //Сама сборка
  const output = await Bun.build(config);
  //
  const files = fs.readdirSync(config.outdir).filter((f) => typeof f === "string");
  const fileName = files.find((f) => new RegExp(`^${"index-[hash].html".replace("[hash]", "[a-z0-9]+")}$`).test(f));
  if (fileName) {
    let indexHtmlContent = fs.readFileSync(`${config.outdir}/${fileName}`, { encoding: "utf8" });
    indexHtmlContent = indexHtmlContent.replace('href="../public/manifest.json"', 'href="./manifest.json"');
    fs.writeFileSync(`${config.outdir}/index.html`, indexHtmlContent, "utf8");
  }
  //
  console.log(`${new Date().toTimeString().split(" ")[0]} \033[92mФронт собран\033[0m`);
  return output;
};

export async function build(config: BuildConfig) {
  let { watchPath, onRebuild } = config;
  // if (watchPath && config.sourcemap !== "external") {
  //   console.error("Watch requires external sourcemap, setting to external");
  // }
  let output = await buildFront(config);

  if (watchPath) {
    let debounce: Timer | null = null;
    let pending = false;

    const rebuild = async () => {
      if (pending) return;
      pending = true;
      output = await buildFront(config);
      onRebuild && onRebuild(output);
      pending = false;
    };

    fs.watch(watchPath, { recursive: true }, (event, filename) => {
      if (!filename) return;
      const source = join(watchPath, filename);
      console.log(`Изменен файл: ${source}`);
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(rebuild, 500);
    });
  }

  onRebuild && onRebuild(output);
  return output;
}
