# 1. 基本信息
```java
class User {
    long count = 0;
    void add() {
        for(int i = 0; i < 1000; i++) {
            count += 1;
        }
    }
}
```

对于这样的案例，add方法并不是线程安全的，问题主要在于变量count的可见性和count+=1的原子性，可见性问题，我们可以使用volatile，原子性问题，可以采用互斥锁。而相对于简单的原子问题，Java 为我们提供了一种无锁方案，就是使用原子类，比如下面这段代码

```java
class User {
    AtomicLong atomicLong = new AtomicLong(0);
    void add() {
        for(int i = 0; i < 10000; i++) {
            atomicLong.getAndIncrement();
        }
    }
}
```

通过这样的方式，我们就可以避免使用互斥锁带来的性能损耗问题。而这种方案是将上是通过硬件来实现的。实际上就是CAS，`compare and swap`的缩写，中文翻译成**<font style="color:#E8323C;">比较并交换</font>**,实现并发算法时常用到的一种技术。它包含三个操作数——内存位置V、预期原值A及更新值B。如下图：

![CAS原理](https://cdn.nlark.com/yuque/0/2022/png/22570918/1652714893363-6b57d54e-2149-414a-91d1-a846e72ffe73.png)

更新失败的线程不会被阻塞，而是被告知这一次的竞争失败，还可以继续尝试

CAS 是JDK提供的非阻塞原子操作，**<font style="color:#2F54EB;">他通过硬件保证了比较-更新的原子性</font>**，是**<font style="color:#2F54EB;">CPU的一条原子指令（</font>**`**<font style="color:#2F54EB;">cmpxchg指令</font>**`），当执行这条指令的时候，会首先判断当前系统是否是多核操作系统，如果是就给总线加锁，保证只有一个线程会对会对总线加锁成功，成功之后会执行CAS操作。总而言之，CAS的原子性实质上是通过操作系统实现的。

在上一个例子中，我们所说的使用原子类来解决我们的原子性问题，而他的底层实际上是调用Unsafe类中的方法，而这些方法都是native方法，也就是这些都是调用底层操作系统的方法。

通过观察原子类的属性，我们发现了里面有unsafe类，还有使用`volatile`修饰的变量。

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661152933825-ed848785-8814-4fbb-bcc0-9120087ce31d.png)

自增方法如下，实际上就是调用unsafe中的方法。

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661152957591-2d138edc-d63e-4e51-80f6-18f77392a8f4.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661153039913-bfa822d4-43b3-49c7-9c89-39013cf1d3db.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661149851752-07242a78-5667-4621-958e-6ea0a81b0e8a.png)

通过这段代码的分析，我们就可以看出，原子类在执行自增操作的时候，在不断的进行自旋操作，而跳出自旋的依据就是通过CAS进行实现。但是这种方案也是存在问题的

+ 问题一：`ABA`问题

:::color4
如果说一个值从 A -----> B ------> A，comparaAndSet 是不会发现问题的。

:::

+ 问题二：由于是不断的进行自旋，就会导致循环时间过长
+ 问题三：只能保证一个共享变量的原子操作

# 2. Unsafe
Unsafe 是CAS的核心类，由于Java方法无法直接访问底层操作系统，需要本地（native）方法来访问，Unsafe相当于一个后门，基于该类可以直接操作特定内存的数据。

Unsafe类存在于`sun.misc`包中，其内部方法操作可以像C的指针一样直接操作内存，因此**<font style="color:#2F54EB;">Java中CAS操作的执行依赖于Unsafe类的方法</font>**。

Unsafe类中的所有方法都是`native`修饰的，也就是说Unsafe类中的方法都直接调用操作系统底层资源执行相应任务 。

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661149851752-07242a78-5667-4621-958e-6ea0a81b0e8a.png)

# 3. 基本类型原子类
## 3.1 类型
1. `AtomicInteger`：原子更新整型
2. `AtomicBoolean`：原子更新布尔类型
3. `AtomicLong`：原子更新长整型

## 3.2 常用API
```java
public final int get() // 获取当前的值
    
public final int getAndSet(int newValue); // 获取当前的值，并返回设置新的值

public final int getAndIncrement(); // 获取当前的值，并自增

public final int getAndDecrement(); // 获取当前的值，并自减

public final int getAndAdd(int delta); // 获取当前的值，并加上预期的值

boolean compareAndSet(int expect,int update); //如果是预期值，就以原子方式更新值
```

## 3.3 Case
```java
class MyNumber{
    AtomicInteger atomicInteger = new AtomicInteger();
    public void addPlusPlus(){
        atomicInteger.incrementAndGet();
    }
}

public class AtomicIntegerDemo {
    public static void main(String[] args) throws InterruptedException {
        MyNumber number = new MyNumber();
        CountDownLatch countDownLatch = new CountDownLatch(50);
        for(int i = 0; i < 50 ;i++) {
            new Thread(()->{
                number.addPlusPlus();
                countDownLatch.countDown();
            }).start();
        }
         /*
            方式1：
            如果说不加 这个sleep，main线程不会得到正确的答案，原因在于main线程太快了,但是这个2秒，可能会导致睡多了
          */
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        /*
        * 方式2：使用CountDownLatch
        * */
        countDownLatch.await();
        System.out.println(Thread.currentThread()+"\t"+number.atomicInteger.get());

    }
}

```

