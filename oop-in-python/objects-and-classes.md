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
and objects created from these classes are called instances.

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
it's other name is class **namespace** which is **distinct** from instances namespace of that class.

```python
print(MyClass.__dict__)
# -> 
{
'__module__': '__main__', 
'language': 'Python', 
'version': '3.9', 
'__dict__': <attribute '__dict__' of 'MyClass' objects>, 
'__weakref__': <attribute '__weakref__' of 'MyClass' objects>, 
'__doc__': None
}

obj1 = MyClass()
print(obj1.__dict__)
# -> {}
```

## Data attributes vs Function attributes
when attributes are functions, there is a difference.

```python
class MyClass:
    def hi(self):
        print('Hi)

obj1 = MyClass()

MyClass.hi  # -> <function MyClass.hi at 0x7fb91d8a8ee0>
obj1.hi     # -> <bound method MyClass.hi of <__main__.MyClass object at 0x7fb91d9a51f0>>
```

so what is a **bound method**? 

**method** is an actual object type in Python and like a function it is callable.
but unlike a function it is **bound** to some object, 
and that object is passed to the method as its **first parameter**.

methods like any objects have some attributes like **__self__** and **__func__** and calling 
**obj.method(args)** leads to something like **method.__func__(method.__self__, args)**

## Initializing Class Instances
when we initialize a class, by default Python does two separate things:
* creates a **new instance** of the class           ```obj = MyCLass()```
* **initializes** the namespace of the instance     ```obj.__dict__ -> {}```

we can provide a custom initializer method (**__init__**) that Python will use instead of its own.

so now as a recap on instantiating and initializing phases and class and instance attributes:

```python
class MyClass:
    language = 'Python'              # language is a class attribute in class namespace

    def __init__(self, version):     # __init__ is a class attribute in class namespace (as a function)
        self.version = version

obj1 = MyClass('3.9')
# 1. python creates a new instance with an empty namespace 
# (we can modify this step in __new__ which we will talk about)
# 2. it calls obj1.__init__('3.9') as a bound method and adds version to obj1's namespace
# obj1.__dict__ => {'version': '3.9'}
```

## Creating attributes in run-time
for data attribute and also function attribute we can use simply dot notation or setattr but to bind a method to an
object we can do like:

```python
from types import MethodType    # MethodType(function, object)

obj.say_hello = MethodType(lambda self: f'Hello {self.language}', obj)
```

## Properties
with consider Java OOP logic attributes that have getter and setter and accessing them directly is not possible are 
called **Properties**. but in Python we don't have real private attribute and as a convention we use an '_' prefix 
in names.

we can use **property** class to define properties in a class.

```python
class MyClass:
    def __init__(self, language):
        self.language = language

# using property class
class MyClass:
    def __init__(self, language):
        self._language = language
    
    def get_language(self):
        print('getter called')
        return self._language

    def set_language(self, value):
        print('setter called')
        self._language = value

    language = property(fget=get_language, fset=set_language) 
    # it has a fdel (for del and delattr) and doc (for docstring) too
```

notice that even if we add an attribute similar to property to the namespace of an instance 
Python still use class property when we call it :

```python
obj = MyClass('python')
obj.__dict__['language'] = 'something that is not property object'

print(obj.language) # getter called
```

so in conclude a **Property** in Python is a class level attribute that contains a **'property' object** 
that has info for what to use for getter and setter (and delete and docstring too)

## Property Decorator
property class also have methods (getter, setter, deleter) that can take a callable as an argument and return the 
instance with the appropriate method now set. so we can set a property like:

```python
x = property(fget=get_x, fset=set_x)

x = property()
x = x.getter(get_x)
x = x.setter(set_x)
```

or in our example:

```python
class MyClass:
    def __init__(self, language):
        self._language = language

    def language(self):
        return self._language
    
    language = property(language) # now we have a property with a getter (it's like decorator functionality)

    # so we can change above lines like:
    @property
    def language(self):
        return self._language
    
    # now for setter

    def set_language(self, value):
        self._language = value
    
    language = language.setter(set_language) # again decorator functionality

    @language.setter
    def language(self, value): # notice the name 'language' matters here
        self._language = value
    
    # the name language matters here because essentially '@' syntax 
    # decorates the function (here language) and assigns
    # it to the same variable (language)
```

in conclusion we can use property decorator like this:

```python
class Person:
    def __init__(self, age):
        self.age = age

    @property
    def age(self):
        """
        This is Person's age that should be a number equal or greater than zero
        """
        return self._age

    @age.setter
    def age(self, value):
        from numbers import Integral

        if not isinstance(value, Integral) or value < 0:
            raise ValueError
        self._age = value

    @age.deleter
    def age(self):
        self._age = 0
```

**[Hint]** although property class is a convenient way of creating instance property, it has some drawbacks.
first is **reusability** if we want same validation for instance several times in our project, repeating same logic
is tedious and error prone.
second is **extended behavior** which is sometimes needed.
in both cases we can use our custom **data descriptor**.

**[Hint]** property class is used to define **instance** properties, for creating **class** properties 
(like class attribute, but using accessor methods) we can use **metaclasses**.

## Class and Static Methods
if we want a function to be always bound to class itself not instances we can use **@classmethod** which uses 
meta-programming to achieve this.

```python
class MyClass:
    @classmethod
    def hi(cls):
        print(f'hi from {cls}')

MyClass.hi()    # hi from <class '__main__.MyClass'>
m = MyClass()
m.hi()          # hi from <class '__main__.MyClass'>
```

if we want a function in a class that **never** be bound to any object we use **static** methods 
with **@staticmethod** decorator. 

**[Hint]** it's almost always better to have these kind of functions (static methods) in module level.
