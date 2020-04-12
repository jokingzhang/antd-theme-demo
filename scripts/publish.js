const fs = require('fs');
const path = require('path');

try {
  const indexPath = path.resolve(__dirname, '../build/index.html');
  let htmlContent = fs.readFileSync(indexPath, 'utf8');
  htmlContent = htmlContent.replace(/href="\/color.less/gi, 'href="/antd-theme-demo/color.less');

  fs.writeFileSync(indexPath, htmlContent, 'utf8');
} catch (error) {
  console.info('重写失败', error);
}

console.info('重写成功!');
