---
          description: 记录常用的 Maven 相关技巧
---

# Maven

## 一、多模块项目的构建

在多模块的使用场景中，通过插件实现统一版本管理

```xml
<properties>
    <revision>1.0.0</revision>
    <flatten-maven-plugin.version>1.6.0</flatten-maven-plugin.version>
</properties>
<build>
    <plugins>
        <!-- 统一 revision 版本 -->
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>flatten-maven-plugin</artifactId>
            <version>${flatten-maven-plugin.version}</version>
            <configuration>
                <flattenMode>resolveCiFriendliesOnly</flattenMode>
                <updatePomFile>true</updatePomFile>
            </configuration>
            <executions>
                <execution>
                    <goals>
                        <goal>flatten</goal>
                    </goals>
                    <id>flatten</id>
                    <phase>process-resources</phase>
                </execution>
                <execution>
                    <goals>
                        <goal>clean</goal>
                    </goals>
                    <id>flatten.clean</id>
                    <phase>clean</phase>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## 二、Git 版本

在 Jar 包中对应的 version.info 文件之中，记录对应的 Git 版本信息

```xml
<plugin>
    <groupId>pl.project13.maven</groupId>
    <artifactId>git-commit-id-plugin</artifactId>
    <version>4.0.3</version>
    <executions>
        <execution>
            <goals>
                <goal>revision</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <verbose>true</verbose>
        <dateFormat>yyyyMMddHHmmss</dateFormat>
        <generateGitPropertiesFile>true</generateGitPropertiesFile>
        <generateGitPropertiesFilename>${project.build.outputDirectory}/version.info
        </generateGitPropertiesFilename>
        <failOnNoGitDirectory>false</failOnNoGitDirectory>
        <offline>true</offline>
    </configuration>
</plugin>
```

## 三、打包

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.1.0</version>
    <configuration>
        <excludes>
            <exclude>application.yaml</exclude>
            <exclude>application.properties</exclude>
        </excludes>
    </configuration>
</plugin>

<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.1</version>
    <configuration>
        <source>${java.version}</source>
        <target>${java.version}</target>
        <encoding>${project.build.sourceEncoding}</encoding>
    </configuration>
</plugin>
```

