/**
* @jsx React.DOM
*/
var HandleSliderChangeMixin = {
    handleChange: function() {
        var value = this.refs.slider.getDOMNode().value;
        this.props.onSliderChanged(value);
        return false;
    }
};

var FontSizeSlider = React.createClass({displayName: 'FontSizeSlider',
    mixins: [HandleSliderChangeMixin],
    render: function() {
        return (
            React.DOM.div(null, 
                React.DOM.input(
                    {ref:"slider",
                    onChange:this.handleChange,
                    value:this.props.size,
                    type:"range",
                    min:"9", max:"50",
                    step:"0.2"}
                ),
                React.DOM.span(null,  " Font Size: ", this.props.size )
            )
        );
    }
});

var FontColorSlider = React.createClass({displayName: 'FontColorSlider',
    mixins: [HandleSliderChangeMixin],
    render: function() {
        return (
            React.DOM.div(null, 
                React.DOM.input(
                    {ref:"slider",
                    onChange:this.handleChange,
                    value:this.props.value,
                    type:"range",
                    min:"0",
                    max:"255",
                    step:"1"}
                ),
                React.DOM.label(null, this.props.label,": ", this.props.value)
            )
        );
    }
});

var FontColorSliders = React.createClass({displayName: 'FontColorSliders',
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
            React.DOM.div(null, 
                FontColorSlider(
                    {onSliderChanged:this.handleRedChange,
                    label:"Red",
                    value:this.props.colors.r}
                ),
                FontColorSlider(
                    {onSliderChanged:this.handleGreenChange,
                    label:"Green",
                    value:this.props.colors.g}
                ),
                FontColorSlider(
                    {onSliderChanged:this.handleBlueChange,
                    label:"Blue",
                    value:this.props.colors.b}
                )
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
            colors: {r:0, g:0, b:0}
        }
    },
    colorsToRGB: function(colors) {
        return "rgb(" + colors.r + "," + colors.g + "," + colors.b + ")";
    },
    handleFontSizeChange: function(size) {
        this.setState({size: size});
        this.refs.text.getDOMNode().style.fontSize = size + "px";
    },
    handleColorsChange: function(colors) {
        this.setState({colors: colors});
        this.refs.text.getDOMNode().style.color = this.colorsToRGB(colors);
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
                FontColorSliders(
                    {onColorsChanged:this.handleColorsChange,
                    colors:this.state.colors}
                ),
                React.DOM.div( {className:"example-text", ref:"text"}, this.state.text)
            )
        );
    }
});

React.renderComponent(
    VariableText( {defaultText:"Some text", defaultSize:15}),
    document.getElementById('ex3')
);
