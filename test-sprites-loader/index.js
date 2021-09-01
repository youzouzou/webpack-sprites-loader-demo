const Spritesmith = require('spritesmith');
const fs = require('fs');
const path = require('path');
const imageList = [];

module.exports = function (content, map, meta) {

  const callback = this.async();

  const patt = /url\((.*)\)/g
  while ((result = patt.exec(content)) != null) {
    // TODO:测试mac
    imageList.push(path.resolve("src", result[1]).replace(/\\/g,"/")) // windows下路径需处理成/
  }

  console.log("图片数组", imageList)

  Spritesmith.run({
    src: imageList,
    algorithm: 'alt-diagonal'
  },
    function handleImages(err, result) {
      if (err) {
        console.log("错误", err)
        callback(err);
      } else {
        // TODO:测试mac
        if (!fs.existsSync(path.resolve("./dist/sprites"))) {
          fs.mkdirSync(path.resolve("./dist/sprites")); // 创建放置雪碧图的目录
        }
        console.log("结果", result)
        console.log("路径", path.resolve("./dist/sprites/sprites.png"))
        fs.writeFile(path.resolve("./dist/sprites/sprites.png"), result.image, function(){
          console.log("成功！")

          // 对css中的背景图进行雪碧图定位替换

          callback(null, content, map, meta);
        }); // 输出雪碧图
      }
    });
};