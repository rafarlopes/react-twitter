using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using ReactTwitter.Models;

namespace ReactTwitter.DAL
{
    public class TwitterInitializer : System.Data.Entity.DropCreateDatabaseIfModelChanges<TwitterContext>
    {
        protected override void Seed(TwitterContext context)
        {
            TwitterInitialData.Seed(context);
        }
    }

    public static class TwitterInitialData
    {
        public static void Seed(TwitterContext context)
        {
            var tweets = new List<Tweet>
            {
                new Tweet
                {
                    User = "user01", 
                    Message = "hey... using twitter! 1", 
                    Date = DateTime.Now
                },
                new Tweet
                {
                    User = "user01", 
                    Message = "hey... using twitter! 2", 
                    Date = DateTime.Now
                },
                new Tweet
                {
                    User = "user02", 
                    Message = "hey... using twitter! 3", 
                    Date = DateTime.Now
                },
                new Tweet
                {
                    User = "user02", 
                    Message = "hey... using twitter! 4", 
                    Date = DateTime.Now
                },
                new Tweet
                {
                    User = "user03", 
                    Message = "hey... using twitter! 5", 
                    Date = DateTime.Now
                }
            };

            tweets.ForEach(t => context.Tweets.Add(t));
            context.SaveChanges();

            var replies = new List<Tweet>
            {
                new Tweet
                {
                    User = "user02",
                    Message = "replying 1...",
                    Date = DateTime.Now,
                    ParentTweet = tweets.First()
                },
                new Tweet
                {
                    User = "user03",
                    Message = "replying 2...",
                    Date = DateTime.Now,
                    ParentTweet = tweets.First()
                },
                new Tweet
                {
                    User = "user04",
                    Message = "replying 3...",
                    Date = DateTime.Now,
                    ParentTweet = tweets.First()
                },
                new Tweet
                {
                    User = "user01",
                    Message = "replying 4...",
                    Date = DateTime.Now,
                    ParentTweet = tweets.Last()
                }
            };

            replies.ForEach(t => context.Tweets.AddOrUpdate(t));
            context.SaveChanges();
        }
    }
}