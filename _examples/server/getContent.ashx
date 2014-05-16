<%@ WebHandler  Language="C#"  Class="getContent" %>
/**
 * Created by visual studio 2010
 * User: xuheng
 * Date: 12-3-6
 * Time: 下午21:23
 * To get the value of editor and output the value .
 */
using System;
using System.Web;

public class getContent : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/html";

        //获取数据
        string content = context.Server.HtmlEncode(context.Request.Form["myEditor"]);

        
        //存入数据库或者其他操作
        //-------------

        //显示
        context.Response.Write("<script src='../ueditor.parse.js' type='text/javascript'></script>");
        context.Response.Write(

            "<script>uParse('.content',{"+
                  "'rootPath': '../'"+
              "})"+
            "</script>");

        context.Response.Write("Content of First Editor: ");
        context.Response.Write("<div class='content'>" + context.Server.HtmlDecode(content) + "</div>");

    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}