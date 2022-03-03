## react 库如何引入？

在 package.json 引入即可，如下
```json
  "devDependencies": {
    "@types/react": "^17.0.38",
    "@types/react-dom": "^17.0.11",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  // 当其他人引入我们的库时，指定 react 版本
  "peerDependencies": {
    "react": ">=16.8"
  },
  "peerDependenciesMeta": {
    "react": {
      // 设置 react 是可选的，去掉 react 库丢掉的警告,因为我们的库是非强制绑定 react 的
      "optional": true
    }
  }
```
