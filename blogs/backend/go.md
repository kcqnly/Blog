---
title: Golang入门笔记
date: 2021-06-05
sidebar: 'auto'
categories:
 - 后端
tags:
 - Go
---

## 设置代理

```shell
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
```

## 分支和循环

猜数字demo

```go
package main

import (
	"fmt"
	"math/rand"
	"time"
)

func main() {
	var count = rand.Intn(100) + 1
	var init = 50
	var min = 1
	var max = 100
	for {
		if init < count {
			fmt.Printf("%v 太小了\n", init)
			min = init
			init += (max - init) / 2
		} else if init > count {
			fmt.Printf("%v 太大了\n", init)
			max = init
			init -= (init - min) / 2
		} else {
			break
		}
		time.Sleep(time.Second)
	}
	fmt.Printf("%v 猜对了\n", init)
}
```

## 实数

```go
days := 365.2425
var days = 365.2425
var days float64 = 365.2425
```

- 只要数字含有小数部分，那么它的类型默认就是`float64`
- 如果你使用一个整数来初始化某个变量，那么你必须指定它的类型为 float64，否则它就是一个整数类型

```go
var answer float64 = 42
```

Go 语言里有两种浮点数类型：

- 默认是 float64

  - 64 位的浮点类型

  - 占用 8 字节内存
  - 某些编程语言把这种类型叫做 double（双精度）

- float32 
  - 占用 4 字节内存
  - 精度比 float64 低
  - 有时叫做单精度类型
  - 想要使用单精度类型，你必须在声明变量的时候指定该类型

浮点数精度问题：为了尽量最小化舍入错误，建议先做乘法，再做除法

## 整数

- 所有的整数类型都有一个取值范围，超出这个范围，就会发生“环绕”

```go
var read uint8 = 255
red++
fmt.Println(red)

var number int8 = 127
number++
fmt.Println(number)
```

- 使用 %b 格式化动词

打印每个bit

```go
var green uint8 = 3
fmt.Printf("%08b\n", green)
green++
fmt.Printf("%08b\n", green)
```

## big包

- 对于较大的整数（超过1018 ）：big.Int

- 对于任意精度的浮点类型，big.Float

- 对于分数，big.Rat

```go
distance := new(big.Int)
// 10表示十进制
distance.SetString("240000000000000000000", 10)
fmt.Println(distance)
```

### 较大值的常量

在Go里面，常量可以是无类型的的（untyped）

```go
const distance = 24000000000000000000000
```

- 常量使用 const 关键字来声明，程序里的每个字面值都是常量。

- 这意味着：比较大的数值可以直接使用（作为字面值）

- 针对字面值和常量的计算是在编译阶段完成的。
- Go 的编译器是用 Go 编写的，这种无类型的数值字面值就是由 big 包所支持的。这使你可以操作很大的数（超过18的10¹⁸）
- 只要能够容纳得下，那么常量就可以赋值给变量。

- 常量和big.Int的值是不能互换的

## 字符和字符串

### rune

rune的使用，需要在输出的时候指明是字符型，不然会输出数字。

```go
var frog rune = 0x1f438
fmt.Printf("%c\n", frog)
```

因为`rune`是`int32`的别名，定义别名的代码如下：

```go
type byte = uint8
type rune = int32
```

### 字符

- 字符字面值使用 ‘’ 括起来。例如：’A’

- 如果没指定字符类型的话，那么 Go 会推断它的类型为 rune

- 字符字面值也可以用 byte 类型

### 字符串

- 可一个给某个变量赋予不同的 string 值，但是 string 本身是不可变的

```go
message := "shalom"
c := message[5]
fmt.Printf("%c\n", c)
```

- len 是 Go 语言的一个内置函数

```go
fmt.Println(len(message))
```

它返回的是字符串具有的byte数，在对中文等语言字符串计算时是不准确的。可以使用 utf-8 包，它提供可以按 rune 计算字符串长度的方法。

```go
package main

import (
	"fmt"
	"unicode/utf8"
)

func main() {
	question := "¿Cómo estás?"
	fmt.Println(len(question), "bytes")
	fmt.Println(utf8.RuneCountInString(question), " runes")
	c, size := utf8.DecodeRuneInString(question)
	fmt.Printf("First rune:%c %v bytes", c, size)
}
```

- 使用range关键词，遍历集合

