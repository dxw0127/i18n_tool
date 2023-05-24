import { IConfig } from "../index";
type TranslateWordProps = Omit<IConfig, "replaceWord">;
declare const translateWords: ({
  inputDir,
  extname,
  intlFunName,
  localFunDir,
  targetLanguage,
  ignoreCache,
}: TranslateWordProps) => Promise<void>;
export default translateWords;
