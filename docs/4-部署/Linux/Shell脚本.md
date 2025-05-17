---
description: 介绍 Shell 脚本的常用语法
---

# Shell 脚本

下面介绍一下 Shell 脚本的常用写法

## 语法

### 注释

:::code-group

```sh [单行注释]
# 单行注释
```

```sh [多行注释]
:<<EOF
注释内容
EOF
```

:::

### 变量

:::=tabs
::定义变量

```sh
# 定义变量
name=''
```

::使用变量

```sh
# echo 是 shell 之中用来进行输出的
echo ${变量名}
```

::只读变量

```sh
# 方式一
readonly 变量名
# 方式二
declare -r 变量名
```

::删除变量

```sh
unset 变量名
```

::外部变量

除了在 shell 文件之中定义变量之外，还可以由外部传入.

> 注意，这里是从 1 开始的，${0} 用来表示 shell 的路径

```sh
# 定义 shell 脚本，内容如下
echo ${1}
```

在执行时，就可以通过：`./a.sh 12`  将 12 赋值给了 `${1}`

:::

### 字符串

字符串可以用单引号，也可以用双引号，也可以不用引号。单引号与双引号的区别：

- 单引号中的内容会原样输出，不会执行、不会取变量；
- 双引号中的内容可以执行、可以取变量；

```sh
name='coding'
name1='${name}'
# 输出：${name}
echo ${name1};

name2="${name}"
# 输出：coding
echo ${name2};

# 获取字符串的长度
length=${#name};
echo ${length};

# 截取字符串
echo ${name:0:5}
```

### 数组

:::=tabs
::定义数组

元素之间使用空格进行隔开

```sh
list=(1 'coding 666' 2);
```

::获取元素

```sh
# 获取某个元素的值
${list[0]}
# 获取整个数组的值
${list[@]}
${list[*]}
```

::数组长度

```sh
${#list[@]}
${#list[*]}
```

:::

### expr

expr 命令用来求表达式的值，格式为：

```sh
expr 表达式

# 获取表达式的结果
`expr 表达式`

${expr 表达式}
```

### 判断语句

:::=tabs
::if

```sh
if condition
then
	语句
fi

```

::示例

```sh
if condition
then
	语句
else
	语句
```

:::



