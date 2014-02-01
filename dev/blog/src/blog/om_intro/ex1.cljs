(ns om-intro.ex1
  (:require [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]))

(def app-state (atom {:text "Some Text"}))

(defn my-widget [app owner]
  (reify
    om/IRender
    (render [this]
      (dom/div nil (:text app)))))

(om/root
  app-state
  my-widget
  (. js/document (getElementById "ex1")))
