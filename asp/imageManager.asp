<%@ CODEPAGE=65001 %>
<!--#include file="ASPIncludeFile.asp"-->
<%
'********************************************************
'   uEditor ASP图片遍历
'   By ZSX(http://www.zsxsoft.com)
'   Z-Blog (http://www.rainbowsoft.org)
'********************************************************

'请在这里插入权限控制代码，比如数据库初始化什么的

'以下代码仅为参考，遍历upload文件夹下的全部图片。实际使用中可能还需要从数据库里输出图片。
'反正输出的就是
'  地址1&uEditor_Split&地址2&uEditor_Split，依此类推。
' 由于需要遍历全部文件夹，需使用递归。
Dim strResponse()
Redim Preserve strResponse(-1)

If Request.Form("action")="get" Then
	Dim path
	path=Server.MapPath(uEditor_ASPUploadPath)
	
	Call GetAllFiles("",path)
    Response.Write Join(strResponse,uEditor_Split)
End If

Function GetAllFiles(foldername,path)
	'Stop
	Dim fso,objFolder,objFile,objSubFolder
	Set fso=Server.CreateObject("scripting.filesystemobject")
    Set objFolder=fso.GetFolder(path)   
	  
	For Each objSubFolder In objFolder.SubFolders
		Call GetAllFiles(objFolder.Name,objSubFolder.Path)
	Next

    For Each objFile in objFolder.Files
		If CheckRegExp(objFile.Name,"\.(gif|jpeg|jpg|png|bmp)$") Then 
			Redim Preserve strResponse(Ubound(strResponse)+1)
			strResponse(Ubound(strResponse))=ReplacePath(foldername&"\"&objFolder.Name&"\"&objFile.Name,True)
		End If
    Next 
    Set objFolder=nothing   
    Set objFiles=nothing   
    Set fso=nothing   
End Function
%>