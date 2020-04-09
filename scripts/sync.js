const path = require('path');
const klawSync = require('klaw-sync');
const fs = require('fs');
const fse = require('fs-extra');
const program = require('commander');

program.version('0.0.1').option('-c, --comp <n>', 'comp');
program.on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    -c:需要同步的组件');
  console.log('');
});

program.parse(process.argv);

const paramPath = program.comp;

if (!fs.existsSync(path.resolve(__dirname, '../../dantd'))) {
  console.error('未找到迁移目标项目：dantd，请检查后重试。');
  return;
}

if (!paramPath) {
  console.error('请输入要迁移的组件重试。');
  return;
}

if (paramPath && !fs.existsSync(path.resolve(__dirname, `../src/components/${paramPath}`))) {
  console.error('未找到组件，请重新输入组件名称重试。');
  return;
}

const compPath = path.resolve(__dirname, `../src/components/${paramPath}`);

const fileReg = new RegExp('(.tsx|.ts|.less|.md|.css)$');

const compPaths = klawSync(compPath, {
  nodir: true,
}).map(item => item.path);
// .filter(path => !fileReg.test(path));

console.info(compPaths);

compPaths.forEach(pathItem => {
  const targetPath = pathItem.replace('/dantd-demo/src/components', '/dantd/components');
  try {
    fse.copySync(pathItem, targetPath);
    // console.log(`copy ${pathItem} to ${targetPath} succeed!`);
  } catch (err) {
    console.error(err);
  }
});

console.log('组件同步成功！');
