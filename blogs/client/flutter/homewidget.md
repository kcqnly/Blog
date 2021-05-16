---
title: Flutter+Android桌面组件
date: 2021-02-26
categories:
 - 客户端
tags:
 - flutter
---

一开始看到这个需求，我没想太多，google走一遭之后，我发现，桌面小组件只能用原生来，那就不可避免的要使用混合栈开发。后端半路出家来写flutter，没学过原生，于是我就一直咕咕咕。好不容易放寒假，决定还是学一学kotlin和Android原生开发。这篇文章就是记录我在flutter项目中加入Android桌面组件的整个摸索流程。

## MethodChannel

使用MethodChannel可以实现Flutter 与 Native 端的相互调用，本来想的是写一个插件，提供更新和数据交互功能，结果GitHub一搜，发现有人写好了。

![home_widget.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f95ff0fe27104a069d8f9093eaa72b5a~tplv-k3u1fbpfcp-zoom-1.image)

[项目地址](https://github.com/ABausG/home_widget)

不过他这个插件是通过SharedPreferences来传数据，flutter端通过save方法，将数据存储起来，原生端通过继承它提供好的`HomeWidgetProvider`类，并重写update方法即可。部分源码如下，具体可以查看该插件的example。

flutter端

```dart
HomeWidget.saveWidgetData<String>('title', _titleController.text)；
HomeWidget.saveWidgetData<String>('message', _messageController.text)；
```

原生

```kotlin
class HomeWidgetExampleProvider : HomeWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray, widgetData: SharedPreferences) {
        appWidgetIds.forEach { widgetId ->
            val views = RemoteViews(context.packageName, R.layout.example_layout).apply {
                //Open App on Widget Click
                setOnClickPendingIntent(R.id.widget_container,
                        PendingIntent.getActivity(context, 0, Intent(context, MainActivity::class.java), 0))
                setTextViewText(R.id.widget_title, widgetData.getString("title", null)
                        ?: "No Title Set")
                setTextViewText(R.id.widget_message, widgetData.getString("message", null)
                        ?: "No Message Set")
            }

            appWidgetManager.updateAppWidget(widgetId, views)
        }
    }
}
```

## 数据解析

一开始我确实按着demo，用`SharedPreferences`来读写数据，但是后来这样有一个问题，那就是 `home_widget` 插件并不支持传输 `List<String>` 类型的数据。

![shared_preferenced](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb04a7f61b2e4dafbbf3f514efb06e17~tplv-k3u1fbpfcp-zoom-1.image)

而平时我们在flutter端使用官方的`SharedPreferences`插件的时候，是有`setStringList` 和 `getStringList`这两个方法的，当然原生端的也没有这两个方法。通过查看官方插件源码，找到了问题所在。

```kotlin
List<String> list = call.argument("value");
commitAsync(preferences.edit().putString(key, LIST_IDENTIFIER + encodeList(list)), result);
```

可以看到它实际上是把 `List<String>` 通过一个编码函数改成单一字符串再进行存储。所以如果flutter端使用list类型的数据，那可能还得在原生端加上编码和解码方法，那有点麻烦。最终我还是放弃了这种方式，选择两端都使用数据库存储，且都使用 `orm` 框架。

## 小组件动态更新

小组件的编写我是看的[官方文档](https://developer.android.com/guide/topics/appwidgets#ProviderBroadcasts)，通过在layout文件夹编写小组件样式，在xml文件夹中的info文件里，写入小组件的基本信息。

```xml
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:initialKeyguardLayout="@layout/course_widget"
    android:initialLayout="@layout/course_widget"
    android:minWidth="320dp"
    android:minHeight="110dp"
    android:previewImage="@drawable/widget_preview"
    android:updatePeriodMillis="3600000"
    android:widgetCategory="home_screen" />
```

其中 `android:updatePeriodMillis` 定义的是小组件通过调用 `onUpdate()` 回调方法来从 `AppWidgetProvider` 请求更新的频率。关于这一项的设置，官方文档中是这样写的。

> 不能保证实际更新按此值正好准时发生，我们建议尽可能降低更新频率 - 或许不超过每小时一次，以节省电池电量。您也可以允许用户在配置中调整频率 - 有些人可能希望股票行情自动收录器每 15 分钟更新一次，另有一些人也可能希望它一天只更新 4 次。

通过询问前辈，我了解到这一项最小只能设置成30分钟，也就是1800000。本来到这里，我的任务就解决了，但实际上，过了30分钟，设置过了一个小时，也没有更新。通过测试发现应用后台被关闭之后，它就不能更新了。虽然我们的需求仅仅是1个小时更新一次，但是目前这样也做不到。后来我的思路就跑偏了，还记得前面说的那个 `home_widget` 插件吗，它的example里就提供了一个动态刷新的例子，使用的是 `WorkManager` 实现，于是我也照着写了一版，发现运行两三个小时之后就会失效，而且在百度的过程中，我发现部分厂商甚至把这个api给屏蔽了。。。之后我就想着怎么让后台保活，用了前台服务法，又试了好几天，发现重启后又用不了了。。。

## 仔细看文档

就在我快要放弃的时候，我又去看了眼Android的官方文档，结果发现文档里写的清清楚楚的。

> **注意**：如果设备在到了该更新的时候（由 `updatePeriodMillis` 定义）处于休眠状态，则设备会唤醒以执行更新。如果您的更新频率不超过每小时一次，这样或许不会给电池续航时间造成严重问题。不过，如果您需要更频繁地更新和/或不需要在设备处于休眠状态时进行更新，则可以改为基于不会唤醒设备的闹钟来执行更新。为此，请使用 `AlarmManager` 设置一个具有 AppWidgetProvider 会接收的 Intent 的闹钟。将闹钟类型设为 `ELAPSED_REALTIME` 或 `RTC`，这样只有在设备处于唤醒状态时，闹钟才会响起。然后，将 `updatePeriodMillis` 设为零 (`"0"`)。

使用 `AlarmManager`，通过实测，确实可行，问题解决。

```kotlin
val pending = PendingIntent.getBroadcast(context, 0, intent, 0)
val alarm: AlarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
alarm.cancel(pending)
val interval = 1000 * 60.toLong()
alarm.setRepeating(AlarmManager.ELAPSED_REALTIME, SystemClock.elapsedRealtime(), interval, pending)
```

## 遗留问题

~~桌面组件在一加手机上会出现尺寸不一样的情况，明明写的是5x2的组件，到了一加这里显示的是5x1，有点懵。~~ （应该是一加系统自身的问题，用户反应升级系统后，小组件显示正常。）
