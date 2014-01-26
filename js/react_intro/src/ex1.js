/**
* @jsx React.DOM
*/

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
                <div className='example-text'>{this.state.text}</div>
            </div>
        );
    }
});

React.renderComponent(
    <VariableText defaultText="Some text" />,
    document.getElementById('ex1')
);
