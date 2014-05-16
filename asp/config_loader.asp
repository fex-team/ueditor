<%
	Set json = new ASPJson
    Set fso = Server.CreateObject("Scripting.FileSystemObject")

    Set stream = Server.CreateObject("ADODB.Stream")

    stream.Open()
    stream.Charset = "UTF-8"
    stream.LoadFromFile Server.MapPath( "config.json" )

    content = stream.ReadText()

    Set commentPattern = new RegExp
    commentPattern.Multiline = true
    commentPattern.Pattern = "/\*[\s\S]+?\*/"
    commentPattern.Global = true
    content = commentPattern.Replace(content, "")
    json.loadJSON( content )

    Set config = json.data
%>