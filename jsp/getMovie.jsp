<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="java.io.BufferedReader"%>
<%@ page import="java.io.IOException"%>
<%@ page import="java.io.InputStream"%>
<%@ page import="java.io.InputStreamReader"%>
<%@ page import="java.net.MalformedURLException"%>
<%@ page import="java.net.URL"%>
<%@ page import="java.net.URLEncoder"%>
<%@ page import="java.net.URLConnection"%>
<%
request.setCharacterEncoding("utf-8");
response.setCharacterEncoding("utf-8");
StringBuffer readOneLineBuff = new StringBuffer();   
String content ="";   
String searchkey = request.getParameter("searchKey");
String videotype = request.getParameter("videoType");
try {
searchkey = URLEncoder.encode(searchkey,"utf-8");
    URL url = new URL("http://api.tudou.com/v3/gw?method=item.search&appKey=myKey&format=json&kw="+ searchkey+"&pageNo=1&pageSize=20&channelId="+videotype+"&inDays=7&media=v&sort=s");
    URLConnection conn = url.openConnection();
    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(),"utf-8"));
    String line = "";   
    while ((line = reader.readLine()) != null) {   
        readOneLineBuff.append(line);   
    }   
     content = readOneLineBuff.toString();   
    reader.close();   
} catch (MalformedURLException e) {   
    e.printStackTrace();   
} catch (IOException e2) {   
    e2.printStackTrace();   
}      
response.getWriter().print(content); 
%>