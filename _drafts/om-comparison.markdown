---
layout: post
---

In my [last post](http://mcramm.com/2014/01/26/react-intro.html) I built a simple text manipulation widget with [React](http://facebook.github.io/react/).
As promised, I\'ve built the same widget in [Om](), a Clojurescript library that
sits on top of React.

If you want to follow along, you\'ll need to install Leiningen and run:

{% highlight bash %}
    lein new mies-om om-intro
{% endhighlight %}

`cd` into the new directory and make your `project.clj` look like the following:
{% highlight clojure %}
    (defproject om-intro "0.1.0-SNAPSHOT"
      :description "FIXME: write this!"
      :url "http://example.com/FIXME"
     
      :dependencies [[org.clojure/clojure "1.5.1"]
                     [org.clojure/clojurescript "0.0-2138"]
                     [org.clojure/core.async "0.1.267.0-0d7780-alpha"]
                     [om "0.3.1"]
                     [com.facebook/react "0.8.0.1"]]
     
      :plugins [[lein-cljsbuild "1.0.1"]]
     
      :source-paths ["src"]
     
      :cljsbuild {
        :builds [{:id "dev"
                  :source-paths ["src"]
                  :compiler {
                    :output-to "om_intro.js"
                    :output-dir "out"
                    :optimizations :none
                    :source-map true}}]})
{% endhighlight %}

You will also want to update your `index.html` look like this:

{% highlight html %}
    <html>
        <body>
            <div id="app"></div>
            <script src="http://fb.me/react-0.8.0.js"></script>
            <script src="out/goog/base.js" type="text/javascript"></script>
            <script src="om_intro.js" type="text/javascript"></script>
            <script type="text/javascript">goog.require("om_intro.core");</script>
        </body>
    </html>
{% endhighlight %}

Get any missing dependencies with `lein deps`, then build the project with `lein
cljsbuild once dev`. Open `index.html` in a browser and you should see the
bare-bones example that comes with this template.

For the rest of this tutorial, I recommend running `lein cljsbuild auto dev` in
a separate terminal. The first time the project gets built takes a second or
two, but after the JVM has warmed up, it takes just milliseconds.

The snippets above are for a development build of the project. The final example
I link to at the end of this post contains a release build, that generates a
single Javascript file.

With the setup out of the way we can start rebuilding this widget.

{% highlight clojure %}
    (ns om-intro.core
      (:require [om.core :as om :include-macros true]
                [om.dom :as dom :include-macros true]))

    (def app-state (atom :text "Some Text"))

    (defn my-widget [app owner]
      (reify
        om/IRender
        (render [this]
          (dom/div nil (:text app)))))

    (om/root
      app-state
      my-widget
      (. js/document (getElementById "app")))
{% endhighlight %}

aosnehanoe
<div class='highlight example' id="ex1"> </div>
{% highlight clojure %}
    (ns om-intro.core
      (:require-macros [cljs.core.async.macros :refer [go]])
      (:require [om.core :as om :include-macros true]
                [om.dom :as dom :include-macros true]
                [cljs.core.async :refer [put! chan <! sliding-buffer]]))
{% endhighlight %}
{% highlight clojure %}
    (defn my-widget [app owner]
      (reify
        om/IInitState
        (init-state [this]
          {:comm {:string (chan)}})

        om/IWillMount
        (will-mount [this]
          (let [{:keys [string] :as comm} (om/get-state owner :comm)]
            (go (while true
                  (let [value (<! string)]
                    (om/transact! app :text (fn [_] value)))))))

        om/IRenderState
        (render-state [this {:keys [comm]}]
          (dom/div nil
                   (dom/input #js {:type "text"
                                   :ref "text"
                                   :value (:text app)
                                   :onChange #(put!
                                                (:string comm)
                                                (-> (om/get-node owner "text")
                                                    .-value))})

                   (dom/div nil (:text app))))))
{% endhighlight %}
<div class='highlight example' id="ex2"> </div>

{% highlight clojure %}
    (def app-state (atom {:text "Some Text"
                          :size 15}))
{% endhighlight %}
{% highlight clojure %}
    om/IInitState
    (init-state [this]
      {:comm {:string (chan)
              :size (chan)}})
{% endhighlight %}
{% highlight clojure %}
    om/IWillMount
    (will-mount [this]
      (let [{:keys [string size] :as comm} (om/get-state owner :comm)]
        (go (while true
              (let [value (<! string)]
                (om/transact! app :text (fn [_] value)))))
        (go (while true
              (let [value (<! size)]
                (om/transact! app :size (fn [_] value)))))))
{% endhighlight %}
{% highlight clojure %}
    (dom/div nil
            (dom/input #js {:type "range"
                            :min 10
                            :max 50
                            :step 0.2
                            :ref "size"
                            :value (:size app)
                            :onChange #(put!
                                        (:size comm)
                                        (get-value owner "size"))})
            (dom/label nil (str (:size app) "px")))
{% endhighlight %}
{% highlight clojure %}
    (defn get-value [owner ref]
      (-> (om/get-node owner ref)
          .-value))
{% endhighlight %}
{% highlight clojure %}
    (let [size (:size app)]
     (dom/div #js {:style #js {:font-size (str (:size app) "px")}
                   :className "example-text"}
              (:text app)))
{% endhighlight %}
<div class='highlight example' id="ex3"> </div>
{% highlight clojure %}
    (def app-state (atom {:text "Some Text"
                          :size 15
                          :colors {:red 0
                                   :green 0
                                   :blue 0}}))
{% endhighlight %}
{% highlight clojure %}
    (defn color-slider [colors owner {:keys [label onChange color-key]}]
      (reify
        om/IRenderState
        (render-state [this {:keys [comm]}]
          (dom/div nil
                   (dom/input #js {:type "range"
                                   :min 0
                                   :max 255
                                   :step 1
                                   :ref "color"
                                   :value (color-key colors)
                                   :onChange #(onChange color-key owner)})
                   (dom/label nil (str label ": " (color-key colors)))))))
{% endhighlight %}
{% highlight clojure %}
    om/IInitState
    (init-state [this]
      {:comm {:string (chan)
              :size (chan)
              :colors (chan)}})
{% endhighlight %}
{% highlight clojure %}
    (go (while true
          (let [[c value] (<! colors)]
            (om/update! app assoc-in [:colors c] value))))))
{% endhighlight %}
{% highlight clojure %}
    (let [putfn (fn [k o]
                 (put! (:colors comm) [k (get-value o "color")]))]
        (apply dom/div nil
             (map (fn [[label color-key]]
                    (om/build color-slider
                              (:colors app)
                              {:opts {:label label
                                      :color-key color-key
                                      :onChange putfn}}))
                  [["Red" :red] ["Green" :green] ["Blue" :blue]])))
{% endhighlight %}
{% highlight clojure %}
    (let [size (:size app)
         {:keys [red green blue]} (:colors app)]
     (dom/div #js {:style #js {:font-size (str (:size app) "px")
                               :color (str "rgb(" red "," green "," blue ")")}}
              (:text app)))))))
{% endhighlight %}
<div class='highlight example' id="final"> </div>


<script src="/js/om-intro.js" type="text/javascript"></script>
