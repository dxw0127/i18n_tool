import fs from "fs";
import nodePath from "path";

const dfsFile = (
  path: string,
  extensions: string[],
  callback: (props: string) => any
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
