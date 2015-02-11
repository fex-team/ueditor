<?php
/**
 * 
 * @author: peng.shan <peng.shan@happyelements.com>
 * @version $Id: mail.php 156323 2011-11-28 02:57:21Z peng.shan $
 */
class Mail {
	function send_mail($to,$subject = "",$body = "") {
		//error_reporting(E_STRICT);
		date_default_timezone_set("Asia/Shanghai");//设定时区东八区
		require_once('../libs/phpmailer/class.phpmailer.php');
		include("../libs/phpmailer/class.pop3.php");
		$mail             = new PHPMailer(); //new一个PHPMailer对象出来
		$body             = str_replace("[\]",'',$body); //对邮件内容进行必要的过滤
		$mail->CharSet ="UTF-8";//设定邮件编码，默认ISO-8859-1，如果发中文此项必须设置，否则乱码
//		$mail->IsSMTP(); // 设定使用SMTP服务
//		$mail->SMTPDebug  = 1;                     // 启用SMTP调试功能
											   // 1 = errors and messages
											   // 2 = messages only
		$mail->SMTPAuth   = true;                  // 启用 SMTP 验证功能
		$mail->SMTPSecure = "ssl";                 // 安全协议
		$mail->Host       = "MAILBOX03.internal.baidu.com";      // SMTP 服务器
		$mail->Port       = 465;                   // SMTP服务器的端口号
		$mail->Username   = "zhuwemxuan";  // SMTP服务器用户名
		$mail->Password   = "xxxxx";            // SMTP服务器密码
		$mail->SetFrom('xxxx@baidu.com', '朱文轩');
		$mail->AddReplyTo("xxxx@baidu.com","邮件回复人的名称");
		$mail->Subject    = $subject;
		$mail->AltBody    = "To view the message, please use an HTML compatible email viewer! - From www.jiucool.com"; // optional, comment out and test
		$mail->MsgHTML($body);
		$address = $to;
		$mail->AddAddress($address, "收件人名称");
		if(!$mail->Send()) {
			echo "Mailer Error: " . $mail->ErrorInfo;
		} else {
			echo "Message sent!恭喜，邮件发送成功！";
        }
    }
    function new_send_mail(){
        mail("xxxx@baidu.com","asdfasdf","asdfasdf");
//        require_once('../libs/phpmailer/class.phpmailer.php');
//        $mail = new PHPMailer();
//        $body             = "asdfdsf";
//        $body             = str_replace("[\]",'',$body);
//        $mail->SMTPAuth   = true;                  // 启用 SMTP 验证功能
//        $mail->SMTPSecure = "ssl";                 // 安全协议
//        $mail->IsSMTP();
//        $mail->CharSet='UTF-8';
//        $mail->SMTPDebug = 2;
//        $mail->Host     = 'smtp.baidu.com';
//        $mail->Port = 25;
//        $mail->Username = "xxxx@baidu.com";
//        $mail->Password = "xxxx";
//        $mail->SetFrom('xxxx@baidu.com', 'First Last');
//
//        $mail->AddReplyTo("zhuwen_xuan@126.com","First Last");
//
//        $mail->Subject    = "PHPMailer Test Subject via POP before SMTP, basic";
//
//        $mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test
//
//        $mail->MsgHTML($body);
//
//        $address = "zhuwen_xuan@126.com";
//        $mail->AddAddress($address, "John Doe");
//        if(!$mail->Send()) {
//          echo "Mailer Error: " . $mail->ErrorInfo;
//        } else {
//          echo "Message sent!";
//        }
    }

    function sendMain126(){
        require_once('../libs/phpmailer/class.phpmailer.php');
        $mail = new PHPMailer();
        $body             = "asdfdsf";
        $body             = str_replace("[\]",'',$body);
        $mail->SMTPAuth   = true;                  // 启用 SMTP 验证功能
        $mail->SMTPSecure = "ssl";                 // 安全协议
        $mail->IsSMTP();
        $mail->CharSet='UTF-8';
        $mail->SMTPDebug = 2;
        $mail->Host     = 'smtp.126.com';
        $mail->Port = 465;
        $mail->Username = "zhuwen_xuan@126.com";
        $mail->Password = "zwx19840818";
        $mail->SetFrom('zhuwen_xuan@126.com', 'First Last');

        $mail->AddReplyTo("xxxx@baidu.com","First Last");

        $mail->Subject    = "PHPMailer Test Subject via POP before SMTP, basic";

        $mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test

        $mail->MsgHTML($body);

        $address = "xxxxxx@baidu.com";
        $mail->AddAddress($address, "John Doe");
        if(!$mail->Send()) {
          echo "Mailer Error: " . $mail->ErrorInfo;
        } else {
          echo "Message sent!";
        }
    }

}
$m = new Mail();
$m->new_send_mail();




    