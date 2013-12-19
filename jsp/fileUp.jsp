    <%@page import="java.io.File"%>
        <%@page import="java.util.Properties"%>
        <%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
        <%@ page import="ueditor.Uploader" %>


            <%
    request.setCharacterEncoding("utf-8");
    response.setCharacterEncoding("utf-8");
    
    String currentPath = request.getRequestURI().replace( request.getContextPath(), "" );

    File currentFile = new File( currentPath );

    currentPath = currentFile.getParent() + File.separator;

    //加载配置文件
    Properties pro = new Properties();
    String propertiesPath = request.getSession().getServletContext().getRealPath( currentPath + "config.properties" );
    Properties properties = new Properties();
    
    Uploader up = new Uploader(request);
    
    String fileNameFormat = up.getParameter( "fileNameFormat" );
    
    System.out.println( fileNameFormat );
    
	if ( up.getParameter( "fileNameFormat" ) == null ) {
		fileNameFormat = properties.getProperty( "fileNameFormat" );
    }
    
    up.setSavePath("upload"); //保存路径
    String[] fileType = {".rar" , ".doc" , ".docx" , ".zip" , ".pdf" , ".txt" , ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg", ".ogg", ".mov", ".wmv", ".mp4"};  //允许的文件类型
    up.setAllowFiles(fileType);
    up.setMaxSize(10000);        //允许的文件最大尺寸，单位KB
    up.setFileNameFormat( up.getParameter( "fileNameFormat" ) );
    up.upload();
    response.getWriter().print("{'url':'"+up.getUrl()+"','fileType':'"+up.getType()+"','state':'"+up.getState()+"','original':'"+up.getOriginalName()+"'}");

%>
