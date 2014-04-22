using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

/// <summary>
/// UploadHandler 的摘要说明
/// </summary>
public class UploadHandler : Handler
{

    public UploadConfig Config { get; private set; }
    public UploadResult Result { get; private set; }

    public UploadHandler(HttpContext context, UploadConfig config)
        : base(context)
    {
        this.Config = config;
        this.Result = new UploadResult() { State = UploadState.Unknown };
    }

    public override void Process()
    {
        byte[] uploadFileBytes = null;
        string uploadFileName = null;

        if (Config.Base64)
        {
            uploadFileName = Config.Base64Filename;
            uploadFileBytes = Convert.FromBase64String(Request[Config.UploadFieldName]);
        }
        else
        {
            var file = Request.Files[Config.UploadFieldName];
            uploadFileName = file.FileName;

            if (!CheckFileType(uploadFileName))
            {
                Result.State = UploadState.TypeNotAllow;
                WriteResult();
                return;
            }
            if (!CheckFileSize(file.ContentLength))
            {
                Result.State = UploadState.SizeLimitExceed;
                WriteResult();
                return;
            }

            uploadFileBytes = new byte[file.ContentLength];
            try
            {
                file.InputStream.Read(uploadFileBytes, 0, file.ContentLength);
            }
            catch (Exception)
            {
                Result.State = UploadState.NetworkError;
                WriteResult();
            }
        }

        Result.OriginFileName = uploadFileName;
        
        var savePath = Config.SavePath + NameFormater.Format(Config.FileNamingFormat, uploadFileName);
        var localPath = Server.MapPath(savePath);
        try
        {
            if (!Directory.Exists(Path.GetDirectoryName(localPath)))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(localPath));
            }
            File.WriteAllBytes(localPath, uploadFileBytes);
            Result.Url = savePath;
            Result.State = UploadState.Success;
        }
        catch (Exception e)
        {
            Result.State = UploadState.FileAccessError;
            Result.ErrorMessage = e.Message;
        }
        finally
        {
            WriteResult();
        }
    }

    private void WriteResult()
    {
        if (Result.State != UploadState.Success)
        {
            Response.StatusCode = 500;
        }
        this.WriteJson(new
        {
            state = GetStateMessage(Result.State),
            url = Result.Url,
            title = Result.OriginFileName,
            origin = Result.OriginFileName,
            error = Result.ErrorMessage
        });
    }

    private string GetStateMessage(UploadState state)
    {
        switch (state)
        {
            case UploadState.Success:
                return "SUCCESS";
            case UploadState.FileAccessError:
                return "文件访问出错，请检查写入权限";
            case UploadState.SizeLimitExceed:
                return "文件大小超出服务器限制";
            case UploadState.TypeNotAllow:
                return "不允许的文件格式";
            case UploadState.NetworkError:
                return "网络错误"; 
        }
        return "未知错误";
    }

    private bool CheckFileType(string filename)
    {
        var fileExtension = Path.GetExtension(filename).ToLower();
        return Config.AllowExtensions.Select(x => x.ToLower()).Contains(fileExtension);
    }

    private bool CheckFileSize(int size)
    {
        return size < Config.SizeLimit;
    }
}

public class UploadConfig
{
    /// <summary>
    /// 上存文件保存路径
    /// </summary>
    public string SavePath { get; set; }

    /// <summary>
    /// 文件命名规则
    /// </summary>
    public string FileNamingFormat { get; set; }

    /// <summary>
    /// 上传表单域名称
    /// </summary>
    public string UploadFieldName { get; set; }

    /// <summary>
    /// 上传大小限制
    /// </summary>
    public int SizeLimit { get; set; }

    /// <summary>
    /// 上传允许的文件格式
    /// </summary>
    public string[] AllowExtensions { get; set; }

    /// <summary>
    /// 文件是否以 Base64 的形式上传
    /// </summary>
    public bool Base64 { get; set; }

    /// <summary>
    /// Base64 字符串所表示的文件名
    /// </summary>
    public string Base64Filename { get; set; }
}

public class UploadResult
{
    public UploadState State { get; set; }
    public string Url { get; set; }
    public string OriginFileName { get; set; }

    public string ErrorMessage { get; set; }
}

public enum UploadState
{
    Success = 0,
    SizeLimitExceed = -1,
    TypeNotAllow = -2,
    FileAccessError = -3,
    NetworkError = -4,
    Unknown = 1,
}

public static class NameFormater
{
    public static string Format(string format, string filename)
    {
        if (String.IsNullOrWhiteSpace(format))
        {
            format = "{filename}{rand:6}";
        }
        string ext = Path.GetExtension(filename);
        filename = Path.GetFileNameWithoutExtension(filename);
        format = format.Replace("{filename}", filename);
        format = new Regex(@"\{rand(\:?)(\d+)\}", RegexOptions.Compiled).Replace(format, new MatchEvaluator(delegate(Match match)
        {
            var digit = 6;
            if (match.Groups.Count > 2)
            {
                digit = Convert.ToInt32(match.Groups[2].Value);
            }
            var rand = new Random();
            return rand.Next((int)Math.Pow(10, digit), (int)Math.Pow(10, digit + 1)).ToString();
        }));
        format = format.Replace("{time}", DateTime.Now.Ticks.ToString());
        format = format.Replace("{yyyy}", DateTime.Now.Year.ToString());
        format = format.Replace("{yy}", (DateTime.Now.Year % 100).ToString("D2"));
        format = format.Replace("{mm}", DateTime.Now.Month.ToString("D2"));
        format = format.Replace("{dd}", DateTime.Now.Day.ToString("D2"));
        format = format.Replace("{hh}", DateTime.Now.Hour.ToString("D2"));
        format = format.Replace("{ii}", DateTime.Now.Minute.ToString("D2"));
        format = format.Replace("{ss}", DateTime.Now.Second.ToString("D2"));
        var invalidPattern = new Regex(@"[\\\/\:\*\?\042\<\>\|]");
        format = invalidPattern.Replace(format, "");
        return format + ext;
    }
}