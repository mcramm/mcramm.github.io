+++
date = "2015-07-02T18:04:47-06:00"
draft = true
title = "Datomic Setup"
tags = [ "Clojure", "Datomic", "Database" ]
+++

I've recently been exploring Datomic more seriously and have found myself
jumping through the same hoops as I have in the past *just to get things up and
running*. I've also encountered slight deficiencies in the documentation that
I've had to re-investigate since the exploratory project I created had long
since been deleted.

I'm tired of jumping through these same hoops again so I thought I'd create a
quick post with some of the basic steps to get setup & using Datomic in an
application.

## Installing Datomic

You do not need to install Datomic to get started, you can use the in-memory
database.

Go here: [https://my.datomic.com/downloads/free](https://my.datomic.com/downloads/free) and find the latest version.

Then add `[com.datomic/datomic-free "<the-latest-version>"]` to your Leiningen project.

---

## Component Setup

This is pretty easy, but you should have something like this:

{{< highlight clojure >}}
    (ns my-project.component.datomic
      (:require [com.stuartsierra.component :as component]
                [datomic.api :as datomic]))

    (defrecord DatomicComponent [uri conn]
      component/Lifecycle
      (start [this]
        (if (:conn this)
          this
          (do
            (assoc this :conn (datomic/connect uri)))))
      (stop [this]
        (assoc this :conn nil)))
{{< /highlight >}}

## Schema

{{< highlight clojure >}}
    (def schema
      (delay
        (read-string
          (slurp (io/resource "my_project/schema.edn"))))

    (defn create-schema [conn]
      (datomic/transact conn @schema))
{{< /highlight >}}

## Seed Data

{{< highlight clojure >}}
    (def seed-data
      (delay
        (read-string
          (slurp (io/resource "my_project/seed-data.edn"))))

    (defn seed-db [conn]
      (datomic/transact conn @seed-data))
{{< /highlight >}}

## Queries

{{< highlight clojure >}}
    (ns my-project.accounts
      (:require [datomic.api :as datomic]
                [my-project.component.datomic])
      (:import [my_project.component.datomic DatomicComponent]))

    (defprotocol AccountOps
      (all [this])
      (by-email [this email]))

    (extend-type DatomicComponent
      AccountOps
      (all [this]
        (datomic/q '[:find [(pull ?account [* {:account/email [*]}]) ...]
                     :where [?account :account/email]]
                   (datomic/db (:conn this))))
      (by-email [this email]
        (datomic/q '[:find [(pull ?account [*]) ...]
                     :in $ ?email
                     :where [?account :account/email ?email]]
                   (datomic/db (:conn this))
                   email)))

{{< /highlight >}}
