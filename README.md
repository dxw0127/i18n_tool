# i18n 辅助工具

# 安装

- npm
  `npm install @fengluo/i18n_tool -D`
- yarn
  `yarn add @fengluo/i18n_tool -D`

# 使用

`i18n_tool`

该用法会使用默认配置

```json
{
  "inputDir": "./src",
  "extname": [".ts", ".tsx"],
  "intlFunName": "i18n",
  "localFunDir": "./locals",
  "targetLanguage": "en-US",
  "ignoreCache":
}
```

- 指定配置文件运行

`i18n_tool -c ./config.json`

# 配置文件详解

```ts
interface IConfig {
  // 入口文件夹
  inputDir: string;
  // 要匹配的文件名后缀
  extname: `.${string}`[];
  // i18n函数所在文件
  intlFunName: string;
  // 翻译相关的文件夹
  localFunDir: string;
  // 要翻译的目标语言，这会作为第二个参数传给翻译函数，同时还会影响到写入的语言文件名
  targetLanguage: string;
  // 是否忽略缓存，默认情况下，只会向翻译函数提交未翻译的文案
  ignoreCache?: true;
  // 是否替换文案为多语言函数，默认情况下不执行，设置为true，会将所有中文相关的字符串,JSXText包装成i18n函数调用
  replaceWord?: true;
}
```