```go
question := "¿Cómo estás?"
for i, c := range question {
	fmt.Printf("%v %c\n", i, c)
}
```

## 类型转换

整型转字符串

- 使用strconv包中的`Itoa`函数可以解决。

```go
countdown := 10
str := "Launch in " + strconv.Itoa(countdown) + " seconds."
fmt.Println(str)
```

- Sprintf函数

```go
countdown := 10
str := fmt.Sprintf("Launch in %v seconds.", countdown)
fmt.Println(str)
```

字符串转数字

可以使用strconv里的`Atoi`函数，由于字符串中可能包含任意字符，或者要转换的数字太大，Atoi函数可能会报错。

```go
countdown, err := strconv.Atoi("10")
if err != nil{

}
fmt.Println(countdown)
```

## 函数

- 在 Go 里，大写字母开头的函数、变量或其它标识符都会被导出，对其它包可用。小写字母开头的就不行。

```go
func kelvinToCelsius(k float64) float64 {
	k -= 273.15
	return k
}

func main() {
	kelvin := 294.0
	celsius := kelvinToCelsius(kelvin)
	fmt.Println(kelvin, " =====> ", celsius)
}
```

## 方法

- 关键字 type 可以用来声明新类型：

```go
type celsius float64
var temperature celsius = 20
```

- 不同类型不能混用，即使底层类型一样也不能混用

通过方法添加行为

```go
type kelvin float64
type celsius float64

//关键词 接收者   方法名   返回值类型
func (k kelvin) celsius() celsius {
	return celsius(k - 273.15)
}

func main() {
	var kelvin kelvin = 294.0
	celsius := kelvin.celsius()
	fmt.Println(kelvin, " =====> ", celsius)
}
```

- 可以将方法和同包中的任何类型相关联，但不可以是int、float64等预声明的类型进行关联。

## 一等函数

- 将函数本身赋值给变量

```go
type kelvin float64

func fackSensor() kelvin {
	return kelvin(rand.Intn(151) + 50)
}

func realSensor() kelvin {
	return 0
}

func main() {
	sensor := fackSensor
	fmt.Println(sensor())

	sensor = realSensor
	fmt.Println(sensor())
}
```

- 将函数赋值给其他函数

```go
type kelvin float64

func fackSensor() kelvin {
	return kelvin(rand.Intn(151) + 50)
}

func measureTemperature(samples int, sensor func() kelvin) {
	for i := 0; i < samples; i++ {
		k := sensor()
		fmt.Printf("%v Kn\n", k)
		time.Sleep(time.Second)
	}
}

func main() {
	measureTemperature(3, fackSensor)
}
```

### 闭包和匿名函数

- 匿名函数就是没有名字的函数，在Go里面也称作函数字面值。

```go
var f = func() {
	fmt.Println("f()")
}

func main() {
	f()
	test := func() {
		fmt.Println("test()")
	}
	test()
	func() {
		fmt.Println("====")
	}()
}
```

- 因为函数字面值需要保留外部作用域的变量引用，所以函数字面值都是闭包的。
- 闭包（closure）就是由于匿名函数封闭并包围作用域中的变量而得名的。

```go
import "fmt"

type measure func() string

func test(message string) measure {
	return func() string {
		return "I get " + message
	}
}

func main() {
	f := test("123")
	fmt.Println(f())
}
```

## 数组

```go
var planets [8]string
planets[0] = "Mars"
planets[1] = "Venus"
planets[2] = "Earth"
earth := planets[2]
fmt.Println(earth)
fmt.Println(len(planets)) 	// 获取数组长度
fmt.Println(planets[3] == "") // true
```

使用复合字面值初始化数组

```go
dwarfs := [...]int{0, 1, 2, 4, 5, 6, 42, 51}
```

可以在复合字面值中使用`...`作为数组的长度，这样go编译器会为你算出数组的元素数量。

### 数组复制

- 无论数组赋值给新的变量还是将它传递给函数，都会产生一个完整的数组副本。

- 数组也是一种值，函数通过值传递来接受参数。所以数组作为函数的参数就非常低效。

- 数组的长度也是数组类型的一部分。

- 尝试将长度不符的数组作为参数传递，将会报错。

- 函数一般使用 slice 而不是数组作为参数

## 切片

切片的是半开区间

```go
planets := [...]int{0, 1, 2, 3, 4, 5}
test := planets[0:4]
```

