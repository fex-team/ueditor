<!--#include file="ASPJson.class.asp"-->
<!--#include file="config_loader.asp"-->

<%
	Set json = new ASPJson
    Set json.data = config

    json.PrintJson()
%>