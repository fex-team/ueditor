package com.baidu.ueditor;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PathFormat {
	
	private static final String TIME = "time";
	private static final String FULL_YEAR = "yyyy";
	private static final String YEAR = "yy";
	private static final String MONTH = "mm";
	private static final String DAY = "dd";
	private static final String HOUR = "hh";
	private static final String MINUTE = "ii";
	private static final String SECOND = "ss";
	private static final String RAND = "rand";
	
	private static Date currentDate = null;
	
	public static String parse ( String input ) {
		
		Pattern pattern = Pattern.compile( "\\{([^\\}]+)\\}", Pattern.CASE_INSENSITIVE  );
		Matcher matcher = pattern.matcher(input);
		
		PathFormat.currentDate = new Date();
		
		StringBuffer sb = new StringBuffer();
		
		while ( matcher.find() ) {
			
			matcher.appendReplacement(sb, PathFormat.getString( matcher.group( 1 ) ) );
			
		}
		
		matcher.appendTail(sb);
		
		return sb.toString();
	}
	
	/**
	 * 格式化路径, 把windows路径替换成标准路径
	 * @param input 待格式化的路径
	 * @return 格式化后的路径
	 */
	public static String format ( String input ) {
		
		return input.replace( "\\", "/" );
		
	}

	public static String parse ( String input, String filename ) {
	
		Pattern pattern = Pattern.compile( "\\{([^\\}]+)\\}", Pattern.CASE_INSENSITIVE  );
		Matcher matcher = pattern.matcher(input);
		String matchStr = null;
		
		PathFormat.currentDate = new Date();
		
		StringBuffer sb = new StringBuffer();
		
		while ( matcher.find() ) {
			
			matchStr = matcher.group( 1 );
			if ( matchStr.indexOf( "filename" ) != -1 ) {
				filename = filename.replace( "$", "\\$" ).replaceAll( "[\\/:*?\"<>|]", "" );
				matcher.appendReplacement(sb, filename );
			} else {
				matcher.appendReplacement(sb, PathFormat.getString( matchStr ) );
			}
			
		}
		
		matcher.appendTail(sb);
		
		return sb.toString();
	}
		
	private static String getString ( String pattern ) {
		
		pattern = pattern.toLowerCase();
		
		// time 处理
		if ( pattern.indexOf( PathFormat.TIME ) != -1 ) {
			return PathFormat.getTimestamp();
		} else if ( pattern.indexOf( PathFormat.FULL_YEAR ) != -1 ) {
			return PathFormat.getFullYear();
		} else if ( pattern.indexOf( PathFormat.YEAR ) != -1 ) {
			return PathFormat.getYear();
		} else if ( pattern.indexOf( PathFormat.MONTH ) != -1 ) {
			return PathFormat.getMonth();
		} else if ( pattern.indexOf( PathFormat.DAY ) != -1 ) {
			return PathFormat.getDay();
		} else if ( pattern.indexOf( PathFormat.HOUR ) != -1 ) {
			return PathFormat.getHour();
		} else if ( pattern.indexOf( PathFormat.MINUTE ) != -1 ) {
			return PathFormat.getMinute();
		} else if ( pattern.indexOf( PathFormat.SECOND ) != -1 ) {
			return PathFormat.getSecond();
		} else if ( pattern.indexOf( PathFormat.RAND ) != -1 ) {
			return PathFormat.getRandom( pattern );
		}
		
		return pattern;
		
	}

	private static String getTimestamp () {
		return System.currentTimeMillis() + "";
	}
	
	private static String getFullYear () {
		return new SimpleDateFormat( "yyyy" ).format( PathFormat.currentDate );
	}
	
	private static String getYear () {
		return new SimpleDateFormat( "yy" ).format( PathFormat.currentDate );
	}
	
	private static String getMonth () {
		return new SimpleDateFormat( "MM" ).format( PathFormat.currentDate );
	}
	
	private static String getDay () {
		return new SimpleDateFormat( "dd" ).format( PathFormat.currentDate );
	}
	
	private static String getHour () {
		return new SimpleDateFormat( "HH" ).format( PathFormat.currentDate );
	}
	
	private static String getMinute () {
		return new SimpleDateFormat( "mm" ).format( PathFormat.currentDate );
	}
	
	private static String getSecond () {
		return new SimpleDateFormat( "ss" ).format( PathFormat.currentDate );
	}
	
	private static String getRandom ( String pattern ) {
		
		int length = 0;
		pattern = pattern.split( ":" )[ 1 ].trim();
		
		length = Integer.parseInt( pattern );
		
		return ( Math.random() + "" ).replace( ".", "" ).substring( 0, length );
		
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}
