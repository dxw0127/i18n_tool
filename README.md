# 前言

最近在为一个项目做多语言，但是项目设计之初没有考虑多语言，因此每个文案一个个替换什么的简直痛苦面具。于是考虑通过 node 脚本的形式，来为项目进行迁移

# 多语言方案

我们实现的多语言，大多数情况下都是提供一个 intl 函数，然后每个文案的地方写成类似下面这种形式

```typescript
// 多语言函数定义部分
import zhCN from "./zhCN.json";
import enUS from "./enUS.json";
import getLanguage from "./getLanguage";

const languageMap: Record<string, Record<string, string>> = {
  zhCN,
  enUS,
};

function intl(str: string) {
  const targetLanguage = languageMap[getLanguage()];
  return targetLanguage[str] || str;
}

// 消费部分

<span>{intl("要翻译的文案")}</span>;
```

# 确定工具功能

基于以上的部分，我们大概需要以下一些功能

- 递归遍历所有满足条件的文件
- 将所有的文案转换成类似`intl('要翻译的文案')`的形式
- 对项目中所有的翻译的文案收集，翻译，写入对应 json 文件里

# 实现部分

## 递归遍历所有满足条件的文件

这部分比较简单，递归遍历即可，而且网上类似代码一大堆

```typescript
import fs from "fs";
import nodePath from "path";

const dfsFile = (
  path: string,
  extensions: string[],
  callback: (props: string) => void
) => {
  const data = fs.readdirSync(path);

  data.forEach((item) => {
    const newPath = `${path}/${item}`;
    const stat = fs.statSync(newPath);
    if (stat.isFile()) {
      const extname = nodePath.extname(item);
      if (extensions.includes(extname)) {
        callback(newPath);
      }
      return;
    }
    if (stat.isDirectory()) {
      dfsFile(newPath, extensions, callback);
    }
  });
};

export default dfsFile;
```

## 将所有的文案转换成类似`intl('要翻译的文案')`的形式

- 这部分实现要稍微复杂一点，需要用到一点 ast 的工具，另外对于如何确定是否是需要翻译的文案的问题，我认为所有的中文都属于需要翻译的，所以判断字符里是否含有中文即可

### 用到的 ast 相关的工具

