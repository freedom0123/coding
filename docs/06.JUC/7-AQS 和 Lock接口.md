# AQS

:::info
<font style="color:#000000;">AbstractQueuedSynchronizer</font>，AQS 是用来构建锁或者其他同步器组件的 重量级基础框架及整个JUC体系的基石，通过内置的FIFO队列来完成资源获取线程的排队工作，并通过一个int类型的变量state 表示持有锁的状态。

AQS = state + CLH 队列

:::

# 1. 基本信息
`AbstractQueuedSynchronizer`, 抽象的队列式的同步器，内部定义了很多锁相关的方法。在内部中维护了一个`**volatile int state**`**来代表共享资源是否被占用的标志位**，并用一个`FIFO`线程等待队列。

**<font style="color:#2F54EB;">同步器的主要使用方式是继承</font>**<font style="color:black;">，子类通过继承同步器并实现它的抽象方法来管理同步状态。</font>

**<font style="color:#2F54EB;">类推荐被定义为自定义同步组件的静态内部类</font>**<font style="color:black;">，同步器自身没有实现任何同步接口，它仅仅是定义了若干同步状态获取和释放的方法来供自定义同步组件使用，</font>**<font style="color:#2F54EB;">同步器既可以支持独占式地获取同步状态，也可以支持共享式地获取同步状态。</font>**同步器的设置是基于模板方法模式。

# 2. 内部结构
## 2.1 state
线程获取锁的两种方式

+ 独占模式，一旦被占用，其他线程就不能被占用。
+ 另外一种方式就是共享模式，一旦被占用，其他共享模式下的线程也能获取锁。

**<font style="color:#2F54EB;">所以这个state，不仅仅用来表示共享资源是否被占用，还用来表示线程占用的数量。</font>**

使用`volatile` 就保证了线程的可见性。通过CAS进行值的设置，保证原子性。这里还有一个直接设置State变量的方法，主要是在获取锁成功之后，进行锁释放的时候进行

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661155719982-558ef5a3-2683-4fc3-85e3-e77aff303427.png)

## 2.2 Node
```java
static final class Node {
       // 表示已共享模式的情况之下，共享锁
        static final Node SHARED = new Node();
    
        // 表示以 独占模式的情况之下，占用锁
        static final Node EXCLUSIVE = null;
    
       // 表示线程获取锁的请求已经取消了 cancelled
        static final int CANCELLED =  1;
    
        // 表示线程已经准备好了，就等资源释放了
        static final int SIGNAL    = -1;
    
       // 表示节点在等待队列之中，节点线程等待被唤醒
        static final int CONDITION = -2;
    
       // 只有在共享模式下才会被使用
        static final int PROPAGATE = -3;

        volatile int waitStatus;
    
        // 指向当前节点的前驱节点
        volatile Node prev;
    
        // 指向当前节点的后继节点
        volatile Node next;
        
        volatile Thread thread;

        Node nextWaiter;

        final boolean isShared() {
            return nextWaiter == SHARED;
        }

        final Node predecessor() throws NullPointerException {
            Node p = prev;
            if (p == null)
                throw new NullPointerException();
            else
                return p;
        }

        Node() {}

        Node(Thread thread, Node mode) {
            this.nextWaiter = mode;
            this.thread = thread;
        }

        Node(Thread thread, int waitStatus) {
            this.waitStatus = waitStatus;
            this.thread = thread;
        }
    }
```

## 2.3 CLH 双端队列
![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661170560868-105b7d03-2fd5-40af-b8a5-bd52f3730bb3.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1653915929813-3a446f2e-c02d-4f00-a325-5ea952ce2382.png)

# 3. 核心方法
1. 尝试获取锁，修改标志位，立即返回
2. 获取锁，愿意进入队列进行等待，直到放回
3. 释放锁

## 3.1 tryAcquire
:::color4
独占式获取同步状态

:::

> **继承类必须覆盖重写该方法，否则抛出异常**
>

```java
/**
* @param arg 参数表示对state的修改
* @Return 用来表示是否获取成功
**/
protected boolean tryAcquire(int arg) {
    
    throw new UnsupportedOperationException();
    
}
```

