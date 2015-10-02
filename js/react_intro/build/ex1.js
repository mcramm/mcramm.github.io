/**
* @jsx React.DOM
*/

'use strict';

var TextInput = React.createClass({
    displayName: 'TextInput',

    handleChange: function handleChange() {
        var text = this.refs.text.getDOMNode().value;
        this.props.onTextChanged(text);
        return false;
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement('input', {
                ref: 'text',
                onChange: this.handleChange,
                type: 'text',
                value: this.props.inputValue
            })
        );
    }
});

var VariableText = React.createClass({
    displayName: 'VariableText',

    getInitialState: function getInitialState() {
        return {
            text: this.props.defaultText
        };
    },
    handleTextChange: function handleTextChange(text) {
        this.setState({ text: text });
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(TextInput, {
                onTextChanged: this.handleTextChange,
                inputValue: this.state.text
            }),
            React.createElement(
                'div',
                { className: 'example-text' },
                this.state.text
            )
        );
    }
});

React.render(React.createElement(VariableText, { defaultText: 'Some text' }), document.getElementById('ex1'));