var TwitterApp = React.createClass({
    getInitialState: function() {
        return { user: '' };
    },
    handleUserLogin: function(user) {
        this.setState({user: user});
    },
    render: function() {
        var componentToRender = this.state.user 
            ? <TwitterHome user={this.state.user}/>
            : <Login onLoginSubmit={this.handleUserLogin}/>;

        return (
            <div>
                {componentToRender}
            </div>
        );
    }
});

var Login = React.createClass({
    getInitialState: function() {
        return { user: '' };
    },
    handleLoginChange: function(e) {
        this.setState({user: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var user = this.state.user.trim();

        if (!user)
            return;

        this.props.onLoginSubmit(user);
        this.setState({user: ''});
    },
    render: function() {
        return (
            <form className="loginForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your login" value={this.state.user} onChange={this.handleLoginChange} />
                <input type="submit" value="Login" />
            </form>
        );
    }
});

var TwitterHome = React.createClass({
    getInitialState: function() {
        return { tweets: [] , user: this.props.user };
    },
    handleTweetSubmit: function(message) {
        var tweets = this.state.tweets;
        
        var tweet = {
            user: this.state.user,
            date: Date.now(),
            message: message
        };
        
        var newTweets = tweets.concat([tweet]);
        this.setState({ tweets: newTweets, user: this.state.user });
        
    },
    render: function() {
        return (
            <div>
                <TweetForm onTweetSubmit={this.handleTweetSubmit}/>
                <p>Tweets</p>
                <TweetList tweets={this.state.tweets}/>
            </div>
        );
    }
});

var TweetForm = React.createClass({
    getInitialState: function() {
        return { tweet: '' };
    },
    handleTweetChange: function(e) {
        this.setState({tweet: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var tweet = this.state.tweet.trim();

        if (!tweet)
            return;

        this.props.onTweetSubmit(tweet);
        this.setState({tweet: ''});
    },
    render: function() {
        return (
            <form className="tweetForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="What's happening?" value={this.state.tweet} onChange={this.handleTweetChange} />
                <input type="submit" value="Tweet!" />
            </form>
        );
    }
});

var TweetList = React.createClass({
    render: function() {
        var tweetNodes = this.props.tweets.map(function(tweet) {
            return (
              <Tweet user={tweet.user} tweet={tweet.message} />
            );
        });
        return (
            <div className="tweetList">
                {tweetNodes}
            </div>
        );
    }
});

var Tweet = React.createClass({
    render: function() {
        return (
            <div className="tweet">
                <b>@{this.props.user}:</b> {this.props.tweet}
            </div>
        );
    }
});

ReactDOM.render(
    <TwitterApp />,
    document.getElementById('app')
);