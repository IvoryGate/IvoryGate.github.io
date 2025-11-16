---
Date: Thu Sep 18 2025 22:29:29 GMT+0800
tags:
  - python
---
# Python创建多线程的方法
1. 准备一个函数
```python
def my_func(a,b):
	do_craw(a,b)
```
2. 怎样创建一个线程
```python
import threading 
t = threading.Thread(target=my_func, args=(100, 200))
# target传函数名（并未调用），args传参数
```
3. 启动线程
```python
t.start()
```
4. 等待结束
```python
t.join()
```

# 代码实现
`blog_spider.py`文件
```python
from rich import print
import requests

urls = [
    f"https://www.cnblogs.com/#p{page}"
    for page in range(1,50+1)
]

# print(urls)
def craw(url):
    r = requests.get(url)
    print(url, len(r.text))
    
# craw(urls[0])
```

`01_multi_thread_craw.py`文件
```python
import blog_spider
import threading
import time

def single_thread():
    for url in blog_spider.urls:
        blog_spider.craw(url=url)

def multi_thread():
    threads = []
    for url in blog_spider.urls:
        threads.append(
            threading.Thread(target=blog_spider.craw,args=(url,))
        )
        
    for thread in threads:
        thread.start()

    for thread in threads:
        thread.join()

  

if __name__=="__main__":
    start_time =time.time()
    single_thread()
    end_time = time.time()
    print("single thread cost:", end_time - start_time, "seconds")
    start_time =time.time()
    multi_thread()
    end_time = time.time()
    print("multi thread cost:", end_time - start_time, "seconds")
```

