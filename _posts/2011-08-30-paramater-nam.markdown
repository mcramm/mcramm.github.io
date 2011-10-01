---
layout: post
title: Parameter 'Nam
published: false
---

I recently finished a project to improve the design of the account
statements our customers print off for patients. The new design was
pretty heavy and I was going to need to draw a lot of variable-length
text that could be aligned to the left, right or center.

We use a library called [Zend](http://framework.zend.com/manual/en/zend.pdf.html)
to generate all of our PDFs, and it has served us well so far. The
problem is that all of the previous projects used it pretty lightly, and
there weren't any methods written that would help with such a dynamic
design. This meant I was going to have to write a lot of the code
myself, (which is fine, as I **am** a software developer), but would
probably take the project past the deadline our clients were expecting.
As the day approached, we started feeling more and more pressure to ship
the feature, and of course, the code suffered.

The following is a small excerpt from the class responsible for drawing
text to the page.

Short projects are fun. Long projects *sound* fun, but can get pretty
arduous towards the end. Strap on a deadline, and a bunch of customers
champing at the bit and you've got yourself a recipe for some pretty
shitty code.

This was a project that I finished recently and was forced to rush
during the last few weeks to get it out the door in time. Thankfully I
was given some time recently to go back over it and refactor anything
that I can before my next project starts. This project was centered around
drawing dynamic text to a PDF over and over again. The text itself could
be aligned to the left/center/right and required some funky math to
re-position it based on that attribute. Since I was on a deadline and
coding like a madman, I came up with this solution:

*Note: The original project was done in php. I've transposed it to ruby
for the sake of simplicity and because I couldn't get Pygments to syntax
highlight php code nicely.*

{% highlight ruby %}
def drawStaticText(text, x, y, page=0, html_color="#000000", fontSize=0)
  fontSize = (fontSize == 0) ? self.fontSize : fontSize
  getPage(page)

  setColor(html_color)
  self.page.setFont(getFont(), fontSize)

  self.page.drawText(text, x, y, 'UTF-8')
end

def drawCenteredText(text, x, y, page, html_color="#000000", font_size=0)
  font_size = (font_size == 0) ? self.fontSize : font_size

  width = getTextWidth(text, getFont(), font_size)
  x = x - width / 2

  drawStaticText(text, x, y, page, html_color, font_size)
end

def drawRightAlignedText(text, x, y, page, html_color="#000000", font_size=0)
  font_size = (font_size == 0) ? self.fontSize : font_size

  width = getTextWidth(text, getFont(), font_size)
  x = x - width

  drawStaticText(text, x, y, page, html_color, font_size)
end
{% endhighlight %}

Ack! Look at that mess! I can see at least 3 things wrong here:

### 1. Code Duplication
I'm doing a few things over and over again in each of these methods. The
bottom two are even calling ```drawStaticText```, which is defaulting
the ```fontSize``` yet again!

```getTextWidth()``` is also being called twice in order the get the
text's width. This is required to reposition the text on the page based
on the alignment.

### 2. Poorly named methods
The names of these methods aren't consistent, nor do I feel the
correctly convey what they're doing. The person implmenting this
code might not have a problem understanding what ```drawCenteredText```,
does, but it would feel inconsistant next to ```drawRightAlignedText```.
And why the word "Static" in ```drawStaticText```? What does that imply
about the method?

I might just be nitpicking here, but I think these methods should be
renamed and/or removed if possible.

### 3. Parameter Hell
Wow. There are way too many parameters being passed around here.
Some people regrard the passing of more than 2 parameters as a code
smell, and I tend to agree. If you're passing in 3 or more parameters to
a method, then you should think about different ways of doing what you
want to accomplish. Maybe you can split the method out into two smaller
methods, or maybe you can modify some logic within the method to reduce
the requirement of so many parameters. In any case, there is almost
always a better solution that will not only simplify/reduce your code,
but also make it easier to test.

My focus for the remainder of this post is getting rid of those crazy
parameters from the example. These methods depend upon an underlying
library ([Zend](http://framework.zend.com/manual/en/zend.pdf.html)) to
render the pdf onto the page. This is called through the ```self.page.drawText()```
method, and I won't be able to modify it without having to change a base
lbrary that may be used by others. This means I'll be forced to
pass in a number of parameters to this method at some point. I'll need
to find a way of reducing the number of parameters being passed in, and
yet still provide the necessary information to the underlying library.

I recently got Martin Fowler's "Refactoring: Improving the Design of
Existing Code", and it has been an amazing reference for
refactorings like this. On page 295, it details the process of replacing a
number of parameters sent to a method with a parameter _object_ instead:

> Often you see a particular group of parameters that tend to be passed
> together. Several methods may use this group, either on one calss or
> in several classes. Such a group of classes is a data clump that can
> be replaced with an object that carries all of this data.

Besides just removing the number of parameters (which may cause problems
for anyone else implmenting this code), you get the added benefit of
(possibly) being able to move some business logic into the object
itself, having an easier to read/implment method call, and testing this
class just became a lot easier.


This seemed relativly trivial to do, and here is the resulting code:

{% highlight ruby %}
class TextObject
  ATTRIBUTES = [
    :value, :x, :y, :alignment, :color, :font_size
  ].freeze

  ATTRIBUTES.each do |attr|
    attr_accessor attr
  end

  def initialize(args=nil)
    ATTRIBUTES.each do |attr|
      if( args.key?(attr) )
        instance_variable_set("@#{attr}", args[attr])
      end
    end
  end

  def x
    return x unless [:right, :center].include? self.alignment
    return (self.alignment == :right) ? calculateOffsetForRight : calculateOffsetForCenter
  end

  private

  def calculateOffsetForRight
    return x - getWidth()
  end

  def calculateOffsetForCenter
    return x - (getWidth() / 2)
  end

  def getWidth
    return self.value.size
    # In reality, this method returns pixel value for the string based on font size / family.
  end
end
{% endhighlight %}

You can see that not only did I move all of the required parameters into
attributes themselves, but I also added in the
```calculateOffsetForRight``` and ```calculateOffsetForCenter``` methods
that should remove the requirement of having two slightly different
methods higher up. Both of these methods simply return the ```x``` value
that the text should start at based upon it's width.

Now, thankfully, I can remove the needed parameters from the list, as
well as the two other duplicated methods. At the same time, I'll rename
```drawStaticText``` to ```drawText``` to better reflect what it is
doing.

{% highlight ruby %}

def drawText( text_obj, page=1 )
  font_size = (textObj.font_size == 0) ? self.font_size : text_obj.font_size
  getPage(page)
  setColor(text_obj.color)
  self.page.setFont(get_font(), font_size)
  self.page.drawText(text_obj.value, text_obj.x, text_obj.y, 'UTF-8')
end

{% endhighlight %}

Finally this code is starting to shape up. This is what it would look
like to use that ```TextObject```:

{% highlight ruby %}

my_text_obj = new TextObject({
  :value => "Draw Me!",
  :x => 12,
  :y => 100,
  :alignment => :left,
  :color => "#000000",
  :font_size => 12
})

my_text_obj.x   # => 12

my_text_obj.alignment = :right
my_text_obj.x   # => 4

my_text_obj.alignment = :center
my_text_obj.x   # => 8

drawText( my_text_obj )

{% endhighlight %}

I'm sure that there are other ways to refactor this code even further,
but this is fine for the puroposes of getting rid of all those crazy
parameters. Testing the ```drawText``` method now should be much easier,
and I can write tests for the ```TextObject``` as well.

Hopfully when I am in a rush from this point on, I'll try this solution
first instead of writing method definations that require me to enable
text-wrapping in VIM just so I can see them!
