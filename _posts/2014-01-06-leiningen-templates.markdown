---
layout: post
---

Getting started with Clojurescript can be tough if you\'ve never done it before,
and once you do you might find yourself running through the same steps to get
new projects into a structure that makes sense. In either case, the solution is
to use a Leiningen template. My goal here is to show how easy it can be
to create one of your own. Most templates are built for Clojure, but we\'ll
be creating one for Clojurescript. On top of that we\'ll get ourselves started
off with the new Om library.

Before beginning I want to make it clear that this isn\'t meant as an
introduction to Clojurescript, [Om](https://github.com/swannodette/om), or the framework it acts as an interface to
([React](http://facebook.github.io/react/)). This is meant to help you through creating a Leiningen template that
will get you going quickly on a new project. If you want a bare-bones template
for a new Clojurescript project, then I recommend [mies](https://clojars.org/mies/lein-template).

Using Leiningen you can create new templates with a default project structure
through the `new` task: `lein new <template> <name>`.

Let\'s create one together. Since we\'re creating one for the Om library, we\'ll
call it \'Hum\':

{% highlight bash %}
    lein new template hum
{% endhighlight %}

To install this template locally, `cd` into it and run `lein install`. Let\'s see
what a project based off this bare template looks like. Run `lein new hum my-app`.
You should get a directory tree with one file like this:
`my-app/src/my_app/foo.clj`.

The contents of this file should simply be `(def my-app :foo)`.

Open up `src/leiningen/new/hum.clj` and look at the `hum` function:

{% highlight clojure %}
    (defn hum
      "FIXME: write documentation"
      [name]
      (let [data {:name name
                  :sanitized (name-to-path name)}]
        (main/info "Generating fresh 'lein new' hum project.")
        (->files data
                 ["src/{{site.lcbs}}sanitized{{site.rcbs}}/foo.clj" (render "foo.clj" data)])))
{% endhighlight %}

Let\'s go through this line by line.  This function takes a name then creates a
map, `data`, that contains this name and a sanitized version of it.  `name-to-path`
simply takes a name and first replaces any dashes with underscores, then any
periods with directory separators.  So a name like `lawrence-of.arabia`
becomes `lawrence_of/arabia`. For us, `hum` will remain unchanged.

The `main/info` line is simply printing some info to the user.

`->files` is where the action happens. This function takes a map containing at
least the key `name` and a variable number of \"paths\". Each path is a vector
containing a string representing the path to a file, and some
content for that file.

To understand the `render` call a little better, we need to look at the
definition right above this function:

{% highlight clojure %}
    (def render (renderer "hum"))
{% endhighlight %}

All this does is create a renderer that will process one of our templates and
replace the appropriate variables. This templating is based off of mustache
which you\'ll see in a moment. For now, all you need to know is that `render`
will take the name of a file in `src/leiningen/new/hum` and replaces certain
areas that we specify with our supplied `data`. If we don\'t supply any data
then the file remains unchanged.

Keeping with our example, using this line:
{% highlight clojure %}
    ["src/{{site.lcbs}}sanitized{{site.rcbs}}/foo.clj" (render "foo.clj" data)]
{% endhighlight %}

Will create a file at `src/hum/foo.clj` with the content of the file `foo.clj`.
Let\'s open that file up and see this templating in action:

{% highlight clojure %}
    (def {{site.lcbs}}name{{site.rcbs}} :foo)
{% endhighlight %}

Remember that the `:name` key in `data` is set the unsanitized value we supply.

Now lets start making some changes. Create a file at
`src/leiningen/new/hum/project.clj` and give it the following content:

{% highlight clojure %}
    (defproject {{site.lcbs}}name{{site.rcbs}} "0.1.0-SNAPSHOT"
      :description "FIXME: write this!"
      :url "http://example.com/FIXME"

      :dependencies [[org.clojure/clojure "1.5.1"]
                     [org.clojure/clojurescript "0.0-2138"]
                     [om "0.1.4"]]

      :plugins [[lein-cljsbuild "1.0.1"]]

      :cljsbuild {
        :builds [{:id "dev"
                  :source-paths ["src"]
                  :compiler {
                    :output-to "{{site.lcbs}}sanitized{{site.rcbs}}.js"
                    :output-dir "out"
                    :optimizations :none
                    :source-map true
                    :externs ["om/externs/react.js"]}}]})
{% endhighlight %}

This is doing a bunch of stuff, but is a reasonably standard starting point. The
main differences is that I\'ve included the Om library as a dependency.

Now add this to the list of processed files in `hum.clj`:
{% highlight clojure %}
    (->files data
             ["project.clj" (render "project.clj" data)]
             ["src/{{site.lcbs}}sanitized{{site.rcbs}}/foo.clj" (render "foo.clj" data)])))
{% endhighlight %}

To test it out, run `lein new hum my-app`. Remember to remove the previous test
first, and make sure you are in the root of the template project. Open up
`my-app/project.clj` and marvel at the magic.

There are few more things we need to add to finish this off. First let\'s get rid
of `foo.clj` by renaming it to a Clojurescript file, like `core.cljs`.
Change the content of the file to this:

{% highlight clojure %}
    (ns {{site.lcbs}}name{{site.rcbs}}.core
      (:require [om.core :as om :include-macros true]
                [om.dom :as dom :include-macros true]))

    (enable-console-print!)

    (def app-state
      (atom {:clicks 0}))

    (defn button [data owner]
      (om/component
        (dom/div nil
                 (dom/button
                   #js {:onClick #(om/transact! data :clicks inc)}
                   "Click Me")
                 (dom/span #js {} (:clicks data)))))

    (defn my-app [app owner]
      (reify
        om/IRender
        (render [_]
          (om/build button app {}))))

    (om/root app-state my-app js/document.body)
{% endhighlight %}

Again the intent here is not to introduce you to Om, or Clojurescript. All
you need to know for now is that this creates a button and counter that tracks how
many times the button has been clicked.

Your list of processed files should look something like this:

{% highlight clojure %}
    ["project.clj" (render "project.clj" data)]
    ["src/{{site.lcbs}}sanitized{{site.rcbs}}/core.cljs" (render "core.cljs" data)]
{% endhighlight %}


Let\'s add in one more file, `index.html`:

{% highlight html %}
    <html>
        <body>
            <script src="http://fb.me/react-0.8.0.js"></script>
            <script src="out/goog/base.js" type="text/javascript"></script>
            <script src="{{site.lcbs}}sanitized{{site.rcbs}}.js" type="text/javascript"></script>
            <script type="text/javascript">goog.require("{{site.lcbs}}sanitized{{site.rcbs}}.core");</script>
        </body>
    </html>
{% endhighlight %}

And to the list of processed files:

{% highlight clojure %}
    ["index.html" (render "index.html" data)]
    ["project.clj" (render "project.clj" data)]
    ["src/{{site.lcbs}}sanitized{{site.rcbs}}/core.cljs" (render "core.cljs" data)]
{% endhighlight %}

The full `hum` function should look similar to this:

{% highlight clojure %}
    (defn hum [name]
      (let [data {:name name
                  :sanitized (name-to-path name)}]
        (main/info "Generating a new Om project using the Hum template")
        (->files data
                 ["index.html" (render "index.html" data)]
                 ["project.clj" (render "project.clj" data)]
                 ["src/{{site.lcbs}}sanitized{{site.rcbs}}/core.cljs" (render "core.cljs" data)])))
{% endhighlight %}

Now we\'re done. Run `lein new hum my-app` again and `cd` into it. Run `lein deps`
to get any dependencies, then `lein cljsbuild once dev`. Open up `index.html`
and voila! You should see something like the following:

<div class='highlight example' id="lein-templates-example"> </div>

If you\'re looking for more about creating templates, then I recommend the
excellent [Leiningen
docs](https://github.com/technomancy/leiningen/blob/stable/doc/TEMPLATES.md).

The full source for this template can be found
[here](https://github.com/mcramm/hum).

<script src="/js/lein-templates.js"></script>
