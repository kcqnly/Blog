---
title: Flutter基本组件
date: 2020-07-08
categories:
 - 客户端
tags:
 - flutter
---

Flutter提供了丰富多样的基本组件，要使用他们，首先要进行导入。

```dart
import 'package:Flutter/widgets.dart';
```

## 文本组件

```dart
Text("文本组件" * 3,
  textAlign: TextAlign.start,
  maxLines: 1,
  overflow: TextOverflow.ellipsis,
  textScaleFactor: 2,
  style: TextStyle(
    color: Colors.white,
    fontSize: 7.0,
    background: Paint()..color = Colors.blue,
    decoration: TextDecoration.underline))
```

属性定义：

- textAlign：对齐方式，主要有start、end、center，对齐方式的作用范围在组件本身。
- maxLines：最大显示行数，默认情况下会自动换行，上述例子中为1，超过1的部分会被省略，通常与overflow属性结合使用。
- overflow：文本超出范围的省略方式，本例中使用的`TextOverflow.ellipsis`，使超出部分以(...)的方式省略显示。
- textScaleFactor：字体的缩放比例，默认为1.0。

样式定义属性：

- color：定义文字的颜色。
- fontSize：该属性定义文字的大小，与textScaleFactor不同，他设置的是精确的尺寸值，大小相对固定，无法跟随系统设置文字的大小而改变。
- decoration：背景装饰。

Flutter的文本组件还支持同时存在不同样式的文本。

```dart
Text.rich(TextSpan(children: [
          TextSpan(
              text: "text1",
              style: TextStyle(color: Colors.red, fontSize: 25.0)),
          TextSpan(
              text: "text2",
              style: TextStyle(color: Colors.green, fontSize: 25.0))
        ]))
```

TextSpan作为文本的一个片段，可以作为参数放入Text.rich()中。

Flutter还提供了默认样式的继承。

```dart
DefaultTextStyle(
          style: TextStyle(color: Colors.blue, fontSize: 25.0),
          textAlign: TextAlign.start,
          child: Column(
            children: <Widget>[
              Text("text1"),
              Text("text2",
                  style: TextStyle(inherit: false, color: Colors.black)),
              Text(
                "text3",
                style: TextStyle(color: Colors.green),
              )
            ],
          ),
        )
```

被DefaultTextStyle包裹的内容在未单独定义样式的时候，均会使用DefaultTextStyle中样式。`inherit: false`指完全不继承样式，由于text3中单独设置了color，所以除color以外的样式均会得到继承。

## 按钮组件

- RaisedButton 有凸起效果的漂浮按钮

```dart
RaisedButton(
  child: Text("hello"),
  onPressed: () => {debugPrint("clicked")},
)
```

- IconButton 图标按钮

```dart
IconButton(
  icon: Icon(Icons.phone),
  onPressed: () => {debugPrint("clicked")},
)
```

- OutlineButton 边框按钮

```dart
OutlineButton(
  child: Text("hello"),
  onPressed: () => {debugPrint("clicked")},
)
```

- 自定义按钮

```dart
RaisedButton(
  shape:RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
  highlightColor: Colors.green,
  child: Text("cilck"),
  onPressed: () => {debugPrint("clicked")},
)
```

## 图片组件

和Android和iOS原生开发不同，Flutter支持的图片来源更加丰富，包括从asset资源文件中获取图片，通过网络URL获取图片，使用本地图片文件，已经从内存中加载。支持JPG、PNG、GIF、WebP、BMP等。

- asset中的图片

在根目录下创建images文件夹，添加图片，然后在pubspec.yaml中的assets部分添加对这个图片的声明。

```dart
Image.asset('images/avatar.png',width: 50.0)
```

- 网络中的图片

```dart
Image.network("URL")
```

当网络不佳时，网络中的图片可能加载不出来，我们应该使用一个默认的图片来替换它，而不是直接显示空白。

```dart
FadeInImage.assetNetwork(
  placeholder: "本地", image: "URL")
```

### 图片重复

Flutter提供了图片重复的属性，该属性通常在组件尺寸大于图片尺寸时使用，效果类似于平铺，默认不重复，重复属性提供了水平和垂直方向的重复。

```dart
Image.asset('images/avatar.png',height: 600.0,
  repeat: ImageRepeat.repeat,
)
```

