<!--#include file="PathFormatter.class.asp"-->
<!--#include file="MultiformProcessor.class.asp"-->

<%
' ASP 文件上传类
' Author: techird
' Email: techird@qq.com

'配置
'MAX_SIZE 在这里设定了之后如果出现大上传失败，请执行以下步骤
'IIS 6 
    '找到位于 C:\Windows\System32\Inetsrv 中的 metabase.XML 打开，找到ASPMaxRequestEntityAllowed 把他修改为需要的值（如10240000即10M）
'IIS 7
    '打开IIS控制台，选择 ASP，在限制属性里有一个“最大请求实体主题限制”，设置需要的值

CURRENT_ENCODING = "gb2312"

Class Uploader

    '上传配置
    Private cfgMaxSize
    Private cfgAllowType
    Private cfgPathFormat
    Private cfgFileField

    '上传返回信息
    Private stateString
    Private rsOriginalFileName
    Private rsFilePath

    Private rsFileName
    Private rsFileSize
    Private rsState
    Private rsFormValues

    Private Sub Class_Initialize
        Set stateString = Server.CreateObject("Scripting.Dictionary")
        stateString.Add "SIZE_LIMIT_EXCCEED", "File size exceeded!"
        stateString.Add "TYPE_NOW_ALLOW", "File type not allowed!"
    End Sub

    Public Property Let MaxSize(ByVal size)
        cfgMaxSize = size
    End Property

    Public Property Let AllowType(ByVal types)
        Set cfgAllowType = types
    End Property

    Public Property Let PathFormat(ByVal format)
        cfgPathFormat = format
    End Property

    Public Property Let FileField(ByVal field)
        cfgFileField = field
    End Property

    Public Property Get OriginalFileName
        OriginalFileName = rsOriginalFileName
    End Property

    Public Property Get FileName
        FileName = rsFileName
    End Property 

    Public Property Get FilePath
        FilePath = rsFilePath
    End Property

    Public Property Get FileSize
        FileSize = rsFileSize
    End Property

    Public Property Get State
        State = rsState
    End Property

    Public Property Get FormValues
        Set FormValues = rsFormValues
    End Property

    Public Function UploadForm()
        ProcessForm()
        SaveFile()
    End Function

    Public Function ProcessForm()        
        Set processor = new MultiformProcessor
        Set rsFormValues = processor.Process()
    End Function

    Public Function SaveFile()
        Dim stream, filename
        Set stream = rsFormValues.Item( cfgFileField )
        filename = rsFormValues.Item( "filename" )
        DoUpload stream, filename
    End Function

    Public Function UploadBase64( filename ) 
        Dim stream, content
        content = Request.Item ( cfgFileField )
        Set stream = Base64Decode( content )

        DoUpload stream, filename
    End Function

    Private Function RegExpTest(patrn, str) 
        Dim regEx, Match, Matches
        Set regEx = New RegExp
        regEx.Pattern = patrn 
        regEx.IgnoreCase = False
        regEx.Global = True 
        Set Matches = regEx.Execute(str)
        For Each Match in Matches
        RetStr = RetStr & Match.value &" "
        RetStr = RetStr & vbCRLF 
        Next 
        RegExpTest = RetStr 
    End Function

    Private Function IpToNumber( ip )
        arr=split(ip,".")
        IpToNumber=256*256*256*clng(arr(0))+256*256*clng(arr(1))+256*clng(arr(2))+clng(arr(3))
    End Function

    Private Function IsPrivateIp( url )
        Dim ip
        ip = RegExpTest("\d+\.\d+\.\d+\.\d*", url)

        If ip = "" Then
            If RegExpTest("([\w-]+\.)+[\w-]+", url) <> "" Then
                IsPrivateIp = False:Exit Function
            End If
        IsPrivateIp = True:Exit Function
        End If

        If instr(ip,"127.")=1 Then
        IsPrivateIp = true:Exit Function
        End If
        ABegin = IpToNumber("10.0.0.0"):AEnd = IpToNumber("10.255.255.255")
        BBegin = IpToNumber("172.16.0.0"):BEnd = IpToNumber("172.31.255.255")
        CBegin = IpToNumber("192.168.0.0"):CEnd = IpToNumber("192.168.255.255")
        IpNum = IpToNumber(ip)
        IsPrivateIp = (ABegin <= IpNum and IpNum <= AEnd) or (BBegin <= IpNum and IpNum <= BEnd) or (CBegin <= IpNum and IpNum <= CEnd)
    End Function

    Public Function UploadRemote( url )
        Dim stream, filename

        If IsPrivateIp(url) Then
        rsState = "Failed":Exit Function
        End If

        filename = Right( url, Len(url) - InStrRev(url, "/") )

        Set stream = CrawlImage( url )

        If Not IsNull(stream) Then
            DoUpload stream, filename
        Else
            rsState = "Failed"
        End If
        Set stream = Nothing
    End Function

    Private Function DoUpload( stream, filename )

        rsFileSize = stream.Size
        If rsFileSize > cfgMaxSize Then
            rsState = stateString.Item( "SIZE_LIMIT_EXCCEED" )
            Exit Function
        End If

        rsOriginalFileName = filename
        fileType = GetExt(filename)
        If CheckExt(fileType) = False Then
            rsState = stateString.Item( "TYPE_NOW_ALLOW" )
            Exit Function
        End If
        
        Set formatter = new PathFormatter
        rsFilePath = formatter.format( cfgPathFormat, filename )
        
        savePath = Server.MapPath(rsFilePath)
        CheckOrCreatePath(  GetDirectoryName(savePath) )

        stream.SaveToFile savePath
        stream.Close
        rsState = "SUCCESS"
    End Function

    Private Function GetDirectoryName(path)
        GetDirectoryName = Left( path, InStrRev(path, "\") )
    End Function

    Private Function Base64Decode( content )
        dim xml, stream, node
        Set xml = Server.CreateObject("MSXML2.DOMDocument")
        Set stream = Server.CreateObject("ADODB.Stream")
        Set node = xml.CreateElement("tmpNode")
        node.dataType = "bin.base64"
        node.Text = content
        stream.Charset = CURRENT_ENCODING
        stream.Type = 1
        stream.Open()
        stream.Write( node.nodeTypedValue )
        Set Base64Decode = stream
        Set node = Nothing
        Set stream = Nothing
        Set xml = Nothing
    End Function

    Private Function CrawlImage( url )
        Dim http, stream
        Set http = Server.CreateObject("Microsoft.XMLHTTP")
        http.Open "GET", url, false
        http.Send
        If http.Status = 200 Then
            Set stream = Server.CreateObject("ADODB.Stream")
            stream.Type = 1
            stream.Open()
            stream.Write http.ResponseBody
            Set CrawlImage = stream
        Else
            Set CrawlImage = null
        End If
        Set http = Nothing
    End Function

    Private Function CheckExt( fileType )
        If IsEmpty (cfgAllowType) Then
            CheckExt = true
             Exit Function
        End If
        For Each ext In cfgAllowType
            If UCase(fileType) = UCase(cfgAllowType.Item(ext)) Then 
                CheckExt = true
                Exit Function
            End If
        Next
        CheckExt = false
    End Function
    
    Private Function GetExt( file )
        GetExt = Right( file, Len(file) - InStrRev(file, ".") + 1 )
    End Function

    Private Function CheckOrCreatePath( ByVal path )
        Set fs = Server.CreateObject("Scripting.FileSystemObject")
        Dim parts
        parts = Split( path, "\" )
        path = ""
        For Each part in parts
            path = path + part + "\"
            If fs.FolderExists( path ) = False Then
                fs.CreateFolder( path )
            End If
        Next
    End Function
End Class



%>