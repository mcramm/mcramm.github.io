---
layout: post
---

[This commit](https://github.com/clojure/clojurescript/commit/571e156d2daa223dcef273106827e932283e2f93) was pushed up to Clojurescript core recently, adding a new
macro `specify`. This means we can now have instance-level implementations of
protocols on specific values:

{% highlight clojure %}
    (ns example1)
    (enable-console-print!)

    (defprotocol Listable
      (render [items]))


    (def elements
     (specify ["one" "two" "three"]
       Listable
       (render [items]
         (str
           "<ul>"
           (apply str (map #(str "<li>" % "</li>") items))
           "</ul>"))))

    (println (satisfies? Listable elements))
    ; true

    (println (satisfies? Listable ["one" "two" "three"])) ; false
    ; false

    (println (render elements))
    ; <ul><li>one</li><li>two</li><li>three</li></ul>

    (println elements)
    ; [one two three]

    (println (= elements ["one" "two" "three"]))
    ; true
    (println (identical? elements ["one" "two" "three"]))
    ; false
{% endhighlight %}

This is pretty important feature for Clojurescript. `extend-type` is still
powerful, but there is the odd time where you want to make a specific value
conform to an interface. Because we\'re on Javascript, we can get this level of
modularity without a huge performance cost.

Note that this relies on version `0.0-2138` of Clojurescript.

This change was authored by the indomitable [David Nolen](http://swannodette.github.io/) whose [latest open source offering](https://github.com/swannodette/om) in a Clojurescript interface over Facebook\'s [React](http://facebook.github.io/react/).
