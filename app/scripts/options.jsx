/** @jsx React.DOM */

'use strict';

var ConfigForm = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    chrome.storage.sync.get('user_id', function(result) {
      this.setState({value: result.user_id});
    }.bind(this));
  },
  handleSubmit: function() {
    var user_id = this.refs.user_id.getDOMNode().value.trim();
    if (!user_id) {
      return false;
    }
    chrome.storage.sync.set({'user_id': user_id}, function() {
      console.log('Saved');
      this.setState({value: user_id});
    }.bind(this));
    return false;
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  render: function() {
    return (
      <form className='configForm' onSubmit={this.handleSubmit}>
        <h3>StackExchange ID</h3>
        <input type='text' placeholder='What is your ID?' ref='user_id' value={this.state.value} onChange={this.handleChange}/>
        <br />
        <br />
        <input type='submit' value='Save' />
      </form>
    );
  }
});

document.addEventListener('DOMContentLoaded', function () {

  React.renderComponent(
    <ConfigForm />,
    document.getElementById('formID')
  );
});
