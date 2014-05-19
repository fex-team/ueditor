<!--#include file="ASPJson.class.asp"-->
<!--#include file="config_loader.asp"-->
<!--#include file="Uploader.class.asp"-->
<%
    uploadTemplateName = Session.Value("ueditor_asp_uploadTemplateName")

    Set up = new Uploader
    up.MaxSize = config.Item( uploadTemplateName & "MaxSize" )
    up.FileField = config.Item( uploadTemplateName & "FieldName" )
    up.PathFormat = config.Item( uploadTemplateName & "PathFormat" )

    If Not IsEmpty( Session.Value("base64Upload") ) Then
        up.UploadBase64( Session.Value("base64Upload") )
    Else
        up.AllowType = config.Item( uploadTemplateName & "AllowFiles" )
        up.UploadForm()
    End If

    Set json = new ASPJson

    With json.data
        .Add "url", up.FilePath
        .Add "original", up.OriginalFileName
        .Add "state", up.State
        .Add "title", up.OriginalFileName
    End With
    
    json.PrintJson()
%>