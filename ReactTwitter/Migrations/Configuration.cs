using ReactTwitter.DAL;

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
            TwitterInitialData.Seed(context);
        }
    }
}
