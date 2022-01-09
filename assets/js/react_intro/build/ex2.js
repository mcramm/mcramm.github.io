/**
* @jsx React.DOM
*/

"use strict";

var FontSizeSlider = React.createClass({
    displayName: "FontSizeSlider",

    handleChange: function handleChange() {
        var value = this.refs.slider.getDOMNode().value;
        this.props.onSliderChanged(value);
        return false;
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement("input", {
                ref: "slider",
                onChange: this.handleChange,
                value: this.props.size,
                type: "range",
                min: "9",
                max: "50",
                step: "0.2"
            }),
            React.createElement(
                "span",
                null,
                " Font Size: ",
                this.props.size,
                " "
            )
        );
    }
});

var TextInput = React.createClass({
    displayName: "TextInput",

    handleChange: function handleChange() {
        var text = this.refs.text.getDOMNode().value;
        this.props.onTextChanged(text);
        return false;
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement("input", {
                ref: "text",
                onChange: this.handleChange,
                type: "text",
                value: this.props.inputValue
            })
        );
    }
});

var VariableText = React.createClass({
    displayName: "VariableText",

    getInitialState: function getInitialState() {
        return {
            size: this.props.defaultSize,
            text: this.props.defaultText
        };
    },
    handleFontSizeChange: function handleFontSizeChange(size) {
        this.setState({ size: size });
        this.refs.text.getDOMNode().style.fontSize = size + "px";
    },
    handleTextChange: function handleTextChange(text) {
        this.setState({ text: text });
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(TextInput, {
                onTextChanged: this.handleTextChange,
                inputValue: this.state.text
            }),
            React.createElement(FontSizeSlider, {
                onSliderChanged: this.handleFontSizeChange,
                size: this.state.size
            }),
            React.createElement(
                "div",
                { className: "example-text", ref: "text" },
                this.state.text
            )
        );
    }
});

React.render(React.createElement(VariableText, { defaultText: "Some text", defaultSize: 15 }), document.getElementById('ex2'));