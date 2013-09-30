<%
' ASP 文件上传类
' Author: techird
' Email: techird@qq.com

Class Uploader
    Private cfgMaxSize
    Private cfgAllowType
    Private cfgSavePath
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
        cfgSavePath = "/upload"

        Set stateString = Server.CreateObject("Scripting.Dictionary")
        stateString.Add "SIZE_LIMIT_EXCCEED", "文件大小超过服务器限制"
        stateString.Add "TYPE_NOW_ALLOW", "文件类型不允许"
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

    Public Function Upload( filefield )
        Dim processor, savepath

        Set processor = new MultiformProcessor
        Set rsFormValues = processor.Process()

        If Request.TotalBytes > cfgMaxSize Then
            rsState = stateString.Item( "SIZE_LIMIT_EXCCEED" )
            Exit Function
        End If

        rsOriginalFileName = rsFormValues.Item( "filename" )
        rsFileType = GetExt( rsOriginalFileName )
        If CheckExt(rsFileType) = False Then
            rsState = stateString.Item( "TYPE_NOW_ALLOW" )
            Exit Function
        End If

        savepath = GetSavePath()
        CheckOrCreatePath( Server.MapPath(savepath) )

        rsFileName = GetSaveName( rsOriginalFileName )
        rsFilePath = savepath + rsFileName

        Set fileStream = rsFormValues.Item( filefield )
        rsFileSize = fileStream.Size

        fileStream.SaveToFile Server.MapPath( rsFilePath )
        fileStream.Close
        rsState = "SUCCESS"
    End Function

    Private Function CheckExt( fileType )
        For Each ext In cfgAllowType
            If fileType = ext Then 
                CheckExt = true
                Exit Function
            End If
        Next
        CheckExt = false
    End Function

    Private Function GetExt( file )
        GetExt = Right( file, Len(file) - InStrRev(file, ".") + 1 )
    End Function

    Private Function GetSavePath()
        GetSavePath = cfgSavePath & GetFormatedDate() & "/"
    End Function

    Private Function GetSaveName( ByVal filename )
        GetSaveName = TimeStamp() & "_" & Rand(1e12, 1e13 - 1) & "_" & filename
    End Function

    Private Function TimeStamp()
        Dim hh, mm, ss
        hh = LeadZero(Hour(Now))
        mm = LeadZero(Minute(Now))
        ss = LeadZero(Second(Now))
        TimeStamp = hh & mm & ss
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

            'Decode the header
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