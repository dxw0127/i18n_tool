import fs from "fs";
import * as parser from "@babel/parser";
import generate from "@babel/generator";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import textToIntl from "./textToIntl";
import dfsFile from "./dfsFile";

const inputDir = "./test";

const extname = [".ts", ".tsx"];

const intlFunName = "i18n";
const localFunName = "./loacls";

dfsFile(inputDir, extname, (filePath) => {
  const code = fs.readFileSync(filePath, { encoding: "utf-8" });

  const ast = parser.parse(code, {
    // parse in strict mode and allow module declarations
    sourceType: "module",

    plugins: [
      // enable jsx and flow syntax
      "jsx",
      "typescript",
    ],
  });

  textToIntl(ast, intlFunName, localFunName);

  const output = generate(ast, {
    jsescOption: {
      // 处理字符串会被转成utf-8编码的表示的问题
      minimal: true,
    },
  });

  fs.writeFileSync(filePath, output.code, { encoding: "utf-8" });
});
