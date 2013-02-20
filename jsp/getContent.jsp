    <%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
<script src="../uparse.js" type="text/javascript"></script>
<script>
  uParse('.content',{
      'highlightJsUrl':'../third-party/SyntaxHighlighter/shCore.js',
      'highlightCssUrl':'../third-party/SyntaxHighlighter/shCoreDefault.css'
  })
</script>
<%
request.setCharacterEncoding("utf-8");
response.setCharacterEncoding("utf-8");
String content = request.getParameter("myEditor");
String content1 = request.getParameter("myEditor1");


response.getWriter().print("第1个编辑器的值");
response.getWriter().print("<div class='content'>"+content+"</div>");
response.getWriter().print("<br/>第2个编辑器的值<br/>");
response.getWriter().print("<textarea style='width:500px;height:300px;'>"+content1+"</textarea><br/>");
%>