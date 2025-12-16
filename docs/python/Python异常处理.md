---
title: Python异常处理
date: Thu Sep 18 2025 22:29:29 GMT+0800
tags:
  - python
cover: /python0.webp
description: 本文将深入剖析Python异常处理
---
# Python异常处理

## 错误与异常

异常处理是Python中一种很常见，并且很重要的机制与代码规范。

通常来说，程序中的错误至少包括两种，一种是语法错误，另一种则是异常。

语法错误是指代码不符合编程规范，无法被识别与执行，例如：

```python
if __name__ == "__main__"
	print("hello python!")
```

if语句结尾缺少冒号，不符合Python的语法规范，所以程序就会报错`SyntaxError`。

```shell
Traceback (most recent call last):  
  File "path/main.py", line 1
    if __name__ == "__main__"
                             ^
SyntaxError: expected ':'
```

异常是指语法正确，也可以被执行，但是在执行的过程中出现错误，此时就会抛出异常，例如：

```python
1 / 0
```

```shell
Traceback (most recent call last):
  File "path/main.py", line 1, in <module>
    1 / 0
    ~~^~~
ZeroDivisionError: division by zero
```

```python
fish * 2
```

```shell
Traceback (most recent call last):
  File "path/main.py", line 1, in <module>
    fish * 2
    ^^^^
NameError: name 'fish' is not defined
```

```python
1 + (2,)
```

```shell
Traceback (most recent call last):
  File "path/main.py", line 1, in <module>
    1 + (2,)
    ~~^~~~~~
TypeError: unsupported operand type(s) for +: 'int' and 'tuple'
```

在上面的例子中，由于做除法时分母不能为0，未定义的变量不能参与运算，也不能用一个整型和一个元组做加法运算。故当程序运行到这些地方时，就会抛出异常，并终止程序。像是上面例子中的`ZeroDivisionError`、`NameError`，`TypeError`就是一些常见的异常类型，此外，python中还有许多异常类型，可以在[相关文档](https://docs.python.org/3/library/exceptions.html#bltin-exceptions)中查看，在本文最后，也附上了一个python异常类型的[[#python中的异常类型|列表]]。除了python给出的异常，我们还可以自定义异常，这一部分内容会在后文提到。

## 异常的处理

异常的处理就是为了在出现异常时，保证程序可以继续执行下去。我们使用`try`和`expect`来处理异常。



## 自定义异常

## 异常的使用场景

## python中的异常类型

```shell
BaseException
 +-- SystemExit
 +-- KeyboardInterrupt
 +-- GeneratorExit
 +-- Exception
      +-- StopIteration
      +-- StopAsyncIteration
      +-- ArithmeticError
      |    +-- FloatingPointError
      |    +-- OverflowError
      |    +-- ZeroDivisionError
      +-- AssertionError
      +-- AttributeError
      +-- BufferError
      +-- EOFError
      +-- ImportError
      |    +-- ModuleNotFoundError
      +-- LookupError
      |    +-- IndexError
      |    +-- KeyError
      +-- MemoryError
      +-- NameError
      |    +-- UnboundLocalError
      +-- OSError
      |    +-- BlockingIOError
      |    +-- ChildProcessError
      |    +-- ConnectionError
      |    |    +-- BrokenPipeError
      |    |    +-- ConnectionAbortedError
      |    |    +-- ConnectionRefusedError
      |    |    +-- ConnectionResetError
      |    +-- FileExistsError
      |    +-- FileNotFoundError
      |    +-- InterruptedError
      |    +-- IsADirectoryError
      |    +-- NotADirectoryError
      |    +-- PermissionError
      |    +-- ProcessLookupError
      |    +-- TimeoutError
      +-- ReferenceError
      +-- RuntimeError
      |    +-- NotImplementedError
      |    +-- RecursionError
      +-- SyntaxError
      |    +-- IndentationError
      |         +-- TabError
      +-- SystemError
      +-- TypeError
      +-- ValueError
      |    +-- UnicodeError
      |         +-- UnicodeDecodeError
      |         +-- UnicodeEncodeError
      |         +-- UnicodeTranslateError
      +-- Warning
           +-- DeprecationWarning
           +-- PendingDeprecationWarning
           +-- RuntimeWarning
           +-- SyntaxWarning
           +-- UserWarning
           +-- FutureWarning
           +-- ImportWarning
           +-- UnicodeWarning
           +-- BytesWarning
           +-- ResourceWarning
```