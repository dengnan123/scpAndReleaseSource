#!/usr/bin/env node

const shell = require("shelljs");
const fs = require("fs-extra");
const { getBaseJson, getConfigName } = require("./utils/index");
const { uploadFile } = require("./utils/upload");
const { startRemoteShell } = require("./utils/startShell");
shell.exec("pwd", async function (err, pwd) {
  if (err) {
    return;
  }
  const configName = getConfigName();
  console.log("configName.......", configName);
  if (configName && !configName.includes(".json")) {
    throw new Error(`${configName} is not a  json file`);
  }
  const _pwd = getPwd(pwd);
  const configNamePath = `${_pwd}/${configName}`;
  console.log("configNamePath.....", configNamePath);
  if (configName && !fs.existsSync(configNamePath)) {
    throw new Error(`${configNamePath} not exist `);
  }
  try {
    //获取base.json 里面的 outputName值
    let serveConfig = configName
      ? getBaseJson(configNamePath)
      : getBaseJson(`${_pwd}/release.json`);
    console.log("serveConfigserveConfig", serveConfig);
    const sourcePath = `${_pwd}/${serveConfig.source}`;
    await uploadZipAndExecStartShell({
      ...serveConfig,
      sourcePath,
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
