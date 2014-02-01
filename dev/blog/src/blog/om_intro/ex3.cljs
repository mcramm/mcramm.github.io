(ns om-intro.ex3
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]
            [cljs.core.async :refer [put! chan <!]]))

(def app-state (atom {:text "Some Text"
                      :size 15}))

(defn get-value [owner ref]
  (-> (om/get-node owner ref)
      .-value))

(defn my-widget [app owner]
  (reify
    om/IInitState
    (init-state [this]
      {:comm {:string (chan)
              :size (chan)}})

    om/IWillMount
    (will-mount [this]
      (let [{:keys [string size] :as comm} (om/get-state owner :comm)]
        (go (while true
              (let [value (<! string)]
                (om/transact! app :text (fn [_] value)))))
        (go (while true
              (let [value (<! size)]
                (om/transact! app :size (fn [_] value)))))))

    om/IRenderState
    (render-state [this {:keys [comm]}]
      (dom/div nil
               (dom/input #js {:type "text"
                               :ref "text"
                               :value (:text app)
                               :onChange #(put! (:string comm) (get-value owner "text"))})

               (dom/div nil
                        (dom/input #js {:type "range"
                                        :min 10
                                        :max 50
                                        :step 0.2
                                        :ref "size"
                                        :value (:size app)
                                        :onChange #(put! (:size comm) (get-value owner "size"))})
                        (dom/label nil (str (:size app) "px")))

              (dom/div #js {:style #js {:font-size (str (:size app) "px")}
                                             :className "example-text"}
                                        (:text app))))))
(om/root
  app-state
  my-widget
  (. js/document (getElementById "ex3")))
