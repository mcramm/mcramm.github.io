/**
* @jsx React.DOM
*/

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
            <div>
                <TextInput
                    onTextChanged={this.handleTextChange}
                    inputValue={this.state.text}
                />
                <FontSizeSlider
                    onSliderChanged={this.handleFontSizeChange}
                    size={this.state.size}
                />
                <div className='example-text' ref='text'>{this.state.text}</div>
            </div>
        );
    }
});

React.renderComponent(
    <VariableText defaultText="Some text" defaultSize={15}/>,
    document.getElementById('ex2')
);
