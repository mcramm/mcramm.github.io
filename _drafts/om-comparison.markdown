---
layout: post
---

In my [last post](http://mcramm.com/2014/01/26/react-intro.html) I built a simple text manipulation widget with [React](http://facebook.github.io/react/).
I recommend reading through that post first, before this one.
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
single JavaScript file.

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

This is analogous to the first example in the React version; all we\'re doing is
defining a component that renders a `div` containing the value of `:text` from
our application state.

There are already a differences though. First, we\'ve moved all of our state
into an atom. Components are given *cursors* into this application state that
they can use to read/update.

Second, our `my-widget` component is returning a reified object that satisfies
the `om/IRender` interface. The `render` method simply returns the
aforementioned `div`.

You should see something like this:

<div class='highlight example' id="ex1"> </div>

Like our first example in the React version, this is pretty boring. Let\'s add
in the text input.

We\'re going to be using [core.async](https://github.com/clojure/core.async) at
the edges of our components, wherever our users will be interacting with the
various `input`s we\'ll eventually have.

Change the namespace declaration to the following:

{% highlight clojure %}
    (ns om-intro.core
      (:require-macros [cljs.core.async.macros :refer [go]])
      (:require [om.core :as om :include-macros true]
                [om.dom :as dom :include-macros true]
                [cljs.core.async :refer [put! chan <!]]))
{% endhighlight %}

Then we\'ll update the widget. We\'re going to walk through this step-by-step in
a minute, but here is what it should look like:

{% highlight clojure %}
    (defn my-widget [app owner]
      (reify
        om/IInitState
        (init-state [this]
          {:comm {:string (chan)}})

        om/IWillMount
        (will-mount [this]
          (let [{:keys [string]} (om/get-state owner :comm)]
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

We\'ve changed our widget to satisfy a few more Om interfaces that take
advantage of the [React life cycles](http://facebook.github.io/react/docs/component-specs.html).

The first is `om/IInitState` which sets up some initial, local state for the
component. Here we are creating a map with a channel assigned to the `:string`
key. `init-state` is called once on a component.

In `om/IWillMount`, we setup a go loop that blocks on the channel assigned to
`:string` earlier, then sets the `:text` attribute in our application state to
the value we get off of that channel. Once it\'s done it goes back to waiting on
the channel.

> If you\'re new to Clojure, then the destructuring we do in the `let` binding can
> be a little confusing. The gist of what we\'re doing is creating a local
> `string` variable for our go block that is the key a map returned by
> `(om/get-state owner :comm)`. In other words, it takes the map we created
> earlier and creates a local variable that is assigned the value of the
> `:string` key.

We use `om/trasact!` here since updating an atom needs to occur within a
transaction. We could have also used `swap!` here to modify the `atom` manually.

`will-mount` is called once, before the component is mounted into the DOM.

Finally, we\'ve changed `om/IRender` to `om/IRenderState`. Every component needs
to satisfy one of these interfaces, but not both. The difference between the two
is that `IRenderState` is passed the component state as it\'s second argument. We
need it so that we can have access to the channel we created earlier.

Finally we create the `input`:

{% highlight clojure %}
    (dom/input #js {:type "text"
                    :ref "text"
                    :value (:text app)
                    :onChange #(put!
                                (:string comm)
                                (-> (om/get-node owner "text")
                                    .-value))})
{% endhighlight %}

The element is actually only taking a single argument, though it looks like two.
`#js` is a reader literal for Clojurscript that transforms the following object
into literal JavaScript object. The map that we pass is setting some attributes
on the component. In this case, we want a text input that contains the value of
the `:text` key from our application state. We assign it the ref `text` so that
we can refer to it from `onChange` callback.

This callback is really simple, and is one of the reasons why core.async is so
attractive. All it does is take the value of the `text` node and put it onto the
`string` channel.

If you\'ve been following along, then you should see the following:

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
