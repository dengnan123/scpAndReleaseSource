#!/usr/bin/env node

const fs = require("fs-extra");
const lodash = require("lodash");
const shell = require("shelljs");

function formatJson(data) {
  return JSON.stringify(data, null, 2);
}

function readData(_path) {
  return JSON.parse(fs.readFileSync(_path, "utf-8"));
}

function writeData(_path, data) {
  fs.outputFileSync(_path, data, {
    encoding: "utf8",
  });
}

async function moveFile(srcPath, toPath) {
  await fs.copy(srcPath, toPath);
}

function template(filePath, opts) {
  const content = fs.readFileSync(filePath, { encoding: "utf8" });
  return lodash.template(content, { interpolate: /<%=([\s\S]+?)%>/g })(opts);
}

async function execShell(shellStr, ifErrorMsg) {
  console.log("exec shell", shellStr);
  const { stderr, code } = await shell.exec(shellStr);
  if (code) {
    console.log("shell err msg >>>>", stderr);
    console.log("errcode>>>", code);
    throw new Error(stderr || ifErrorMsg);
  }
}

function getBaseJson(_pwdPath) {
  console.log("_pwdPath_pwdPath", _pwdPath);
  return readData(_pwdPath);
}

// function hasValue(v) {
//   if (!v) {
//     return false;
//   }
//   if (!isArray(v) || !isString(v)) {
//     return false;
//   }
//   return v.includes('')
// }

function getArgvs() {
  const options = process.argv;
  let arr = [];
  if (options.length > 2) {
    arr = options.slice(2);
  }
  return arr;
}

function getConfigName() {
  const opts = getArgvs();
  // 默认取--config 后面的参数
  for (const [index, value] of opts.entries()) {
    if (value === "--config") {
      return opts[index + 1]; // 返回--config 后面的参数
    }
  }
}

module.exports = {
  formatJson,
  readData,
  writeData,
  moveFile,
  template,
  execShell,
  getBaseJson,
  getArgvs,
  getConfigName
};
