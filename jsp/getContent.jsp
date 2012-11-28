<%@ page language="java" pageEncoding="utf-8"%>
<%
request.setCharacterEncoding("utf-8");
response.setCharacterEncoding("utf-8");
String content = request.getParameter("myEditor");
String content1 = request.getParameter("myEditor1");


response.getWriter().print("第1个编辑器的值");
response.getWriter().print(content);
response.getWriter().print("<br/>第2个编辑器的值<br/>");
response.getWriter().print("<textarea style='width:500px;height:300px;'>"+content1+"</textarea><br/>");
response.getWriter().print("<input type='button' value='点击返回' onclick='javascript:location.href = \"../_examples/submitFormDemo.html\"' /></script>");
%>