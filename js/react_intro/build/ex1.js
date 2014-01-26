/**
* @jsx React.DOM
*/

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
            text: this.props.defaultText
       }
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
                React.DOM.div( {className:"example-text", ref:"text"}, this.state.text)
            )
        );
    }
});

React.renderComponent(
    VariableText( {defaultText:"Some text"} ),
    document.getElementById('ex1')
);
