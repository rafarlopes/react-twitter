var TwitterApp = React.createClass({
    getInitialState: function() {
        return { user: '' };
    },
    handleUserLogin: function(user) {
        this.setState({user: user});
    },
    render: function() {
        var componentToRender = this.state.user 
            ? <TwitterHome user={this.state.user} url="/api/tweets/"/>
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
    loadTweetsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({tweets: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadTweetsFromServer();
    },
    handleTweetSubmit: function(message, parentTweet) {
        var tweets = this.state.tweets;
        
        var tweet = {
            user: this.state.user,
            date: new Date().toJSON(),
            message: message,
            parentTweet: parentTweet
        };

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: tweet,
            success: function(data) {
                tweets.unshift(data);
                this.setState({ tweets: tweets, user: this.state.user });
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({tweets: tweets});
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        
    },
    render: function() {
        return (
            <div>
                <TweetForm onTweetSubmit={this.handleTweetSubmit}/>
                <p>Tweets</p>
                <TweetList tweets={this.state.tweets} onTweetSubmit={this.handleTweetSubmit}/>
            </div>
        );
    }
});

var TweetForm = React.createClass({
    getInitialState: function() {
        return { tweet: this.props.tweet };
    },
    handleTweetChange: function(e) {
        this.setState({tweet: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var tweet = this.state.tweet.trim();

        if (!tweet)
            return;

        this.props.onTweetSubmit(tweet, this.props.parentTweet);
        this.setState({ tweet: '' });
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
        var props = this.props;
        var tweetNodes = props.tweets.map(function(tweet) {
            return (
              <Tweet tweet={tweet} onTweetSubmit={props.onTweetSubmit}/>
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
    getInitialState: function () {
        return { showReplyFormModal: false };
    },
    handleReplyFormHideModal: function () {
        this.setState({ showReplyFormModal: false });
    },
    handleReplyFormShowModal: function (){
        this.setState({ showReplyFormModal: true });
    },
    handleReply: function(e) {
        e.preventDefault();
    },
    render: function() {
        var modal = this.state.showReplyFormModal 
            ? <TweetReplyModal onHideModal={this.handleReplyFormHideModal} tweet={this.props.tweet} onTweetSubmit={this.props.onTweetSubmit}/>
            : null;

        return (
            <div className="tweet">
                <b>@{this.props.tweet.user}:</b> {this.props.tweet.message}
                <button className="replyButton" onClick={this.handleReplyFormShowModal}>Reply</button>
                {modal}
            </div>
        );
    }
});

var TweetReplyModal = React.createClass({
    getInitialState: function() {
        return { reply: '@' + this.props.tweet.user + ' ' };
    },
    handleSubmit: function(reply, parentTweet) {
        this.props.onTweetSubmit(reply, parentTweet);
        this.setState({reply: ''});
        this.props.onHideModal();
        $(ReactDOM.findDOMNode(this)).modal('hide');
    },
    render: function() {
        var modalBody = <div>
                            <p><b>@{this.props.tweet.user}: </b> {this.props.tweet.message}</p>
                            <TweetForm onTweetSubmit={this.handleSubmit} tweet={this.state.reply} parentTweet={this.props.tweet}/>
                        </div>;

        return (
            <Modal title="Tweet Reply" body={modalBody} onHideModal={this.props.onHideModal}/>
        );
    }
});

var Modal = React.createClass({
    componentDidMount: function (){
        $(ReactDOM.findDOMNode(this)).modal('show');
        $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.onHideModal);
    },
    render: function() {
        return (
            <div className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.body}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <TwitterApp />,
    document.getElementById('app')
);