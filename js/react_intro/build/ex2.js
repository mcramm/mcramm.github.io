/**
* @jsx React.DOM
*/

var FontSizeSlider = React.createClass({displayName: 'FontSizeSlider',
    handleChange: function() {
        var value = this.refs.slider.getDOMNode().value;
        this.props.onSliderChanged(value);
        return false;
    },
    render: function() {
        return (
            React.DOM.div(null, 
                React.DOM.input(
                    {ref:"slider",
                    onChange:this.handleChange,
                    value:this.props.size,
                    type:"range",
                    min:"9",
                    max:"50",
                    step:"0.2"} 
                ),
                React.DOM.span(null,  " Font Size: ", this.props.size )
            )
        );
    }
});

var TextInput = React.createClass({displayName: 'TextInput',
    handleChange: function() {
        var text = this.refs.text.getDOMNode().value;
        this.props.onTextChanged(text);
        return false;
    },
    render: function() {
        return (
            React.DOM.div(null, 
                React.DOM.input(
                    {ref:"text",
                    onChange:this.handleChange,
                    type:"text",
                    value:this.props.inputValue}
                )
            )
        );
    }
});

var VariableText = React.createClass({displayName: 'VariableText',
    getInitialState: function() {
        return {
            size: this.props.defaultSize,
            text: this.props.defaultText,
        }
    },
    handleFontSizeChange: function(size) {
        this.setState({size: size});
        this.refs.text.getDOMNode().style.fontSize = size + "px";
    },
    handleTextChange: function(text) {
        this.setState({text: text});
    },
    render: function() {
        return (
            React.DOM.div(null, 
                TextInput(
                    {onTextChanged:this.handleTextChange,
                    inputValue:this.state.text}
                ),
                FontSizeSlider(
                    {onSliderChanged:this.handleFontSizeChange,
                    size:this.state.size}
                ),
                React.DOM.div( {className:"example-text", ref:"text"}, this.state.text)
            )
        );
    }
});

React.renderComponent(
    VariableText( {defaultText:"Some text", defaultSize:15}),
    document.getElementById('ex2')
);
