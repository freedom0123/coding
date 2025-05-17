---
title: Spring 整合 MyBatis
description: 深度分析Spring 整合 MyBatis
date: false
tag:
- Spring
---

# 整合 MyBatis

```
MapperFactoryBean
```

```java
@Override
public T getObject() throws Exception {
    return getSqlSession().getMapper(this.mapperInterface);
}
```

