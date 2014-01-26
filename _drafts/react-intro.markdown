---
layout: post
---

[React](http://facebook.github.io/react/) is a new-ish library from
Facebook/Instagram that is is designed to make building user interfaces easy. 

I thought it would be fun to build a basic example in React, and then contrast
it with the same example in Om.

First lets setup the page where our example will live. We\'re going to want a
container for the React root component, which we\'ll give the id `app`, and we\'ll
include the React library and the JSX transformer.
{% highlight html %}
    <html>
        <body>
            <div id='app'></div>
            <script src="http://fb.me/react-0.8.0.js"></script>
            <script src="http://fb.me/JSXTransformer-0.8.0.js"></script>
            <script type='text/jsx'>
                /**
                * @jsx React.DOM
                */
                // Your code goes here
            </script>
        </body>
    </html>
{% endhighlight %}

Note the `@jsx React.DOM` in the block comment at the top of the script tag
where our code will go. This is required for the JSX transformer to be able to
process elements in our components from this:

{% highlight html %}
    <a href="http://google.com">Click Me</a>
{% endhighlight %}

Into this:

{% highlight html %}
    React.DOM.a( {href:"http://google.com"}, "Click Me")
{% endhighlight %}

JSX is completely optional, but it is a little bit easier to visualize the
arrangement of nodes, so I\'ll be using it for this example.

Let\'s start writing some code. Our first goal here is to create a text input
where any entered text is rendered out to some node.

First we\'ll create our root component and pass it some initial state:

{% highlight html %}
    var VariableText = React.createClass({
        render: function() {
            return (
                <p>{this.props.defaultText}</p>
            );
        }
    });
    React.renderComponent(
        <VariableText defaultText="Some text" />,
        document.getElementById('app')
    );
{% endhighlight %}

What we\'re doing here is create a component called `VariableText` that knows how
to render itself. `render` simply creates a `<p>` tag and inserts the
`defaultText` inside of it. The second argument to `renderComponent` is simply
explaining where to insert our component on our page.

This is great, but kinda boring. Let\'s create our text input and change this
text when we type into it. This next snippet will be a little bit bigger, but
all we really want to do is create a `TextInput` component that renders an
`input` tag and responds to changes. We\'ll also want to pass it our default text
to set it\'s initial value.

{% highlight html %}
    var TextInput = React.createClass({
        handleChange: function() {
            var text = this.refs.text.getDOMNode().value;
            this.props.onTextChanged(text);
            return false;
        },
        render: function() {
            return (
                <div>
                    <input
                        ref="text"
                        onChange={this.handleChange}
                        type='text'
                        value={this.props.inputValue}
                    />
                </div>
            );
        }
    });

    var VariableText = React.createClass({
        getInitialState: function() {
            return {
                text: this.props.defaultText
           }
        },
        handleTextChange: function(text) {
            this.setState({text: text});
        },
        render: function() {
            return (
                <div>
                    <TextInput
                        onTextChanged={this.handleTextChange}
                        inputValue={this.state.text}
                    />
                    <p>{this.state.text}</p>
                </div>
            );
        }
    });
{% endhighlight %}

We\'ve had to change our `VariableText` component since we\'ll need to introduce
some mutable state, the value of the text input, into our app. The
`getInitialState` function is caled once, before the component is mounted. The
return value of this function will be set to the initial `state` attribute of
this component. Here, we\'re setting it the default text property. `VariableText`
is going to be our root component, and will any state changes based on events
triggered on it\'s children.

Our first child component is `TextInput`. As mentioned before, this component
renders an input tag and calls the component\'s `handleChange` function whenever
it's value changes. `handleChange` gets the value from the input via the `refs`
attribute. When we create components in `render`, we can attach a special
property to it that lets us refer back to it later. Once we get the value, we
execute a callback that was assigned in our root component. This is the typical
way a child can communicate with it\'s parent, and we\'ll see this pattern occur
throughout the rest of the example.

If you\'re following along on your own, this is what you should have so far:
<div class='highlight example' id="ex1"> </div>

Now let\'s introduce a slider to change the font size of our output text. We\'ll
create a `FontSizeSlider` component that again renders an `input` tag.
{% highlight html %}
    var FontSizeSlider = React.createClass({
        handleChange: function() {
            var value = this.refs.slider.getDOMNode().value;
            this.props.onSliderChanged(value);
            return false;
        },
        render: function() {
            return (
                <div>
                    <input
                        ref="slider"
                        onChange={this.handleChange}
                        value={this.props.size}
                        type='range'
                        min="9"
                        max="50"
                        step="0.2" 
                    />
                    <span> Font Size: {this.props.size} </span>
                </div>
            );
        }
    });
{% endhighlight %}
This should look very similar to the `TextInput` component. Here is what changed
on `VariableText`:

{% highlight html %}
    getInitialState: function() {
        return {
            size: this.props.defaultSize,
            text: this.props.defaultText,
        }
    },
    handleFontSizeChange: function(size) {
        this.setState({size: size});
        this.refs.outputText.getDOMNode().style.fontSize = size + "px";
    },
    render: function() {
        return (
            <div>
                <TextInput
                    onTextChanged={this.handleTextChange}
                    inputValue={this.state.text}
                />
                <FontSizeSlider
                    onSliderChanged={this.handleFontSizeChange}
                    size={this.state.size}
                />
                <p ref='outputText'>{this.state.text}</p>
            </div>
        );
    }
{% endhighlight %}
Again, this should look similar to the previous change. All we\'ve done is add
another child component and react to it changing it the same way as `TextInput`.

The `defaultSize` prop will also need to be passed into the root component:
{% highlight html %}
    <VariableText defaultText="Some text" defaultSize={15}/>,
{% endhighlight %}

You should now see something like the following;
<div class='highlight example' id="ex2"> </div>

Let\`s create a few more sliders and I\'ll show you how React gives you the
ability to reduce code duplication. These sliders will control the red, green,
and blue levels of our output text.

Since these sliders will respond to change similarly to our `FontSizeSlider`
component, we\'ll create a mixin: 

{% highlight html %}
    var HandleSliderChangeMixin = {
        handleChange: function() {
            var value = this.refs.slider.getDOMNode().value;
            this.props.onSliderChanged(value);
            return false;
        }
    };
{% endhighlight %}

Each of these color sliders will be pretty similar. They will all range from 0
to 255, and we'll want to give it a label and display it\'s value. Let\s create
a generic component first:

{% highlight html %}
    var FontColorSlider = React.createClass({
        mixins: [HandleSliderChangeMixin],
        render: function() {
            return (
                <div>
                    <input
                        ref="slider"
                        onChange={this.handleChange}
                        value={this.props.value}
                        type='range'
                        min="0"
                        max="255"
                        step="1"
                    />
                    <label>{this.props.label}: {this.props.value}</label>
                </div>
            );
        }
    });
{% endhighlight %}

Not that we use the `HandleSliderChangeMixin` here. We\'ll also want to update
`FontSizeSlider` to use this mixin.

Next we\'ll create a component that will create a `FontColorSlider` for each
color value and communicate to our root component with the new values.

{% highlight html %}
    var FontColorSliders = React.createClass({
        handleChange: function(r, g, b) {
            this.props.onColorsChanged({r: r, g: g, b: b});
        },
        handleRedChange: function(value) {
            this.handleChange(value, this.props.colors.g, this.props.colors.b);
        },
        handleGreenChange: function(value) {
            this.handleChange(this.props.colors.r, value, this.props.colors.b);
        },
        handleBlueChange: function(value) {
            this.handleChange(this.props.colors.r, this.props.colors.g, value);
        },
        render: function() {
            return (
                <div>
                    <FontColorSlider
                        onSliderChanged={this.handleRedChange}
                        label="Red"
                        value={this.props.colors.r}
                    />
                    <FontColorSlider
                        onSliderChanged={this.handleGreenChange}
                        label="Green"
                        value={this.props.colors.g}
                    />
                    <FontColorSlider
                        onSliderChanged={this.handleBlueChange}
                        label="Blue"
                        value={this.props.colors.b}
                    />
                </div>
            );
        }
    });
{% endhighlight %}

Here are the changes to `WariableText` that we'll need to make:
{% highlight html %}
    getInitialState: function() {
        return {
            size: this.props.defaultSize,
            text: this.props.defaultText,
            colors: {r:0, g:0, b:0}
        }
    },
    colorsToRGB: function(colors) {
        return "rgb(" + colors.r + "," + colors.g + "," + colors.b + ")";
    },
    handleColorsChange: function(colors) {
        this.setState({colors: colors});
        this.refs.outputText.getDOMNode().style.color = this.colorsToRGB(colors);
    }
{% endhighlight %}

Don\'t forget to add our new component to the `render` method:
{% highlight html %}
    <FontColorSliders
        onColorsChanged={this.handleColorsChange}
        colors={this.state.colors}
    />
{% endhighlight %}

Here is the final product:
<div class='highlight example' id="ex3"> </div>

The full source for this app can be found [here](https://gist.github.com/mcramm/8636822).

Most of this should be pretty straight forward. Again, the goal here was to
create something simple to get your feet wet with. There are a few opportunites
to make things even simpler, but I\'ll leave that as an exercise for the reader.

If you plan on exploring more of React, then I would recommend going through
their [Tutorial](http://facebook.github.io/react/docs/tutorial.html), and
checking out the different [lifecycle methods](http://facebook.github.io/react/docs/component-specs.html).

In an upcoming post, I'll be creating a similar app in [Om](https://github.com/swannodette/om).

<script src="http://fb.me/react-0.8.0.js"></script>
<script src="/js/react_intro/build/ex1.js"></script>
<script src="/js/react_intro/build/ex2.js"></script>
<script src="/js/react_intro/build/ex3.js"></script>
