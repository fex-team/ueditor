<!--#include file="ASPJson.class.asp"-->
<!--#include file="config_loader.asp"-->

<%
    listTemplateName = Session.Value("ueditor_asp_listTemplateName")

    start = CInt(Request.Item("start"))
    size = CInt(Request.Item("size"))
    total = 0

    If size < 0 Then
        size = CInt(config.Item( listTemplateName + "ManagerListSize" ))
    End If

    path = config.Item( listTemplateName + "ManagerListPath" )
    Set extensions = config.Item( listTemplateName + "ManagerAllowFiles")

    Set list = new ASPJson.Collection

    Set fso = Server.CreateObject("Scripting.FileSystemObject")
    If fso.FolderExists(Server.MapPath(path)) = False Then
        state = "找不到目录：" + path
    Else
        Set all = ListAllFilesInFolder( fso, path )
        total = all.Count
        index = 0
        For Each file in all
            If index >= start And index < start + size Then
                Dim fileObject
                Set fileObject = new ASPJson.Collection
                fileObject.Add "url", file
                list.Add index - start, fileObject
            End If
            index = index + 1
        Next
        state = "SUCCESS"
    End If
    
    Set json = new ASPJson
    With json.data
        .Add "state", state
        .Add "list", list
        .Add "start", start
        .Add "size", size
        .Add "total", total
    End With

    json.PrintJson()

    Function ListAllFilesInFolder( fso, path )
        Dim list
        Set list = Server.CreateObject("Scripting.Dictionary")
        Set folder = fso.GetFolder(Server.MapPath(path))
        For Each file In folder.Files
            If CheckExt(file.Name) Then
                list.Add path & "/" & file.Name, true
            End If
        Next
        For Each subFolder In folder.SubFolders
            Set subList = ListAllFilesInFolder( fso, path & "/" & subFolder.Name )
            For Each subListFile In subList
                list.Add subListFile, true
            Next
        Next
        Set ListAllFilesInFolder = list
    End Function

    Function CheckExt( filename )
        For Each ext In extensions
            If UCase(GetExt(filename)) = UCase(extensions.Item(ext)) Then 
                CheckExt = true
                Exit Function
            End If
        Next
        CheckExt = false
    End Function
    
    Function GetExt( file )
        GetExt = Right( file, Len(file) - InStrRev(file, ".") + 1 )
    End Function
%>