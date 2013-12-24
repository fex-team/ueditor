<%
' ASP 文件上传类
' Author: techird
' Email: techird@qq.com

Class Uploader
    Private cfgMaxSize
    Private cfgAllowType
    Private cfgSavePath
    Private cfgFileField
    Private stateString
    Private rsOriginalFileName
    Private rsFileName
    Private rsFilePath
    Private rsFileSize
    Private rsFileType
    Private rsState
    Private rsFormValues

    Private Sub Class_Initialize
        cfgMaxSize = 1 * 1024 * 1024
        cfgAllowType = Array(".png", ".jpg", ".jpeg", ".gif", ".bmp")
        cfgSavePath = "upload/"

        Set stateString = Server.CreateObject("Scripting.Dictionary")
        stateString.Add "SIZE_LIMIT_EXCCEED", "File size exceeded!"
        stateString.Add "TYPE_NOW_ALLOW", "File type not allowed!"
    End Sub

    Public Property Let MaxSize(ByVal size)
        cfgMaxSize = size
    End Property

    Public Property Let AllowType(ByVal types)
        cfgAllowType = types
    End Property

    Public Property Let SavePath(ByVal path)
        cfgSavePath = path
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

    Public Property Get FileType
        FileType = rsFileType
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

    Public Function UploadBase64( content ) 
        Dim stream
        Set stream = Base64Decode( content )

        DoUpload stream, "Base64Upload.png"
    End Function

    Public Function UploadRemote( url )
        Dim stream, filename
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
        Dim savepath

        rsFileSize = stream.Size
        If rsFileSize > cfgMaxSize Then
            rsState = stateString.Item( "SIZE_LIMIT_EXCCEED" )
            Exit Function
        End If

        rsOriginalFileName = filename
        rsFileType = GetExt( filename )
        If CheckExt(rsFileType) = False Then
            rsState = stateString.Item( "TYPE_NOW_ALLOW" )
            Exit Function
        End If

        savepath = GetSavePath()
        CheckOrCreatePath( Server.MapPath(savepath) )
        rsFileName = GetSaveName( filename )
        rsFilePath = savepath + rsFileName

        Set fs = Server.CreateObject("Scripting.FileSystemObject")
        ai = 1
        testPath = rsFilePath
        Do While fs.FileExists( Server.MapPath( testPath ) )
            testPath = GetNameWithoutExt( rsFilePath ) & "_" & ai & GetExt( rsFilePath )
            ai = ai + 1
        Loop
        rsFilePath = testPath

        stream.SaveToFile Server.MapPath( rsFilePath )
        stream.Close
        rsState = "SUCCESS"
    End Function

    Private Function Base64Decode( content )
        dim xml, stream, node
        Set xml = Server.CreateObject("MSXML2.DOMDocument")
        Set stream = Server.CreateObject("ADODB.Stream")
        Set node = xml.CreateElement("tmpNode")
        node.dataType = "bin.base64"
        node.Text = content
        stream.Charset ="gb2312"
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
        For Each ext In cfgAllowType
            If UCase(fileType) = UCase(ext) Then 
                CheckExt = true
                Exit Function
            End If
        Next
        CheckExt = false
    End Function

    Private Function GetExt( file )
        GetExt = Right( file, Len(file) - InStrRev(file, ".") + 1 )
    End Function

    Private Function GetNameWithoutExt( file )
        GetNameWithoutExt = Left( file, InStrRev(file, ".") - 1 )
    End Function

    Private Function GetSavePath()
        GetSavePath = cfgSavePath & GetFormatedDate() & "/"
    End Function

    Private Function GetSaveName( ByVal filename )
        Dim format, ext, name
        If Not IsEmpty( rsFormValues ) Then
            format = rsFormValues.Item( "fileNameFormat" )
        Else
            format = "{yyyy}{mm}{dd}{hh}{ii}{ss}{rand:6}"
        End If
        ext = GetExt( filename )
        name = GetNameWithoutExt( filename )
        filename = Replace( format, "{filename}", name )
        filename = Replace( filename, "{time}", TimeStamp() )
        filename = Replace( filename, "{yyyy}", Year(Now) )
        filename = Replace( filename, "{yy}", Year(Now) Mod 100 )
        filename = Replace( filename, "{mm}", LeadZero( Month(Now) ) )
        filename = Replace( filename, "{dd}", LeadZero( Day(Now) ) )
        filename = Replace( filename, "{hh}", LeadZero( Hour(Now) ) )
        filename = Replace( filename, "{ii}", LeadZero( Minute(Now) ) )
        filename = Replace( filename, "{ss}", LeadZero( Second(Now) ) )
        Set randPattern = new RegExp
        randPattern.Pattern = "{rand(\:?)(\d+)}"
        Set matches = randPattern.Execute(filename)
        If matches.Count Then
            Set match = matches(0)
            digit = 6
            If match.SubMatches.Count > 1 Then
                digit = 0 + match.SubMatches(1)
            End If
            min = 1
            Do While digit > 0
                min = min * 10
                digit = digit - 1
            Loop
            max = min * 10
            filename = randPattern.Replace( filename, Rand( min, max ) )
        End If
        Set invalidPattern = new RegExp
        invalidPattern.Pattern = "[\\\/\:\*\?\<\>\|""]"
        invalidPattern.Global = true
        filename = invalidPattern.Replace( filename, "" )
        GetSaveName = filename + ext
    End Function

    Private Function TimeStamp()
        TimeStamp = DateDiff("s", "1970-1-1 8:00:00", Now())
    End Function

    Private Function Rand( min, max )
        Randomize 
        Rand = Int( (max - min + 1) * Rnd + min )
    End Function

    Private Function GetFormatedDate()
        Dim yyyy, mm, dd
        yyyy = Year(Date)
        mm = LeadZero(Month(Date))
        dd = LeadZero(Day(Date))
        GetFormatedDate = yyyy & mm & dd
    End Function

    Private Function LeadZero( number )
        If number < 10 Then
            LeadZero = "0" & number
        Else
            LeadZero = number
        End If
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


