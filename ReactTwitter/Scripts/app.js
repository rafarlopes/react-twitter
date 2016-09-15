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
            <div className="row">
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
            <form className="form-signin col-md-4 col-md-offset-4" onSubmit={this.handleSubmit}>
                <h2 className="form-signin-heading">Please sign in</h2>
                <label htmlFor="inputLogin" className="sr-only">Login</label>
                <input name="inputLogin" className="form-control" type="text" placeholder="Your login" value={this.state.user} onChange={this.handleLoginChange} required />
                <button type="submit" className = "btn btn-lg btn-primary btn-block" > Sign in </button>
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
            parentTweetId: parentTweet ? parentTweet.id : null
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
            <div className="col-md-12">
                <TweetForm onTweetSubmit={this.handleTweetSubmit}/>
                <h3>Tweets</h3>
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
            <form onSubmit={this.handleSubmit}>
                <div className="input-group">
                    <label htmlFor="tweet" className="sr-only">Tweet</label>
                    <input className="form-control" name="tweet" type="text" placeholder="What's happening?" value={this.state.tweet} onChange={this.handleTweetChange} required maxLength="140"/>
                    <span className="input-group-btn">
                        <button className="btn btn-primary" type="submit">Tweet!</button>
                    </span>
                </div>
            </form>
        );
    }
});

var TweetList = React.createClass({
    render: function() {
        var tweetListCompoment = this;
        return (
            <div className="tweetList">
                {
                    this.props.tweets.map(function(tweet) {
                        return (
                            <div key={tweet.id} className="thumbnail">
                                <TweetConversation tweet={tweet}>
                                    <Tweet tweet={tweet} onTweetSubmit={tweetListCompoment.props.onTweetSubmit} />
                                </TweetConversation>
                                <ReplyButton tweet={tweet} onTweetSubmit={tweetListCompoment.props.onTweetSubmit}/>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
});

var Tweet = React.createClass({
    render: function() {
        return (
            <div className="caption" onClick={this.props.onClick}>
                <h4>@{this.props.tweet.user}</h4> 
                <p>{this.props.tweet.message}</p>
            </div>
        );
    }
});

var ReplyButton = React.createClass({
    getInitialState: function () {
        return { showReplyFormModal: false };
    },
    handleReplyFormHideModal: function () {
        this.setState({ showReplyFormModal: false });
    },
    handleReplyFormShowModal: function (){
        this.setState({ showReplyFormModal: true });
    },
    render: function() {
        var replyModal = this.state.showReplyFormModal 
            ? <TweetReplyModal onHideModal={this.handleReplyFormHideModal} tweet={this.props.tweet} onTweetSubmit={this.props.onTweetSubmit}/>
            : null;

        return (
            <div>
                <button className="btn btn-primary btn-block" onClick={this.handleReplyFormShowModal}>Reply</button>
                {replyModal}
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
                            <label>@{this.props.tweet.user}: </label>
                            <p>{this.props.tweet.message}</p>
                            <TweetForm onTweetSubmit={this.handleSubmit} tweet={this.state.reply} parentTweet={this.props.tweet}/>
                        </div>;

        return (
            <Modal title="Tweet Reply" body={modalBody} onHideModal={this.props.onHideModal}/>
        );
    }
});

var TweetConversation = React.createClass({
    getInitialState: function () {
        return { showConversationModal: false };
    },
    handleConversationHideModal: function () {
        this.setState({ showConversationModal: false });
    },
    handleConversationShowModal: function (){
        this.setState({ showConversationModal: true });
    },
    render: function() {
        var conversationModal = this.state.showConversationModal 
            ? <TweetConversationModal onHideModal={this.handleConversationHideModal} tweet={this.props.tweet}/>
            : null;

        return (
            <div onClick={this.handleConversationShowModal}>
                { this.props.children }
                { conversationModal }
            </div>
        );
    }
});

var TweetConversationModal = React.createClass({
    render: function() {
        var modalBody = <ConversationList tweet={this.props.tweet}/>;
        return (
            <Modal title="Conversation" body={modalBody} onHideModal={this.props.onHideModal} />
        );
    }
});

var ConversationList = React.createClass({
    render: function() {
        var replies = this.props.tweet.replies
            ? this.props.tweet.replies.map(function(tweet) {
                    return <Tweet key = { tweet.id } tweet = { tweet }/>;
                }) 
            : null;
        return (
            <div>
                <Tweet key={this.props.tweet.id} tweet={this.props.tweet} />
                {replies}
            </div>
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