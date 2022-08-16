import fs from "fs";
import nodePath from "path";
import { program } from "commander";
import textToIntl from "./textToIntl";
import translateWords from "./translateWords";

export interface IConfig {
  inputDir: string;
  extname: `.${string}`[];
  intlFunName: string;
  localFunDir: string;
  targetLanguage: string;
  ignoreCache?: true;
  replaceWord?: true;
}

const defaultConfig: IConfig = {
  inputDir: "./src",
  extname: [".ts", ".tsx"],
  intlFunName: "i18n",
  localFunDir: "./locals",
  targetLanguage: "en-US",
};

program
  .name("i18n_tool")
  .description("transform language cli")
  .version(
    // eslint-disable-next-line import/no-dynamic-require
    require(nodePath.resolve(__dirname, "../package.json")).version,
    "-v"
  );

program.option("-c <string>", "set config file path").action((path: string) => {
  let userConfig: IConfig = defaultConfig;
  try {
    userConfig = {
      ...userConfig,
      ...JSON.parse(fs.readFileSync(path, { encoding: "utf-8" })),
    };
  } catch (_) {
    userConfig = defaultConfig;
  }

  const { replaceWord, ignoreCache, targetLanguage, ...restProps } = userConfig;

  if (replaceWord) {
    textToIntl(restProps);
  }

  translateWords({
    ...restProps,
    targetLanguage,
    ignoreCache,
  });
});

program.parse(process.argv);
