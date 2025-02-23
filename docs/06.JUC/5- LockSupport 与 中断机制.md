# 1. 什么是中断
**<font style="color:#2F54EB;">一个线程不应该由其他线程来强制中断或停止，而是应该由线程自己自行停止</font>**。因为，一个线程被强制停止，不会保证线程的资源正常释放，而是占用着资源进入睡眠状态。

**<font style="color:#2F54EB;">在Java中没有办法立即停止一条线程，然而停止线程却显得尤为重要，如取消一个耗时操作。因此，Java提供了一种用于停止线程的机制——中断。</font>**

**<font style="color:#E8323C;">中断只是一种协作机制，仅仅是修改线程的中断标志位，不会立刻停止线程。</font>**

# 2. 中断相关的API方法
![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1652232298052-12371d13-55b8-4e00-8791-fd33b66f18de.png)

## 2.1 interrupt
> **<font style="color:#E8323C;">实例方法</font>**
>

1. 如果说线程处于正常活动状态，**<font style="color:#2F54EB;">仅仅是设置线程的中断状态为true</font>**，不会立刻停止线程。
2. 如果线程处于被阻塞状态（例如处于sleep, wait, join 等状态），在别的线程中调用当前线程对象的`interrupt`方法，**那么线程将立即退出被阻塞状态**，并抛出一个InterruptedException异常。`<font style="color:#000000;">Thread</font>._currentThread_().interrupt()`
3. 在这里抛出异常的时候，线程的标志位会被清除，也就是重置为false

```java
Thread t1 = new Thread(() -> {
        while (true) {
            if (Thread.currentThread().isInterrupted()) {
                System.out.println(Thread.currentThread().getName() + "\t" + "被中断");
                break;
            }
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                // 解决方案：Thread.currentThread().interrupt();
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName() + "正在执行");
        }
    }, "t1");
    t1.start();
    try {
        TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    new Thread(() -> {
       t1.interrupt();
        System.out.println("我已设置 t1 线程的中断标志位为 true");
    },"t2").start();
```

