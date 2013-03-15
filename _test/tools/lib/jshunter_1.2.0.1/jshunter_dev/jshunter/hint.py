#!/usr/bin/python
#encoding=utf-8
import sys,os
import ConfigParser
import commands
import time
import codecs

htmlMap = {}
def processHtml(filename):
	f = open(filename,"r")
	if f is None:
		raise Exception('open %s error!' % (filename))
	newName = os.sep.join(os.path.abspath(__file__).split(os.sep)[:-1]) + os.sep + "core" + os.sep + "data"+os.sep+os.path.basename(filename) + "." + str(time.time())
	#print newName
	tmp = ""
	flag=False
	orig_num = 0
	new_num = 0
	for ln in f:
		orig_num += 1
		if ln.find("<script type=\"text/javascript\">") != -1 and ln.find("</script>") == -1:
			flag=True
			continue
		if ln.find("<script type=\"text/javascript\">") != -1 and ln.find("</script>") != -1:
			flag=False
			continue
		if ln.find("<script>") != -1 and ln.find("</script>") == -1:
			flag=True
			continue
		if ln.find("<script>") != -1 and ln.find("</script>") != -1:
			flag=False
			continue
		if ln.find("</script>") != -1:
			flag=False
			continue
		if flag == True:
			tmp += ln
			new_num += 1
			htmlMap[filename+os.sep+str(orig_num)]=newName + os.sep + str(new_num)
	if tmp == "":
		print ('[WARNING]file %s not contain js code' % (filename))
		return ""
	outfile = open(newName,"w")
	if outfile is None:
		raise Exception('open %s error!' % (newName))
	outfile.write(tmp)
	#print htmlMap
	return newName

def clearTmpFiles():
	dels=[]
	for key in htmlMap.keys():
		fn =  os.sep.join(htmlMap[key].split(os.sep)[:-1])
		if not fn in dels:
			dels.append(fn)
	#print dels
	for item in dels:
		os.remove(item)
def isHiddenFile(path):
	itms = path.split(os.sep)
	for itm in itms:
		if itm != "" and itm != "." and itm != ".." and itm[0]==".":
			return True
	return False
'''
@input
a file (or a top dir) to be checked
@process 
recuresively read all the files of a dir.only support .html and .js.
if it is a html file then we only check the code between <script></script>
if it is a js file then we check all the code
@return
file(or folder) to be checked
'''
def getFiles(paths):
	#print paths
	ret = []
	omitpath = os.path.dirname(__file__) + os.sep + "conf" + os.sep + "omitfiles.conf"
	for path in paths:
		path = path.rstrip(os.sep)
		if not os.path.isdir(path):
			omitfiles = getOmitedFiles(omitpath,os.sep.join(path.split(os.sep)[:-1])+os.sep)
			if (os.path.getsize(path)==0) or (path in omitfiles):
				continue
			if path.find(".js") != -1 and isHiddenFile(path)==False:
				ret.append(path)
			elif path.find(".html") != -1 and isHiddenFile(path)==False: 
				np = processHtml(path)
				if np != "":
					ret.append(np)
		else:
			omitfiles = getOmitedFiles(omitpath,path)
			for root, dirs, files in os.walk(path):
				for f in files:
					if (os.path.getsize(root + os.sep + f)==0) or ((root + os.sep + f) in omitfiles):
						continue
					if f.find(".js") != -1 and isHiddenFile(root + os.sep + f) == False:
						ret.append(root + os.sep + f)
					elif f.find(".html") != -1 and isHiddenFile(root + os.sep + f) == False:
						np=processHtml(root + os.sep + f)
						if np != "":
							ret.append(np)
					else:
						continue
	return ret


def getopt(path):
	_opt=[]
	_predef=[]
	conf = ConfigParser.ConfigParser()
	conf.read(path)
	for item in conf.options('option'):
		_opt.append("%s=%s"%(item,conf.get('option',item)))
	for item in conf.options('predef'):
		_predef.append("%s=%s"%(item,conf.get('predef',item)))
	return "%s %s"%(",".join(_opt),",".join(_predef))

