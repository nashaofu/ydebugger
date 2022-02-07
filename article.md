# 这个工具让平板不再买后爱奇艺

> 让你的平板不再吃灰，不再买前生产力，买后爱奇艺，让 Github Codespace & Codeserver 也能在平板设备上进行 Web 开发调试。----[ydebugger](https://github.com/nashaofu/ydebugger 'ydebugger')

随着 Codeserver 的推出，让我们能够便捷地在网页中进行开发，Github 推出 Codespace 更加提升了便捷性。

假期在外旅行，不想带沉重的电脑，我可以使用平板，在 Codespace 上进行开发吗？然后我就动手试了一下，下面总结了一下 Codeserver 和 Codespace 的优缺点。

## Codeserver 与 Codespace 优点

1. 可以随时随地地进行开发，不受开发环境的限制，一切都在云端。
2. 开发后端程序比较方便，例如 nodejs,完全和在本地 vscode 体验一样。
3. Codespace 与 GitHub 深度集成，更易于使用。

## Codeserver 与 Codespace 缺点

1. 网络有一定的延迟，如果是自己部署的 codeserver,延迟应该较低。
2. 没办法运行带有 UI 类的程序，界面效果不能显示。例如 electron 不能调试和效果预览。
3. 服务器上的环境也需要自己先配置，例如 Codespace 不包含中文字体，导致中文乱码。
4. vscode 部分插件没法使用。

但作为一个前端开发者，当我访问正在开发的页面的时候，习惯性的打开开发者工具，结果一点反应都没有，这才想起来，平板设备上的浏览器没有开发者工具。那么问题来了，怎么让平板用上开发者工具呢？一通操作，发现 Chrome 的 Devtools 是一个独立的 Web 应用，并且如果在 Chrome 启动时指定`remote-debugging-port`就可以在浏览器中访问 Devtools 应用。

```bash
# Mac
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

这个时候在浏览器中输入：`http:127.0.0.1:9222/json`就能获取到对应页面的调试信息，类似于下面的内容。

```json
[
  {
    "description": "",
    "devtoolsFrontendUrl": "/devtools/inspector.html?ws=127.0.0.1:8080/devtools/page/A7033F3F4904852AD107E9E489C27E58",
    "id": "A7033F3F4904852AD107E9E489C27E58",
    "title": "百度一下，你就知道",
    "type": "page",
    "url": "https://www.baidu.com/",
    "webSocketDebuggerUrl": "ws://127.0.0.1:8080/devtools/page/A7033F3F4904852AD107E9E489C27E58"
  },
  {
    "description": "",
    "devtoolsFrontendUrl": "/devtools/inspector.html?ws=127.0.0.1:8080/devtools/page/9B115D928C2121A09BCF49A28B70EDA5",
    "id": "9B115D928C2121A09BCF49A28B70EDA5",
    "title": "about:blank",
    "type": "page",
    "url": "about:blank",
    "webSocketDebuggerUrl": "ws://127.0.0.1:8080/devtools/page/9B115D928C2121A09BCF49A28B70EDA5"
  }
]
```

然后春节假期我就落地了这个想法，在服务端使用 puppeteer 启动一个无头浏览器，并且开启调试功能，然后用 puppeteer 访问要调试的页面，访问对应页面调试地址就可以在平板中调试啦！然后对 Codeserver 和 Codespace 进行了一些适配，`npm publish` 一把梭，**[ydebugger](https://github.com/nashaofu/ydebugger 'ydebugger')** 发布啦！

## 使用方法

```bash
npm i -g ydebugger

# 调试 https://www.google.com
ydebugger https://www.google.com
```

然后在浏览器打开`http://127.0.0.1:8080`，就会得到如下界面：

点击对应页面的`inspect`按钮，就会跳转到调试页面了，效果如下：

更多信息请前往 [https://github.com/nashaofu/ydebugger](https://github.com/nashaofu/ydebugger) 查看。
