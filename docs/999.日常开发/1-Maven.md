# Maven

## 多模块项目的构建

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

