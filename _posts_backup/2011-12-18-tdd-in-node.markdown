---
layout: post
---

TDD is discipline that I've been trying to master for a while now, and
I've been absorbing every blog post, talk, or book I can get my hands
on. One thing thats key for me is to have some way to run my tests very
quickly. Even better, the tests should run automatically whenever code
in application files or tests changes.

In Ruby, I have Guard. It works beautifully and does exactly what I need
it to do. I spent the last week struggling to find something similar in
NodeJs but didn't come up with anything I liked. I found it frustrating,
because watching for events on files or directories is something that
Node should be good at. In the end I settled on writing a simple
Cakefile:

{% highlight ruby %}
    CoffeeScript = require 'coffee-script'

    {print} = require 'util'
    exec = require('child_process').exec
    fs = require 'fs'

    # ANSI Terminal Colors
    green = '\033[0;32m'
    reset = '\033[0m'
    red = '\033[0;31m'

    log = (message, color, explanation) ->
        console.log color + message + reset + ' ' + (explanation or '')

    compile = (callback) ->
        exec "coffee -o js -c lib", (error, stdout, stderr) ->
            if error is null
                log 'compiled!', green
                callback?()
            else
                log error, red

    test = ->
        command = 'jasmine-node --coffee spec'

        exec command, (error, stdout, stderr) ->
            if error is null
                log stdout, green
            else
                log stdout, red

    task 'build', 'Compile the coffeescript into javascript', ->
        compile()

    task 'test', 'Run the tests', ->
        test()

    task 'watch', 'Watch for file changes and compile into javascript', ->
        fs.watch 'spec', (event, filename) -> test()
        fs.watch 'lib', (event, filename) -> compile test

        compile test
{% endhighlight %}

This file is pretty simple and contains three tasks: build, test and
watch. Node has an easy way to watch for file system events on
directories through `fs.watch <directory>`.

I tried a couple of testing libraries, but settled on [jasmine-node](https://github.com/mhevery/jasmine-node) since
I've used it before.

Now I can just run `cake watch` and start writing code. Occasionally I'll
stop and take a look at the other monitor to make sure everything is
green. I used this process and ran through the classic [Bowling Game
Kata](http://butunclebob.com/ArticleS.UncleBob.TheBowlingGameKata).
I also posted [the source](https://github.com/mcramm/node_katas) on GitHub.
