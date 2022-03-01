# ydebugger

A remote webapp of the Chrome DevTools, you can develop and debug front-end pages on iPad Browser with [GitHub codespaces](https://github.com/features/codespaces) or [code-server](https://github.com/coder/code-server).

## Usage

```bash
npm i -g ydebugger

ydebugger https://www.google.com
```

## Browser support

| name    | version | OS                      |
| :------ | :------ | :---------------------- |
| Safari  | >=15    | `mac ios`               |
| Chrome  | >=80    | `mac ios windows linux` |
| Firefox | >=96    | `mac ios windows linux` |
| Edge    | >=80    | `mac ios windows linux` |

## Screenshots

- Pages

![index.png](./screenshots/index.png)

- Inspector page

![inspect.png](./screenshots/inspect.png)

## Options

```bash
ydebugger [url]

Positionals:
  url  debugging website url  [string]

Options:
  -h, --help       Show help  [boolean]
  -v, --version    Show version number  [boolean]
  -p, --port       devtools frontend port number  [number] [default: 8080]
  -o, --open       Open browser automatically  [boolean] [default: false]
      --width      viewport width  [number] [default: 1024]
      --height     viewport width  [number] [default: 768]
      --mobile     viewport is mobile  [boolean] [default: false]
      --landscape  viewport is landscape  [boolean] [default: false]
      --touch      viewport is touch supported  [boolean] [default: false]
      --dsf        viewport device scale factor  [number] [default: 2]
```

## Github Codespaces

There will be a problem of page character scrambling When debugging a non English website. This situation is because the system does not have a font file in the corresponding language. The corresponding language font file can be put into `~/.fonts` or `/usr/share/fonts`. For example, you can use [HarmonyOS Sans](https://developer.harmonyos.com/cn/docs/design/des-guides/font-0000001157868583) to render Chinese fonts.
use xx to render Chinese fonts

```bash
curl -o HarmonyOS_Sans.zip https://communityfile-drcn.op.hicloud.com/FileServer/getFile/cmtyPub/011/111/111/0000000000011111111.20211104104632.29664895974930825801937957883629:50521103025534:2800:1C62D8D976C9EAB505E2AAE22BD5B04FB5E6E311A8C39626B70F3F5BCF941EF9.zip\?needInitFileName\=true

unzip -d ~/.fonts/ HarmonyOS_Sans.zip
```
