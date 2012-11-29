<%@ CODEPAGE=65001 %>
<!--#include file="ASPIncludeFile.asp"-->
<%
'********************************************************
'   uEditor ASP图片上传
'   By ZSX(http://www.zsxsoft.com)
'   Z-Blog (http://www.rainbowsoft.org)
'********************************************************


'请在这里插入权限控制代码，比如数据库初始化什么的

Dim UploadPath
UploadPath=uEditor_ASPUploadPath & "\" & Year(Now) &  Month(Now) &  Day(Now) & "\"
Dim objUpload,isOK
CreatDirectoryByCustomDirectory UploadPath '创建上传文件夹
Set objUpload=New UpLoadClass
objUpload.AutoSave=2
objUpload.Charset=uEditor_ASPCharset
objUpload.FileType="jpg/jpeg/png/bmp/gif"'设置允许上传扩展名，空为全部
objUpload.savepath=uEditor_ASPPath&UploadPath
objUpload.maxsize=1024000 '设置最大上传大小,单位为字节，0表示不受限
objUpload.open
objUpload.Save uEditor_ASPFormName,0 '0为自动重命名，1为改名

'如果要对上传成功后的文件进行任何处理，在这里是再好不过的了。
'上传文件相对路径：uEditor_ASPUploadPath&objUpload.form(uEditor_ASPFormName)


Dim strJSON
strJSON="{'state':'"& objUpload.Error2Info(uEditor_ASPFormName) & "',"'输出状态,SUCCESS代表成功
strJSON=strJSON&"'url':'"& ReplacePath(UploadPath&objUpload.form(uEditor_ASPFormName),True) &"'," '输出上传后URL
strJSON=strJSON&"'fileType':'"&objUpload.form(uEditor_ASPFormName&"_Ext")&"'," '输出扩展名
strJSON=strJSON&"'title':'"& htmlspecialchars(objUpload.form("pictitle"))&"',"  '输出图片标题
strJSON=strJSON&"'original':'"&objUpload.Form(uEditor_ASPFormName&"_Name")&"'}" '输出源文件名
response.write strJSON


%>