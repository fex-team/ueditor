<%@ LANGUAGE="VBSCRIPT" CODEPAGE="65001" %>
<%
    action = Request.Item("action")

    Session.Contents.RemoveAll()

    Select Case action

        Case "config"
            Server.Execute("action_config.asp")

        Case "uploadimage"
            Session.Value("uploadTemplateName") = "image"
            Server.Execute("action_upload.asp")

        Case "uploadscrawl"
            Session.Value("uploadTemplateName") = "scrawl"
            Session.Value("base64Upload") = "scrawl.png"
            Server.Execute("action_upload.asp")

        Case "uploadvideo"
            Session.Value("uploadTemplateName") = "video"
            Server.Execute("action_upload.asp")

        Case "uploadfile"
            Session.Value("uploadTemplateName") = "file"
            Server.Execute("action_upload.asp")

        Case "listimage"
            Session.Value("listTemplateName") = "image"
            Server.Execute("action_list.asp")

        Case "listfile"
            Session.Value("listTemplateName") = "file"
            Server.Execute("action_list.asp")

        Case "catchimage"
            Server.Execute("action_crawler.asp")
    End Select

%>