- 忽略掉 slice 的起始索引，表示从数组的起始位置进行切分；

- 忽略掉 slice 的结束索引，相当于使用数组的长度作为结束索引。

- 注意：slice 的索引不能是负数。

- 如果同时省略掉起始和结束索引，那就是包含数组所有元素的一个 slice。

- 切分数组的语法也可以用于切分字符串，不过索引代表的是字节数而非 rune 的数。

```go
planets := [...]int{0, 1, 2, 3, 4, 5}
// 创建slice方式一
planetSlice := planets[:]
// 方式二
planetsTemp := []int{0, 1, 2}
fmt.Println(planetSlice, planetsTemp)
```

Go 里面很多函数都倾向于使用 slice 而不是数组作为参数。可以将 slice 或数组作为底层类型，然后绑定其它方法。

```go
planets := []int{5, 4, 3, 2, 1, 0}
// 转换成IntSlice类型，再调用sort方法
sort.IntSlice(planets).Sort()
fmt.Println(planets)
```

使用`append`函数将数据添加到切片中。append函数可以添加多个参数。如果底层数组的容量不够，将会再分配一个数组，slice总容量增加一倍。

```go
dwarfs := []string{"Ceres", "Pluto", "Haumea", "Makemake", "Eris"}
dwarfs = append(dwarfs, "Orcus")
fmt.Println(dwarfs)
dwarfs = append(dwarfs, "Salacia", "Quaoar", "Sedna")
fmt.Println(dwarfs)
```

使用`len`函数获取切片的长度。切片容量是指slice底层数组的容量，可以使用`cap`函数获取。

```go
func dump(label string, slice []string) {
	fmt.Printf("%v: length %v, capacity %v %v\n", label, len(slice), cap(slice), slice)

```

三索引切分操作，用于限制新建切片的容量。

```go
terrestrial := planets[0:4:4]
```

使用`make`函数对slice进行预分配。

- 当 slice 的容量不足以执行 append 操作时，Go 必须创建新数组并复制旧数组中的内容。

- 但通过内置的 make 函数，可以对 slice 进行预分配策略。尽量避免额外的内存分配和数组复制操作。

```go
dwarfs := make([]string, 0, 10) // 第二个和第三个参数分别是长度和容量
temp := make([]string, 10) // 表示长度和容量都是10
dwarfs = append(dwarfs, "Ceres", "Pluto", "Haumea", "Makemake", "Eris")
```

声明可变参数的函数，通过在类型前添加`...`，表示为可变参数

```go
// words类型为切片
func terraform(prefix string, worlds ...string) []string {
	newWorlds := make([]string, len(worlds))

	for i := range worlds {
		newWorlds[i] = prefix + " " + worlds[i]
	}
	return newWorlds
}
```

## map

map 是 Go 提供的另外一种集合：

- 它可以将 key 映射到 value。

- 可快速通过 key 找到对应的 value

- 它的 key 几乎可以是任何类型

```go
// map[keyType]valueType
temperature := map[string]int{
		"Earth": 15,
		"Mars":  -65,
}
// 获取value
temp := temperature["Earth"]
fmt.Printf("On average the Earth is %vº C.\n", temp)
// 修改value的值
temperature["Earth"] = 16
// 添加新的键值对
temperature["Venus"] = 464
fmt.Println(temperature)
// 货物不存在的key对应的value，会返回相应类型的0值
moon := temperature["Moon"]
fmt.Println(moon)
// 通过逗号ok写法来判断是否存在相应的key
if moon, ok := temperature["Moon"]; ok {
	fmt.Printf("On average the moon is %vº C.\n", moon)
} else {
	fmt.Println("Where is the moon?")
}
// 判断是否存在Earth这个key
_, ok := temperature["Earth"]
fmt.Println(ok)
// 删除相应的key
delete(temperature, "Earth")
```

- 数组、int、float64等类型在赋值给新变量或传递至函数/方法的时候会创建相应的副本，但 map 不会

```go
planets := map[string]string{
	"Earth": "Sector ZZ9",
	"Mars":  "Sector ZZ9",
}

planetsMarkII := planets
planets["Earth"] = "whoops"
// 输出结果一致
fmt.Println(planets)
fmt.Println(planetsMarkII)
```

### 使用 make 函数对 map 进行预分配

- 除非你使用复合字面值来初始化 map，否则必须使用内置的`make`函数来为 map 分配空间。

