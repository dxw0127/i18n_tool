import { IConfig } from "../index";
type TextToIntlProps = Pick<
  IConfig,
  "inputDir" | "extname" | "intlFunName" | "localFunDir"
>;
export declare function isChinese(temp: string): boolean;
declare const textToIntl: ({
  inputDir,
  extname,
  intlFunName,
  localFunDir,
}: TextToIntlProps) => void;
export default textToIntl;
