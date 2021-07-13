---
title: Kotlin笔记
date: 2021-05-15
sidebar: 'auto'
categories:
 - 客户端
tags:
 - Kotlin
---

## 变量

使用`var`声明变量，`val`声明常量。

```kotlin
var a: Int = 10
```

kotlin完全抛弃了java中的基本类型，全部使用了对象数据类型。

## 函数

当一个函数里只有一行代码的时候，kotlin 允许我们不必写函数体。

```kotlin
fun largerNumber(num1: Int, num2: Int): Int = max(num1, num2)
```

## 程序的逻辑控制

### if条件语句

Kotlin里的if语句相对于java中的有一个额外的功能，它是可以有返回值的。

```kotlin
fun largerNumber(num1: Int, num2: Int): Int {
    return if (num1 > num2) {
        num1
    } else {
        num2
    }
}
```

### when 条件语句

when有点类似于java里的switch，但是又远比switch强大的多。

```kotlin
fun getScore(name: String) = when (name) {
    "Tom" -> 86
    "Jim" -> 77
    "Jack" -> 95
    else -> 0
}
```

when语句允许传入一个任意类型的数据，参数，然后再when的结构体中定义一系列的条件，格式为`匹配值 -> { 执行逻辑 }`，逻辑只有一行时，`{}`可以省略。

除了进行精准匹配，when还可以进行类型匹配。

```kotlin
fun checkNum(num: Number) {
    when (num) {
        is Int -> println("Int")
        is Double -> println("Double")
        else -> println("not support")
    }
}
```

is相当于java中的instanceof关键字。Number是kotlin里的一个抽象类，Int、Double、Long等都是它的子类。

when还有一种不带参数的用法。

```kotlin
fun getScore(name: String) = when {
    name.startsWith("Tom") -> 86
    name == "Jim" -> 77
    name == "Jack" -> 95
    else -> 0
}
```

## 循环

在kotlin中表示一个区间

双端闭区间

```kotlin
val range = 0..10
```

单端闭区间

```kotlin
var range = 0 util 10
```

降序区间

```kotlin
var range = 10 downTo 1
```

基本for-in循环的使用

```kotlin
fun main(args: Array<String>) {
    for (i in 0..10) {
        println(i)
    }
		for (i in 0 util 10 step 2){
      	println(i)
    }
}
```

## 面向对象编程

### 类与对象

```kotlin
class Person {
  var name = ""
  var age = 0
  
  fun eat() {
    println(name + " is eating. He is " + age + " years old.")
  }
}

fun main() {
  val p = Person()
  p.name = "Jack"
  p.age = 19
  p.eat()
}
```

### 继承

默认所有的非抽象类都是不可继承的。抽象类本身是无法创建实例的，一定要子类去继承它才能创建实例，因此抽象类必须被继承才行，不然就没有意义。通过给Person添加`open`关键词，才可以被继承。

```kotlin
open class Person {
  // ...
}
```

让Student类继承Person类

```kotlin
class Student : Person() {
  var sno = ""
  var grade = 0
}
```

### 构造函数

kotlin里的构造函数分为两种：主构造函数和次构造函数。

主构造函数就是最常用的构造函数，每个类默认都有一个不带参数的主构造函数，当然也可以显示的给它指明参数。主构造函数没有函数体，直接定义在类名后面即可。

```kotlin
class Student(val sno: String, val grade: Int) : Person() {
  
}

val student = Student("a123", 5)
```

由于主构造函数没有函数体，如果我们需要在主构造函数里写一些逻辑的话，需要使用`init`函数。

```kotlin
class Student(val sno: String, val grade: Int) : Person() {
  init {
    println("sno is " + sno)
    println("grade is " + grade)
  }
}
```

根据继承特性的规定，子类的构造函数必须调用父类的构造函数，子类的主构造函数调用父类中的哪个构造函数，在继承的时候通过括号指定。

次构造函数是通过constructor关键词定义，它是有函数体的。当一个类既有主构造函数又有次构造函数的时候，所有的次构造函数都必须调用主构造函数（包括间接调用）。

```kotlin
class Student(val sno: String, val grade: Int, name: String, age: Int) : Person(name, age) {
  constructor(name: String, age: Int) : this("", 0, name, age){
  }
}
```

### 接口

kotlin允许在接口中定义的函数里进行默认实现，jdk1.8之后也开始支持这个功能了。

```kotlin
interface Study {
  fun readBooks()
  
  fun doHomeWork() {
    println("do homework default")
  }
}

class Student(name: String, age: Int): Person(name, age), Study {
  override fun readBooks() {
    println(name + " is reading.")
  }
}
```

### 数据类和单例类

创建数据类

```kotlin
data class Cellphone(val brand: String, val price: Double)
```

添加`data`关键字之后，kotlin会根据主构造函数中的参数帮我们将`equals()`、`hashCode()`、`toString()`等固定方法自动生成。

创建单例类

```kotlin
object Singleton {}
```

只需要把class关键字换成object就可以创建一个单例类

### lambda编程

初始化集合

```kotlin
val list = listOf("Apple", "Banana", "Orange")
for( fruit in list) {
  println(fruit)
}
```

`listOf()`函数创建的集合是不可变的，也就是它只能用于读取操作。如果想创建可变集合，可以使用`mutableListOf()`函数。set的基本使用和list相似。

map的基本使用

```kotlin
val map = mapOf("Apple" to 1, "Orange" to 2)
for((fruit, number) in map) {
  // ...
}
```

#### 集合的函数式API

```kotlin
val list = listOf("Apple", "orange", "Pear", "Grape")
val maxLengthFruit = list.maxByOrNull { it.length }
println(maxLengthFruit)
```

lambda表达式结构

> {参数名1: 参数类型, 参数名2: 参数类型 -> 函数体 }

```kotlin
val maxLengthFruit = list.maxBy({ fruit: String -> fruit.length })
```

然后Kotlin规定，当Lambda参数是函数的最后一个参数时，可以将Lambda表达式移到函数括 号的外面，如下所示:

```kotlin
val maxLengthFruit = list.maxBy() { fruit: String -> fruit.length }
```

接下来，如果Lambda参数是函数的唯一一个参数的话，还可以将函数的括号省略:

```kotlin
val maxLengthFruit = list.maxBy { fruit: String -> fruit.length }
```

当Lambda表达式的参数列表中只有一个参数时，也不必声明参数名，而是可以使用it 关键字来代替，那么代码就变成了:

```kotlin
val maxLengthFruit = list.maxBy { it.length }
```

