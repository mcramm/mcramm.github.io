---
layout: post
---

{% highlight html %}
    <html>
        <body>
            <div id='app'></div>
            <script src="http://fb.me/react-0.8.0.js"></script>
            <script type='text/jsx'>
                /**
                * @jsx React.DOM
                */
                // Your code goes here
            </script>
        </body>
    </html>
{% endhighlight %}

{% highlight html %}
    var TextInput = React.createClass({
        handleChange: function() {
            var text = this.refs.text.getDOMNode().value.trim();
            this.props.onTextChanged(text);
            return false;
        },
        render: function() {
            return (
                <div>
                    <input ref="text" onChange={this.handleChange} type='text' value={this.props.inputValue} />
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
                    <p ref='text'>{this.state.text}</p>
                </div>
            );
        }
    });

    React.renderComponent(
        <VariableText defaultText="Some text" />,
        document.getElementById('ex1')
    );
{% endhighlight %}

<div class='highlight example' id="ex1"> </div>
## Ex 2
<div class='highlight example' id="ex2"> </div>
## Ex 3
<div class='highlight example' id="ex3"> </div>

<script src="http://fb.me/react-0.8.0.js"></script>
<script src="/js/react_intro/build/ex1.js"></script>
<script src="/js/react_intro/build/ex2.js"></script>
<script src="/js/react_intro/build/ex3.js"></script>