- 创建 map 时，`make` 函数可接受一个或两个参数

- 第二个参数用于为指定数量的 key 预先分配空间

- 使用`make`函数创建的 map 的初始长度为 0

```go
// 使用复合字面值进行初始化
temperatures := []float64{
	-28.0, 32.0, -31.0, -29.0, -23.0, -29.0, -28.0, -33.0,
}
// 使用make函数进行初始化
frequency := make(map[float64]int)
// 使用map进行计数
for _, t := range temperatures {
	frequency[t]++
}
// 使用range进行遍历map时，顺序无法保证
for t, num := range frequency {
	fmt.Printf("%+.2f occurs %d times\n", t, num)
}
```

### 使用 map 和 slice 实现数据分组

```go
func main() {
	temperatures := []float64{
		-28.0, 32.0, -31.0, -29.0, -23.0, -29.0, -28.0, -33.0,
	}

	groups := make(map[float64][]float64)

	for _, t := range temperatures {
        // 跨度为10
		g := math.Trunc(t/10) * 10
        // 向slice中添加值
		groups[g] = append(groups[g], t)
	}

	for g, temperatures := range groups {
		fmt.Printf("%v: %v\n", g, temperatures)
	}
}
```

### 将 map 用作 set

Set 这种集合与数组类似，但元素不会重复，Go 语言里没有提供 set 集合。

```go
func main() {
	var temperatures = []float64{
		-28.0, 32.0, -31.0, -29.0, -23.0, -29.0, -28.0, -33.0,
	}

	set := make(map[float64]bool)
    // 将温度值作为key
	for _, t := range temperatures {
		set[t] = true
	}

	if set[-28.0] {
		fmt.Println("set member")
	}

	fmt.Println(set)
    // 创建切片
	unique := make([]float64, 0, len(set))
    // 将数据添加到切片中
	for t := range set {
		unique = append(unique, t)
	}
    // 排序
	sort.Float64s(unique)
	fmt.Println(unique)
}
```

## struct结构体

```go
func main() {
	var curiosity struct {
		lat  float64
		long float64
	}

	curiosity.lat = -4.5895
	curiosity.long = 137.4417

	fmt.Println(curiosity.lat, curiosity.long)
	fmt.Println(curiosity)
}
```

- 通过类型复用结构体以及结构体初始化

```go
type location struct {
	lat, long float64
}
// 复合字面值初始化
opportunity := location{lat: -1.9462, long: 354.4734}
fmt.Println(opportunity)
// long将会变成对应属性的0值
insight := location{lat: 4.5}
fmt.Println(insight)
// 按顺序进行初始化
curiosity := location{-4.5895, 137.4417}
fmt.Printf("%v\n", curiosity)
// +v这样可以输出前面的label
fmt.Printf("%+v\n", curiosity)
```

- struct的复制是复制一个新的副本，对其修改不会影响之前的值

### 由结构体构成slice

```go
type location struct {
	name string
	lat  float64
	long float64
}
// 创建切片
locations := []location{
	{name: "Bradbury Landing", lat: -4.5895, long: 137.4417},
	{name: "Columbia Memorial Station", lat: -14.5684, long: 175.472636},
	{name: "Challenger Memorial Station", lat: -1.9462, long: 354.4734},
}
```

### 将结构体编码成json

```go
import (
	"encoding/json"
	"fmt"
	"os"
)

func main() {
	type location struct {
        // 必须是大写，不然编码后会显示为空
		Lat, Long float64
	}

	curiosity := location{-4.5895, 137.4417}
	// 使用json包的 Marshal 函数将struct转成json
	bytes, err := json.Marshal(curiosity)
	exitOnError(err)
	fmt.Println(string(bytes))
}

// exitOnError prints any errors and exits.
func exitOnError(err error) {
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
```

Go 语言中的 json 包要求 struct 中的字段必须以大写字母开头，类似 CamelCase 驼峰型命名规范。但有时候我们需要 snake_case 蛇形命名规范，那可以为字段注明标签，使得 json 包在进行编码的时候能够按照标签里的样式修改字段名。

```go
type location struct {
	Lat  float64 `json:"latitude"`
	Long float64 `json:"longitude"`
}
```

这样输出时的label就会变成我们设置的latitude和longitude。

## 组合和转发

### 组合

