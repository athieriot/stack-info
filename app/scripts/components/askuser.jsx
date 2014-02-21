/** @jsx React.DOM */

'use strict';

define(['components/stackuser',
        'utils/stackapi',
        'bower/react/react',
        'bower/oauth-js/oauth'], function(StackUser, StackApi, React, OAuth) {

  OAuth.initialize('ZNODsgRCJWaVZoOlySj7s6nhRhQ');

  var AskUser = React.createClass({

    getInitialState: function() {
      return {};
    },

    componentWillMount: function() {
      chrome.storage.sync.get('user_id', function(result) {
        this.setState({user_id: result.user_id});
      }.bind(this));
    },

    handleClick: function() {
      OAuth.popup("stackexchange", function(error, result) {
        if (!error) {
          StackApi.me(result.access_token, function(err, user_id) {

            chrome.storage.sync.set({'user_id': user_id}, function() {
              this.setState({user_id: user_id});
            }.bind(this));
          }.bind(this));            
        }
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
          <div className="container text-center">
            
            <button type="button" className="btn btn-primary" onClick={this.handleClick}>Authenticate</button>
          </div>
        );
      }
    }
  });

  return AskUser;
});
