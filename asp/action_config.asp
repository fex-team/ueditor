<%
	Set json = new ASPJson
    Set json.data = config

    Response.Write json.JSONoutput()
%>