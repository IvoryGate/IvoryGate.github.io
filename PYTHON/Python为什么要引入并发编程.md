---
Date: Thu Sep 18 2025 22:29:29 GMT+0800
tags:
  - python
---
# 为什么要引入并发编程
答：为了提升速度
# 程序提速的方法
- 单线程串行
- 多线程并发
- 多CPU并行
- 多机器并行

![图片](./attachments/Pasted_image_20250128104156.png)

# python对并发编程的支持
- 多线程：threading，利用CPU和IO可以同时执行的原理，让CPU不会干巴巴等待IO完成
- 多进程：multiprocessing，利用多核CPU的能力，真正的并行执行任务
- 异步IO：asyncio，在单线程利用CPU和IO同时执行的原理，实现函数异步执行
- 使用Lock对资源进行加锁，防止冲突访问
- 使用Queue实现不同线程/进程之间的数据通信，实现生产者-消费者模式
- 使用线程池Pool/进程池Pool，简化线程/进程的任务提交、等待结束、获取结果
- 使用subprocess启动外部程序的进程，并进行输入输出交互
