---
layout: post
---

In the Clojure world, when you want to write a web app, you will almost
certainly be using [Ring](https://github.com/ring-clojure/ring). Ring is directly inspired by
[Rack](https://rack.github.io/), the defacto
webserver abstraction for frameworks in Ruby.

The two are conceptually very similar, but there are some slight differences
(aside from language) that might be interesting to highlight. I won\'t be going
too in depth with this post, and will focus instead on the basics of using
Rack and Ring. I thought I would just get that out of the way before your
expectations got too high.

It\'s worth noting that most apps won\'t actually use either Rack or Ring
directly like we will here. It would be a lot faster and safer to use something
like [Sinatra](http://www.sinatrarb.com/) or [Rails](http://rubyonrails.org/) for Rack, and
[Compojure](https://github.com/technomancy/compojure) or
[Luminus](http://www.luminusweb.net/) for Ring.

If you want to see the final versions of these examples in their full forms
please click:

* [Here for the Rack example](https://github.com/mcramm/rack-basics)
* [Here for the Ring example](https://github.com/mcramm/ring-basics)

---

## The Minimal First Step

Let\'s start with Rack, since it\'s obviously the more popular of the two.
I\'m going to assume that you can
[read](https://github.com/rack/rack#installing-with-rubygems) and get Rack
installed if you don\'t already have it. If you can\'t read, then I have nothing
to worry about because this will all look like gobbledygook to you. I hope ASCII
art will serve as an appropriate apology  :-).

The first step in getting either application off the ground is to create a
entry point. In the case of Rack this is will be an object with a `call`
method. This method needs to return the basic structure required for a Rack
response, which is an array containing the response status, headers and body:

{% highlight ruby %}
    # my_rack_app.rb
    class MyRackApp
      def call(env)
        ['200', {'Content-Type' => 'text/html'}, ['Hello World']]
      end
    end
{% endhighlight %}

Note how simple this is. This is just a regular old ruby object with a method
that returns a triplet. It knows nothing about Rack or anything else that might
be using it.

Unfortunately this does absolutely *nothing*, which is pretty boring.  To boot this app up,
we\'ll add a `config.ru` to the current directory:

{% highlight ruby %}
    # config.ru
    require 'rack'
    require_relative 'my_rack_app'

    run MyRackApp.new
{% endhighlight %}

We can now run `rackup` from our current directory and, navigating to
[http://localhost:9292](http://localhost:9292/), we should see our \"Hello World\"
response.

Getting our Ring app off the ground requires a little bit more setup, but we\'ll be
using [Leiningen](http://leiningen.org/) to do most of the trivial stuff for us.

First let\'s create a new project with `lein new app my-ring-app`. Add `[ring "1.3.2"]` to the list of dependencies
in `project.clj`.
You might need to run `lein deps` to download the Ring library if you don\'t already have it.

Ring is similar to Rack in that we need to give it a function that returns
some standard response. Ring expects a map instead of an array:

{% highlight clojure %}
    (ns my-ring-app.app)

    (defn handler [request]
     {:status 200
     :headers {"Content-Type" "text/html"}
     :body "Hello World"})
{% endhighlight %}

Calling the function \"handler\" above is simply the convention in Clojure-land.
Like the Rack example, we need some way to boot this app up. Some examples will
mash this boot process together with the code we wrote above but I prefer to
keep this separate. Plus it makes it similar to our Rack example so win-win,
right?

{% highlight clojure %}
    (ns my-ring-app.core
      (:require [ring.adapter.jetty :refer [run-jetty]]
                [my-ring-app.app :as app)
      (:gen-class)

    (defn -main [& args]
      (run-jetty app/handler {:port 3000}))
{% endhighlight %}

Now we can just do `lein run` from our project root. Navigating to
[http://localhost:3000](http://localhost:3000/) should display a very familiar page.

---

## Middleware

Middleware is essentially a series a steps a request has to go through in order
to generate a response. Once a response is generated, it will return the
response back up through any middleware in reverse order.

We\'re going to introduce some middleware to both of our applications that
translates \"Hello\" to it\'s French counterpart \"Bonjour\". Why French? Well
I\'m Canadian, and if I don\'t provide some kind of French content, then the
CRTC might come and yell at me for not being fair.

I also don\'t know how to say \"Hello\" in any other language off the top of my
head and I\'m too lazy to do any more research so we are going to stick with
\"Bonjour\".

In Rack our middleware is going to be another ruby object, except that we will actually
be doing something with that `env` parameter we saw in our earlier example. You
will notice that our middleware bears some resemblance to our running
`MyRackApp`

{% highlight ruby %}
    # hello_translator.rb
    class HelloTranslator
      def initialize(app)
        @app = app
      end

      def translate_hello(str)
        str.gsub(/Hello/, 'Bonjour')
      end

      def call(env)
        status, headers, body = @app.call(env)

        body.map! { |str| translate_hello(str) }

        [status, headers, body]
      end
    end
{% endhighlight %}

First we initialize the middleware with our running application. Calling
`@app.call(env)` simply passes the request down the stack. If there was
another piece of middleware beneath us, then it would be the next reciever of
our `env` parameter. This would keep going until a response is generated, which
in our case will be from `MyRackApp` that we defined earlier. Our return value
needs to be the same status, headers and body array in order for Rack to be able
to serve the response.

If you ran `rackup` right now, then you wouldn\'t see any change. This is because
we actually need to *tell* Rack about this is middleware. To accomplish this we
need to require and `use` it in our `config.ru`:

{% highlight ruby %}
    # config.ru
    require 'rack'
    require_relative 'my_rack_app'
    require_relative 'hello_translator'

    use HelloTranslator
    run MyRackApp.new
{% endhighlight %}

Running `rackup` and refreshing the previous page will now show a lovely
greeting in the famously romantic French language.

Again Ring is very similar. The biggest difference is that the middleware is
just a function instead of an object:

{% highlight clojure %}
    (ns my-ring-app.middleware
      (:require [clojure.string :as s]))

    (defn translate-hello [body]
      (s/replace body "Hello" "Bonjour"))

    (defn wrap-hello-translator [handler]
      (fn [request]
          (let [response (handler request)]
                (update-in response [:body] translate-hello))))
{% endhighlight %}

Again, prefixing our middleware with `wrap` is convention.  As before we will need to require and use
this middleware in the namespace responsible for booting the app:

{% highlight clojure %}
    (ns my-ring-app.core
      (:require [ring.adapter.jetty :refer [run-jetty]]
                [my-ring-app.app :as app]
                [my-ring-app.middleware :refer [wrap-hello-translator]])
      (:gen-class))

    (defn -main [& args]
      (run-jetty (-> app/handler
                     wrap-hello-translator) {:port 3000}))
{% endhighlight %}

---

## Dealing With Query Params

I was originally going to end the post here with an amazingly concise, beautifully
written conclusion to tie a nice little bow over everything. Instead I\'m going to
take this comparison one step further and really phone in the whole \"wrapping
things up\" section that is structurally necessary.

I want to show something that is *much* more common than our mostly pointless
\"Hello\" to \"Bonjour\" translation app that we\'ve written. I\'m going to show
you how Ring and Rack each let you access any query parameters that may have
come along with the request.

Let\'s say that we want to let the request specify who we want to say
\"Bonjour\" to, and \"World\" if nothing is provided. The request can tell us what
name to use by simply providing a `name` parameter.

With the Rack example, we aren\'t going to touch anything except for our base
application:

{% highlight ruby %}
    # my_rack_app.rb
    class MyRackApp
      def call(env)
        request = Rack::Request.new(env)
        subject = request.params.fetch('name', 'World')
        body = ["Hello #{subject}"]

        ['200', {'Content-Type' => 'text/html'}, body]
      end
    end

{% endhighlight %}

The change here is that we wrap the `env` parameter in a `Rack::Request`
object, then attempt to fetch the `'name'` parameter. If one isn\'t provided,
then we default to `'World'`. Our response is essentially the same.

Opening [http://localhost:9292?name=Pierre](http://localhost:9292?name=Pierre), we should see
\"Bonjour Pierre\". If we omit the `name` parameter entirely, then we should
see \"Bonjour World\" as before.

Ring\'s approach is slightly different. Instead of wrapping the request in
another object, there is a set of very common default middleware that we can
choose to include. One of these is `wrap-params`, which will add a `:params` key
to the request and take any parameters out of the query string and put into a
map at that key.

I\'ve included full-versions of each file here to keep things easy to follow.
Additions to `my-ring-app.core` are noted:

{% highlight clojure %}
    (ns my-ring-app.core
      (:require [ring.adapter.jetty :refer [run-jetty]]
                [ring.middleware.params :refer [wrap-params]] ; NEW
                [my-ring-app.app :as app]
                [my-ring-app.middleware :refer [wrap-hello-translator]])
      (:gen-class))

      (defn -main [& args]
       (run-jetty (-> app/handler
                      wrap-params ; NEW
                      wrap-hello-translator) {:port 3000}))
{% endhighlight %}

{% highlight clojure %}
    (ns my-ring-app.app)

    (defn handler [request]
      (let [subject (get-in request [:params "name"] "World")]
        {:status 200
         :headers  {"Content-Type" "text/html"}
         :body (format "Hello %s" subject)}))
{% endhighlight %}

The difference between the two examples is the fact that the
query string processing is handled in middleware with Ring, while with Rack I
wrapped it. I tried to find a similar piece of middleware for Rack but
after an hour of clicking around I came up short. There is some stuff in
[rack-contrib](https://github.com/rack/rack-contrib) that comes close, but not
close enough.  I\'m sure one exists and I\'ll update this post if I can find something
analogous to Ring\'s `wrap-params`.

---

I hope this been at least a little bit enlightening. I found the basics of Ring and Rack to be
*so similiar* that I couldn\'t help but write a post about the two. The
differences in application structure and methodologies become more pronounced
the  more complicated your stack becomes, but this is usually due to stuff built
*on top* of them.

In future posts I hope to show something a bit more useful built with Ring.
