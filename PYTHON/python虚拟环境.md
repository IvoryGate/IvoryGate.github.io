---
Date: Thu Sep 18 2025 22:29:29 GMT+0800
tags:
  - python
---
# python虚拟环境
## 创建python虚拟环境

1. 使用venv模块，创建名为`myvenv`的虚拟环境

```bash
pyhton3 -m venv myvenv
```

2. 激活虚拟环境

```bash
# Windows
myvenv\Scripts\activate
# Linux/macOS
source myvenv/bin/activate
```

3. 管理依赖

```bash
# 安装包
pip install 包名
# 查看已安装的包
pip list
# 导出依赖到文件
pip freeze > requirements.txt
# 从文件安装依赖
pip install -r requirements.txt
```

4. 退出环境

```bash
deactivate
```
