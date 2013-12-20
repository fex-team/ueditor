package ueditor;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.fileupload.*;
import org.apache.commons.fileupload.servlet.*;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;







import sun.misc.BASE64Decoder;

import javax.servlet.http.HttpServletRequest;
/**
 * UEditor文件上传辅助类
 *
 */
public class Uploader {
	
	//文件大小常量, 单位kb
	// 32M, 如果报了内存溢出异常， 请根据具体需求修改该值
	private static final int MAX_SIZE = 64 * 1024;
	// 输出文件地址
	private String url = "";
	// 上传文件名
	private String fileName = "";
	// 状态
	private String state = "";
	// 文件类型
	private String type = "";
	// 原始文件名
	private String originalName = "";
	// 文件大小
	private String size = "";
	// 文件名称格式化模板
	private String format = "";

	private HttpServletRequest request = null;
	private String title = "";

	private String savePath = "upload";
	// 文件允许格式
	private String[] allowFiles = { ".rar", ".doc", ".docx", ".zip", ".pdf",".txt", ".swf", ".wmv", ".gif", ".png", ".jpg", ".jpeg", ".bmp" };
	// 文件大小限制，单位Byte
	private long maxSize = 0;
	
	private HashMap<String, String> errorInfo = new HashMap<String, String>();
	private Map<String, String> params = null;
	private FileItem fileItem = null;
	
	public static final String ENCODEING = System.getProperties().getProperty( "file.encoding" );

	public Uploader(HttpServletRequest request) {
		
		this.request = request;
		this.params = new HashMap<String, String>();

		this.setMaxSize( Uploader.MAX_SIZE );
		
		HashMap<String, String> tmp = this.errorInfo;
		tmp.put("SUCCESS", "SUCCESS");
		// 未包含文件上传域
		tmp.put("NOFILE", "\\u672a\\u5305\\u542b\\u6587\\u4ef6\\u4e0a\\u4f20\\u57df");
		// 不允许的文件格式
		tmp.put("TYPE", "\\u4e0d\\u5141\\u8bb8\\u7684\\u6587\\u4ef6\\u683c\\u5f0f");
		// 文件大小超出限制
		tmp.put("SIZE", "\\u6587\\u4ef6\\u5927\\u5c0f\\u8d85\\u51fa\\u9650\\u5236");
		// 请求类型错误
		tmp.put("ENTYPE", "\\u8bf7\\u6c42\\u7c7b\\u578b\\u9519\\u8bef");
		// 上传请求异常
		tmp.put("REQUEST", "\\u4e0a\\u4f20\\u8bf7\\u6c42\\u5f02\\u5e38");
		// 未找到上传文件
		tmp.put("FILE", "\\u672a\\u627e\\u5230\\u4e0a\\u4f20\\u6587\\u4ef6");
        // IO异常
		tmp.put("IO", "IO\\u5f02\\u5e38");
		// 目录创建失败
		tmp.put("DIR", "\\u76ee\\u5f55\\u521b\\u5efa\\u5931\\u8d25");
        // 未知错误
		tmp.put("UNKNOWN", "\\u672a\\u77e5\\u9519\\u8bef");
		
		//默认成功
		this.state = tmp.get( "SUCCESS" );
		
		this.parseParams();
		
	}

	public void upload() throws Exception {
		
		boolean isMultipart = ServletFileUpload.isMultipartContent(this.request);
		if (!isMultipart) {
			this.state = this.errorInfo.get("NOFILE");
			return;
		}
		
		if ( this.fileItem == null ) {
			this.state = this.errorInfo.get("FILE");
			return;
		}
		
		//存储title
		this.title = this.getParameter( "pictitle" );

		try {
			String savePath = this.getFolder(this.savePath);
			
			if (!this.checkFileType(this.originalName)) {
				this.state = this.errorInfo.get("TYPE");
				return;
			} 
			
			if ( this.fileItem.getSize() > this.maxSize ) {
				this.state = this.errorInfo.get("SIZE");
				return;
			} 
			
			this.fileName = this.getName(this.originalName);
			this.type = this.getFileExt(this.fileName);
			this.url = savePath + "/" + this.fileName;
			
			FileOutputStream fos = new FileOutputStream( this.getPhysicalPath( this.url ) );
			BufferedInputStream bis = new BufferedInputStream( this.fileItem.getInputStream() );
			byte[] buff = new byte[128];
			int count = -1;
			
			while ( ( count = bis.read( buff ) ) != -1 ) {
				
				fos.write( buff, 0, count );
				
			}
			
			
			
			bis.close();
			fos.close();
			
			this.state=this.errorInfo.get("SUCCESS");
		} catch ( Exception e ) {
			e.printStackTrace();
			this.state=this.errorInfo.get("IO");
		}
		
	}
	
	/**
	 * 接受并保存以base64格式上传的文件
	 * @param fieldName
	 */
	public void uploadBase64(String fieldName){
		String savePath = this.getFolder(this.savePath);
		String base64Data = this.request.getParameter(fieldName);
		this.fileName = this.getName("test.png");
		this.url = savePath + "/" + this.fileName;
		BASE64Decoder decoder = new BASE64Decoder();
		try {
			File outFile = new File(this.getPhysicalPath(this.url));
			OutputStream ro = new FileOutputStream(outFile);
			byte[] b = decoder.decodeBuffer(base64Data);
			for (int i = 0; i < b.length; ++i) {
				if (b[i] < 0) {
					b[i] += 256;
				}
			}
			ro.write(b);
			ro.flush();
			ro.close();
			this.state=this.errorInfo.get("SUCCESS");
		} catch (Exception e) {
			e.printStackTrace();
			this.state = this.errorInfo.get("IO");
		}
	}

	public String getParameter ( String name ) {
		
		return this.params.get( name );
		
	}