- [@babel/parser](https://babeljs.io/docs/en/babel-parser)
- [@babel/traverse](https://babeljs.io/docs/en/babel-traverse)
- [@babel/types](https://babeljs.io/docs/en/babel-types)
- [@babel/generator](https://babeljs.io/docs/en/babel-generator)

### 判断是否是中文

```typescript
function isChinese(temp: string) {
  const re = /[\u4E00-\u9FA5]+/;
  if (re.test(temp)) return true;
  return false;
}
```

### 读取文件，并转换为 ast

这里我们主要是通过[@babel/parser](https://babeljs.io/docs/en/babel-parser)来将我们的代码转成 ast，然后利用[@babel/traverse](https://babeljs.io/docs/en/babel-traverse)来遍历 ast 的节点，在遍历的过程中改变节点的属性，或者对节点进行更改，替换，我们可以借助[@babel/types](https://babeljs.io/docs/en/babel-types)生成一些新的节点，最后将处理好的 ast，使用[@babel/generator](https://babeljs.io/docs/en/babel-generator)将 ast 转换回我们的代码，最后将代码重新写回到对应的文件里即可

#### parser 阶段

```typescript
const ast = parser.parse(code, {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
});
```

#### 遍历以及处理 ast 的节点

1. 确定有哪些节点需要处理，这里我们需要处理的字符串，有两种可能，一种是普通字符串，一种是 jsx 的文案，分别是以下两种的：
   - StringLiteral
   - JSXText

也会你会疑惑是如何确定节点的，这里强烈推荐这个网站：[https://astexplorer.net](https://astexplorer.net/) ，非常好用，你选中内容，右边回自动高亮对应的 ast 节点，而且它支持的语言也非常广，有以下这么多：<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1660915509969-ef220b26-d878-4095-a36b-254a26d58ec5.png#clientId=ub2ef4976-671d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1267&id=u780556bd&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1267&originWidth=2545&originalType=binary&ratio=1&rotation=0&showTitle=false&size=76005&status=done&style=none&taskId=u2ecc2951-2144-4c17-9ec4-5ba185f4921&title=&width=2545)

2. 根据 ast 节点来进行改写

- 不包含中文的，不处理
- 父节点是 ImportDeclaration 的，不处理，

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1660915854194-cd2c0836-0276-4788-a797-38f02ae84a97.png#clientId=ub2ef4976-671d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1233&id=u969f27de&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1233&originWidth=2482&originalType=binary&ratio=1&rotation=0&showTitle=false&size=41314&status=done&style=none&taskId=uc13ae2f1-0cc6-4f4f-9761-cf77b8f28e0&title=&width=2482)

3. 如果是 jsx 的属性，比如<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1660967356064-16a9b256-5310-48e7-8752-817f0305579f.png#clientId=ub2ef4976-671d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1231&id=u87ccb153&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1231&originWidth=2208&originalType=binary&ratio=1&rotation=0&showTitle=false&size=44154&status=done&style=none&taskId=uda59c101-f3a1-44c7-8c70-ac9df222d5b&title=&width=2208)<br />那我们要转成这样子<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1660967460390-899ca6e5-e9bc-4107-a89d-ca0442088bea.png#clientId=ub2ef4976-671d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1264&id=u049fcfbc&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1264&originWidth=2264&originalType=binary&ratio=1&rotation=0&showTitle=false&size=45150&status=done&style=none&taskId=u7b91d037-b54c-41d1-a66a-c7be4808631&title=&width=2264)
4. 如果已经注入完成的，即父节点是 CallExpression，且其 callee 的 name 是我们指定的函数名，这种情况不处理。因为使用的时候，一般会做增量的注入<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1660969945224-7e246c1b-f5c4-4540-b5c3-0267cc6837a5.png#clientId=ub2ef4976-671d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1287&id=u744724e5&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1287&originWidth=2432&originalType=binary&ratio=1&rotation=0&showTitle=false&size=52005&status=done&style=none&taskId=u5a7cc724-b8af-4082-a113-d8e7488e9de&title=&width=2432)
5. JSXText 节点<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1660970087507-91adb7f3-8fb9-4c44-9fd6-ce63b1cb84ad.png#clientId=ub2ef4976-671d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1246&id=u831d3278&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1246&originWidth=2265&originalType=binary&ratio=1&rotation=0&showTitle=false&size=44335&status=done&style=none&taskId=u8b875fd8-7415-4390-80b2-0308b071f14&title=&width=2265)<br />要转成这样子:<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1660970150112-14824d38-421c-4e0c-84c7-4b6bd1cadf2a.png#clientId=ub2ef4976-671d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1279&id=ua92411ba&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1279&originWidth=2551&originalType=binary&ratio=1&rotation=0&showTitle=false&size=52446&status=done&style=none&taskId=u74ba13ec-e778-430e-84c3-3657bf223e5&title=&width=2551)

#### 如何转换

[traverse](https://babeljs.io/docs/en/babel-traverse)为我们提供了遍历 ast 的简易方式，它是以深度搜索优先的方式遍历节点的，每种节点它都提供两个回调，一个是 enter，即刚进入该节点时执行，一个是 exit，离开该节点时执行，而它注入的 path，通过这里的[代码](https://github.com/babel/babel/blob/3445cb39dcf9fed4df7ce21d3f006965dd1c4fc4/packages/babel-traverse/src/path/index.ts)我们其实可以看到它的具体实现，我们主要会用到以下几种：<br />以 is 开头的系列的判断节点类型的方案，如 isJSXAttribute，isCallExpression 等<br />替换节点：replaceWith<br />插入节点：insertBefore<br />另外我们还要用到[@babel/types](https://babeljs.io/docs/en/babel-types)，来为我们生成一些新的节点，使用非常简单，直接 t.xxx()即可<br />实际的转换代码：

```typescript
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
```

这里还增加处理了增加对应 import 语句，来自动引用对应的注入函数<br />ps: 在使用 rollup 打包[traverse](https://babeljs.io/docs/en/babel-traverse)时，有个坑，就是你要写成这样，这个时模块兼容的问题，具体可以看相关的[issues](https://github.com/babel/babel/issues/13855)

```typescript
import _traverse from "@babel/traverse";

// babel的模块兼容性问题，详见https://github.com/babel/babel/issues/13855
// @ts-ignore
const traverse: typeof _traverse = _traverse.default;

export default traverse;
```

### 重写源文件

这个就非常简单了，将处理好后的 ast 节点，传入给[@babel/generator](https://babeljs.io/docs/en/babel-generator)，然后调用就好了，不过这里有个坑就是一定要配置 jsescOption.minimal 属性为 true，不然你就会发行写入的是文案变成了 utf-8 表示<br />代码如下：

```typescript
const output = generate(ast, {
  jsescOption: {
    // 处理字符串会被转成utf-8编码的表示的问题
    minimal: true,
  },
});

fs.writeFileSync(filePath, output.code, { encoding: "utf-8" });
```

## 翻译部分

这部分就比较简单了，方案大概是这样子的：
![](https://cdn.nlark.com/yuque/__puml/bb02c138053f2b0e061fae4b64e1b512.svg#lake_card_v2=eyJ0eXBlIjoicHVtbCIsImNvZGUiOiJAc3RhcnR1bWxcblxucGFydGljaXBhbnQgXCJpMThuX3Rvb2xcIiBhcyBpMThuX3Rvb2xcbnBhcnRpY2lwYW50IFwi57-76K-R56uvXCIgYXMgU2VydmVyICNvcmFuZ2VcblxuaTE4bl90b29sIC0-IGkxOG5fdG9vbDog6YCa6L-HYXN077yM5pS26ZuG5omA5pyJ6KaB57-76K-R55qE5paH5qGIXG5cbmkxOG5fdG9vbCAtPiBTZXJ2ZXI6IOivt-axgue_u-ivkeerr--8jOiOt-WPlue_u-ivkeWQjueahOWNleivjVxuXG5pMThuX3Rvb2wgLT4gaTE4bl90b29sOiDlsIbnv7vor5HlkI7nmoTljZXor43vvIzlhpnlhaXlr7nlupTnmoRqc29u5paH5Lu25LitXG5cblxuQGVuZHVtbCIsInVybCI6Imh0dHBzOi8vY2RuLm5sYXJrLmNvbS95dXF1ZS9fX3B1bWwvYmIwMmMxMzgwNTNmMmIwZTA2MWZhZTRiNjRlMWI1MTIuc3ZnIiwiaWQiOiJGU0M5VSIsIm1hcmdpbiI6eyJ0b3AiOnRydWUsImJvdHRvbSI6dHJ1ZX0sImNhcmQiOiJkaWFncmFtIn0=)

### 收集

还是通过 ast 来收集，通过判断 StringLiteral 的父节点的类型，callee 的 name 属性来判断是否是需要翻译的文案，是的话就收集起来<br />代码如下：

```typescript
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
```

### 翻译

我们还要根据用户配置的翻译函数，来调用该函数，代码如下：

```typescript
// eslint-disable-next-line
const request = require(nodePath.resolve(localFunDir, `request`));
const translatedWords = await request([...pendI18nWords], targetLanguage);

[...pendI18nWords].forEach((item, index) => {
  translatedMap[item] = translatedWords[index];
});

fs.writeFileSync(
  nodePath.resolve(localFunDir, `${targetLanguage}.json`),
  JSON.stringify(translatedMap)
);
```

我们可能还过滤掉已经被翻译的内容，这部分代码如下：

```typescript
let translatedMap: Record<string, string> = {};

// 不忽略缓存，就完全重新翻译
if (!ignoreCache) {
  try {
    translatedMap = JSON.parse(
      fs.readFileSync(nodePath.resolve(localFunDir, `${targetLanguage}.json`), {
        encoding: "utf-8",
      })
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
```

# 最后

这样，我们的一个多语言工具就基本写完了，当然这只是最初的版本，后续肯定还需要再优化<br />源代码地址：[https://github.com/fengluoX/i18n_tool/tree/docs_example](https://github.com/fengluoX/i18n_tool/tree/docs_example)
