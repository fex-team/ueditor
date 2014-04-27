<%

Class PathFormatter
    Public Function Format( ByVal pathFormat, ByVal filename )
        Dim ext, name
        If IsEmpty( format ) Then
            format = "{yyyy}{mm}{dd}{hh}{ii}{ss}{rand:6}"
        End If

        Set invalidPattern = new RegExp
        invalidPattern.Pattern = "[\\\/\:\*\?\<\>\|""]"
        invalidPattern.Global = true
        filename = invalidPattern.Replace( filename, "" )

        ext = GetExt( filename )
        name = GetNameWithoutExt( filename )

        pathFormat = Replace( pathFormat, "{filename}", name )
        pathFormat = Replace( pathFormat, "{time}", TimeStamp() )
        pathFormat = Replace( pathFormat, "{yyyy}", Year(Now) )
        pathFormat = Replace( pathFormat, "{yy}", Year(Now) Mod 100 )
        pathFormat = Replace( pathFormat, "{mm}", LeadZero( Month(Now) ) )
        pathFormat = Replace( pathFormat, "{dd}", LeadZero( Day(Now) ) )
        pathFormat = Replace( pathFormat, "{hh}", LeadZero( Hour(Now) ) )
        pathFormat = Replace( pathFormat, "{ii}", LeadZero( Minute(Now) ) )
        pathFormat = Replace( pathFormat, "{ss}", LeadZero( Second(Now) ) )

        Set randPattern = new RegExp
        randPattern.Pattern = "{rand(\:?)(\d+)}"
        Set matches = randPattern.Execute(pathFormat)
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
            pathFormat = randPattern.Replace( pathFormat, Rand( min, max ) )
        End If
        Format = pathFormat + ext
    End Function
    
    Private Function GetExt( file )
        GetExt = Right( file, Len(file) - InStrRev(file, ".") + 1 )
    End Function

    Private Function GetNameWithoutExt( file )
        GetNameWithoutExt = Left( file, InStrRev(file, ".") - 1 )
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
End Class
%>