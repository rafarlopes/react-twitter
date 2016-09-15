using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using ReactTwitter.DAL;
using ReactTwitter.Models;

namespace ReactTwitter.Controllers
{
    public class TweetsController : ApiController
    {
        readonly TwitterContext db = new TwitterContext();

        // GET: api/Tweets
        public IEnumerable<Tweet> GetTweets()
        {
            return db.Tweets.OrderByDescending(t => t.Date).ToList();
        }

        // GET: api/Tweets/5
        [ResponseType(typeof(Tweet))]
        public IHttpActionResult GetTweet(long id)
        {
            var tweet = db.Tweets.Find(id);

            return tweet == null 
                ? (IHttpActionResult) NotFound() 
                : Ok(tweet);
        }

        // POST: api/Tweets
        [ResponseType(typeof(Tweet))]
        public IHttpActionResult PostTweet(Tweet tweet)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            db.Tweets.Add(tweet);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tweet.Id }, tweet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}