## 3.2 acquire
:::warning
`acquire `方法是AQS为我们提供的模板方法，主要是为了进行锁的获取操作，`tryAcquire`方法是我们必须要进行重写的方法，主要是为了尝试获取锁，完成状态的变化。如果说获取锁失败了，我们需要进入`addWaiter`方法中，先将该线程封装为一个节点，然后将该节点入队

+ 如果此时同步队列是空的，我们需要进入`enq`方法，在第一个循环之中，`CAS`设置头结点，之后`CAS`设置尾节点
+ 如果此时同步队列不为空，直接`CAS`设置尾节点

结束完`addWriter`方法之后，就会使得该节点已经插入到队列中，并获得该线程封装的节点，之后进入`acquireQueued`方法之中:

+ 如果说此时该节点的头节点是head，并且获取锁成功，设置当前节点为头节点
+ 如果说此时不是头节点或者获取锁失败，进入`shouldParkAfterFailedAcquire`

在该方法之后，我们会判断他前一个节点的等待状态，

+ 如果说是SIGNAL，就好好等待，将当前线程进行阻塞
+ 如果是callelled(1)状态，则移除
+ 其他状态节点，则通过CAS设置为SIGNAL

:::

> **所有继承类都不能重写**
>

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661213415276-83b29fa4-c125-49db-8837-481d37f7e650.png)

1. 如果说获取锁失败，将当前线程封装为一个Node，放入等待队列之中，如果说队列不为空，就CAS设置尾节点

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661214181358-3c4b7e80-1097-43d7-8c3c-0882102f5313.png)

:::success
我们发现在设置为尾节点的时候，需要使用CAS，如果说有三个线程ABC，A线程持有锁，B和C同时竞争失败，就要竞争tail节点，这个时候，为了保证线程安全性，正确添加为尾节点，需要使用CAS操作.

设置头节点不需要使用CAS，因为设置头节点的线程已经是获取锁成功的线程，这个时候只有一条线程，没有竞争。

:::

3. 如果说等待队列为空，直接调用`enq`方法将当前线程放入到的等待队列的尾部，这个方法中我们发现如果说这个队列的tail为空，说明队列中还没有元素，就要竞争设置头节点，但是只会发生一次。设置完成之后，在循环设置尾节点。

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661174691877-1f1236df-bcb9-4aa9-8b09-3e13d2dcfac7.png)

4. 添加成功之后，最终会返回一个Node节点，进入`acquireQueued()`方法，如果说它的前一个节点是head节点，并且获得锁，设置当前节点为头结点

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661175292061-05e4cacd-f99c-4531-a1ef-01ec48ed027b.png)

5. 如果获取锁失败了，首先我们获取前一个节点的等待状态
    1. 如果是被通知状态，return true，执行第6步中的方法，将线程进行阻塞
    2. 如果说是>0，让前一个节点不要进行排队了，直接让他出队，return false
    3. CAS设置前一个节点为等待状态，retrun false

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661175344573-923f1190-dce4-49a4-9246-907adb6e9e39.png)

6. 清除中断标志位，挂起该线程

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661175954183-6226a88a-7c20-453f-9ef9-e6ddbed9155e.png)

## 3.3 tryRelease
:::info
独占式释放同步状态

:::

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661214215191-14796ebf-0d8c-402d-867f-2398b965865e.png)

## 3.4 tryAcquireShared
:::info
共享式获取锁

:::

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661214356591-fa699aed-c330-4bc2-8ce7-1191c1211f0e.png)

## 3.5 tryReleaseShared
:::info
共享式释放锁

:::

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661214332641-0deafee2-22fc-446b-89e3-5423002c95f1.png)

## 3.6 isHeldExclusively
:::info
当前同步器是否被占用

:::

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661214432950-eb88b878-ffa8-4ddc-a0ab-5d5916e77906.png)

