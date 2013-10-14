<%@ LANGUAGE="VBSCRIPT" CODEPAGE="65001" %> 
<!--#include file="Uploader.Class.asp"-->
<!--#include file="json.asp"-->

<%	
	Dim up, urls, paths, i, seperator, json

	seperator = "ue_separate_ue"
    paths = ""
    urls = Split( Request.Form("upfile") )

    Set up = new Uploader    
    up.MaxSize = 1 * 1024 * 1024
    up.AllowType = Array(".gif", ".png", ".jpg", ".jpeg", ".bmp")
    up.SavePath = "upload/"

    For i = 0 To UBound(urls)
    	up.UploadRemote(urls(i))
    	If up.State = "SUCCESS" Then
    		paths = paths & up.FilePath
    	Else
    		paths = paths & urls(i)
    	End If
    	If i < UBound(urls) Then
    		paths = paths & seperator
    	End If
    Next

    Set json = jsObject()
    json("url") = paths
    json("srcUrl") = Request.Form("upfile")
    json("tip") = "远程图片抓取成功！"

    Response.Write json.jsString()
%>