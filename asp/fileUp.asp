<%@ CODEPAGE=65001 %>
<!--#include file="ASPIncludeFile.asp"-->
<%
'********************************************************
'   uEditor ASP文件上传
'   By ZSX(http://www.zsxsoft.com)
'   Z-Blog (http://www.rainbowsoft.org)
'********************************************************

Dim Ext
Ext="rar/doc/docx/zip/pdf/txt/swf/wmv"'设置允许上传扩展名，空为全部。分隔符/

'请在这里插入权限控制代码，比如数据库初始化什么的
'注意：swfupload上传时会导致COOKIES消失，解决方法：
'修改dialogs\attachment\attachment.html，将COOKIES作为POST的数据提交。这个页面验证身份的代码也从Request.Cookies改成Request.Form。
'可以参阅Z-Blog 2.0的相关代码。

Dim UploadPath
UploadPath=uEditor_ASPUploadPath & "\" & Year(Now) &  Month(Now) &  Day(Now) & "\"
Dim objUpload,isOK
CreatDirectoryByCustomDirectory UploadPath '创建上传文件夹
Set objUpload=New UpLoadClass
objUpload.AutoSave=2
objUpload.Charset=uEditor_ASPCharset
objUpload.FileType=Ext
objUpload.savepath=uEditor_ASPPath&UploadPath
objUpload.maxsize=102400000 '设置最大上传大小,单位为字节，0表示不受限
objUpload.open
objUpload.Save uEditor_ASPFormName,0 '0为自动重命名，1为不改名


'如果要对上传成功后的文件进行任何处理，在这里是再好不过的了。
'上传文件相对路径：uEditor_ASPUploadPath&objUpload.form(uEditor_ASPFormName)


Dim strJSON
strJSON="{'state':'"& objUpload.Error2Info(uEditor_ASPFormName) & "',"  '输出状态,SUCCESS代表成功
strJSON=strJSON&"'url':'"& ReplacePath(uEditor_ASPUploadPath,True)&objUpload.form(uEditor_ASPFormName) &"',"  '输出上传后URL
strJSON=strJSON&"'fileType':'."&objUpload.form(uEditor_ASPFormName&"_Ext")&"',"  '输出扩展名
strJSON=strJSON&"'original':'"&objUpload.Form(uEditor_ASPFormName&"_Name")&"'}"  '输出源文件

response.write strJSON

%>