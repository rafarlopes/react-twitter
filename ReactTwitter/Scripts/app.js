var TwitterApp = React.createClass({
    getInitialState: function() {
        return { user: '' };
    },
    handleUserLogin: function(user) {
        this.setState({user: user});
    },
    render: function() {
        var componentToRender = this.state.user 
            ? <TwitterHome/>
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
   render: function() {
       return (
            <p>Tweets</p>
        );
   }
});

ReactDOM.render(
    <TwitterApp />,
    document.getElementById('app')
);