# 4. 数组类型原子类
:::info
通过这些原子类，我们可以实现原子化地更新数组中的每一个元素。数组通过构造方法传递进去，然后类会将该数组复制一份。

:::

## 4.1 类型
1. `AtomicIntegerArray`
    1. 原子更新整型数组里面的元素
2. `AtomicLongArray`
    1. 原子更新长整型数组中的元素
3. `AtomicReferenceArray`
    1. 原子更新引用类型数组中的元素

## 4.2 常用API
```java
int addAndGet(int i,int delta);

boolean compareAndSet(int i,int expect,int update);
```

# 5. 引用类型原子类
## 5.1 类型
1. `AtomicReference`
2. `AtomicStampedReference`
    1. 携带版本号的引用类型原子类，可以解决ABA问题
    2. 解决了修改了几次
3. `AtomicMarkedReference`
    1. 原子更新带有标识位的引用类型对象，不建议用它解决ABA问题
    2. 解决了是否修改过
    3. 相当于一次性筷子

## 5.2 Case
```java
public class AtomicMarkableReferenceDemo {
    static AtomicMarkableReference reference = new AtomicMarkableReference(100, false);
    public static void main(String[] args) {
        new Thread(()->{
            boolean flag = reference.isMarked();
            System.out.println(Thread.currentThread().getName()+"\t"+"---默认修改表示位："+flag);
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            boolean f = reference.compareAndSet(100, 102, flag, !flag);
            System.out.println(Thread.currentThread().getName()+"\t"+"---是否修改成功："+f);
        },"t1").start();

        new Thread(()->{
            boolean flag = reference.isMarked();
            System.out.println(Thread.currentThread().getName()+"\t"+"---默认修改表示位："+flag);
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            boolean f = reference.compareAndSet(100, 103, flag, !flag);
            System.out.println(Thread.currentThread().getName()+"\t"+"---是否修改成功："+f);
        },"t2").start();

    }
}
```

# 6. 对象属性修改原子类
## 6.1 基本信息
1. `AtomicIntegerFieldUpdater`
    1. 原子更新对象中int类型字段的值
2. `AtomicLongFieldUpdater`
    1. 原子更新对象中Long类型字段的值
3. `AtomicReferenceFieldUpdater`
    1. 原子更新对象中引用类型字段的值

## 6.2 使用
1. 使用目的：以一种线程安全的方式操作非线程安全对象内的某些字段
2. 使用要求
    1. 更新的对象属性必须使用 `public volatile `修饰符
    2. 因为对象的属性修改类型原子类都是抽象类，所以每次使用都必须使用静态方法`newUpdater() `创建一个更新器，并且需要设置想要更新的类和属性

## 6.3 Case
```java
class MyVar {
    public volatile Boolean isInit = Boolean.FALSE;
    AtomicReferenceFieldUpdater fieldUpdater= AtomicReferenceFieldUpdater.newUpdater(MyVar.class, Boolean.class,"isInit");
    public void init(MyVar myVar) {
        if (fieldUpdater.compareAndSet(myVar, Boolean.FALSE, Boolean.TRUE)){
            System.out.println(Thread.currentThread().getName()+"\t"+"------start init");
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName()+"\t-----end init");
        } else {
            System.out.println(Thread.currentThread().getName()+"\t-----抢夺失败，已经有线程正在修改中");
        }
    }
}

public class AtomicReferenceFieldUpdaterDemo {
    public static void main(String[] args) {
        MyVar myVar = new MyVar();
        for(int i = 0; i < 5; i++) {
            new Thread(()->{
                myVar.init(myVar);
            },String.valueOf(i)).start();
        }
    }
}
```

# 7. 原子操作增强类
## 01 基本信息
1. `DoubleAccumulator`
2. `DoubleAdder`
3. `LongAccmulator`
4. `LongAdder`                                                                                                                                                              

## 02 Case
```java
public class LongAdderAPIDemo {
    public static void main(String[] args) {

        LongAdder longAdder = new LongAdder();// 只能做加法
        longAdder.increment();
        longAdder.increment();
        System.out.println(longAdder.longValue());
        // 提供了自定义的两个数的操作
        LongAccumulator longAccumulator = new LongAccumulator((x,y)->{
            return x + y;
        },5);// 从 多少 开始加
        
        longAccumulator.accumulate(2);
        longAccumulator.accumulate(1);
        longAccumulator.accumulate(3);
        longAccumulator.accumulate(4);
        System.out.println(longAccumulator.longValue());

    }
}
```

                                       

