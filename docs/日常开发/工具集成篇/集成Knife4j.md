---
date: 2025-03-01
---

# Knife4j

## 前言
最近发现了一款新的接口文档生成，比Swagger 的 UI 好看多了，这里简单介绍一下集成方式

官网链接：https://doc.xiaominfo.com/docs/quick-start

版本：

```xml
<dependency>
    <groupId>com.github.xiaoymin</groupId> <!-- 接口文档 UI：knife4j -->
    <artifactId>knife4j-openapi2-spring-boot-starter</artifactId>
    <version>4.5.0</version>
</dependency>
```

:::code-group

```java [配置类]
@ConfigurationProperties(prefix = "swagger")
@Data
public class SwaggerProperties {

    /**
     * 标题
     */
    private String title;
    /**
     * 描述
     */
    private String description;
    /**
     * 作者
     */
    private String author;
    /**
     * 版本
     */
    private String version;
}
```

```yaml [配置信息]
springdoc:
  api-docs:
    enabled: true
    path: /v3/api-docs
  swagger-ui:
    enabled: true
    path: /swagger-ui
  default-flat-param-object: false
knife4j:
  # 开启 knife4j 增强
  enable: true
  setting:
    language: zh_cn
  # 设置加密
  basic:
    enable: true
    username: root
    password: 123456
  # 如果设置为 true，则会屏蔽所有的接口文档
  production: false
swagger:
  title: Coding-Web
  author: coding
  description: "测试集成 Knife4j"
  version: "v1.0"
```

```java
package com.coding.web.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.*;
import org.springdoc.core.customizers.OpenApiBuilderCustomizer;
import org.springdoc.core.customizers.ServerBaseUrlCustomizer;
import org.springdoc.core.providers.JavadocProvider;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpHeaders;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Configuration
@EnableConfigurationProperties({SwaggerProperties.class})
public class CodingSwaggerConfiguration {

    @Bean
    public OpenAPI createApi(SwaggerProperties properties) {
        Map<String, SecurityScheme> securitySchemas = buildSecuritySchemes();
        // 配置摘要信息
        Info info = new Info()
                .title(properties.getTitle())
                .description(properties.getDescription())
                .version(properties.getVersion())
                .contact(new Contact().name(properties.getAuthor()));
        OpenAPI openAPI = new OpenAPI()
                // 接口信息
                .info(info)
                // 接口安全配置
                .components(new Components().securitySchemes(securitySchemas))
                .addSecurityItem(new SecurityRequirement().addList(HttpHeaders.AUTHORIZATION));
        securitySchemas.keySet().forEach(key -> openAPI.addSecurityItem(new SecurityRequirement().addList(key)));
        return openAPI;
    }

    /**
     * 安全模式，这里配置通过请求头 Authorization 传递 token 参数
     */
    private Map<String, SecurityScheme> buildSecuritySchemes() {
        Map<String, SecurityScheme> securitySchemes = new HashMap<>();
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.APIKEY) // 类型
                .name(HttpHeaders.AUTHORIZATION) // 请求头的 name
                .in(SecurityScheme.In.HEADER); // token 所在位置
        securitySchemes.put(HttpHeaders.AUTHORIZATION, securityScheme);
        return securitySchemes;
    }

    /**
     * 自定义 OpenAPI 处理器
     */
    @Bean
    @Primary // 目的：以我们创建的 OpenAPIService Bean 为主，避免一键改包后，启动报错！
    public OpenAPIService openApiBuilder(Optional<OpenAPI> openAPI,
                                         SecurityService securityParser,
                                         SpringDocConfigProperties springDocConfigProperties,
                                         PropertyResolverUtils propertyResolverUtils,
                                         Optional<List<OpenApiBuilderCustomizer>> openApiBuilderCustomizers,
                                         Optional<List<ServerBaseUrlCustomizer>> serverBaseUrlCustomizers,
                                         Optional<JavadocProvider> javadocProvider) {
        return new OpenAPIService(openAPI, securityParser, springDocConfigProperties,
                propertyResolverUtils, openApiBuilderCustomizers, serverBaseUrlCustomizers, javadocProvider);
    }

    // ========== 分组 OpenAPI 配置 ==========

    /**
     * 所有模块的 API 分组
     */
    @Bean
    public GroupedOpenApi allGroupedOpenApi() {
        return buildGroupedOpenApi("all", "/**");
    }

    public static GroupedOpenApi buildGroupedOpenApi(String group, String path) {
        return GroupedOpenApi.builder()
                .group(group)
                .pathsToMatch(path)
                .addOperationCustomizer((operation, handlerMethod) -> operation.addParametersItem(buildSecurityHeaderParameter()))
                .build();
    }

    /**
     * 构建 Authorization 认证请求头参数
     * 解决 Knife4j <a href="https://gitee.com/xiaoym/knife4j/issues/I69QBU">Authorize 未生效，请求header里未包含参数</a>
     *
     * @return 认证参数
     */
    private static Parameter buildSecurityHeaderParameter() {
        return new Parameter()
                .name(HttpHeaders.AUTHORIZATION) // header 名
                .description("认证 Token") // 描述
                .in(String.valueOf(SecurityScheme.In.HEADER)) // 请求 header
                .schema(new StringSchema()._default("Bearer test1").description("认证 Token")); // 默认：使用用户编号为 1
    }
}

```

:::

