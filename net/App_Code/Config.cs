using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;

/// <summary>
/// Config 的摘要说明
/// </summary>
public static class Config
{
    public static dynamic Items
    {
        get
        {
            if (_Items == null)
            {
                _Items = BuildItems();
            }
            return _Items;
        }
    }
    private static dynamic _Items;
    private static dynamic BuildItems()
    {
        var http = HttpContext.Current;
        var actionPrefix = "/ueditor/net/controller.ashx?action=";
        var uploadBasePath = "/ueditor/net/";
        return new
        {
            // 上传文件保存目录
            savePath = new String[] { "upload/" },
            nameFormat = "{time}/{rand:6}",

            imageUrl = actionPrefix + "uploadimage",
            imagePath = uploadBasePath,
            imageFieldName = "upfile",
            imageMaxSize = 2 * 1024, // in kb
            imageAllowFiles = new String[] { ".png", ".jpg", ".jpeg", ".gif", ".bmp" },
            imageCompressEnable = true,
            imageCompressBorder = 1600,
            imageInsertAlign = "none",

            scrawlUrl = actionPrefix + "uploadscrawl",
            scrawlPath = uploadBasePath,
            scrawlFieldName = "upfile",
            scrawlInsertAlign = "none",
            scrawlMaxSize = 2 * 1024, // in kb
            scrawlAllowFiles = new String[] { ".png", ".jpg" },

            snapscreenHost = http.Request.Url.Host,
            snapscreenServerUrl = actionPrefix + "uploadimage",
            snapscreenPath = uploadBasePath,
            snapScreenServerPort = http.Request.Url.Port,
            snapscreenInsertAlign = "none",

            imageManageUrl = actionPrefix + "listimage",
            imageManagerPath = uploadBasePath,
            imageManagerListSize = 20,
            imageManagerInsertAlign = "none",

            catcherLocalDomain = new String[] { 
                    "127.0.0.1",
                    "localhost",
                    "img.baidu.com"
                },
            catcherUrl = actionPrefix + "catchimage",
            catcherPath = uploadBasePath,
            catcherFieldName = "source",
            catcherMaxSize = 2 * 1024, // in kb
            catcherAllowFiles = new String[] { ".png", ".jpg", ".jpeg", ".gif", ".bmp" },

            fileUrl = actionPrefix + "uploadfile",
            filePath = uploadBasePath,
            fileFieldName = "upfile",
            fileMaxSize = 20 * 1024, // in kb
            fileAllowFiles = new String[] { ".rar", ".zip", ".tar", ".gz", ".7z", "bz2", ".cab", ".iso",
        ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf",
        ".txt", ".md", ".xml" },

            videoUrl = actionPrefix + "uploadvideo",
            videoPath = uploadBasePath,
            videoFileName = "upfile",
            videoMaxSize = 400 * 1024, // in kb
            videoAllowFiles = new String[] { ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg", ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid" }
        };
    }
 
    public static T GetValue<T>(string key)
    {
        Type t = Items.GetType() as Type;
        return (T)t.GetProperty(key).GetValue(Items, null);
    }

    public static String[] GetStringList(string key)
    {
        return GetValue<String[]>(key);
    }

    public static String GetString(string key)
    {
        return GetValue<String>(key);
    }

    public static int GetInt(string key)
    {
        return GetValue<int>(key);
    }
}