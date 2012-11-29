<%@ CODEPAGE=65001 %>
<!--#include file="ASPIncludeFile.asp"-->
<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
<%
	Dim content,content1
    '获取数据
    content =  stripslashes(Request.Form("myEditor"))
    content1 =  stripslashes(Request.Form("myEditor1"))
    '存入数据库或者其他操作

    '显示
    echo "第1个编辑器的值"
    echo content
    echo "<br/>第2个编辑器的值<br/>"

    echo "<textarea style='width:500px;height:300px;'>"&content1&"</textarea><br/>"
    echo "<input type='button' value='点击返回' onclick='window.history.go(-1)' /></script>";
	
	Sub echo(str):response.write str:End Sub
%>