```go
type report struct {
	sol         int
	temperature temperature
	location    location
}

type temperature struct {
	high, low celsius
}

type location struct {
	lat, long float64
}

type celsius float64
```

### 转发方法

Go 可以通过 struct 嵌入 来实现方法的转发。在 struct 中只给定字段类型，不给定字段名即可。
在 struct 中，可以转发任意类型。

```go
type report struct {
	sol int
	temperature
	location
}

type temperature struct {
	high, low celsius
}

type location struct {
	lat, long float64
}

type celsius float64

func (t temperature) average() celsius {
	return (t.high + t.low) / 2
}

func main() {
	report := report{
		sol:         15,
		location:    location{-4.5895, 137.4417},
		temperature: temperature{high: -1.0, low: -78.0},
	}
	// 转发之后，report可以直接调用average方法
	fmt.Printf("average %vº C\n", report.average())
    // 虽然没有设置字段名，但是go语言会自动帮我们生成一个和类型名一样的字段名
	fmt.Printf("average %vº C\n", report.temperature.average())
	fmt.Printf("%vº C\n", report.high)
	report.high = 32
	fmt.Printf("%vº C\n", report.temperature.high)
}
```

`average`是temperature类型的方法，但是通过嵌入，可以实现方法的转发，级report可以直接调用average方法。

## 接口

接口是实现方和调用方约定好的一种合作协议。当接口名的首字母和方法名的首字母大写的时候，表示该方法是公开的。

```go
type Tank interface {
    Walk()
    Fire()
}
```

## 指针

C 语言中的内存地址可以通过例如 address++ 这样的指针运算进行操作，但是在 Go 里面不允许这种不安全操作。

- 将 * 放在类型前面表示声明指针类型
- 将 * 放在变量前面表示解引用操作
- 两个指针变量持有相同的内存地址，那么它们就是相等的

### 指向结构体的指针

与字符串和数值不一样，复合字面量的前面可以放置 &

```go
func main() {
	type person struct {
		name, superpower string
		age              int
	}

	timmy := &person{
		name: "Timothy",
		age:  10,
	}
	timmy.superpower = "flying"

	fmt.Printf("%+v\n", timmy)
}
```

### 指向数组的指针

- 和结构体一样，可以把 & 放在数组的复合字面值前面来创建指向数组的指针。
- 数组在执行索引或切片操作时会自动解引用。没有必要写 (*superpower)[0] 这种形式。
- 与 C 语言不一样，Go 里面数组和指针是两种完全独立的类型。
- Slice 和 map 的复合字面值前面也可以放置 & 操作符，但是 Go 并没有为它们提供自动解引用的功能。

```go
superpowers := &[3]string{"flight", "invisibility", "super strength"}
fmt.Println(superpowers[0])
fmt.Println(superpowers[1:2])
```

### 实现修改

- Go 语言的函数和方法都是按值传递参数的，这意味着函数总是操作于被传递参数的副本。
- 当指针被传递到函数时，函数将接收传入的内存地址的副本。之后函数可以通过解引用内存地址来修改指针指向的值。
- 方法的接收者和方法的参数在处理指针方面是很相似的。

```go
type person struct {
    name string
    age int
}

func (p *person) birthday() {
    p.age++
}

func birthday(p *person) {
    p.age++
}
```

Go 语言在变量通过点标记法进行调用的时候，自动使用 & 取得变量的内存地址。

### 内部指针

- Go 语言提供了内部指针这种特性。它用于确定结构体中指定字段的内存地址。
- & 操作符不仅可以获得结构体的内存地址，还可以获得结构体中指定字段的内存地址。

```go
type stats struct {
	level             int
	endurance, health int
}

func levelUp(s *stats) {
	s.level++
	s.endurance = 42 + (14 * s.level)
	s.health = 5 * s.endurance
}

func main() {
	type character struct {
		name  string
		stats stats
	}

	player := character{name: "Matthias"}
	levelUp(&player.stats)

	fmt.Printf("%+v\n", player.stats)
}
```

### 修改数组

```go
func reset(board *[8][8]rune) {
	board[0][0] = 'r'
}

func main() {
	var board [8][8]rune
	reset(&board)
	fmt.Printf("%c", board[0][0])
}
```

### 隐式的指针

- Go 语言里一些内置的集合类型就在暗中使用指针。
- map 在被赋值或者呗作为参数传递的时候不会被复制。map 就是一种隐式指针。
- map 的键和值都可以是指针类型。
- 需要将指针指向 map 的情况并不多见。

