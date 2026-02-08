---
title: git分布式版本控制工具
Date: Thu Sep 18 2025 22:29:29 GMT+0800
tags:
  - git
cover: /git0.webp
description: git分布式版本控制工具
---
# git分布式版本控制工具

## 学习目标

- [x] 了解Git的基本概念
- [x] 能够描述Git工作流程
- [x] 能够使用Git常用命令
- [x] 熟悉Git代码托管服务
- [x] 能够使用Idea操作Git

## 概述
### 应用场景
> 场景一：备份
> 
> 场景二：代码还原
> 
> 场景三：协同开发
> 
> 场景四：追溯问题代码源头

### 版本控制方的方法

>**集中式版本控制系统（Centralized Version Control Systems，CVCS）**
>
>版本库是集中放在中央服务器的，而干活的时候，用的都是自己的电脑，所以首先要从中央服务器哪里得到最新的版本，然后干活，干完后，需要把自己做完的活推送到中央服务器。
>
>例子🌰:SVN和CVS
>
>**分布式式版本控制系统（Distributed Version Control Systems，DVCS）**
>
>没有“中央服务器”，每个人的电脑上都是一个完整的版本库，工作的时候无需联网，因为版本库都在自己的电脑上。多人协作只需要各自修改然后推送给对方，就能看到对方的修改了。
>
>例子🌰:Git

**SVN工作流程**

![SVN_work_flow](../attachments/SVN_work_flow.svg)

**Git工作流程**

![git_work_flow](../attachments/git_work_flow.svg)

### Git的优势



## Git的安装与配置

### 下载与安装

在[官网](https://git-scm.com/)上下载Git并安装
没什么好说的，选择安装目录，一直点next直到安装😎

### 配置基本信息

**设置用户名和邮箱**
```shell
git config --global user.name "xxxxxxxxx" //引号里是自己的用户名
git config --global user.email "xxxxxxxxxxx" //引号里为自己的邮箱
```

`--global`为全局参数，加上表示对所有仓库生效，不加则仅对当前仓库生效

**保存用户名和密码**

```shell
git config --global credential.helper store
```

**查看配置信息**
```shell
git config --global --list
```

## 创建仓库

### 创建本地仓库

```shell
// 初始化当前目录
git init
// 指定项目名
git init <project-name>
```

### 从远程服务器上克隆仓库

```shell
git clone https://github.com/xxxx-xxxx/remote-repo.git
```

`git clone`后面是远程仓库的地址


## Git工作流
### 本地工作流示意图

![本地工作流](./attachments/git_local_work_flow.svg)

### Git的四个区域

| 区域                        | 描述                                                         |
| --------------------------- | ------------------------------------------------------------ |
| 工作区 (Working Directory)  | 当前看到的文件目录；                                         |
| 暂存区 (Staging Area/Index) | 一般存放在 `.git` 目录下的 index 文件中，暂时存储即将在下一次提交中包含的更改； |
| 本地仓库 (Repository)       | 工作区有一个隐藏目录 `.git`，这个不算工作区，而是 Git 的版本库； |
| 远程仓库 (Remote)           | 托管在远程服务器（如 GitHub, GitLab）的仓库。                |

### Git管理的文件的四种状态

| 状态               | 描述                             |
| ------------------ | -------------------------------- |
| 未追踪（Untrack）   | 新建的文件，还没有被git管理；|
| 已修改 (Modified)  | 修改了文件，但还没保存到暂存区； |
| 已暂存 (Staged)    | 把修改后的文件放到了暂存区；     |
| 已提交 (Committed) | 把暂存区的文件提交到了本地仓库。 |

### 添加和提交相关命令

```shell
// 添加指定文件到暂存区
git add <file>
//添加所有文件到暂存区
git add .
// 提交暂存区到本地仓库
git commit -m "message"
// 添加并提交（跳过 git add，仅限已跟踪文件）
git commit -am "message"
```

### 查看状态与历史

```shell
// 查看当前状态
git status
// 查看提交历史
git log --oneline (简洁模式)
// 查看文件差异
git diff (工作区 vs 暂存区) 
git diff <commit1> <commit2> (两个提交之间的差异)
```
