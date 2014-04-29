<!--#include file="ASPJson.class.asp"-->
<!--#include file="config_loader.asp"-->
<!--#include file="Uploader.class.asp"-->
<%	

    Set up = new Uploader    
    up.MaxSize = config.Item("catcherMaxSize")
    up.AllowType = config.Item("catcherAllowFiles")
    up.PathFormat = config.Item("catcherPathFormat")

    urls = Split(Request.Item("source[]"), ", ")
    Set list = new ASPJson.Collection

    For i = 0 To UBound(urls)
    	up.UploadRemote( urls(i) )
        Dim instance
        Set instance = new ASPJson.Collection
        instance.Add "state", up.State
        instance.Add "url", up.FilePath
        instance.Add "source", urls(i)
        list.Add i, instance
    Next

    Set json = new ASPJson

    With json.data
        .Add "state", "SUCCESS"
        .Add "list", list
    End With

    json.PrintJson()
%>