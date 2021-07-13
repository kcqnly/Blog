---
title: 树莓派无屏幕配置
date: 2021-07-13
tags:
 - 树莓派
---

使用官方工具烧写系统。烧写完，进行ssh和wifi的配置。

### ssh和wifi配置

SSH

```bash
cd /Volumes/boot
touch ssh
```

Wi-Fi

```bash
touch wpa_supplicant.conf
```

文件内容如下

```shell
country=CN
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
 
network={
ssid="WiFi-A"
psk="12345678"
key_mgmt=WPA-PSK
priority=1
}
 
network={
ssid="WiFi-B"
psk="12345678"
key_mgmt=WPA-PSK
priority=2
}
```

ssh可以通过这样连接，默认密码为`raspberry`。

```shell
ssh pi@raspberrypi.local
```

#### SSH免密

```shell
ssh-copy-id -i ~/.ssh/id_rsa.pub pi@raspberrypi.local
```

之后在本地的ssh config文件里加上下面的部分

```shell
Host pi
    HostName raspberrypi.local
    User pi
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes
```

之后就可以直接通过`ssh pi`来进行连接。

### apt-get国内镜像

修改`/etc/apt/sources.list`

```bash
deb http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ buster main contrib non-free rpi
deb-src http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ buster main contrib non-free rpi
```

然后执行

```shell
sudo apt-get update && apt-get upgrade -y
```

## 开启root

```shell
sudo passwd root # 设置root密码
sudo passwd --unlock root # 开启root用户
su # 切换至root
```

## 安装zsh和omz

使用国内github镜像站

```shell
sudo apt-get install zsh
git clone https://hub.fastgit.org/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
chsh -s /bin/zsh
```

### 安装命令高亮插件

```shell
sudo git clone https://hub.fastgit.org/zsh-users/zsh-syntax-highlighting ~/.zsh/zsh-syntax-highlighting
```

之后编辑`.zshrc`，在最后添加下面这一行

```shell
source ~/.zsh/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
```

之后再生效一下。

```shell
source .zshrc
```


