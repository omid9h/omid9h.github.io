---
layout: default
title: Objects and Classes
parent: OOP in Python
nav_order: 1
---

# Objects and Classes
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## What is an Object
basically an Object is a **Container** which contains **Data** (or State or Attribute) and **Functionality** (or Behavior)

## Creating an Object
we use a **class** as a template or blueprint to create objects. these classes in Python also called **type**, 
and objects created fron these classes are called instances.

classes are **themselves** objects. they have attributes like name and behavior like create an instance.
they are created from **type metaclass**.

when we have a class definition in our code like:

```python
class MyClass:
    pass
```

it's actually run by Python in compile time 
(if for example the module this class definition resides in, has been imported) 
and Python creates an MyClass object of type type, and provides us certain attributes and methods by default like:

```python
MyClass.__name__    # (state)
MyClass()           # (behavior)
```

## Class Attributes
defining class attributes (an not instance attributes)

```python
class MyClass:
    language = 'Python'
    version = '3.9'
```

we can get values of attributes of any objects with **getattr**
and set values with **setattr**

```python
# getattr(object_symbol, attribute_name, optional_default)
getattr(MyClass, 'language', 'N/A') # -> Python
setattr(MyClass, 'version', '3.10')
```

another way is **dot notation** for get and set values

```python
MyClass.language # -> python
MyClass.x        # -> AttributeError exception
MyClass.x = 10
```

these states are stored in a dictionary that we can access via **__dict__**

```python
MyClass.__dict__
```

it returns a dictionary from type **mappingproxy** 
it's not from type dict but it's a read-only 
(better we say it's not directly mutable but can be change with setattr though), all-key-string dictionary.

