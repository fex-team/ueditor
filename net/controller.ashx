<%@ WebHandler Language="C#" Class="UEditorHandler" %>

using System;
using System.Web;
using System.IO;
using System.Collections;
using Newtonsoft.Json;

public class UEditorHandler : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        Handler action = null;
        switch (context.Request["action"])
        {
            case "config":
                action = new ConfigHandler(context);
                break;
            case "uploadimage":
                action = new UploadHandler(context, new UploadConfig()
                {
                    AllowExtensions = Config.GetStringList("imageAllowFiles"),
                    FileNamingFormat = Config.GetString("nameFormat"),
                    SavePath = Config.GetStringList("savePath")[0],
                    SizeLimit = Config.GetInt("imageMaxSize") * 1024,
                    UploadFieldName = Config.GetString("imageFieldName")
                });
                break;
            case "uploadscrawl":
                action = new UploadHandler(context, new UploadConfig()
                {
                    AllowExtensions = Config.GetStringList("scrawlAllowFiles"),
                    FileNamingFormat = Config.GetString("nameFormat"),
                    SavePath = Config.GetStringList("savePath")[0],
                    SizeLimit = Config.GetInt("scrawlMaxSize") * 1024,
                    UploadFieldName = Config.GetString("scrawlFieldName"),
                    Base64 = true,
                    Base64Filename = "scrawl.png"
                });
                break;
            case "uploadvideo":
                action = new UploadHandler(context, new UploadConfig()
                {
                    AllowExtensions = Config.GetStringList("videoAllowFiles"),
                    FileNamingFormat = Config.GetString("nameFormat"),
                    SavePath = Config.GetStringList("savePath")[0],
                    SizeLimit = Config.GetInt("videoMaxSize") * 1024,
                    UploadFieldName = Config.GetString("videoFieldName")
                });
                break;
            case "uploadfile":
                action = new UploadHandler(context, new UploadConfig()
                {
                    AllowExtensions = Config.GetStringList("fileAllowFiles"),
                    FileNamingFormat = Config.GetString("nameFormat"),
                    SavePath = Config.GetStringList("savePath")[0],
                    SizeLimit = Config.GetInt("fileMaxSize") * 1024,
                    UploadFieldName = Config.GetString("file FieldName")
                });
                break;
            case "listimage":
                action = new ListFileManager(context);
                break;
            case "catchimage":
                action = new CrawlerHandler(context);
                break;
            default:
                action = new NotSupportedHandler(context);
                break;
        }
        action.Process();
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}