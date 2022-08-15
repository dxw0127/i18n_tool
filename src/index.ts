import textToIntl from "./textToIntl";
import translateWords from "./translateWords";

const inputDir = "./test";

const extname = [".ts", ".tsx"];

const intlFunName = "i18n";
const localFunDir = "./locals";

const targetLanguage = "en-US";

textToIntl(inputDir, extname, intlFunName, localFunDir);

translateWords(inputDir, extname, intlFunName, localFunDir, targetLanguage);
