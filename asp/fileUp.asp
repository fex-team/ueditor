<%@ LANGUAGE="VBSCRIPT" CODEPAGE="65001" %> 
<!--#include file="Uploader.Class.asp"-->
<!--#include file="json.asp"-->
<%
    'Author: techird
    'Date: 2013/09/29
	
	'配置
    'MAX_SIZE 在这里设定了之后如果出现大上传失败，请执行以下步骤
    'IIS 6 
        '找到位于 C:\Windows\System32\Inetsrv 中的 metabase.XML 打开，找到ASPMaxRequestEntityAllowed 把他修改为需要的值（如10240000即10M）
    'IIS 7
        '打开IIS控制台，选择 ASP，在限制属性里有一个“最大请求实体主题限制”，设置需要的值

    Dim up, json

    Set up = new Uploader
    up.MaxSize = 10 * 1024 * 1024
    up.AllowType = Array(".rar" , ".doc" , ".docx" , ".zip" , ".pdf" , ".txt" , ".swf" , ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg", ".ogg", ".mov", ".wmv", ".mp4", ".webm")
    up.SavePath = "upload/"
    up.FileField = "upfile"
    up.UploadForm()

    Session.CodePage = 65001
    Response.AddHeader "Content-Type", "text/html;charset=utf-8"
    SetLocale 2052

    Set json = jsObject()
    json("url") = up.FilePath
    json("original") = up.OriginalFileName
    json("state") = up.State
    json("fileType") = up.FileType

    Response.Write json.jsString()
%>