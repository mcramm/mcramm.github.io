---
layout: post
---

Let\'s look at the different flavors of function composition
in Clojure.

## Comp
There is a function in clojure.core called `comp` that takes a set of
functions and returns a function that is a composition of those functions:

{% highlight clojure %}
    (defn doubler [x]
      (* x 2))

    (defn incrementer [x]
      (+ x 1))

    (def doubler-and-incrementer (comp incrementer doubler))

    (map doubler-and-incrementer [1 2 3 4]) ; => [3 5 7 9]
{% endhighlight %}

> `clojure.core/inc` exists, but I recreate it here to be explicit

Note that when composing functions with comp, they are applied right to left to
their arguments:

{% highlight clojure %}
    (def incrementer-and-doubler (comp doubler incrementer))

    (map incrementer-and-doubler [1 2 3 4]) ; => [4 6 8 10]
{% endhighlight %}


## Partial

Another function in clojure.core is `partial` that takes a function and some
arguments to that function and returns a new function that will accept the
remaining number of arguments. This can be useful when combined with comp and
writing a custom reducer:

{% highlight clojure %}
    (def incrementer-and-doubler (comp (partial map doubler)
                                       (partial map incrementer)))

    (incrementer-and-doubler [1 2 3 4]) ; => [4 6 8 10]
{% endhighlight %}

> Clojure 1.7 will introduce transducers, which will likely become the idiomatic
> way of accomplishing this same task.

## Threading Macros

A more popular method of composition are the thread-first and
thread-last macros.

The thread-first macro evaluates the first expression then passes the result
into first argument of the next form, and the result of that into the first
argument of the next form and so on.

In other words, this:

{% highlight clojure %}
    (doubler (incrementer 2))
{% endhighlight %}

Is the same as this:

{% highlight clojure %}
    (-> 2 incrementer doubler)
{% endhighlight %}

Thread-last works the same way, but it passes the result of each expression into
the last element of each successive form.

{% highlight clojure %}
    (->> [1 2 3 4]
         (map incrementer)
              (map doubler))
{% endhighlight %}

Is the same as:

{% highlight clojure %}
    (map doubler (map incrementer [1 2 3 4]))
{% endhighlight %}