### slice 指向数组

实际上 slice 在指向数组元素的时候也使用了指针。每个 slice 内部都会被表示为一个包含 3 个元素的结构，它们分别指向：

- 数组的指针
- slice 的容量
- slice 的长度

当 slice 被直接传递至函数或方法时，slice 的内部指针就可以对底层数据进行修改。

```go
func reclassify(planets *[]string) {
	*planets = (*planets)[0:8]
}

func main() {
	planets := []string{
		"Mercury", "Venus", "Earth", "Mars",
		"Jupiter", "Saturn", "Uranus", "Neptune",
		"Pluto",
	}
	reclassify(&planets)

	fmt.Println(planets)
}
```

### 指针和接口

- 本例中，无论 martian 还是指向 martian 的指针，都可以满足 talker 接口。

- 如果方法使用的是指针接收者，那么情况会有所不同。

```go
type stats struct {
	level             int
	endurance, health int
}

func levelUp(s *stats) {
	s.level++
	s.endurance = 42 + (14 * s.level)
	s.health = 5 * s.endurance
}

func main() {
	type character struct {
		name  string
		stats stats
	}

	player := character{name: "Matthias"}
	levelUp(&player.stats)

	fmt.Printf("%+v\n", player.stats)
}
```

## 错误处理

Go 语言允许函数和方法同时返回多个值，按照惯例，函数在返回错误时，最后边的返回值应用来表示错误。调用函数后，应立即检查是否发生错误。如果没有错误发生，那么返回的错误值为 nil。

```go
import (
	"fmt"
	"io/ioutil"
	"os"
)

func main() {
	files, err := ioutil.ReadDir(".")
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	for _, file := range files {
		fmt.Println(file.Name())
	}
}
```

### defer

- 使用 defer 关键字，Go 可以确保所有 deferred 的动作可以在函数返回前执行。
- 可以 defer 任意的函数和方法。
- defer 并不是专门做错误处理的。
- defer 可以消除必须时刻惦记执行资源释放的负担

```go
func proverbs(name string) error {
	f, err := os.Create(name)
	if err != nil {
		return err
	}
	defer f.Close()

	_, err = fmt.Fprintln(f, "Errors are values.")
	if err != nil {
		return err
	}

	_, err = fmt.Fprintln(f, "Don’t just check errors, handle them gracefully.")
	return err
}
```

## goroutine

在 Go 中，独立的任务叫做 goroutine。虽然 goroutine 与其它语言中的协程、进程、线程都有相似之处，但 goroutine 和它们并不完全相同。Goroutine 创建效率非常高，Go 能直截了当的协同多个并发（concurrent）操作。

```go
import (
	"fmt"
	"time"
)

func main() {
	for i := 0; i < 5; i++ {
		go sleepyGopher()
	}
	time.Sleep(4 * time.Second)
}

func sleepyGopher() {
	time.Sleep(3 * time.Second)
	fmt.Println("... snore ...")
}
```

- 向 goroutine 传递参数就跟向函数传递参数一样，参数都是按值传递的（传入的是副本）

```GO
func main() {
	for i := 0; i < 5; i++ {
		go sleepyGopher(i)
	}
	time.Sleep(4 * time.Second)
}

func sleepyGopher(id int) {
	time.Sleep(3 * time.Second)
	fmt.Println("... snore ... ", id)
}
```

## channel

- 通道可以在多个goroutine之间安全传值。
- 通过可以用作变量、函数参数、结构体字段...
- 创建通道使用`make`函数，并指定其传输数据的类型。

### 通过channel发送、接收

使用左箭头操作符 `<-` 向通道发送值 或 从通道接收值

- 向通道发送值：c <- 99

- 从通道接收值：r := <- c

- 发送操作会等待直到另一个 goroutine 尝试对该通道进行接收操作为止。

- 执行发送操作的 goroutine 在等待期间将无法执行其它操作

- 未在等待通道操作的 goroutine 让然可以继续自由的运行

 执行接收操作的 goroutine 将等待直到另一个 goroutine 尝试向该通道进行发送操作为止。

```go
func main() {
	c := make(chan int)
	for i := 0; i < 5; i++ {
		go sleepyGopher(i, c)
	}
	for i := 0; i < 5; i++ {
		gopherID := <-c
		fmt.Println("gopher ", gopherID, " has finshed...")
	}
}

func sleepyGopher(id int, c chan int) {
	time.Sleep(3 * time.Second)
	fmt.Println(" ... ", id)
	c <- id
}
```

