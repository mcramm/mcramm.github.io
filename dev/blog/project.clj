(defproject blog "0.1.0-SNAPSHOT"
  :description "Example code for blog posts"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/core.async "0.1.267.0-0d7780-alpha"]
                 [org.clojure/clojurescript "0.0-2138"]
                 [om "0.3.1"]]

  :plugins [[lein-cljsbuild "1.0.1"]]

  :cljsbuild
    {:builds
     [{:id "lein-templates"
       :source-paths ["src/blog/lein_templates"]
       :compiler {:output-to "../../js/lein-templates.js"
                  :optimizations :advanced
                  :pretty-print false
                  :preamble ["react/react.min.js"]
                  :externs ["react/externs/react.js"]
                  :closure-warnings {:non-standard-jsdoc :off}}}
      {:id "om-intro"
       :source-paths ["src/blog/om_intro"]
       :compiler {:output-to "../../js/om-intro.js"
                  :optimizations :advanced
                  :pretty-print false
                  :preamble ["react/react.min.js"]
                  :externs ["react/externs/react.js"]}}
      ]})
