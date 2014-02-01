(ns om-intro.ex2
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]
            [cljs.core.async :refer [put! chan <!]]))

(def app-state (atom {:text "Some Text"}))

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

               (dom/div #js {:className "example-text"}
                        (:text app))))))
(om/root
  app-state
  my-widget
  (. js/document (getElementById "ex2")))