## 开关和复选框组件

Flutter中对于开关和复选框的样式定义较少，可以通过activeColor定义选中时的颜色，但无法定义复选框的尺寸，而对于开关，仅可以定义它的宽度。

```dart
class SwitchAndCheckBox extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return SwitchAndCheckBoxState();
  }
}

class SwitchAndCheckBoxState extends State<SwitchAndCheckBox> {
  var switchEnable = false;
  var checked = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        Switch(
            value: switchEnable,
            onChanged: (value) {
              setState(() {
                switchEnable = value;
              });
            }),
        Checkbox(
            value: checked,
            onChanged: (value) {
              setState(() {
                checked = value;
              });
            })
      ],
    );
  }
}
```

## 单选框组件

和复选框/开关组件类似，为了实现选中状态，单选框组件也需要自己调用setState()方法重建组件。

```dart
class HomePageState extends State<HomePage> {
  var _groupValue;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: <Widget>[
        Radio(
          activeColor: Colors.green,
          value: "单选框1",
          groupValue: _groupValue,
          onChanged: (value) {
            setState(() {
              _groupValue = value;
            });
          },
        ),
        Radio(
          activeColor: Colors.blue,
          value: "单选框2",
          groupValue: _groupValue,
          onChanged: (value) {
            setState(() {
              _groupValue = value;
            });
          },
        ),
        Radio(
          activeColor: Colors.red,
          value: "单选框3",
          groupValue: _groupValue,
          onChanged: (value) {
            setState(() {
              _groupValue = value;
            });
          },
        )
      ],
    );
  }
}
```

## 输入框组件和表单组件

```dart
// 用户名
class UserNameInputTextField extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return UserNameInputTextFieldState();
  }
}

class UserNameInputTextFieldState extends State<UserNameInputTextField> {
  @override
  Widget build(BuildContext context) {
    return TextField(
      decoration: InputDecoration(labelText: "登录名", hintText: "输入您的手机号或者邮箱"),
    );
  }
}
// 密码
class PasswordInputTextField extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return PasswordInputTextFieldState();
  }
}

class PasswordInputTextFieldState extends State<PasswordInputTextField> {
  @override
  Widget build(BuildContext context) {
    return TextField(
      decoration: InputDecoration(labelText: "密码", hintText: "在此输入登录密码"),
    );
  }
}
```

### 常用属性

- autofocus 值为true时，会自动获取焦点。
- maxLines 最大行数，默认为1，设为null即可无限换行。
- maxLength 最大长度，被赋值后会显示在输入框的右下角。
- maxLengthEnforced 布尔类型，当长度到达限制时，true将组织输入，false不会阻止，但是输入框为红色。
- obscureText 当为true时，会隐藏密码。
- keyboardType 需要对输入类型做一些限制的时候使用。该属性会通过限制弹出的软键盘的类型，从而达到限制输入类型的目的。类型为TextInputType，常见的属性值有text、number、phone、datetime、emailAddress、url。

添加首部图标

```dart
decoration: InputDecoration(labelText: "密码", hintText: "在此输入登录密码", prefixIcon: Icon(Icons.lock))
```

### 获取输入框的文本内容

#### 一次性地获取内容

1.定义TextEditingController

```dart
TextEditingController usernameController = TextEditingController();
TextEditingController passwordController = TextEditingController();
```

2.设置TextEditingController到TextField中

```dart
class UserNameInputTextFieldState extends State<UserNameInputTextField> {
  @override
  Widget build(BuildContext context) {
    return TextField(
      autofocus: true,
      maxLength: 6,
      controller: usernameController,
      keyboardType: TextInputType.emailAddress,
      decoration: InputDecoration(
          labelText: "登录名", hintText: "输入您的邮箱", prefixIcon: Icon(Icons.person)),
    );
  }
}
```

3.通过TextEditingController获取内容

先在界面中放一个按钮，当用户点击按钮时，获取输入的用户名和密码。

```dart
class LoginButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return RaisedButton(
      child: Text('登录'),
      onPressed: () {
        debugPrint("UserName: " +
            usernameController.text +
            " Password: " +
            passwordController.text);
      },
    );
  }
}
```

#### 实时监听用户的输入

