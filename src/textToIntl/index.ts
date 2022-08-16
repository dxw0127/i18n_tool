import { ParseResult } from "@babel/parser";
import fs from "fs";
import * as parser from "@babel/parser";
import generate from "@babel/generator";
import * as t from "@babel/types";
import dfsFile from "../dfsFile";
import traverse from "../traverseWrapper";
import { IConfig } from "../index";

type TextToIntlProps = Pick<
  IConfig,
  "inputDir" | "extname" | "intlFunName" | "localFunDir"
>;

function isChinese(temp: string) {
  const re = /[\u4E00-\u9FA5]+/;
  if (re.test(temp)) return true;
  return false;
}

const textToIntlSimple = (
  ast: ParseResult<t.File>,
  intlFunName: string,
  intlFunPath: string
) => {
  const isAddImport = {
    notImported: true,
    needImport: false,
  };

  traverse(ast, {
    StringLiteral: {
      enter(path) {
        // 如果不是中文
        if (!isChinese(path.node.value)) {
          return;
        }

        const { parentPath } = path;

        // 如果是导入语句
        if (parentPath.isImportDeclaration()) {
          return;
        }

        // 如果是已经注入函数完成
        if (
          parentPath.isCallExpression() &&
          parentPath.node.callee.type === "Identifier" &&
          parentPath.node.callee.name === intlFunName
        ) {
          return;
        }

        isAddImport.needImport = true;
        // 如果是jsx的属性
        if (parentPath.isJSXAttribute()) {
          path.replaceWith(
            t.jsxExpressionContainer(
              t.callExpression(t.identifier(intlFunName), [
                t.stringLiteral(path.node.value),
              ])
            )
          );
          return;
        }

        // 其他字符串情况
        path.replaceWith(
          t.callExpression(t.identifier(intlFunName), [
            t.stringLiteral(path.node.value),
          ])
        );
      },
    },
    JSXText: {
      enter(path) {
        // 如果不是中文
        if (!isChinese(path.node.value)) {
          return;
        }
        isAddImport.needImport = true;
        // 其他字符串情况
        path.replaceWith(
          t.jsxExpressionContainer(
            t.callExpression(t.identifier(intlFunName), [
              t.stringLiteral(path.node.value.trim()),
            ])
          )
        );
      },
    },

    ImportDefaultSpecifier: {
      enter(path) {
        if (path.node.local.name === intlFunName) {
          isAddImport.notImported = false;
        }
      },
    },
    Program: {
      exit(path) {
        if (isAddImport.needImport && isAddImport.notImported) {
          path
            .get("body")[0]
            ?.insertBefore(
              t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier(intlFunName))],
                t.stringLiteral(intlFunPath)
              )
            );
        }
      },
    },
  });
};

const textToIntl = ({
  inputDir,
  extname,
  intlFunName,
  localFunDir,
}: TextToIntlProps) => {
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

    textToIntlSimple(ast, intlFunName, localFunDir);

    const output = generate(ast, {
      jsescOption: {
        // 处理字符串会被转成utf-8编码的表示的问题
        minimal: true,
      },
    });

    fs.writeFileSync(filePath, output.code, { encoding: "utf-8" });
  });
};

export default textToIntl;
