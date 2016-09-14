using System;
using System.Collections.Generic;
using System.Linq;
using ReactTwitter.DAL;
using ReactTwitter.Models;

namespace ReactTwitter.Migrations
{
    using System.Data.Entity.Migrations;

    internal sealed class Configuration : DbMigrationsConfiguration<TwitterContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(TwitterContext context)
        {
            var tweets = new List<Tweet>
            {
                new Tweet{User = "user01", Message = "hey... using twitter! 1", Date = DateTime.Now},
                new Tweet{User = "user01", Message = "hey... using twitter! 2", Date = DateTime.Now},
                new Tweet{User = "user02", Message = "hey... using twitter! 3", Date = DateTime.Now},
                new Tweet{User = "user02", Message = "hey... using twitter! 4", Date = DateTime.Now},
                new Tweet{User = "user03", Message = "hey... using twitter! 5", Date = DateTime.Now},
            };

            tweets.ForEach(t => context.Tweets.Add(t));
            context.SaveChanges();

            var replies = new List<Tweet>
            {
                new Tweet{User = "user02", Message = "replying 1...", Date = DateTime.Now, ReplyToTweet = tweets.First()},
                new Tweet{User = "user03", Message = "replying 2...", Date = DateTime.Now, ReplyToTweet = tweets.First()},
                new Tweet{User = "user04", Message = "replying 3...", Date = DateTime.Now, ReplyToTweet = tweets.First()},
                new Tweet{User = "user01", Message = "replying 4...", Date = DateTime.Now, ReplyToTweet = tweets.Last()},
            };

            replies.ForEach(t => context.Tweets.Add(t));
            context.SaveChanges();
        }
    }
}
