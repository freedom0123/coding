---
description: 介绍 K8S 的基本使用
---

# K8S

使用 Docker 安装 K8S

```yaml
docker run -d --privileged --restart=unless-stopped --name=kuboard-spray  -p 80:80/tcp -v /var/run/docker.sock:/var/run/docker.sock  -v ~/kuboard-spray-data:/data eipwork/kuboard-spray:latest-amd64
  # 如果抓不到这个镜像，可以尝试一下这个备用地址：
  # swr.cn-east-2.myhuaweicloud.com/kuboard/kuboard-spray:latest-amd64

```