def getBlackList(path):
	lst={}
	conf = ConfigParser.ConfigParser()
	conf.read(path)
	for item in conf.options('level'):
		lst[item]=conf.get('level',item)
	return lst

def printReport(rptstr):
	if rptstr=="":
		return
	array = rptstr.split('\n')
	for ln in array:
		items = ln.split("***")
		if items[1].find("Stopping") != -1:
			print items[1]
		else:
			print "文件：%s\t错误原因:%s\t错误位置:第%s行\t错误语句：%s"%(items[0],items[1],items[2],items[4])
def processItem(item,blacklst,hp):
	itm = item
	for key in hp.keys():
		if item[0]+os.sep+item[2] == hp[key]:
			itm[0]=os.sep.join(key.split(os.sep)[:-1])
			itm[2]=key.split(os.sep)[-1]
	#print "====",itm,"======"
	itm.append("error")
	for err in blacklst.keys():
		if itm[1].lower().find(err.lower())!=-1:
			itm[5] = blacklst[err]
			break
	return itm
'''
parse jshint output
'''
def splitOutput(rptstr,blacklist,mp):
	if rptstr=="":
		return
	array = rptstr.split('\n')
	lst=[]
	parsecnt = 0;
	parsetotal=len(array)
	for ln in array:
		#print ln
		if ln.find("***") == -1:
			continue
		items = processItem(ln.split("***"),blacklist,mp)
		if items[1].find("Stopping") != -1:
			print items[1]
		else:
			lst.append(items)
		parsecnt = parsecnt + 1
	return (lst,parsecnt,parsetotal)
'''
get the table body according to the result-list
'''
def getBody(lst):
	files={}
	error=0
	warning=0
	ignore=0;
	count=0
	for item in lst:
		count = count + 1
		if len(item)<6:
			continue
		if not files.has_key(item[0]):
			if item[5] == "ignore":
				ignore = ignore + 1
			elif item[5] == "error":
				error = error + 1
				files[item[0]] = getLine(item,count)
			else:
				files[item[0]] = getLine(item,count)
				warning = warning + 1
		else:
			if item[5] == "ignore":
				ignore = ignore + 1
			elif item[5] == "error":
				error = error + 1
				files[item[0]] = files[item[0]] + getLine(item,count)
			else:
				files[item[0]] = files[item[0]] + getLine(item,count)
				warning = warning + 1
	return (files,ignore,warning,error)
	
def generateHtml(rptstr,outfile,blacklst,mp):
	print "start parsing jshint output..."
	(lst,parsecnt,parsetotal) = splitOutput(rptstr,blacklst,mp)
	print "prepare main tpl..."
	tpl=""
	tplPath=os.sep.join(os.path.abspath(__file__).split(os.sep)[:-1])+os.sep+"core"+os.sep+"tpl"+os.sep+"toggle_tpl.html"
	if not os.path.exists(tplPath):
		raise Exception('%s file does not exists!'%(tplPath))
	f=open(tplPath,"r")
	if f is None:
		raise Exception('open %s error!' % (tplPath))
	for ln in f:
		tpl+=ln
	strStartTime = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
	tpl=tpl.replace("{$pnumber}",str(len(lst)))
	tpl=tpl.replace("{$timeData}",strStartTime)
	f.close()
	print "blacklist filtering..."
	(files,ignore,warning,error) = getBody(lst)
	tpl=tpl.replace("{$ignumber}","%s(%5.1f%%)"%(str(ignore),(float(ignore)/len(lst)*100)))
	tpl=tpl.replace("{$errnumber}","%s(%5.1f%%)"%(str(error),(float(error)/len(lst)*100)))
	tpl=tpl.replace("{$warnumber}","%s(%5.1f%%)"%(str(warning),(float(warning)/len(lst)*100)))
	print "prepare body"
	bodys=""
	for key in files:
		tblPath=os.sep.join(os.path.abspath(__file__).split(os.sep)[:-1])+os.sep+"core"+os.sep+"tpl"+os.sep+"htmlpart.html"
		if not os.path.exists(tblPath):
			raise Exception('%s file does not exists!'%(tblPath))
		f=open(tblPath,"r")
		body=''''''
		for ln in f:
			body += ln
		body = body.replace("{$title}",key)
		body = body.replace("{$fname}",key)
		f.close()
		body = body.replace("[---to be replaced 2---]",files[key])
		bodys = bodys + body
	if bodys=="":
		#raise Exception('no report generated')
		bodys = "no informatin maybe they are filtered"
	tpl=tpl.replace("[---to be replace 1---]",bodys)
	ts=str(int(time.time()))
	resf=open(outfile,"w")
	if resf is None:
		raise Exception('open %s error!' % (outfile))
	resf.write(tpl)
	resf.close()
	print "generate html file %s OK!"%(outfile)
	return ts

