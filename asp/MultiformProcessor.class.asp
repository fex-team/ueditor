<%
' Power by Techird
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