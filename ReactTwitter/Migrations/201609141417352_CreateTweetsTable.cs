namespace ReactTwitter.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTweetsTable : DbMigration
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
                        ParentTweetId = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Tweets", t => t.ParentTweetId)
                .Index(t => t.ParentTweetId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Tweets", "ParentTweetId", "dbo.Tweets");
            DropIndex("dbo.Tweets", new[] { "ParentTweetId" });
            DropTable("dbo.Tweets");
        }
    }
}