### 使用 select 处理多个通道

select 和 switch 有点像。该语句包含的每个 case 都持有一个通道，用来发送或接收数据。select 会等待直到某个 case 分支的操作就绪，然后就会执行该 case 分支。

**注意：**即使已经停止等待 goroutine，但只要 main 函数还没返回，仍在运行的 goroutine 将会继续占用内存。

```go
func main() {
	c := make(chan int)
	for i := 0; i < 5; i++ {
		go sleepyGopher(i, c)
	}
  //time.After 函数，返回一个通道，该通道在指定时间后会接收到一个值
  //（发送该值的 goroutine 是 Go 运行时的一部分）
	timeout := time.After(2 * time.Second)
	for i := 0; i < 5; i++ {
		select {
		case gopherID := <-c:
			fmt.Println("gopher ", gopherID, " has finished sleeping")
		case <-timeout:
			fmt.Println("my patience ran out")
			return
		}
	}
}
func sleepyGopher(id int, c chan int) {
	time.Sleep(time.Duration(rand.Intn(4000)) * time.Millisecond)
	c <- id
}
```

### 阻塞和死锁

- 当 goroutine 在等待通道的发送或接收时，我们就说它被阻塞了。
- 除了 goroutine 本身占用少量的内存外，被阻塞的 goroutine 并不消耗任何其它资源。
- 当一个或多个 goroutine 因为某些永远无法发生的事情被阻塞时，我们称这种情况为死锁。而出现死锁的程序通常会崩溃或挂起。

```go
// 流水线实例
func main() {
	c0 := make(chan string)
	c1 := make(chan string)
	go sourceGopher(c0)
	go filterGopher(c0, c1)
	printGopher(c1)
}
func sourceGopher(downstream chan string) {
	for _, v := range []string{"hello world", "a bad apple", "goodbye all"} {
		downstream <- v
	}
	downstream <- ""
}
func filterGopher(upstream, downstream chan string) {
	for {
		item := <-upstream
		if item == "" {
			downstream <- ""
			return
		}
		if !strings.Contains(item, "bad") {
			downstream <- item
		}
	}
}
func printGopher(upstream chan string) {
	for {
		v := <-upstream
		if v == "" {
			return
		}
		fmt.Println(v)
	}
}
```

Go 允许在没有值可供发送的情况下通过 close 函数关闭通道。通道被关闭后无法写入任何值，如果尝试写入将引发 panic。尝试读取被关闭的通道会获得与通道类型对应的零值。

**注意：** 如果循环里读取一个已关闭的通道，并没检查通道是否关闭，那么该循环可能会一直运转下去，耗费大量 CPU 时间。

```go
v, ok := <- c // 可以得知通道是否被关
```

对流水线代码进行改造

```go
func main() {
	c0 := make(chan string)
	c1 := make(chan string)
	go sourceGopher(c0)
	go filterGopher(c0, c1)
	printGopher(c1)
}
func sourceGopher(downstream chan string) {
	for _, v := range []string{"hello world", "a bad apple", "goodbye all"} {
		downstream <- v
	}
	close(downstream)
}
func filterGopher(upstream, downstream chan string) {
	for {
		item, ok := <-upstream
		if !ok {
			close(downstream)
			return
		}
		if !strings.Contains(item, "bad") {
			downstream <- item
		}
	}
}
func printGopher(upstream chan string) {
	for v := range upstream {
		fmt.Println(v)
	}
}
```

从通道里面读取值，直到它关闭为止。也可以使用 range 关键字达到该目的。

```go
func main() {
	c0 := make(chan string)
	c1 := make(chan string)
	go sourceGopher(c0)
	go filterGopher(c0, c1)
	printGopher(c1)
}
func sourceGopher(downstream chan string) {
	for _, v := range []string{"hello world", "a bad apple", "goodbye all"} {
		downstream <- v
	}
	close(downstream)
}
func filterGopher(upstream, downstream chan string) {
	for item := range upstream {
		if !strings.Contains(item, "bad") {
			downstream <- item
		}
	}
	close(downstream)
}
func printGopher(upstream chan string) {
	for v := range upstream {
		fmt.Println(v)
	}
}
```