def getLine(item,no):
	#print item
	text = '''<tr><td width='10%%'>%s</td><td width='10%%'>%s</td><td width='20%%'>%s</td><td width='10%%'>%s</td><td width='50%%'>%s</td></tr>'''%(str(no),item[5],item[1],item[2],item[4].replace("<","&lt;").replace(">","&gt;"))
	return text

def genReport(status,output,blackpath,outfile,htmlMap):
	#if status == 0:
	#	print "[WARNING][NO ERROR DETECTED BY JSHUNTER]"
	#else:
	if output.find("open file") != -1:
		raise Exception("File Not Found Error!")
	print "[ERROR DETECTED BY JSHUNTER]"
	blacklist = getBlackList(blackpath)
	ts = generateHtml(output,outfile,blacklist,htmlMap)
	return ts

def checkJavaExist():
	cmd="java"
	(status,output) = commands.getstatusoutput(cmd)
	if status != 0:
		raise Exception("jshunter depend on java enviroment.please make sure your java is OK")
def checkPythonExist():
	cmd="python -h"
	(status,output) = commands.getstatusoutput(cmd)
	if status != 0:
		raise Exception("jshunter depend on python enviroment.please make sure your python is OK")

def getCustomerCheckFiles(paths):
	omitpath = os.path.dirname(__file__) + os.sep + "conf" + os.sep + "omitfiles.conf"
	ret = []
	for path in paths:
		path = path.rstrip(os.sep)
		if not os.path.isdir(path):
			omitfiles = getOmitedFiles(omitpath,os.sep.join(path.split(os.sep)[:-1])+os.sep)
			if ((os.path.getsize(path)==0) or (path in omitfiles)):
				continue
			ret.append(path)
		else:
			omitfiles = getOmitedFiles(omitpath,path)
			for root, dirs, files in os.walk(path):
				for f in files:
					if (os.path.getsize(root + os.sep + f)==0) or ((root + os.sep + f) in omitfiles):
						continue
					else:
						ret.append(root + os.sep + f)
	return ret
def getOmitedFiles(confpath,topdir):
	_res = []
	_opt = []
	conf = ConfigParser.ConfigParser()
	conf.read(confpath)
	for item in conf.options('omitfils'):
		if conf.get('omitfils',item) == "true":
			_opt.append(item)
	if (not os.path.isdir(topdir)) and (len(_opt) > 0):
		return []
	for item in _opt:
		cmd = 'find %s -name "%s"'%(topdir,item)
		#print cmd
		(status,output) = commands.getstatusoutput(cmd)
		if status != 0:
			raise Exception("[FATAL]cmd failed!%s"%(cmd))
		#print output
		for ln in output.split("\n"):
			_res.append(ln)
	return _res
	
def usage():
	print "===================================================================================================================="
	print "[Usage]\n./hint outpath.html fileToCheck.js\t\t检查fileToCheck.js这个文件"
	print "./hint outpath.html folderToCheck\t\t检查folderToCheck这个目录内的所有js文件和html文件（递归检查）"
	print "./hint outpath.html folderToCheck/*.js\t\t检查folderToCheck一级目录下的所有js文件和html文件（忽略目录）"
	print "[Notice]使用时请确保当前目录中包含jshint.js文件，建议cd到jshunter的目录中执行./hint.py"
	print "[Contact] pankai01@baidu.com liulanying01@baidu.com"
	print "===================================================================================================================="

