(ns om-intro.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]
            [cljs.core.async :refer [put! chan <! sliding-buffer]]))

(def app-state (atom {:text "Some Text"
                      :size 15
                      :colors {:red 0
                               :green 0
                               :blue 0}}))

(defn get-value [owner ref]
  (-> (om/get-node owner ref)
      .-value))

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

(defn my-widget [app owner]
  (reify
    om/IInitState
    (init-state [this]
      {:comm {:string (chan)
              :size (chan)
              :colors (chan)}})

    om/IWillMount
    (will-mount [this]
      (let [{:keys [string size colors] :as comm} (om/get-state owner :comm)]
        (go (while true
              (let [value (<! string)]
                (om/transact! app :text (fn [_] value)))))
        (go (while true
              (let [value (<! size)]
                (om/transact! app :size (fn [_] value)))))
        (go (while true
              (let [[c value] (<! colors)]
                (om/update! app assoc-in [:colors c] value))))))

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

               (let [size (:size app)
                     text (:text app)
                     {:keys [red green blue]} (:colors app)]
                 (dom/div #js {:style #js {:font-size (str size "px")
                                           :color (str "rgb(" red "," green "," blue ")")}
                               :className "example-text"}
                          text))))))
(om/root
  app-state
  my-widget
  (. js/document (getElementById "final")))
