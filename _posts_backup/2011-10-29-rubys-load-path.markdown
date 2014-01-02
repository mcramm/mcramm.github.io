---
title: Ruby's Load Path
layout: post
published: true
---

One thing that always tripped me up when I first started writing my own
gems was how to properly require other files when the files were
relative to the current file's path. Let's say you have your classes laid out
like this:

{% highlight bash %}
    app.rb
    lib/
        myclass.rb
        anotherclass.rb
{% endhighlight %}

How would you require those two files in `lib`? I quickly became used to doing
something like this:

{% highlight ruby %}
    require File.join( File.dirname(__FILE__), 'lib', 'myclass' )
    require File.join( File.dirname(__FILE__), 'lib', 'anotherclass' )
{% endhighlight %}

Which works, but has a lot of duplication. All I really care about is
the name of the file I'm requiring, and that's all the way at the end of the line.

In quicker, smaller projects, it was okay since I only ever needed to
require one file at a time. On larger projects though, I began to do the
following:

{% highlight ruby %}
    path_to_lib =  File.join( File.dirname(__FILE__), 'lib' )
    require File.join( path_to_lib, 'myclass' )
{% endhighlight %}

This was better but it still felt like I was doing something
unnecessary. Finally one day I was frustrated enough to look into
what `require` actually did. How does Ruby know where to look when requiring a gem? If I want to use
the [Typhoeus](http://rubydoc.info/gems/typhoeus/0.3.2/frames) library,
I can just say `require 'typhoeus'`; I don't need to specify the full
path to its location.

Sounds like its time to check out Ruby's
[Kernel](http://www.ruby-doc.org/core-1.9.2/Kernel.html#method-i-require)
module.

> Ruby tries to load the library named *string*, returning *true* if successful.
> If the filename does not resolve to an absolute path, it will be searched
> for in the directories listed in `$:`.

Makes sense. All I should need to do is add the subdirectory I want to
require to load to the path that Ruby scans through. Kernel's rdoc says
that the path(s) are stored in `$:`. Let's see whats in there:

{% highlight ruby %}
    p $:  # => ["/Library/Ruby/Site/1.8", ... ]
{% endhighlight %}

Looks like its just an array of paths. I should be able to simply add a
path to the end of the array and Ruby *should* scan that directory when
I call `require`:

{% highlight ruby %}
    $:.unshift File.join(File.dirname(__FILE__), '..', 'lib')
{% endhighlight %}

Again, this works, but `$:` dosen't feel intuitive. Some quick googling
shows that `$LOAD_PATH` is an alias for `$:`:

{% highlight ruby %}
    $LOAD_PATH.unshift File.join(File.dirname(__FILE__), '..', 'lib')

    require 'myclass'
    require 'anotherclass'
{% endhighlight %}

Now you can see immediately which file is being required. Plus, if
you're writing a gem, you only need to do this *once* in the base class
and the same load path will be used in any file beneath it.
