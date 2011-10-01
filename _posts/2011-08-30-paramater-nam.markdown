---
layout: post
title: Parameter 'Nam
---

I recently finished a project to improve the design of the account
statements our customers print off for patients. The new design was
pretty heavy and I was going to need to draw a lot of variable-length
text that could be aligned to the left, right or center.

We use a library called [Zend](http://framework.zend.com/manual/en/zend.pdf.html)
to generate all of our PDFs, and it has served us well so far. The
problem is that all of the previous projects used it pretty lightly and
there weren't any methods written that would help with such a dynamic
design. This meant I was going to have to write a lot of the code
myself, (which is fine since I **am** a software developer), but would
probably take the project past the deadline our clients were expecting.
As the day approached, we began to feel more and more pressure to ship
the feature and the code suffered because of it.

The following is a small excerpt from the class responsible for drawing
text to the page. Note that the original project was done in php. I've transposed it to ruby
for the sake of simplicity and because I couldn't get Pygments to syntax
highlight php code nicely.

{% highlight ruby %}
def drawStaticText(text, x, y, page=0, html_color="#000000", fontSize=0)
    fontSize = (fontSize == 0) ? self.fontSize : fontSize
    getPage(page)

    setColor(html_color)
    self.page.setFont(getFont(), fontSize)

    self.page.drawText(text, x, y, 'UTF-8')
end

def drawCenteredText(text, x, y, page, html_color="#000000", fontSize=0)
    fontSize = (fontSize == 0) ? self.fontSize : fontSize

    width = getTextWidth(text, getFont(), fontSize)
    x = x - width / 2

    drawStaticText(text, x, y, page, html_color, fontSize)
end

def drawRightAlignedText(text, x, y, page, html_color="#000000", fontSize=0)
    fontSize = (fontSize == 0) ? self.fontSize : fontSize

    width = getTextWidth(text, getFont(), fontSize)
    x = x - width

    drawStaticText(text, x, y, page, html_color, fontSize)
end
{% endhighlight %}

Yikes, look at that mess! I can see at least 3 things wrong here:

### 1. Code Duplication
Each of these methods are overly similar. I'm defaulting
`fontSize` in all three, and I'm calling `getTextWidth()` in
the bottom two.

### 2. Poorly named methods
The names of these methods aren't consistent, nor do I feel the
correctly convey what they're doing. The person implementing this
code might not have a problem understanding what `drawCenteredText`,
does, but it would feel inconsistent next to `drawRightAlignedText`.
And why the word "Static" in `drawStaticText`? What does that imply
about the method?

### 3. Parameter Hell
There are _way_ too many parameters being passed around here. Some
people regard the passing of anything more than 2 parameters to a
method as a code smell, and I tend to agree. The more parameters you
pass into a method makes it harder to test, looks messy, and generally
create brittle code. Sometimes there is no way around it, but you should
try to avoid it where possible.

My focus for the remainder of this post will be in reducing the number
of parameters being used. `self.page.drawText()` is off-limits since
that's the call to actual library. Everything else is fair game.

I recently got Martin Fowler's "Refactoring: Improving the Design of
Existing Code", and it has been an amazing reference for
refactorings like this. On page 295, it details the process of replacing a
number of parameters sent to a method with a parameter _object_ instead:

> Often you see a particular group of parameters that tend to be passed
> together. Several methods may use this group, either on one class or
> in several classes. Such a group of classes is a data clump that can
> be replaced with an object that carries all of this data.

Moving these parameters into an object, and passing it in instead, feels
like the right way to go. I should also be able to add the offset
calculation required for centered/right aligned text onto the object,
and remove that responsibility from the code higher up. I'm still going
to have a problem with building the object itself, but I should be
able to initialize it with a hash and reduce the chances of it being
implemented incorrectly in the future.

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

You can see that this object is pretty small, and while the
initialization looks a little complicated, it makes using it so much
easier. I can now go ahead and remove replace all of the parameters with this
new object. At the same time, I'll rename `drawStaticText` to `drawText` to
better reflect what it is doing.

{% highlight ruby %}

def drawText( text_obj, page=1 )
    font_size = (textObj.font_size == 0) ? self.font_size : text_obj.font_size
    getPage(page)
    setColor(text_obj.color)
    self.page.setFont(getFont(), font_size)
    self.page.drawText(text_obj.value, text_obj.x, text_obj.y, 'UTF-8')
end

{% endhighlight %}

Finally this code is starting to shape up. This is what it would look
like to use that `TextObject`:

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
but this is fine for the purposes of getting rid of all those crazy
parameters. Testing the `drawText` method now should be much easier,
and I can write tests for the `TextObject` as well.

There are still other areas of this project that could use some
refactoring, but thats it for at least this section. At least I can
browse through this file without having to enable text-wrapping in vim.