' Processor Usage:
'   Set p = new MultiformProcessor
'   Set formValues = p.Process()
'   filename = formValues.Item("filename")
'   Set stream = formValues.Item("file1") // the name of the file input
'   stream.SaveToFile "upload/" & filename
'   stream.Close
Class MultiformProcessor
    Private adTypeBinary
    Private adTypeText
    Private adModeReadWrite
    Private binCtLf
    Private binCtLf2

    private Sub Class_Initialize()
        adTypeBinary = 1
        adTypeText = 2
        adModeReadWrite = 3
        binCtLf = ChrB(13) & ChrB(10)
        binCtLf2 = binCtLf & binCtLf
    End Sub

    Private Function OpenStream( optype )
        Set stream = Server.CreateObject("ADODB.Stream")
        stream.Type = optype
        stream.Mode = adModeReadWrite
        stream.Open
        Set OpenStream = stream
    End Function

    Private Function CopyStreamPart( stream, pBgn, pEnd )
        Dim iStream, oStream
        Set iStream = stream
        Set oStream = OpenStream( adTypeBinary )
        iStream.Position = pBgn
        iStream.CopyTo oStream, pEnd - pBgn
        Set CopyStreamPart = oStream
    End Function

    Private Function GetString( stream, pBgn, pEnd )
        Dim iStream, oStream
        Set iStream = stream
        Set oStream = OpenStream( adTypeBinary )
        iStream.Position = pBgn
        iStream.CopyTo oStream, pEnd - pBgn
        oStream.Position = 0
        oStream.Type = adTypeText
        oStream.Charset = GetCharset
        GetString = oStream.ReadText
        oStream.Close
    End Function

    Private Function GetCharset()
        If Charset = "" Then
            GetCharset = "utf-8"
        Else
            GetCharset = Charset
        End If
    End Function

    'See RFC 2388
    'http://www.ietf.org/rfc/rfc2388.txt
    public Function Process()
        Dim formBytes, bLen, pBgn, pEnd, header, stream
        Dim varPtn, filePtn, formValues, key, field

        formBytes = Request.BinaryRead( Request.TotalBytes )

        Set stream = OpenStream( adTypeBinary )
            stream.Write formBytes

        Set varPtn = new RegExp
            varPtn.Pattern = "(\w+?)=""(.+?)"""
            varPtn.Global = True

        Set filePtn = new RegExp
            filePtn.Pattern = "filename="

        Set formValues = Server.CreateObject("Scripting.Dictionary")

        'Find boundary
        bLen = InStrB( 1, formBytes, binCtLf ) - 1
        boundary = LeftB( formBytes, bLen )

        'Init begin pointer to byte start
        pBgn = 1

        Do
            'Find begin pointer and end pointer for block header
            pBgn = pBgn + bLen + LenB( binCtLf ) - 1
            pEnd = InStrB( pBgn, formBytes, binCtLf2 )

            'If next block not found, means all blocks processed
            If pEnd = 0 Then
                Exit Do 'Load Finished
            End If

            'Decode the headerf
            header = GetString( stream, pBgn, pEnd )

            'Test if the block is a file block
            isFileBlock = filePtn.Test( header ) 

            'Find begin pointer and end pointer for block content
            pBgn = pEnd + LenB(binCtLf2) - 1
            pEnd = InStrB(pBgn, formBytes, boundary) - LenB( binCtLf ) - 1

            'Extract field values from header, which like key = "filed"
            Set matches = varPtn.Execute( header )
            For Each match In matches
                key = match.SubMatches(0)
                field = match.SubMatches(1)
                'filename as a field
                If key = "filename" Then
                    formValues.Add key, field 
                'name specified fields
                ElseIf key = "name" Then
                    If isFileBlock Then
                        'Resolve content as stream for fileblock
                        formValues.Add field, CopyStreamPart(stream, pBgn, pEnd)
                    Else
                        'Resolve content as string for non-fileblock
                        formValues.Add field, GetString(stream, pBgn, pEnd)
                    End If
                End If
            Next

            'Move over the begin pointer to next block
            pBgn = pEnd + LenB( binCtLf ) + 1
        Loop
        stream.Close
        Set Process = formValues
    End Function
End Class

%>