# uploadAndReleaseSource
在本地上传指定打包的资源到指定的服务器如(xxx.zip)，然后执行服务器上指定的启动脚本

```
yarn add df-release-cli --dev
```

然后在项目的跟目录下新增release.json，如下
```
{
  "host": "xxxxx",
  "username": "xxx",
  "password": "xxxx",
  "source": "df-be-screen-building-system.zip",
  "targetPath": "/root/screen",
  "startShellPath": "/root/screen/be.sh" 
}
```

在package.json的scripts新增
```
 "r": "release-cli"
```
运行
npm run r 