<%@ WebHandler Language="C#" Class="scrawlImgUp" %>
<%@ Assembly Src="Uploader.cs" %>

using System;
using System.Web;
using System.IO;
using System.Collections;

public class scrawlImgUp : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/html";
        string action = context.Request["action"];

        if (action == "tmpImg")
        {
            //上传配置
            string pathbase = "tmp/";                                                          //保存路径
            int size = 2;                     //文件大小限制,单位mb                                                                                   //文件大小限制，单位KB
            string[] filetype = { ".gif", ".png", ".jpg", ".jpeg", ".bmp" };                    //文件允许格式

            //上传图片
            Hashtable info = new Hashtable();
            Uploader up = new Uploader();
            info = up.upFile(context, pathbase, filetype, size); //获取上传状态

            HttpContext.Current.Response.Write("<script>parent.ue_callback('" + info["url"] + "','" + info["state"] + "')</script>");//回调函数
        }
        else
        {
            string pathbase = "upload/";                                        //保存路径
            string tmpPath = "tmp/";               //临时图片目录       

            //上传图片
            Hashtable info = new Hashtable();
            Uploader up = new Uploader();
            info = up.upScrawl(context, pathbase, tmpPath, context.Request["content"]); //获取上传状态

            //向浏览器返回json数据
            HttpContext.Current.Response.Write("{'url':'" + info["url"] + "',state:'" + info["state"] + "'}");
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}