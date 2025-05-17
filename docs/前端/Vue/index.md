---
hidden: true
---

# Vue3

> 之前学习的都是 Vue2，最近新项目，前端用 Vue3 和 TypeScript ，这里就上手一下，顺便回顾一下之前的知识

官网链接：https://cn.vuejs.org/guide/quick-start.html

## 一、基础

在官网上，能够看到，对于 Vue3 的 API 风格偏好，分为了两类：选项式和组合式

- 选项式：Vue2 就是选项式，对于数据，方法分别是定义在了 data 和 methods 里面去了
- 组合式：将数据和方法放置在一块

在 Vue 2 之中，将响应式数据定义在 data 之中，而在 Vue3 之中，使用 ref 来创建响应式的数据

```js
const tem = ref(初始值)
```

在方法之中操作这个变量的时候，需要通过 `tem.value`  进行操作，而在模板之中，直接通过  `{{ tem }}` 即可使用

使用 `reactive` 来定义

