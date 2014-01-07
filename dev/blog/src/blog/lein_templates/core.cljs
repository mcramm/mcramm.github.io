(ns lein-templates.core
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

(om/root app-state my-app (.getElementById js/document "lein-templates-example"))
