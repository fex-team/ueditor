using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

/// <summary>
/// FileManager 的摘要说明
/// </summary>
public class ListFileManager : Handler
{
    enum ResultState
    {
        Success,
        InvalidParam,
        AuthorizError,
        IOError,
        PathNotFound
    }

    private int Start;
    private int Size;
    private int Total;
    private ResultState State;
    private String[] PathToList = Config.GetStringList("savePath");
    private String[] FileList;

    public ListFileManager(HttpContext context) : base(context) { }

    public override void Process()
    {
        try
        {
            Start = String.IsNullOrEmpty(Request["start"]) ? 0 : Convert.ToInt32(Request["start"]);
            Size = String.IsNullOrEmpty(Request["size"]) ? Config.GetInt("imageManagerListSize") : Convert.ToInt32("size");
        }
        catch (FormatException)
        {
            State = ResultState.InvalidParam;
            WriteResult();
            return;
        }
        var buildingList = new List<String>();
        try
        {
            foreach (var path in PathToList)
            {
                buildingList.AddRange(Directory.GetFiles(Server.MapPath(path)));
            }
            Total = buildingList.Count;
            FileList = buildingList.OrderBy(x => x).Skip(Start).Take(Size).ToArray();
        }
        catch (UnauthorizedAccessException)
        {
            State = ResultState.AuthorizError;
        }
        catch (DirectoryNotFoundException)
        {
            State = ResultState.PathNotFound;
        }
        catch (IOException)
        {
            State = ResultState.IOError;
        }
        finally
        {
            WriteResult();
        }
    }

    private void WriteResult()
    {
        WriteJson(new
        {
            state = GetStateString(),
            list = FileList == null ? null : FileList.Select(x => new { url = x }),
            start = Start,
            size = Size,
            total = Total
        });
    }

    private string GetStateString()
    {
        switch (State)
        {
            case ResultState.Success:
                return "SUCCESS";
            case ResultState.InvalidParam:
                return "参数不正确";
            case ResultState.PathNotFound:
                return "路径不存在";
            case ResultState.AuthorizError:
                return "文件系统权限不足";
            case ResultState.IOError:
                return "文件系统读取错误";
        }
        return "未知错误";
    }
}