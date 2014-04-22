using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Crawler 的摘要说明
/// </summary>
public class CrawlerHandler : Handler
{
    public CrawlerHandler(HttpContext context) : base(context) { }

    public override void Process()
    {
        Request.QueryString.GetValues("source");
        throw new NotImplementedException();
    }
}