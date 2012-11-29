<%@ CODEPAGE=65001 %>
<!--#include file="ASPIncludeFile.asp"-->
<%
'********************************************************
'   uEditor ASP搜索电影
'   By ZSX(http://www.zsxsoft.com)
'   Z-Blog (http://www.rainbowsoft.org)
'********************************************************
On Error Resume Next
Dim strResponse

Dim searchKey,videoType
searchKey=Trim(Request.Form("searchKey"))
videoType=Trim(Request.Form("videoType"))

strResponse=gethtml("http://api.tudou.com/v3/gw?method=item.search&appKey=myKey&format=json&kw="&searchKey&"&pageNo=1&pageSize=20&channelId="&videoType&"&inDays=7&media=v&sort=s","utf-8")  '从土豆下载数据

Response.Write strResponse
%>
