---
layout: post
---
blah

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
      (dom/div nil
              (om/build color-slider
                        (:colors app)
                        {:opts {:label "Red"
                                :color-key :red
                                :onChange putfn}})
              (om/build color-slider
                        (:colors app)
                        {:opts {:label "Green"
                                :color-key :green
                                :onChange putfn}})
              (om/build color-slider
                        (:colors app)
                        {:opts {:label "Blue"
                                :color-key :blue
                                :onChange putfn}})))
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
