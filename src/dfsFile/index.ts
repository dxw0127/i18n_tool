import fs from "fs";
import nodePath from "path";

const dfsFile = (
  path: string,
  extensions: string[],
  callback: (props: string) => any
) => {
  fs.readdir(path, (_, data) => {
    data.forEach((item) => {
      const newPath = `${path}/${item}`;
      fs.stat(newPath, (_err, ele) => {
        if (ele.isFile()) {
          const extname = nodePath.extname(item);
          if (extensions.includes(extname)) {
            callback(newPath);
          }
          return;
        }
        if (ele.isDirectory()) {
          dfsFile(newPath, extensions, callback);
        }
      });
    });
  });
};

export default dfsFile;
