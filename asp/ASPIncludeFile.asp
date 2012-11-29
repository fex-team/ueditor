<%
'********************************************************
'   uEditor ASP Include File
'   By ZSX(http://www.zsxsoft.com)
'   Z-Blog (http://www.rainbowsoft.org)
'********************************************************
Const uEditor_ASPCharset="UTF-8"  '设置编码
Const uEditor_ASPUploadPath="upload\"  '设置上传目录
Const uEditor_ASPFormName="upfile"  '设置表单名
Const uEditor_Split="ue_separate_ue"  '设置UE分隔符
Const uEditor_tmpImg="tmp/"   '设置临时文件夹（主要是涂鸦）

'得到当前的真实路径
Dim uEditor_ASPPath
uEditor_ASPPath=Server.MapPath("aspincludefile.asp")
uEditor_ASPPath=Split(uEditor_ASPPath,"aspincludefile.asp")(0)&"\"

'把PATH的斜杠改好了。。
Function ReplacePath(path,isLocal)
	If isLocal Then
		path=Replace(path,"\","/")
	Else
		path=Replace(path,"/","\")
	End If
	ReplacePath=Path
End Function
'利用XML对BASE64进行解压
Function UnpackBase64(Base64Code,savePath)
	Dim tmpXMLData
	tmpXMLData="<?xml version=""1.0"" encoding=""utf-8""?><file><stream xmlns:dt=""urn:schemas-microsoft-com:datatypes"" dt:dt=""bin.base64"">"&Base64Code&"</stream></file>"
	
	Dim objXmlFile
	Dim objNodeList
	Dim objStream
	Dim i, j
	Set objXmlFile = CreateObject("Microsoft.XMLDOM")
		objXmlFile.async = False
		objXmlFile.ValidateOnParse = False
			objXmlFile.LoadXML (tmpXMLData)
			If objXmlFile.readyState <> 4 Then
				response.write "error"
			Else
				If objXmlFile.parseError.errorCode <> 0 Then
					response.write "error"
				Else
					Set objNodeList = objXmlFile.documentElement.selectNodes("//file/stream")
							j = objNodeList.length - 1
							For i = 0 To j
								Set objStream = CreateObject("ADODB.Stream")
									With objStream
										.Type = 1
										.Open
										.Write objNodeList(i).nodeTypedvalue
										.SaveToFile savePath, 2
										.Close
									End With
								Set objStream = Nothing
							Next
						Set objNodeList = Nothing
					End If
				End If
			Set objXmlFile = Nothing
		UnpackBase64=True
End Function

'模仿PHP的该函数，去掉反斜杠
Function stripslashes(str)
	stripslashes=Replace(Replace(Replace(str,"\'","'"),"\""",""""),"\\","\")
End Function


'模仿PHP的该函数，并添加了过滤HTML代码
Function htmlspecialchars(str)
	htmlspecialchars=TransferHTML(str,"[&][<][>][""][space][enter][nohtml]")
End Function

'自动生成文件名
Function RandomFileName(Ext)
	RandomFileName=DateDiff("s", "01/01/1970 08:00:00", Now())&Int((10000 - 1 + 1) * Rnd + 1)&"."&ext
End Function

'正则表达式判断 
Function CheckRegExp(str,regex)
	Dim o
	Set o=New RegExp
	o.IgnoreCase=True
	o.Global=True
	o.Pattern=regex
	CheckRegExp=o.test(str)
	Set o=Nothing
End Function

'得到HTML数据，配合BytesToBstr使用
function gethtml(strUrl,charset)
	on error resume next
	dim objXmlHttp
	set objXmlHttp=server.createobject("MSXML2.ServerXMLHTTP")
	objXmlHttp.setTimeouts 10000,10000,10000,30000
	objXmlHttp.open "GET",strUrl,false
	objXmlHttp.send()
	gethtml=BytesToBstr(objXmlHttp.responseBody,charset)
	err.Clear
	set objXmlHttp=nothing
end function

'格式化BINARY DATA
Function BytesToBstr(body,Cset)
	dim objstream
	set objstream = Server.CreateObject("adodb.stream")
	objstream.Type = 1
	objstream.Mode =3
	objstream.Open
	objstream.Write body
	objstream.Position = 0
	objstream.Type = 2
	objstream.Charset = Cset
	BytesToBstr = objstream.ReadText
	objstream.Close
	set objstream = nothing
End Function

'转换敏感字符
Function TransferHTML(ByVal source,para)
	Dim objRegExp

	If IsNull(source)=True Then Exit Function

	'先换"&"
	If Instr(para,"[&]")>0 Then  source=Replace(source,"&","&amp;")
	If Instr(para,"[<]")>0 Then  source=Replace(source,"<","&lt;")
	If Instr(para,"[>]")>0 Then  source=Replace(source,">","&gt;")
	If Instr(para,"[""]")>0 Then source=Replace(source,"""","&quot;")
	If Instr(para,"[space]")>0 Then source=Replace(source," ","&nbsp;")
	If Instr(para,"[delspace]")>0 Then
		Source=Replace(source," ","")
		Source=Replace(source,"　","")
	End If
	If Instr(para,"[enter]")>0 Then
		source=Replace(source,vbCrLf,"<br/>")
		source=Replace(source,vbLf,"<br/>")
	End If
	If Instr(para,"[no-asp]")>0 Then
		source=Replace(source,"<"&"%","&lt;"&"%")
		source=Replace(source,"%"&">","%"&"&gt;")
	End If
	If Instr(para,"[nohtml]")>0  Then
		Set objRegExp=New RegExp
		objRegExp.IgnoreCase =True
		objRegExp.Global=True
		objRegExp.Pattern="<[^>]*>"
		source= objRegExp.Replace(source,"")
	End If
	TransferHTML=source
End Function

'按照CustomDirectory指示创建相应的目录
Sub CreatDirectoryByCustomDirectory(ByVal strCustomDirectory)
	'On Error Resume Next
	Dim s
	Dim t
	Dim i
	Dim j
	Dim fso
	Set fso = CreateObject("Scripting.FileSystemObject")
	s=uEditor_ASPPath
	strCustomDirectory=Replace(strCustomDirectory,"/","\")
	t=Split(strCustomDirectory,"\")
	j=0
	For i=LBound(t) To UBound(t)
		If (IsEmpty(t(i))=False) And (t(i)<>"") Then
			s=s & t(i) & "\"
			If (fso.FolderExists(s)=False) Then
				Call fso.CreateFolder(s)
			End If
			j=j+1
		End If
	Next
	Set fso = Nothing
	Err.Clear
End Sub
'*********************************************************


'----------------------------------------------------------
'**************  风声 ASP 无组件上传类 V2.11  *************
'作者：风声
'网站：http://www.fonshen.com
'邮件：webmaster@fonshen.com
'版权：版权全体,源代码公开,各种用途均可免费使用
'其他：有稍作改动
'**********************************************************
'----------------------------------------------------------
Class UpLoadClass

	Private m_TotalSize,m_MaxSize,m_FileType,m_SavePath,m_AutoSave,m_Error,m_Charset
	Private m_dicForm,m_binForm,m_binItem,m_strDate,m_lngTime
	Public	FormItem,FileItem

	Public Property Get Version
		Version="Fonshen ASP UpLoadClass Version 2.11"
	End Property

	Public Property Get Error
		Error=m_Error
	End Property

	Public Property Get Charset
		Charset=m_Charset
	End Property
	Public Property Let Charset(strCharset)
		m_Charset=strCharset
	End Property

	Public Property Get TotalSize
		TotalSize=m_TotalSize
	End Property
	Public Property Let TotalSize(lngSize)
		if isNumeric(lngSize) then m_TotalSize=Clng(lngSize)
	End Property

	Public Property Get MaxSize
		MaxSize=m_MaxSize
	End Property
	Public Property Let MaxSize(lngSize)
		if isNumeric(lngSize) then m_MaxSize=Clng(lngSize)
	End Property

	Public Property Get FileType
		FileType=m_FileType
	End Property
	Public Property Let FileType(strType)
		m_FileType=strType
	End Property

	Public Property Get SavePath
		SavePath=m_SavePath
	End Property
	Public Property Let SavePath(strPath)
		m_SavePath=Replace(strPath,chr(0),"")
	End Property

	Public Property Get AutoSave
		AutoSave=m_AutoSave
	End Property
	Public Property Let AutoSave(byVal Flag)
		select case Flag
			case 0,1,2: m_AutoSave=Flag
		end select
	End Property

	Private Sub Class_Initialize
		m_Error	   = -1
		m_Charset  = "gb2312"
		m_TotalSize= 0
		m_MaxSize  = 153600
		m_FileType = "jpg/gif"
		m_SavePath = ""
		m_AutoSave = 0
		Dim dtmNow : dtmNow = Date()
		m_strDate  = Year(dtmNow)&Right("0"&Month(dtmNow),2)&Right("0"&Day(dtmNow),2)
		m_lngTime  = Clng(Timer()*1000)
		Set m_binForm = Server.CreateObject("ADODB.Stream")
		Set m_binItem = Server.CreateObject("ADODB.Stream")
		Set m_dicForm = Server.CreateObject("Scripting.Dictionary")
		m_dicForm.CompareMode = 1
	End Sub

	Private Sub Class_Terminate
		m_dicForm.RemoveAll
		Set m_dicForm = nothing
		Set m_binItem = nothing
		m_binForm.Close()
		Set m_binForm = nothing
	End Sub

	Public Function Open()
		Open = 0
		if m_Error=-1 then
			m_Error=0
		else
			Exit Function
		end if
		Dim lngRequestSize : lngRequestSize=Request.TotalBytes
		if m_TotalSize>0 and lngRequestSize>m_TotalSize then
			m_Error=5
			Exit Function
		elseif lngRequestSize<1 then
			m_Error=4
			Exit Function
		end if

		Dim lngChunkByte : lngChunkByte = 102400
		Dim lngReadSize : lngReadSize = 0
		m_binForm.Type = 1
		m_binForm.Open()
		do
			m_binForm.Write Request.BinaryRead(lngChunkByte)
			lngReadSize=lngReadSize+lngChunkByte
			if  lngReadSize >= lngRequestSize then exit do
		loop		
		m_binForm.Position=0
		Dim binRequestData : binRequestData=m_binForm.Read()

		Dim bCrLf,strSeparator,intSeparator
		bCrLf=ChrB(13)&ChrB(10)
		intSeparator=InstrB(1,binRequestData,bCrLf)-1
		strSeparator=LeftB(binRequestData,intSeparator)

		Dim strItem,strInam,strFtyp,strPuri,strFnam,strFext,lngFsiz
		Const strSplit="'"">"
		Dim strFormItem,strFileItem,intTemp,strTemp
		Dim p_start : p_start=intSeparator+2
		Dim p_end
		Do
			p_end = InStrB(p_start,binRequestData,bCrLf&bCrLf)-1
			m_binItem.Type=1
			m_binItem.Open()
			m_binForm.Position=p_start
			m_binForm.CopyTo m_binItem,p_end-p_start
			m_binItem.Position=0
			m_binItem.Type=2
			m_binItem.Charset=m_Charset
			strItem = m_binItem.ReadText()
			m_binItem.Close()
			intTemp=Instr(39,strItem,"""")
			strInam=Mid(strItem,39,intTemp-39)

			p_start = p_end + 4
			p_end = InStrB(p_start,binRequestData,strSeparator)-1
			m_binItem.Type=1
			m_binItem.Open()
			m_binForm.Position=p_start
			lngFsiz=p_end-p_start-2
			m_binForm.CopyTo m_binItem,lngFsiz


			if Instr(intTemp,strItem,"filename=""")<>0 then
			if not m_dicForm.Exists(strInam&"_From") then
				strFileItem=strFileItem&strSplit&strInam
				if m_binItem.Size<>0 then
					intTemp=intTemp+13
					strFtyp=Mid(strItem,Instr(intTemp,strItem,"Content-Type: ")+14)
					strPuri=Mid(strItem,intTemp,Instr(intTemp,strItem,"""")-intTemp)
					intTemp=InstrRev(strPuri,"\")
					strFnam=Mid(strPuri,intTemp+1)
					m_dicForm.Add strInam&"_Type",strFtyp
					m_dicForm.Add strInam&"_Name",strFnam
					m_dicForm.Add strInam&"_Path",Left(strPuri,intTemp)
					m_dicForm.Add strInam&"_Size",lngFsiz
					if Instr(strFnam,".")<>0 then
						strFext=Mid(strFnam,InstrRev(strFnam,".")+1)
					else
						strFext=""
					end if

					select case strFtyp
					case "image/jpeg","image/pjpeg","image/jpg"
						if Lcase(strFext)<>"jpg" then strFext="jpg"
						m_binItem.Position=3
						do while not m_binItem.EOS
							do
								intTemp = Ascb(m_binItem.Read(1))
							loop while intTemp = 255 and not m_binItem.EOS
							if intTemp < 192 or intTemp > 195 then
								m_binItem.read(Bin2Val(m_binItem.Read(2))-2)
							else
								Exit do
							end if
							do
								intTemp = Ascb(m_binItem.Read(1))
							loop while intTemp < 255 and not m_binItem.EOS
						loop
						m_binItem.Read(3)
						m_dicForm.Add strInam&"_Height",Bin2Val(m_binItem.Read(2))
						m_dicForm.Add strInam&"_Width",Bin2Val(m_binItem.Read(2))
					case "image/gif"
						if Lcase(strFext)<>"gif" then strFext="gif"
						m_binItem.Position=6
						m_dicForm.Add strInam&"_Width",BinVal2(m_binItem.Read(2))
						m_dicForm.Add strInam&"_Height",BinVal2(m_binItem.Read(2))
					case "image/png"
						if Lcase(strFext)<>"png" then strFext="png"
						m_binItem.Position=18
						m_dicForm.Add strInam&"_Width",Bin2Val(m_binItem.Read(2))
						m_binItem.Read(2)
						m_dicForm.Add strInam&"_Height",Bin2Val(m_binItem.Read(2))
					case "image/bmp"
						if Lcase(strFext)<>"bmp" then strFext="bmp"
						m_binItem.Position=18
						m_dicForm.Add strInam&"_Width",BinVal2(m_binItem.Read(4))
						m_dicForm.Add strInam&"_Height",BinVal2(m_binItem.Read(4))
					case "application/x-shockwave-flash"
						if Lcase(strFext)<>"swf" then strFext="swf"
						m_binItem.Position=0
						if Ascb(m_binItem.Read(1))=70 then
							m_binItem.Position=8
							strTemp = Num2Str(Ascb(m_binItem.Read(1)), 2 ,8)
							intTemp = Str2Num(Left(strTemp, 5), 2)
							strTemp = Mid(strTemp, 6)
							while (Len(strTemp) < intTemp * 4)
								strTemp = strTemp & Num2Str(Ascb(m_binItem.Read(1)), 2 ,8)
							wend
							m_dicForm.Add strInam&"_Width", Int(Abs(Str2Num(Mid(strTemp, intTemp + 1, intTemp), 2) - Str2Num(Mid(strTemp, 1, intTemp), 2)) / 20)
							m_dicForm.Add strInam&"_Height",Int(Abs(Str2Num(Mid(strTemp, 3 * intTemp + 1, intTemp), 2) - Str2Num(Mid(strTemp, 2 * intTemp + 1, intTemp), 2)) / 20)
						end if
					end select

					m_dicForm.Add strInam&"_Ext",strFext
					m_dicForm.Add strInam&"_From",p_start
					if m_AutoSave<>2 then
						intTemp=GetFerr(lngFsiz,strFext)
						m_dicForm.Add strInam&"_Err",intTemp
						if intTemp=0 then
							if m_AutoSave=0 then
								strFnam=GetTimeStr()
								if strFext<>"" then strFnam=strFnam&"."&strFext
							end if
							m_binItem.SaveToFile m_SavePath&strFnam,2
							m_dicForm.Add strInam,strFnam
						end if
					end if
				else
					m_dicForm.Add strInam&"_Err",-1
				end if
			end if
			else
				m_binItem.Position=0
				m_binItem.Type=2
				m_binItem.Charset=m_Charset
				strTemp=m_binItem.ReadText
				if m_dicForm.Exists(strInam) then
					m_dicForm(strInam) = m_dicForm(strInam)&","&strTemp
				else
					strFormItem=strFormItem&strSplit&strInam
					m_dicForm.Add strInam,strTemp
				end if
			end if

			m_binItem.Close()
			p_start = p_end+intSeparator+2
		loop Until p_start+3>lngRequestSize
		FormItem=Split(strFormItem,strSplit)
		FileItem=Split(strFileItem,strSplit)
		
		Open = lngRequestSize
	End Function

	Private Function GetTimeStr()
		GetTimeStr=DateDiff("s", "01/01/1970 08:00:00", Now()) & Int((10000 - 1 + 1) * Rnd + 1)
	End Function

	Private Function GetFerr(lngFsiz,strFext)
		dim intFerr
		intFerr=0
		if lngFsiz>m_MaxSize and m_MaxSize>0 then
			if m_Error=0 or m_Error=2 then m_Error=m_Error+1
			intFerr=intFerr+1
		end if
		if Instr(1,LCase("/"&m_FileType&"/"),LCase("/"&strFext&"/"))=0 and m_FileType<>"" then
			if m_Error<2 then m_Error=m_Error+2
			intFerr=intFerr+2
		end if
		GetFerr=intFerr
	End Function

	Public Function Save(Item,strFnam)
		Save=false
		if m_dicForm.Exists(Item&"_From") then
			dim intFerr,strFext
			strFext=m_dicForm(Item&"_Ext")
			intFerr=GetFerr(m_dicForm(Item&"_Size"),strFext)
			if m_dicForm.Exists(Item&"_Err") then
				if intFerr=0 then
					m_dicForm(Item&"_Err")=0
				end if
			else
				m_dicForm.Add Item&"_Err",intFerr
			end if
			if intFerr<>0 then Exit Function
			if VarType(strFnam)=2 then
				select case strFnam
					case 0:strFnam=GetTimeStr()
						if strFext<>"" then strFnam=strFnam&"."&strFext
					case 1:strFnam=m_dicForm(Item&"_Name")
				end select
			end if
			m_binItem.Type = 1
			m_binItem.Open
			m_binForm.Position = m_dicForm(Item&"_From")
			m_binForm.CopyTo m_binItem,m_dicForm(Item&"_Size")
			m_binItem.SaveToFile m_SavePath&strFnam,2
			m_binItem.Close()
			if m_dicForm.Exists(Item) then
				m_dicForm(Item)=strFnam
			else
				m_dicForm.Add Item,strFnam
			end if
			Save=true
		end if
	End Function

	Public Function GetData(Item)
		GetData=""
		if m_dicForm.Exists(Item&"_From") then
			if GetFerr(m_dicForm(Item&"_Size"),m_dicForm(Item&"_Ext"))<>0 then Exit Function
			m_binForm.Position = m_dicForm(Item&"_From")
			GetData = m_binForm.Read(m_dicForm(Item&"_Size"))
		end if
	End Function

	Public Function Form(Item)
		if m_dicForm.Exists(Item) then
			Form=m_dicForm(Item)
		else
			Form=""
		end if
	End Function

	Private Function BinVal2(bin)
		dim lngValue,i
		lngValue=0
		for i = lenb(bin) to 1 step -1
			lngValue = lngValue *256 + Ascb(midb(bin,i,1))
	Next
		BinVal2=lngValue
	End Function

	Private Function Bin2Val(bin)
		dim lngValue,i
		lngValue=0
		for i = 1 to lenb(bin)
			lngValue = lngValue *256 + Ascb(midb(bin,i,1))
	Next
		Bin2Val=lngValue
	End Function

	Private Function Num2Str(num, base, lens)
		Dim ret,i
		ret = ""
		while(num >= base)
			i   = num Mod base
			ret = i & ret
			num = (num - i) / base
		wend
		Num2Str = Right(String(lens, "0") & num & ret, lens)
	End Function

	Private Function Str2Num(str, base)
		Dim ret, i
		ret = 0 
		for i = 1 to Len(str)
			ret = ret * base + Cint(Mid(str, i, 1))
	Next
		Str2Num = ret
	End Function
	Public Function Error2Info(Item)
		Select Case m_dicForm(Item&"_Err")
			case -1:Error2Info = "上传没有开始"
			case 0: Error2Info = "SUCCESS"
			case 1: Error2Info = "文件因大于 "&m_MaxSize&"字节 而未被保存。"
			case 2: Error2Info = "文件因扩展名不符合而未被保存。"
			case 3: Error2Info = "文件因过大且不符合扩展名。"
			case 4: Error2Info = "异常，不存在上传。"
			case 5: Error2Info = "上传已经取消，请检查总上载数据是否小于 "&m_TotalSize&" 。"
		End Select
	End Function

End Class
%>