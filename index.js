#!/usr/bin/env node

const shell = require("shelljs");
const { getBaseJson } = require("./utils/index");
const { uploadFile } = require("./utils/upload");
const { startRemoteShell } = require("./utils/startShell");
shell.exec("pwd", async function(err, pwd) {
  if (err) {
    return;
  }
  try {
    const _pwd = getPwd(pwd);
    //获取base.json 里面的 outputName值
    let serveConfig  = getBaseJson(`${_pwd}/release.json`);
    console.log("serveConfigserveConfig", serveConfig);
    const sourcePath = `${_pwd}/${serveConfig.source}`;
    await uploadZipAndExecStartShell({
      ...serveConfig,
      sourcePath
    });
    process.exit(0);
  } catch (err) {
    console.log("build err>>>>>>>>>>>>>", err);
    process.exit(0);
  }
});

async function uploadZipAndExecStartShell(props) {
  const { host, username, password, targetPath } = props;
  if (!host || !username || !password || !targetPath) {
    throw new Error("host or username or password or targetPath must config");
  }
  // 上传
  await uploadFile(props);
  // 上传后启动 start.sh
  await startRemoteShell(props);
}

function getPwd(pwd) {
  const _pwd = pwd.trim(); // 为啥有空格啊 坑死我了
  console.log("pwd.....", _pwd);
  return _pwd;
}
