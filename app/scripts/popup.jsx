/** @jsx React.DOM */

'use strict';

var StackUser = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    chrome.storage.sync.get('user', function(result) {

      this.setState({user: result.user});
    }.bind(this));
  },
  render: function() {
    if (this.state.user) {
      return (
        <div className="content">
          <div className="media">
            <a className="pull-left" href={this.state.user.website_url}>
              <img className="media-object thumbnail" src={this.state.user.profile_image} alt={this.state.user.display_name} height="92px"/>
            </a>
            <div className="media-body pull-right">
              <h4 className="media-heading">{this.state.user.display_name.toString(16)}</h4>
              {this.state.user.location} <br />
              Reputation: <span className="badge">{this.state.user.reputation}</span><br />
              Badges:
                <span className="label label-warning">{this.state.user.badge_counts.gold}</span>
                <span className="label label-primary">{this.state.user.badge_counts.silver}</span>
                <span className="label label-danger">{this.state.user.badge_counts.bronze}</span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>Fetching user informations...</div>
      );
    }
  }
});

var AskUser = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    chrome.storage.sync.get('user_id', function(result) {
      this.setState({user_id: result.user_id});
    }.bind(this));
  },
  handleSubmit: function() {
    var user_id = this.refs.user_id.getDOMNode().value.trim();
    if (!user_id) {
      return false;
    }
    chrome.storage.sync.set({'user_id': user_id}, function() {
      console.log('Saved');
      this.setState({user_id: user_id});
    }.bind(this));
    return false;
  },
  render: function() {
    if (this.state.user_id) {
      return (
        <StackUser />
      );
    } else {
      return (
        <form className='askUser' onSubmit={this.handleSubmit}>
         <input type='text' placeholder='What is your ID?' ref='user_id' />
         <input type='submit' value='Save' />
        </form>
      );
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {

  React.renderComponent(
    <AskUser />,
    document.getElementById('content')
  );
});

//Have to make it work
chrome.runtime.getBackgroundPage(function () {
  console.log('Background page updated');
});
