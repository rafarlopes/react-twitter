﻿using System.Data.Entity;
using ReactTwitter.Models;

namespace ReactTwitter.DAL
{
    public class TwitterContext : DbContext
    {
        public DbSet<Tweet> Tweets { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tweet>()
                .HasMany(t => t.Replies)
                .WithOptional(t => t.ParentTweet)
                .Map(t => t.MapKey("ParentTweetId"));
        }
    }
}