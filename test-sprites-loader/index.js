const Spritesmith = require('spritesmith');
const fs = require('fs');
const path = require('path');
const imageList = [];

module.exports = function (content, map, meta) {

  const callback = this.async();

  const patt = /url\((.*)\)/g
  while ((result = patt.exec(content)) != null) {
    if(result && result[1].indexOf("sprites")>-1){
     // TODO:测试mac
      imageList.push({id: result[1], path: path.resolve("src", result[1]).replace(/\\/g,"/")}) // windows下路径需处理成正斜杠/
    }
  }

  console.log("图片数组", imageList.map(item=>item.path).join(""))

  Spritesmith.run({
    src: imageList.map(item=>item.path),
  },
    function handleImages(err, result) {
      if (err) {
        console.log("错误", err)
        callback(err);
      } else {
        // TODO:测试mac
        if (!fs.existsSync(path.resolve("./src/assets/sprites"))) {
          fs.mkdirSync(path.resolve("./src/assets/sprites")); // 创建放置雪碧图的目录
        }
        console.log("结果", result)
        console.log("路径", path.resolve("./src/assets/sprites/sprites.png"))
        fs.writeFileSync(path.resolve("./src/assets/sprites/sprites.png"), result.image); // 输出雪碧图

        console.log("成功")
        // 对css中的背景图进行雪碧图定位替换
        imageList.forEach(item=>{
            // 匹配 ./assets/sprites/xxx.png
            const position = result.coordinates[path.resolve("src", item.id).replace(/\\/g,"/")]
            const originStr = "url\("+item.id.replace(/\\/g,"\\/")+"\)"
            console.log(999, originStr)
            let reg = originStr.replace(/\//g,"\\/")
            reg = reg.replace(/\./g,"\\.")
            reg = reg.replace(/\(/g,"\\(")
            reg = reg.replace(/\)/g,"\\)")
            console.log(888,reg, new RegExp(reg))
            content = content.replace(new RegExp(reg), "url("+path.resolve("./src/assets/sprites/sprites.png")+") "+(-position.x)+"px "+(-position.y)+"px");
            console.log(666, content)
          })

          callback(null, content, map, meta);
      }
    });
};