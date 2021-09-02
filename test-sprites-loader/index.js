const Spritesmith = require("spritesmith");
const fs = require("fs");
const path = require("path");
const { getOptions } = require("loader-utils");
const imageList = [];

module.exports = function (content, map, meta) {
  const options = getOptions(this);
  // const dist = this.getOptions().dist || "./src/assets/sprites";
  const dist = options.dist; // "./src/assets/sprites";

  const callback = this.async();

  const patt = /(background.*)url\((.*)\).*;/g;
  while ((result = patt.exec(content.replace(/;/g, ";\n"))) != null) {
    if (result) {
      // TODO:测试mac
      imageList.push({
        sentence: result[0],
        id: result[2],
        path: path.resolve("src", result[2]).replace(/\\/g, "/"),
      }); // windows下路径需处理成正斜杠/
    }
  }

  if (dist && imageList.length > 0) {
    Spritesmith.run(
      {
        src: imageList.map((item) => item.path),
      },
      function handleImages(err, result) {
        if (err) {
          console.log("错误", err);
          callback(err);
        } else {
          // TODO:测试mac

          if (!fs.existsSync(path.resolve(dist))) {
            fs.mkdirSync(path.resolve(dist)); // 创建放置雪碧图的目录
          }
          fs.writeFileSync(path.resolve(dist + "/sprites.png"), result.image); // 输出雪碧图

          // 对css中的背景图进行雪碧图定位替换
          imageList.forEach((item) => {
            // 匹配 ./assets/sprites/xxx.png
            const position =
              result.coordinates[
                path.resolve("src", item.id).replace(/\\/g, "/")
              ];
            const originStr = item.sentence; //"url\("+item.id.replace(/\\/g,"\\/")+"\)"
            let reg = originStr.replace(/\//g, "\\/");
            reg = reg
              .replace(/\./g, "\\.")
              .replace(/\(/g, "\\(")
              .replace(/\)/g, "\\)")
              .replace(/\:/g, "\\:")
              .replace(/\;/g, "\\;")
              .replace(/\-/g, "\\-");
            content = content.replace(
              new RegExp(reg),
              "background:url(" +
                path.resolve(dist + "/sprites.png") +
                ") " +
                -position.x +
                "px " +
                -position.y +
                "px no-repeat;width:" +
                position.width +
                "px!important;height:" +
                position.height +
                "px!important;"
            );
          });

          callback(null, content, map, meta);
        }
      }
    );
  } else {
    callback(null, content, map, meta);
  }
};
