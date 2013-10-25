<%@ LANGUAGE="VBSCRIPT" CODEPAGE="65001" %> 
<!--#include file="Uploader.Class.asp"-->
<!--#include file="json.asp"-->
<%

Dim tmpPath

tmpPath = "tmp/"

Session.CodePage = 65001
Response.AddHeader "Content-Type", "text/html;charset=utf-8"
SetLocale 2052

If Request.QueryString("action") = "tmpImg" Then
    UploadBackground
Else
    UploadScraw
End If

Sub UploadBackground    
    Dim up
    Set up = new Uploader    
    up.MaxSize = 1 * 1024 * 1024
    up.AllowType = Array(".gif", ".png", ".jpg", ".jpeg", ".bmp")
    up.SavePath = tmpPath
    up.FileField = "upfile"
    up.UploadForm()
    Response.Write "<script>parent.ue_callback('" + up.FilePath + "','" + up.State + "')</script>"
End Sub

Sub UploadScraw
    Dim content, up, json
    content = Request.Form("content")
    Set up = new Uploader
    up.UploadBase64(content)

    CleanUp

    Set json = jsObject()
    json("url") = up.FilePath
    json("state") = up.State
    
    Response.Write json.jsString()
End Sub

Sub CleanUp
    Dim fso, path
    Set fso = Server.CreateObject("Scripting.FileSystemObject")
    path = Server.MapPath(tmpPath)
    If fso.FolderExists(path) Then
        fso.DeleteFolder path, true
    End If
    Set fso = Nothing
End Sub
%>