def doJsHint(_path):
	fileToCheck=getFiles(_path)
	step = 50
	javapath = "java"
	jsjar = os.path.dirname(__file__) + os.sep + "core" + os.sep + "jshint" + os.sep + "js.jar"
	rhino = os.path.dirname(__file__) + os.sep + "core" + os.sep + "jshint" + os.sep + "jshint-rhino.js"
	confpath = os.path.dirname(__file__) + os.sep + "conf" + os.sep + "check.cfg"
	blackpath = os.path.dirname(__file__) + os.sep + "conf" + os.sep + "ignore.list"
	opt = getopt(confpath)
	sz = len(fileToCheck)
	if sz <= 0:
		print "[WARNING]no file to be checked in doJsHint"
		return ""
	print "Files to be checked Number: %d"%(sz)
	for i in range(0,sz):
		print (i+1),":",fileToCheck[i]
	output=""
	if sz <= step:
		opt = "%s %s"%(getopt(confpath)," ".join(fileToCheck[:]))
		cmd = "%s -jar %s %s %s %s"%(javapath,jsjar,rhino,os.path.dirname(__file__) + os.sep,opt)
		(status,output) = commands.getstatusoutput(cmd)
	else:
		rd=sz/step+1
		for j in range(0,rd):
			if (j+1)*step>sz:
				opt = "%s %s"%(getopt(confpath)," ".join(fileToCheck[j*step:sz]))
			else:
				opt = "%s %s"%(getopt(confpath)," ".join(fileToCheck[j*step:(j+1)*step]))
			cmd = "%s -jar %s %s %s %s"%(javapath,jsjar,rhino,os.path.dirname(__file__) + os.sep,opt)
			(status,output_tmp)=commands.getstatusoutput(cmd)
			if status != 0 and output_tmp.find("open file") != -1:
				raise Exception("File Not Found Error.ERRMSG:%s\n"%(output_tmp))
			else:
				output = output + output_tmp
			print "Finish %5.1f%%"%((j+1)*float(str(step))/sz*100.0)
	return output

def doCustomerCheck(_path):
	confpath = os.path.dirname(__file__) + os.sep + "conf" + os.sep + "custcheck.conf"
	custpath = os.path.dirname(__file__) + os.sep + "core" + os.sep + "customcheck" + os.sep
	ops = getCustCheckOpt(confpath)
	fileToCheck = getCustomerCheckFiles(_path)
	sz = len(fileToCheck)
	if sz == 0:
		print "[WARNING]no file to be checked in doCustomerCheck"
		return ""
	custout = ''
	#print ops
	for item in ops:
		for i in range(0,sz):
			cmd = "%s %s"%(custpath+item,fileToCheck[i])
			#print cmd
			(status,output_tmp)=commands.getstatusoutput(cmd)
			for ln in output_tmp.split("\n"):
				#print ln
				if ln.find("***") != -1:
					custout += (ln+"\n")
	
	#print custout
	return custout

def getCustCheckOpt(path):
	_opt=[]
	conf = ConfigParser.ConfigParser()
	conf.read(path)
	for item in conf.options('command'):
		if conf.get('command',item) == "true":
			_opt.append(item)
	return _opt

if __name__ == "__main__":
	try:
		#checkJavaExist()
		#checkPythonExist()
		#print "check enviroment ok"
		if len(sys.argv) < 3:
			usage()
			raise Exception("arg number error!")
		outfile=sys.argv[1]
		if os.path.exists(outfile):
			raise Exception('%s already exist!In order to avoid overwrite the file,please change a none-exist file!'%(outfile))
		blackpath = os.path.dirname(__file__) + os.sep + "conf" + os.sep + "ignore.list"
		filepath = sys.argv[2:]
		output1 = doJsHint(filepath)
		output2 = doCustomerCheck(filepath)
		output = output1 + output2
		if output != "":
			ts = genReport(0,output,blackpath,outfile,htmlMap)
		else:
			print "[WARNING]%s"%("no error detected")
		clearTmpFiles()
	except Exception,err:
		print "[FATAL]%s"%(err)
		clearTmpFiles()
		sys.exit(1)
