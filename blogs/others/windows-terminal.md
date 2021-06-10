---
title: Windows终端美化
date: 2021-06-09
---

## 前期准备

[官方文档地址](https://docs.microsoft.com/zh-cn/windows/terminal/)

- 打开MicroSoft Store，下载安装Windows Terminal
- 安装[git](https://git-scm.com/)

### 安装oh-my-posh和posh-git

```powershell
Install-Module posh-git -Scope CurrentUser
Install-Module oh-my-posh -Scope CurrentUser
```

### 安装字体

需要安装Nerd Font字体，不然有些终端主题的符号显示乱码。下载地址如下：

[Nerd Fonts - Iconic font aggregator, glyphs/icons collection, & fonts patcher](https://www.nerdfonts.com/font-downloads)

推荐安装FiraCode Nerd Font

## 配置

### 修改PowerShell配置

使用vscode编辑power shell配置文件

```powershell
code $profile
```

添加下面三行（第三行是设置主题）

```powershell
Import-Module posh-git
Import-Module oh-my-posh
Set-PoshPrompt ys
```

### 修改终端配置

点击windows terminal的设置，然后点击打开json文件

```json
"defaults": {
    // 设置字体
    "fontFace": "FiraCode NF",
    // "fontFace": "Cascadia Code PL",
    // 开启毛玻璃
    "useAcrylic": true,
    // 透明度
    "acrylicOpacity": 0.9,
    "colorScheme": "One Half Dark",
    "fontSize": 11,
    "fontWeight": "normal",
    "hidden": false,
    
}
```

在右上角list中添加git bash（2.32.0）

```json
"list": {
    {
        "commandline": "C:/Program Files/Git/bin/bash.exe",
        "icon": "C:/Program Files/Git/mingw64/share/git/git-for-windows.ico",
        "name": "Git Bash"
    },
}
```
