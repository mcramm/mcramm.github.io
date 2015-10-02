/**
* @jsx React.DOM
*/
"use strict";

var HandleSliderChangeMixin = {
    handleChange: function handleChange() {
        var value = this.refs.slider.getDOMNode().value;
        this.props.onSliderChanged(value);
        return false;
    }
};

var FontSizeSlider = React.createClass({
    displayName: "FontSizeSlider",

    mixins: [HandleSliderChangeMixin],
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement("input", {
                ref: "slider",
                onChange: this.handleChange,
                value: this.props.size,
                type: "range",
                min: "9", max: "50",
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

var FontColorSlider = React.createClass({
    displayName: "FontColorSlider",

    mixins: [HandleSliderChangeMixin],
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement("input", {
                ref: "slider",
                onChange: this.handleChange,
                value: this.props.value,
                type: "range",
                min: "0",
                max: "255",
                step: "1"
            }),
            React.createElement(
                "label",
                null,
                this.props.label,
                ": ",
                this.props.value
            )
        );
    }
});

var FontColorSliders = React.createClass({
    displayName: "FontColorSliders",

    handleChange: function handleChange(r, g, b) {
        this.props.onColorsChanged({ r: r, g: g, b: b });
    },
    handleRedChange: function handleRedChange(value) {
        this.handleChange(value, this.props.colors.g, this.props.colors.b);
    },
    handleGreenChange: function handleGreenChange(value) {
        this.handleChange(this.props.colors.r, value, this.props.colors.b);
    },
    handleBlueChange: function handleBlueChange(value) {
        this.handleChange(this.props.colors.r, this.props.colors.g, value);
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(FontColorSlider, {
                onSliderChanged: this.handleRedChange,
                label: "Red",
                value: this.props.colors.r
            }),
            React.createElement(FontColorSlider, {
                onSliderChanged: this.handleGreenChange,
                label: "Green",
                value: this.props.colors.g
            }),
            React.createElement(FontColorSlider, {
                onSliderChanged: this.handleBlueChange,
                label: "Blue",
                value: this.props.colors.b
            })
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
            text: this.props.defaultText,
            colors: { r: 0, g: 0, b: 0 }
        };
    },
    colorsToRGB: function colorsToRGB(colors) {
        return "rgb(" + colors.r + "," + colors.g + "," + colors.b + ")";
    },
    handleFontSizeChange: function handleFontSizeChange(size) {
        this.setState({ size: size });
        this.refs.text.getDOMNode().style.fontSize = size + "px";
    },
    handleColorsChange: function handleColorsChange(colors) {
        this.setState({ colors: colors });
        this.refs.text.getDOMNode().style.color = this.colorsToRGB(colors);
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
            React.createElement(FontColorSliders, {
                onColorsChanged: this.handleColorsChange,
                colors: this.state.colors
            }),
            React.createElement(
                "div",
                { className: "example-text", ref: "text" },
                this.state.text
            )
        );
    }
});

React.render(React.createElement(VariableText, { defaultText: "Some text", defaultSize: 15 }), document.getElementById('ex3'));