	/**
	 * 文件类型判断
	 * 
	 * @param fileName
	 * @return
	 */
	private boolean checkFileType(String fileName) {
		Iterator<String> type = Arrays.asList(this.allowFiles).iterator();
		while (type.hasNext()) {
			String ext = type.next();
			if (fileName.toLowerCase().endsWith(ext)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 获取文件扩展名
	 * 
	 * @return string
	 */
	private String getFileExt(String fileName) {
		return fileName.substring(fileName.lastIndexOf("."));
	}
	
	@SuppressWarnings("unchecked")
	private void parseParams () {
		
		DiskFileItemFactory dff = new DiskFileItemFactory();
		ServletFileUpload sfu = new ServletFileUpload(dff);
		
		List<FileItem> items;
		try {
			items = sfu.parseRequest( this.request );
		
			for ( FileItem item : items ) {
				
				if ( item.isFormField() ) {
					
					this.params.put( item.getFieldName(), item.getString( "utf-8") );
					
				} else if ( this.fileItem == null ) {
					
					this.fileItem = item;
					this.originalName = item.getName();
					
				}
				
			}
			
		} catch (FileUploadException e) {
			// TODO 读取数据错误
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO 读取数据错误
			e.printStackTrace();
		}
		
	}

	/**
	 * 依据原始文件名生成新文件名
	 * @return
	 */
	private String getName(String fileName) {

		String filename = fileName.substring( 0, fileName.lastIndexOf( "." ) );
		Calendar calendar = Calendar.getInstance();
		
		int intMonth = calendar.get( Calendar.MONTH ) + 1;
		int intDay = calendar.get( Calendar.DAY_OF_MONTH );
		int intHour = calendar.get( Calendar.HOUR_OF_DAY );
		int intMinute = calendar.get( Calendar.MINUTE );
		int intSecond = calendar.get( Calendar.SECOND );
		
		
		String month = ( intMonth < 10 ? "0" : "" ) + intMonth;
		String day = ( intDay < 10 ? "0" : "" ) + intDay;
		String hour = ( intHour < 10 ? "0" : "" ) + intHour;
		String minute = ( intMinute < 10 ? "0" : "" ) + intMinute;
		String second = ( intSecond < 10 ? "0" : "" ) + intSecond;
		
		filename = this.format.replaceAll( "\\{filename\\}", filename )
				   .replaceAll( "\\{time\\}", System.currentTimeMillis() + "" )
				   .replaceAll( "\\{yyyy\\}", calendar.get( Calendar.YEAR ) + "" )
				   .replaceAll( "\\{yy\\}", ( calendar.get( Calendar.YEAR ) + "" ).substring( 2 ) )
				   .replaceAll( "\\{mm\\}", month )
				   .replaceAll( "\\{dd\\}", day )
				   .replaceAll( "\\{hh\\}", hour )
				   .replaceAll( "\\{ii\\}", minute )
				   .replaceAll( "\\{ss\\}", second );
		
		Matcher matcher = Pattern.compile( "\\{rand:([0-9]+)\\}" ).matcher( filename );
		
		while ( matcher.find() ) {
			
			int count = Integer.valueOf( matcher.group(1) );
			String groupRex = matcher.group().replace( "{", "\\{" ).replace( "}", "\\}" );
			
			filename = filename.replaceFirst( groupRex, this.getRandom( count ) );
			matcher.reset( filename );
			
		}
		


		// 对最终的结果删除不合法的字符
		return ( filename + this.getFileExt(fileName) ).replaceAll( "[\\\\/:*?\"<>|]", "" );

	}

	/**
	 * 根据字符串创建本地目录 并按照日期建立子目录返回
	 * @param path 
	 * @return 
	 */
	private String getFolder(String path) {
		SimpleDateFormat formater = new SimpleDateFormat("yyyyMMdd");
		path += "/" + formater.format(new Date());
		File dir = new File(this.getPhysicalPath(path));
		if (!dir.exists()) {
			try {
				dir.mkdirs();
			} catch (Exception e) {
				this.state = this.errorInfo.get("DIR");
				return "";
			}
		}
		return path;
	}
	
	/**
	 * 产生一个由参数count指定位数的随机数
	 * @param count 随机数的位数
	 * @return 随机数字符串
	 */
	private String getRandom ( int count ) {
		
		double random = Math.random();
		int resultCount = 0;
		int copyCount = count;
		
		while ( count > 0 ) {
			
			count--;
			random *= 10;
			
		}
		
		String result = ( int )random + "";
		
		resultCount = copyCount - result.length();

		while ( resultCount > 0 ) {
			
			result = "0" + result;
			resultCount--;
			
		}
		
		return result;
		
	}

	/**
	 * 根据传入的虚拟路径获取物理路径
	 * 
	 * @param path
	 * @return
	 */
	private String getPhysicalPath(String path) {
		String servletPath = this.request.getServletPath();
		String realPath = this.request.getSession().getServletContext()
				.getRealPath(servletPath);
		return new File(realPath).getParent() +"/" +path;
	}
	
	public void setSavePath(String savePath) {
		this.savePath = savePath;
	}

	public void setAllowFiles(String[] allowFiles) {
		this.allowFiles = allowFiles;
	}

	public void setMaxSize( long size ) {
		this.maxSize = size * 1024;
	}
	
	public void setFileNameFormat ( String format ) {
		
		this.format = format;
		
	}

	public String getSize() {
		return this.size;
	}

	public String getUrl() {
		return this.url;
	}

	public String getFileName() {
		return this.fileName;
	}

	public String getState() {
		return this.state;
	}
	
	public String getTitle() {
		return this.title;
	}

	public String getType() {
		return this.type;
	}

	public String getOriginalName() {
		return this.originalName;
	}
}