使用`onChanged`属性，代码如下。监听对输入和删除均有效。

```dart
class UserNameInputTextFieldState extends State<UserNameInputTextField> {
  @override
  Widget build(BuildContext context) {
    return TextField(
      autofocus: true,
      maxLength: 6,
      controller: usernameController,
      keyboardType: TextInputType.emailAddress,
      decoration: InputDecoration(
          labelText: "登录名", hintText: "输入您的邮箱", prefixIcon: Icon(Icons.person)),
      onChanged: (content) => {debugPrint("input: " + content)},
    );
  }
}
```

#### 键盘动作按钮

每次我们输入完成的时候，软键盘的右下角都会有一个绿的对勾按钮。我们尝试做这样一个修改，当用户输入完用户名并点击右下角按钮时，自动将光标移动到密码输入框，当用户输入完密码并按下按钮时，进行登录操作。

Flutter提供了`textInputAction`属性和`textinputAction/onSubmitted`属性来实现上述功能。

首先声明一个FocusNode对象，并把它作为focusNode属性的值设置给密码输入框。

```dart
FocusNode passwordNode = FocusNode();
```

然后在用户名输入框中加入`textInputAction`属性和`onEditingComplete`属性。

```dart
class UserNameInputTextFieldState extends State<UserNameInputTextField> {
  @override
  Widget build(BuildContext context) {
    return TextField(
      autofocus: true,
      maxLength: 6,
      textInputAction: TextInputAction.next,
      onEditingComplete: () =>
          FocusScope.of(context).requestFocus(passwordNode),
      controller: usernameController,
      keyboardType: TextInputType.emailAddress,
      decoration: InputDecoration(
          labelText: "登录名", hintText: "输入您的邮箱", prefixIcon: Icon(Icons.person)),
      onChanged: (content) => {debugPrint("input: " + content)},
    );
  }
}
```

最后在密码输入框中加入`textInputAction`属性和`onSubmitted`属性。
前者修改键盘右下角的图标，默认的图标定义为TextInputAction.done，后者与onEditingComplete不同，它有一个Strin类型的参数，其内容就是相应输入框的文本。

```dart
class PasswordInputTextFieldState extends State<PasswordInputTextField> {
  @override
  Widget build(BuildContext context) {
    return TextField(
      maxLength: 8,
      maxLengthEnforced: false,
      obscureText: true,
      controller: passwordController,
      textInputAction: TextInputAction.done,
      onSubmitted: (content) => debugPrint("username " +
          usernameController.text +
          " pssword " +
          passwordController.text),
      focusNode: passwordNode,
      decoration: InputDecoration(
          labelText: "密码", hintText: "在此输入登录密码", prefixIcon: Icon(Icons.lock)),
    );
  }
}
```

#### 非法输入

虽然限制了用户输入的内容类别，但依然无法避免用户的非法操作。这里我们借用（Form）更加优化地实现。

```dart
import 'package:flutter/material.dart';

void main() {
  // debugPaintSizeEnabled = true;
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return MyAppState();
  }
}

class MyAppState extends State<MyApp> {
  GlobalKey<FormState> formGlobalkey = GlobalKey<FormState>();
  String username;

  void save() {
    var form = formGlobalkey.currentState;
    if (form.validate()) {
      form.save();
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Form demo",
      home: Scaffold(
        appBar: AppBar(
          title: Text("Form demo"),
        ),
        body: Column(
          children: <Widget>[
            Form(
                key: formGlobalkey,
                child: TextFormField(
                  decoration: InputDecoration(labelText: "姓名"),
                  validator: (content) {
                    if (content.length <= 0) {
                      return "姓名太短";
                    } else if (content.length > 8) {
                      return "姓名过长";
                    }
                    return null;
                  },
                  onSaved: (content) {
                    username = content;
                  },
                )),
            RaisedButton(onPressed: save, child: Text("保存"))
          ],
        ),
      ),
    );
  }
}
```

GlobalKey是用来获取表单中的表单对象的，一个GlobalKey对应一个表单对象。验证过程在TextFormField对象的validator属性中描述，保存过程在onSaved属性中描述。此外，表单对象还有reset()方法，用来重置表单内容，可以尝试使用reset方法来实现validate失败后自动清空输入框的功能。
