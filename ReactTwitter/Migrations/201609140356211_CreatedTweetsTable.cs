namespace ReactTwitter.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreatedTweetsTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Tweets",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Message = c.String(nullable: false, maxLength: 140),
                        User = c.String(nullable: false),
                        Date = c.DateTime(nullable: false),
                        ReplyToTweet_Id = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Tweets", t => t.ReplyToTweet_Id)
                .Index(t => t.ReplyToTweet_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Tweets", "ReplyToTweet_Id", "dbo.Tweets");
            DropIndex("dbo.Tweets", new[] { "ReplyToTweet_Id" });
            DropTable("dbo.Tweets");
        }
    }
}