# 4. Lock 接口
## 4.1 基本信息
在`Lock`接口出现之前，Java程序是靠`synchronzied`关键字来实现锁功能的，而在Java SE5 之后，并发接口中新增加了Lock接口，提供和`synchronized`关键字相似的同步功能，**<font style="color:#1890FF;">只是在使用时需要显示的获取和释放锁</font>**，虽然说去少了隐式获取释放锁的便捷性，但是却**<font style="color:#1890FF;">拥有了锁获取和释放的可操作性以及超时获取锁等synchronized关键字不具备的同步特性</font>**。

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661169637948-55f662a5-2c69-4aa1-b9e1-5226c1e27f80.png)

```java
public interface Lock {
    // 获取锁，调用该方法当前线程将会获取锁，当锁获取之后，从该方法返回
    void lock();
    
    // 可中断获取锁
    void lockInterruptibly() throws InterruptedException;
    
    // 尝试非阻塞获取锁，一次性获取锁，如果获取成功则成功，如果说失败则失败
    boolean tryLock();
    
    // 超时获取锁，在超时时间之内，循环获取锁
    boolean tryLock(long time, TimeUnit unit) throws InterruptedException;
    
    // 释放锁
    void unlock();
    
    // 获取等待通知组件，该组件和当前的锁绑定，当前线程只有获取了锁，才能调用wait方法
    // 而调用之后，当前线程将释放锁
    Condition newCondition();
}
```

## 4.2 手写模拟
```java
public class SelfLock implements Lock {
    // AQS  私有 静态内部类
    private static class Sync extends AbstractQueuedSynchronizer {
        // 尝试获取锁
        @Override
        public boolean tryAcquire(int acquires) {
            if (compareAndSetState(0,1)) {
                // 设置执行者
                setExclusiveOwnerThread(Thread.currentThread());
                return true;
            }
            return false;
        }
        @Override
        public boolean tryRelease(int releases) {
            if(getState() == 0) {
                throw new IllegalMonitorStateException();
            }
            /**
             * 不用使用CAS，因为当前线程释放锁，说明当前线程已经持有锁
             * */
            setState(0);
            return true;
        }
        // 创建Condition 做wait notify
        Condition newCondition() {
            return new ConditionObject();
        }
        public boolean isLocked() {
            return getState() == 1;
        }
    }
    private final Sync sync = new Sync();
    @Override
    public void lock() {
        sync.acquire(1); // 模板方法
    }
    @Override
    public boolean tryLock() {
        return sync.tryAcquire(1);
    }
    @Override
    public boolean tryLock(long time, TimeUnit unit) throws InterruptedException {
        return sync.tryAcquireNanos(1,unit.toNanos(time));
    }
    @Override
    public void lockInterruptibly() throws InterruptedException {
        sync.acquireInterruptibly(1);
    }

    @Override
    public void unlock() {
        sync.release(1);
    }

    @Override
    public Condition newCondition() {
        return sync.newCondition();
    }

    public boolean isLocked() {
        return sync.isLocked();
    }
    public boolean hasQueue() {
        return sync.hasQueuedThreads();
    }
}
```



```java
public class SyncLockTest {
    static SelfLock selfLock = new SelfLock();

    public static void main(String[] args) throws InterruptedException {
        Thread a = new Thread(()->{
            testLock();
        },"a");
        Thread b = new Thread(()->{
            testLock();
        },"b");
        a.start();
        TimeUnit.SECONDS.sleep(1);
        b.start();

    }
    public static void testLock() {
        selfLock.lock();
        try {
            System.out.println("我获取到了锁" + Thread.currentThread().getName());
            while (true){

            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            selfLock.unlock();
        }
    }
}

```



## 4.3 可重入锁
1. 也可以叫做递归锁，指一个线程在外层获取了锁，进入内层方法会自动获取锁，前提是同一把锁。不会因为之前获取而没有释放而阻塞，能够在一定程度上避免死锁。
2. `sychronized`是隐式的重入锁。在 `synchronized`修饰的方法或者代码块内部，调用本类中其他有`sychronized`修饰的方法或者代码块，是永远可以获取锁的。

```java

Object object = new Object();
new Thread(() -> {
    synchronized (object) {
        System.out.println("--外层--");
        synchronized (object) {
            System.out.println("--内层--");
            synchronized (object) {
                System.out.println("--最内层--");
            }
        }
    }
}).start();

```

