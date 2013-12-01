    <%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
<script src="../ueditor.parse.js" type="text/javascript"></script>
<script>
        uParse('.content',{
            'rootPath': '../'
        })
</script>
<%
request.setCharacterEncoding("utf-8");
response.setCharacterEncoding("utf-8");
String content = request.getParameter("myEditor");



response.getWriter().print("第1个编辑器的值");
response.getWriter().print("<div class='content'>"+content+"</div>");

%>