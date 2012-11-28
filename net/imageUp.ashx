<%@ WebHandler Language="C#" Class="imageUp" %>
<%@ Assembly Src="Uploader.cs" %>

using System;
using System.Web;
using System.IO;
using System.Collections;

public class imageUp : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";

        //上传配置
        string pathbase = "upload/";                                                                    //保存路径
        int size = 2;           //文件大小限制,单位MB                                                                                                   //文件大小限制，单位MB
        string[] filetype = { ".gif", ".png", ".jpg", ".jpeg", ".bmp" };         //文件允许格式


        //上传图片
        Hashtable info = new Hashtable();
        Uploader up = new Uploader();
        info = up.upFile(context, pathbase, filetype, size);                               //获取上传状态

        string title = up.getOtherInfo(context, "pictitle");                              //获取图片描述

        string oriName = up.getOtherInfo(context, "fileName");                //获取原始文件名

        HttpContext.Current.Response.Write("{'url':'" + info["url"] + "','title':'" + title + "','original':'" + oriName + "','state':'" + info["state"] + "'}");  //向浏览器返回数据json数据
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}