```java
public static synchronized void m1() {
    System.out.println("Day4.m1");
    m2();
}
public static synchronized void m2() {
    System.out.println("Day4.m2");
    m3();

}
public static synchronized void m3() {
    System.out.println("Day4.m3");
}

```

3. `lock`是显示的可重入锁

```java
Lock lock = new ReentrantLock();
new Thread(() -> {
    try {
        lock.lock();
        System.out.println(Thread.currentThread().getName()+"外层");
        try{
            lock.lock();
            System.out.println(Thread.currentThread().getName()+"内层");
        }finally {
            lock.unlock();
        }
    } finally {
        lock.unlock();
    }
},"t1").start();
```

## 4.4 ReetrantLock
### 01 属性
`ReetrantLock` 是基于AQS，在并发编程中他可以实现公平锁和非公平锁来对共享资源的同步，同时，和synchronized 一样，ReetrantLock 支持可重入，除此之外，ReetrantLock在调度上更加的灵活，支持更多丰富的功能。

在这个类中只有一个属性，并且这个属性还是内部类

```java
// 被final 修饰，说明一旦被初始化，就不能修改引用
private final Sync sync;
// 这是一个抽象类，等待子类重写
abstract static class Sync extends AbstractQueuedSynchronizer{

    abstract void lock();
    
    final boolean nonfairTryAcquire(int acquires) {
            final Thread current = Thread.currentThread();
            // 获取 state
            int c = getState();
            // 如果说state 为 0，说明还没有线程来占用
            if (c == 0) {
                if (compareAndSetState(0, acquires)) {
                    setExclusiveOwnerThread(current);
                    return true;
                }
            }
            else if (current == getExclusiveOwnerThread()) {
                // 当前线程是否是独占线程
                int nextc = c + acquires;
                if (nextc < 0) // overflow
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);
                return true;
            }
            return false;
        }
}
// 非公平锁
static final class NonfairSync extends Sync{}
// 公平锁
static final class FairSync extends Sync{}

```

:::info
按序排队公平锁，就是判断同步队列是否还有先驱节点的存在，如果没有先驱节点才能获取锁

先占先得非公平锁，是不管这件事的，只要能够抢获到同步状态就可以了。

:::

### 02 非公平锁
1. 抢占式获取锁，不管同步对列中是否有节点，加锁的时候直接CAS，可能会造成线程饿死的情况
2. 效率高,多个线程获取锁是通过“抢”
3. `<font style="color:#cc7832;">private final </font>ReentrantLock <font style="color:#9876aa;">lock </font>= <font style="color:#cc7832;">new </font>ReentrantLock(<font style="color:#cc7832;">false</font>)<font style="color:#cc7832;">;</font>`
4. **<font style="color:#1890FF;">默认就是非公平锁</font>**

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661171537437-1b284cb7-693b-452d-b0a5-068d938a978a.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661171808067-943b83f5-3231-4b99-b281-64c3aef714c8.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661171776338-7c6613a0-8410-421d-b501-c9449e09c70a.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661172014864-1930e9cb-c655-4c7d-bb30-71901de8f600.png)

### 03 公平锁
1. 不会造成线程饿死的情况，每个线程都有活干
2. 效率相对而言低，因为多个线程进行排队
3. `<font style="color:#cc7832;">private final </font>ReentrantLock <font style="color:#9876aa;">lock </font>= <font style="color:#cc7832;">new </font>ReentrantLock(<font style="color:#cc7832;">true</font>)<font style="color:#cc7832;">;</font>`

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661216030922-da7eff64-c881-4195-ad8c-73616e72e15d.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1661216056180-bdd2014a-aa67-491d-94b8-b7b34ef12c61.png)

### 04 面试题
> **<font style="background-color:#FADB14;">为什么默认是非公平锁？</font>**
>

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1652107343482-aec3b2f4-beec-4cc6-ba8e-c7fcdb22f70a.png)

> **<font style="background-color:#FADB14;">什么时候使用非公平锁？什么时候使用公平锁？</font>**
>

如果说为了更高的吞吐量，显然非公平锁比较适合，因为节省了很多线程切换的时间，吞吐量就上去了。否则使用公平锁，公平使用

