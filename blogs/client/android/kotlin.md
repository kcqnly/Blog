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



## 基本类型

### 数字

| 类型     | 大小（比特数）| 最小值  |  最大值 |
| ------- |:---:| ---------:|-----:|
| Byte    | 8   | -128      | 127   |
| Short   | 16  | -32768    | 32767 |
| Int     | 32  | $-2^{31}$ |$2^{31}-1$ |
| Long    | 64  |$-2^{63}$  |$2^{63}-1$ |

所有以未超出 `Int` 最大值的整型值初始化的变量都会推断为 `Int` 类型。如果初始值超过了其最大值，那么推断为 `Long` 类型。 如需显式指定 `Long` 型值，请在该值后追加 `L` 后缀。

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

对于浮点数，Kotlin 提供了 `Float` 与 `Double` 类型。

| 类型     | 比特数| 有效数字比特数  |  指数比特数 |十进制位数|
| ------- |:----:| ---------:|-----:|-----:|
| FLoat   | 32   | 24     | 8   | 6-7 |
| Short   | 64   | 53    | 11 | 15-16 |

对于以小数初始化的变量，编译器会推断为 `Double` 类型。 如需将一个值显式指定为 `Float` 类型，请添加 `f` 或 `F` 后缀。 如果这样的值包含多于 6～7 位十进制数，那么会将其舍入。

```kotlin
val pi = 3.14 // Double
val e = 2.7182818284 // Double
val eFloat = 2.7182818284f // Float，实际值为 2.7182817
```

### 位运算

对于位运算，没有特殊字符来表示，而只可用中缀方式调用具名函数，例如:

```kotlin
val x = (1 shl 2) and 0x000FF000
```

- shl(bits) – 有符号左移
- shr(bits) – 有符号右移
- ushr(bits) – 无符号右移
- and(bits) – 位与
- or(bits) – 位或
- xor(bits) – 位异或
- inv() – 位非

### 区间检测

区间实例以及区间检测：`a..b`、 `x in a..b`、 `x !in a..b`

### 字符和字符串

字符用 `Char` 类型表示。它们不能直接当作数字。

```kotlin
fun check(c: Char) {
    if (c == 1) { // 错误：类型不兼容
        // ……
    }
}
```

### 数组

数组在 Kotlin 中使用 `Array` 类来表示，它定义了 `get` 与 `set` 函数（按照运算符重载约定这会转变为 `[]`）以及 `size` 属性，以及一些其他有用的成员函数：

```kotlin
class Array<T> private constructor() {
    val size: Int
    operator fun get(index: Int): T
    operator fun set(index: Int, value: T): Unit

    operator fun iterator(): Iterator<T>
    // ……
}
```

创建数组的方法：

```kotlin
val array = arrayOf(1,2,3,4,5)
val asc = Array(5){i-> i*i}
```
