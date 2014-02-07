/** @jsx React.DOM */

'use strict';

var RewardProgress = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    callStackApi('/privileges', function(privileges) {
      
      chrome.storage.sync.get('user', function(result) {
        
        var next = privileges.items.filter(function(item) {
          return item.reputation > result.user.reputation;
        })[0];

        this.setState({toNext: (result.user.reputation *  100) / next.reputation, inlineText: result.user.reputation + " / " + next.reputation, nextText: next.short_description});
      }.bind(this));
    }.bind(this));
  },
  render: function() {
    if (this.state.toNext) {
      var style={width: this.state.toNext + "%" };

      return (
          <div className="container">
            <span>Next privilege: <strong>{this.state.nextText}</strong></span>
            <div className="progress">
              <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow={this.state.toNext} aria-valuemin="0" aria-valuemax="100" style={style}>
                <span className="sr-only">{this.state.toNext}% Complete</span>
                <span>{this.state.inlineText}</span>
              </div>
            </div>
          </div>
      );
    } else {
      return (
          <div></div>
      );
    }
  }
});

var decodeHtmlEntity = function(str) {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
};

var StackUser = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    chrome.storage.sync.get('user', function(result) {

      this.setState({user: result.user});
    }.bind(this));
  },
  openTab: function(event) {
    chrome.tabs.create({ url: event.target.parentElement.href });
  },
  render: function() {
    if (this.state.user) {
      return (
        <div className="content">
          <div className="black-band"></div>
          <div className="container inner-shadow">
            <div className="media">
              <a className="pull-left" href={this.state.user.website_url} onClick={this.openTab}>
                <img className="media-object thumbnail" src={this.state.user.profile_image} title={decodeHtmlEntity(this.state.user.display_name)} height="92px"/>
              </a>
              <div className="media-body">
                <a href={this.state.user.link} onClick={this.openTab}><h4 className="media-heading">{decodeHtmlEntity(this.state.user.display_name)}</h4></a>
                {this.state.user.location} <br /><br />
                <span className="badge-number"><img src="../images/gold_medal.png" height="16px"/> {this.state.user.badge_counts.gold}</span>
                <span className="badge-number"><img src="../images/silver_medal.png" height="16px"/> {this.state.user.badge_counts.silver}</span>
                <span className="badge-number"><img src="../images/bronze_medal.png" height="16px"/> {this.state.user.badge_counts.bronze}</span>
              </div>
            </div>
          <RewardProgress />
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