![](https://cdn.nlark.com/yuque/0/2022/png/22570918/1652235630339-480558f5-063f-40f8-a546-65a214f76498.png)

## 2.2 interrupted
> **<font style="color:#E8323C;">静态方法</font>**
>

首先会返回线程的中断状态，其次，**清除线程的中断状态**（相当于将中断标志位设置为false）

## 2.3 isInterrupted
> **<font style="color:#E8323C;">实例方法</font>**
>

返回当前线程的中断标志位，不会清除线程的中断状态。

# 3. 如何使用中断标志停止线程
## 3.1 方式一：volatile 变量
```java
public class InterruptedDemo {
    static volatile boolean flag = false;
    public static void main(String[] args) {
        new Thread(() -> {
            while(true) {
                if(flag) {
                    System.out.println(Thread.currentThread().getName()+"\t"+"被中断");
                    break;
                }
                System.out.println(Thread.currentThread().getName()+"正在执行");
            }
        },"t1").start();
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        new Thread(() -> {
           flag = true;
            System.out.println("我已设置 t1 线程的中断标志位为 true");
        },"t2").start();

    }
}
```

## 3.2 方式二：AtomicBoolean
```java
public class InterruptedDemo {
    static volatile boolean flag = false;
    static AtomicBoolean atomicBoolean = new AtomicBoolean(false);
    public static void main(String[] args) {
        new Thread(() -> {
            while(true) {
                if(atomicBoolean.get()) {
                    System.out.println(Thread.currentThread().getName()+"\t"+"被中断");
                    break;
                }
                System.out.println(Thread.currentThread().getName()+"正在执行");
            }
        },"t1").start();
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        new Thread(() -> {
            atomicBoolean.set(true);
            System.out.println("我已设置 t1 线程的中断标志位为 true");
        },"t2").start();

    }
}
```

## 3.3 中断API
```java
public class InterruptedDemo {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            while (true) {
                if (Thread.currentThread().isInterrupted()) {
                    System.out.println(Thread.currentThread().getName() + "\t" + "被中断");
                    break;
                }
                System.out.println(Thread.currentThread().getName() + "正在执行");
            }
        }, "t1");
        t1.start();
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        new Thread(() -> {
           t1.interrupt();
            System.out.println("我已设置 t1 线程的中断标志位为 true");
        },"t2").start();

    }
}
```

# 4. LockSupport
1. `LockSupport`是用来**<font style="color:#2F54EB;">创建锁和其他同步类的基本线程阻塞原语</font>**。**<font style="color:#2F54EB;">使用一种名为</font>**`**<font style="color:#2F54EB;">Permit（许可证）</font>**`**<font style="color:#2F54EB;">的概念来做到阻塞和唤醒线程的功能。每个线程都有一个许可</font>**。
2. LockSupport 中的 park() 和 unpark() 的作用分别是阻塞线程和解除阻塞线程
+ `**park()**`：`permit`默认是 0，所以一开始调用park方法，当前线程就会阻塞，直到别的线程将当前线程的permit设置为1时，park方法会被唤醒，然后再将permit再次设置为0并放回。
+ `**unpark(thread)**`： 调用`unpark(thread)`方法之后， 会将 thread 线程的许可permit设置成为1（多次调用该方法，permit还是1，不会进行累加），会自动唤醒thread线程。也就是说之前阻塞的park() 会立即返回
+ 无需关心先`park`还是`unpark`

```java
public class Demo {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + "\t" + "\tcome in");
            LockSupport.park();
            System.out.println(Thread.currentThread().getName() + "\t" + "\t被唤醒");
        }, "t1");
        t1.start();
        new Thread(()-> {
            LockSupport.unpark(t1);
            System.out.println(Thread.currentThread().getName()+"\t"+"\t发出通知");
        },"t2").start();
    }
}
```

```java
-------------------------------------故障----------------------------------------------
public class Demo {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + "\t" + "\tcome in");
            LockSupport.park();
            LockSupport.park();
            System.out.println(Thread.currentThread().getName() + "\t" + "\t被唤醒");
        }, "t1");
        t1.start();
        new Thread(()-> {
           // 只会生效一次
           LockSupport.unpark(t1);
           LockSupport.unpark(t1);
           LockSupport.unpark(t1);
           LockSupport.unpark(t1);
           LockSupport.unpark(t1);
            System.out.println(Thread.currentThread().getName()+"\t"+"\t发出通知");
        },"t2").start();
    }
}
-----------------------------------解决-------------------------------------------------
public class Demo {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + "\t" + "\tcome in");
            LockSupport.park();
            LockSupport.park();
            System.out.println(Thread.currentThread().getName() + "\t" + "\t被唤醒");
        }, "t1");
        t1.start();
        new Thread(()-> {
           LockSupport.unpark(t1);
           LockSupport.unpark(t1);
           LockSupport.unpark(t1);
           LockSupport.unpark(t1);
           LockSupport.unpark(t1);
            System.out.println(Thread.currentThread().getName()+"\t"+"\t发出通知");
        },"t2").start();
        new Thread(() -> {
            LockSupport.unpark(t1);
        }).start();
    }
}

```

# 5.  线程等待和唤醒机制
> 方式一：**使用Object中的wait()方法让线程等待，使用Object中的notify()方法唤醒线程**
>

+ wait和notify方法必须要在同步块或者方法里面，且成对出现使用
+ 先 wait 后 notify 才正确。

```java
public class Demo {
    static Object object = new Object();
    static ReentrantLock lock = new ReentrantLock();

    public static void main(String[] args) {
        new Thread(()-> {
            synchronized (object){
                System.out.println(Thread.currentThread().getName()+"\t"+"\tcome in，开始睡眠");

                try {
                    object.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName()+"\t"+"\t被唤醒");
            }

        },"t1").start();

        new Thread(()-> {
           synchronized (object){
               System.out.println(Thread.currentThread().getName()+"\t"+"\t发出通知");
               object.notify();
           }

        },"t2").start();

    }
}
```

> 方式二：使用JUC包中Condition的await()方法让线程等待，使用signal()方法唤醒线程
>

+ Condition 中线程等待 和 唤醒方法之前，需要先获取锁
+ 一定要先await 后 signal 方法

```java
public class Demo {
    static Object object = new Object();
    static ReentrantLock lock = new ReentrantLock();


    public static void main(String[] args) {
        Condition condition = lock.newCondition();
        new Thread(()-> {
            lock.lock();
            System.out.println(Thread.currentThread().getName()+"\t"+"\tcome in");
            try {
                condition.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }finally {
                lock.unlock();
            }
            System.out.println(Thread.currentThread().getName()+"\t"+"\t被唤醒");


        },"t1").start();

        new Thread(()-> {
            lock.lock();
            condition.signal();
            System.out.println(Thread.currentThread().getName()+"\t"+"\t发出通知");
            lock.unlock();
        },"t2").start();

    }
}
```

> 方式三：LockSupport类中的park等待和unpark唤醒
>

```java
public class Demo {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + "\t" + "\tcome in");
            LockSupport.park();
            System.out.println(Thread.currentThread().getName() + "\t" + "\t被唤醒");
        }, "t1");
        t1.start();
        new Thread(()-> {
           LockSupport.unpark(t1);
            System.out.println(Thread.currentThread().getName()+"\t"+"\t发出通知");
        },"t2").start();
    }
}
```

