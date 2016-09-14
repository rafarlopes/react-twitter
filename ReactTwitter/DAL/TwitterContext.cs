using System.Data.Entity;
using ReactTwitter.Models;

namespace ReactTwitter.DAL
{
    public class TwitterContext : DbContext
    {
        public DbSet<Tweet> Tweets { get; set; }
    }
}