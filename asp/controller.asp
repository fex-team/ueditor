<%@ LANGUAGE="VBSCRIPT" CODEPAGE="65001" %>
<!--#include file="ASPJson.class.asp"-->
<!--#include file="config_loader.asp"-->
<%
    action = Request.Item("action")

    Select Case action
        Case "config"
            %><!--#include file="action_config.asp"--><%
        Case "uploadimage"
            %><!--#include file="action_uploadimage.asp"--><%
        Case "uploadscrawl"
            %><!--#include file="action_uploadscrawl.asp"--><%
        Case "uploadvideo"
            %><!--#include file="action_uploadvideo.asp"--><%
        Case "uploadfile"
            %><!--#include file="action_uploadfile.asp"--><%
        Case "listimage"
            %><!--#include file="action_listimage.asp"--><%
        Case "listfile"
            %><!--#include file="action_listfile.asp"--><%
        Case "catchimage"
            %><!--#include file="action_crawler.asp"--><%
    End Select

%>