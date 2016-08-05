<%@ CODEPAGE=65001 %>
<!--#include file="ASPIncludeFile.asp"-->
<%
'********************************************************
'   uEditor ASP下载远程图片
'   By ZSX(http://www.zsxsoft.com)
'   Z-Blog (http://www.rainbowsoft.org)
'********************************************************
Dim l
Dim strURL,i,j,k,t,strResponse(2),aryURL
aryURL=Split(Trim(Request.Form("upfile")),uEditor_Split)  '得到地址数组
Dim MaxSize
MaxSize=1024000 '设置最大上传大小,单位为字节，0表示不受限
Set objStream = Server.Createobject("adodb.stream") 
Set objXmlhttp=Server.CreateObject("msxml2.serverxmlhttp")

Dim UploadPath
UploadPath=uEditor_ASPUploadPath' & "\" & Year(Now) &  Month(Now) &  Day(Now) & "\"

For l=0 To Ubound(aryURL)
	strURL=aryURL(l)   
	If CheckRegExp(strURL,"^http.+?\.(jpe?g|gif|bmp|png)$") Then   '判断URL是否符合图片格式
		t=Int((10000 - 1 + 1) * Rnd + 1)&DateDiff("s", "01/01/1970 08:00:00", Now())&"."&Split(strURL,".")(Ubound(Split(strURL,".")))
		'RandomFileName(Split(strURL,".")(Ubound(Split(strURL,"."))))  '得到重命名文件夹
		Dim objXmlHttp,objStream
		objXmlHttp.Open "GET",strURL,False
		objXmlHttp.Send
		If objXmlHttp.Status=200 Then  'HTTP状态码需要符合“200 OK”
			If Not(CDbl(objXmlHttp.getResponseHeader("Content-Length"))>MaxSize Or MaxSize=0) Then '判断是否超出大小
				k=objXmlHttp.getResponseHeader("Content-Type")    
				If Instr(k,"image") Then '判断Content-type是否为图片
						CreatDirectoryByCustomDirectory UploadPath
						objStream.Type =1 
						objStream.Open 
						objStream.Write objXmlhttp.ResponseBody 
						objStream.Savetofile uEditor_ASPPath&UploadPath&t,2 
						objStream.Close() 
						strResponse(0)=UploadPath&t&uEditor_Split&strResponse(0)  '记录保存位置
						'Exit For
				Else
					strResponse(0)="error"&uEditor_Split&strResponse(0)
				End If
			Else
				strResponse(0)="error"&uEditor_Split&strResponse(0)
			End If
		Else
			strResponse(0)="error"&uEditor_Split&strResponse(0)
		End If
	Else
		strResponse(0)="error"&uEditor_Split&strResponse(0)
	End If
	strResponse(1)=strURL&uEditor_Split&strResponse(1)
Next
strResponse(2)="OK"
strResponse(0)=Left(Replace(Replace(strResponse(0),"\","/"),"'","\'"),Len(strResponse(0))-Len(uEditor_Split))
strResponse(1)=Left(Replace(Replace(strResponse(1),"\","/"),"'","\'"),Len(strResponse(1))-Len(uEditor_Split))
Response.Write "{'url':'"&strResponse(0)&"','tip':'"&strResponse(2)&"','srcUrl':'"&strResponse(1)& "'}"
Set objStream=Nothing
Set objXmlhttp=Nothing
%>