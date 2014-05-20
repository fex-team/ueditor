<%@ LANGUAGE="VBSCRIPT" CODEPAGE="65001" %>
<%
    action = Request.Item("action")

    Session.Contents.Remove("ueditor_asp_uploadTemplateName")
    Session.Contents.Remove("ueditor_asp_base64Upload")
    Session.Contents.Remove("ueditor_asp_listTemplateName")


    Select Case action

        Case "config"
            Server.Execute("action_config.asp")

        Case "uploadimage"
            Session.Value("ueditor_asp_uploadTemplateName") = "image"
            Server.Execute("action_upload.asp")

        Case "uploadscrawl"
            Session.Value("ueditor_asp_uploadTemplateName") = "scrawl"
            Session.Value("base64Upload") = "scrawl.png"
            Server.Execute("action_upload.asp")

        Case "uploadvideo"
            Session.Value("ueditor_asp_uploadTemplateName") = "video"
            Server.Execute("action_upload.asp")

        Case "uploadfile"
            Session.Value("ueditor_asp_uploadTemplateName") = "file"
            Server.Execute("action_upload.asp")

        Case "listimage"
            Session.Value("ueditor_asp_listTemplateName") = "image"
            Server.Execute("action_list.asp")

        Case "listfile"
            Session.Value("ueditor_asp_listTemplateName") = "file"
            Server.Execute("action_list.asp")

        Case "catchimage"
            Server.Execute("action_crawler.asp")
    End Select

%>