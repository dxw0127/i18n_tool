import fs from "fs";
import nodePath from "path";
import * as parser from "@babel/parser";
import traverse from "../traverseWrapper";
import dfsFile from "../dfsFile";
import { IConfig } from "../index";

type TranslateWordProps = Omit<IConfig, "replaceWord">;

const translateWords = async ({
  inputDir,
  extname,
  intlFunName,
  localFunDir,
  targetLanguage,
  ignoreCache,
}: TranslateWordProps) => {
  // eslint-disable-next-line
  const request = require(nodePath.resolve(localFunDir, `request`));

  const pendI18nWords = new Set<string>();

  dfsFile(inputDir, extname, (filePath) => {
    const code = fs.readFileSync(filePath, { encoding: "utf-8" });

    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    traverse(ast, {
      StringLiteral: {
        enter(path) {
          const { parentPath } = path;

          if (
            parentPath.isCallExpression() &&
            parentPath.node.callee.type === "Identifier" &&
            parentPath.node.callee.name === intlFunName
          ) {
            pendI18nWords.add(path.node.value);
          }
        },
      },
    });
  });

  let translatedMap: Record<string, string> = {};

  // 不忽略缓存，就完全重新翻译
  if (!ignoreCache) {
    try {
      translatedMap = JSON.parse(
        fs.readFileSync(
          nodePath.resolve(localFunDir, `${targetLanguage}.json`),
          {
            encoding: "utf-8",
          }
        )
      );
    } catch (e) {
      translatedMap = {};
    }
  }

  Object.keys(translatedMap).forEach((item) => {
    // 去除已翻译过的词
    if (pendI18nWords.has(item)) {
      pendI18nWords.delete(item);
    }
  });

  const translatedWords = await request([...pendI18nWords], targetLanguage);

  [...pendI18nWords].forEach((item, index) => {
    translatedMap[item] = translatedWords[index];
  });

  fs.writeFileSync(
    nodePath.resolve(localFunDir, `${targetLanguage}.json`),
    JSON.stringify(translatedMap)
  );
};

export default translateWords;
