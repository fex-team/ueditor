<%@ CODEPAGE=65001 %>
<!--#include file="ASPIncludeFile.asp"-->
<%
'********************************************************
'   uEditor ASP涂鸦上传
'   By ZSX(http://www.zsxsoft.com)
'   Z-Blog (http://www.rainbowsoft.org)
'********************************************************
Dim UploadPath
UploadPath=uEditor_ASPUploadPath & "\" & Year(Now) &  Month(Now) &  Day(Now) & "\"



'在这里插入权限控制代码。

Dim t
Select Case Request.QueryString("action")
	Case "tmpImg" '此处为涂鸦上传背景
		Dim objUpload,isOK
		UploadPath=uEditor_tmpImg & "\" & Year(Now) &  Month(Now) &  Day(Now) & "\"
		CreatDirectoryByCustomDirectory UploadPath '创建上传文件夹
		Set objUpload=New UpLoadClass
		objUpload.AutoSave=2
		objUpload.Charset=uEditor_ASPCharset
		objUpload.FileType="jpg/jpeg/png/bmp/gif"'设置允许上传扩展名，空为全部
		objUpload.savepath=uEditor_ASPPath&UploadPath
		objUpload.maxsize=1024000
		objUpload.open
		objUpload.Save uEditor_ASPFormName,0
		Response.Write "<script>parent.ue_callback('" & ReplacePath(UploadPath,True) & objUpload.form(uEditor_ASPFormName) & "','" &objUpload.Error2Info(uEditor_ASPFormName)&"')</script>"
		Set objUpload=Nothing
	Case Else
		t=RandomFileName("jpg")
		CreatDirectoryByCustomDirectory UploadPath
		Call UnpackBase64(Request.Form("content"),uEditor_ASPPath&UploadPath&t)
		Response.Write "{'url':'" & ReplacePath(UploadPath&t,True)& "',state:'SUCCESS'}"
		On Error Resume Next
		Dim oFSO
		Set oFSO=Server.CreateObject("scripting.filesystemobject")
		oFSO.DeleteFolder Server.MapPath(uEditor_tmpImg),True  '删除临时文件夹
		Set oFSO=Nothing
End Select

%>