<%@ LANGUAGE="VBSCRIPT" CODEPAGE="65001" %> 
<!--#include file="Uploader.Class.asp"-->
<!--#include file="json.asp"-->
<%
    Dim content, up, json

    content = Request.Form("content")
    Set up = new Uploader
    up.UploadBase64(content)

    Set json = jsObject()
    json("url") = up.FilePath
    json("state") = up.State

    Session.CodePage = 65001
    Response.AddHeader "Content-Type", "text/html;charset=utf-8"
    SetLocale 2052
    
    Response.Write json.jsString()
%>