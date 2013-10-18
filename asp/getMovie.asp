<% @LANGUAGE="VBSCRIPT" CODEPAGE="65001" %> 
<%
	Dim key, type_, url, html, xmlHttp
	key = Server.HTMLEncode(Request.Form("searchKey"))
	type_ = Server.HTMLEncode(Request.Form("videoType"))
	url = "http://api.tudou.com/v3/gw?method=item.search&appKey=myKey&format=json&kw=" + key + "&pageNo=1&pageSize=20&channelId=" + type_ + "&inDays=7&media=v&sort=s"
	Set xmlHttp = Server.CreateObject("Microsoft.XMLHTTP")
	xmlHttp.Open "GET", url, false
	xmlHttp.Send
	Response.Write xmlHttp.ResponseText
%>