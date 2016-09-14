﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactTwitter.Models
{
    public class Tweet
    {
        public Tweet()
        {
            Replies = new List<Tweet>();
        }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [MaxLength(140),Required]
        public string Message { get; set; }

        [Required]
        public string User { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public virtual ICollection<Tweet> Replies { get; set; }
    }
}