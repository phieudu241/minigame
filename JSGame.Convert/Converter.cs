using System;
using System.Collections.Generic;
using System.Text;

using System.IO;
using System.Configuration;
using HtmlAgilityPack;
using iStone.Util;

namespace Convert
{
    public class Converter
    {
        #region static fields/construct
        private static readonly Log _log = new Log(typeof(Converter));

        private static string _basePath = String.Empty;
        //private static string _version = String.Empty;
        private static string _gameNames = String.Empty;
        private static string _classNames = String.Empty;
        private static string _title = String.Empty;
        private static string _description = String.Empty;
        private static string _keywords = String.Empty;
        private static string _subtitle = String.Empty;

        private static string _releasePath = String.Empty;

        private static string _yanzheng = String.Empty;
        // 页脚文字
        private static string _mainFooter = String.Empty;

        // 压缩替换类
        private static JSCompressor _jsc = null;
        private static JSReplacer _jsr = null;

        // js/game.js 压缩后的字符串
        private static string _gameJsStr = String.Empty;

        private static bool _isCompress = false;

        static Converter()
        {
            _basePath = ConfigurationManager.AppSettings["BasePath"];
            //_version = ConfigurationManager.AppSettings["Version"];
            _gameNames = ConfigurationManager.AppSettings["GameNames"];
            _classNames = ConfigurationManager.AppSettings["ClassNames"];
            _title = ConfigurationManager.AppSettings["Title"];
            _description = ConfigurationManager.AppSettings["Description"];
            _keywords = ConfigurationManager.AppSettings["Keywords"];
            _subtitle = ConfigurationManager.AppSettings["SubTitle"];

            _yanzheng = String.Format("验证：{0}&amp;{1}",
                "<a href=\"http://validator.w3.org/check?uri=referer\">XHTML</a>",
                "<a href=\"http://jigsaw.w3.org/css-validator/\">CSS</a>");

            _mainFooter = String.Format("&copy;{0}&nbsp;&nbsp;更新：{1}&nbsp;&nbsp;{2}",
                _title, DateTime.Now.ToString("yyyy-MM-dd"), _yanzheng);

            _releasePath = _basePath + "_release\\";

            _jsc = new JSCompressor(true, false);
            _jsr = new JSReplacer();
        }
        #endregion

        #region Start
        /// <summary>
        /// 入口
        /// </summary>
        public static void Start(bool isCompress)
        {
            _isCompress = isCompress;

            _log.Info("开始转换。");

            // 创建_release目录
            CreateReleaseDirectory();

            // 创建default.htm log.htm about.htm
            CreateMainPages();

            // 转换所有游戏
            ConvertGamePages();

            _log.Info("结束转换。");
        }
        #endregion

        #region CreateReleaseDirectory
        /// <summary>
        /// 创建_release目录
        /// </summary>
        public static void CreateReleaseDirectory()
        {
            try
            {
                if (Directory.Exists(_releasePath))
                {
                    _log.Info("删除 _release 目录");
                    Directory.Delete(_releasePath, true);
                }
                _log.Info("创建 _release 目录");
                Directory.CreateDirectory(_releasePath);

                Directory.CreateDirectory(_releasePath + "css\\");
                Directory.CreateDirectory(_releasePath + "img\\");
                Directory.CreateDirectory(_releasePath + "js\\");
                Directory.CreateDirectory(_releasePath + "js\\lib\\");
                _log.Info("创建 _release 下子目录");

                // 拷贝css/img/js下的文件到目标目录
                IOUtil.CopyDiectory(_basePath + "css\\", _releasePath + "css\\");
                IOUtil.CopyDiectory(_basePath + "img\\", _releasePath + "img\\");
                IOUtil.CopyDiectory(_basePath + "js\\lib\\", _releasePath + "js\\lib\\");
                _log.Info("拷贝文件到 _release 子目录中");

            }
            catch (Exception ex)
            {
                _log.Error("创建 _release 目录失败！", ex);
            }
        }
        #endregion

        #region CreateMainPages
        /// <summary>
        /// 创建default.htm log.htm about.htm
        /// </summary>
        public static void CreateMainPages()
        {
            // 模板文件
            string templateStr = IOUtil.ReadFile(_basePath + "template\\main.htm");
            templateStr = templateStr.Replace("##Title##", _title);
            templateStr = templateStr.Replace("##Keywords##", _keywords);
            templateStr = templateStr.Replace("##Description##", _description);
            templateStr = templateStr.Replace("##SubTitle##", _subtitle);
            templateStr = templateStr.Replace("##Footer##", _mainFooter);


            HtmlDocument doc = new HtmlDocument();
            doc.OptionFixNestedTags = true;
            doc.OptionOutputAsXml = true;

            // default.htm
            doc.LoadHtml(IOUtil.ReadFile(_basePath + "default.htm"));
            string contentStr = doc.DocumentNode.SelectSingleNode("//div[@id='MainContent']").InnerHtml;
            string menuStr = doc.DocumentNode.SelectSingleNode("//div[@id='Menu']").InnerHtml;
            IOUtil.WriteFile(_releasePath + "default.htm", templateStr.Replace("##MainContent##", contentStr).Replace("##Menu##", menuStr));

            // log.htm
            doc.LoadHtml(IOUtil.ReadFile(_basePath + "log.htm"));
            contentStr = doc.DocumentNode.SelectSingleNode("//div[@id='MainContent']").InnerHtml;
            menuStr = doc.DocumentNode.SelectSingleNode("//div[@id='Menu']").InnerHtml;
            IOUtil.WriteFile(_releasePath + "log.htm", templateStr.Replace("##MainContent##", contentStr).Replace("##Menu##", menuStr));

            // about.htm
            doc.LoadHtml(IOUtil.ReadFile(_basePath + "about.htm"));
            contentStr = doc.DocumentNode.SelectSingleNode("//div[@id='MainContent']").InnerHtml;
            menuStr = doc.DocumentNode.SelectSingleNode("//div[@id='Menu']").InnerHtml;
            IOUtil.WriteFile(_releasePath + "about.htm", templateStr.Replace("##MainContent##", contentStr).Replace("##Menu##", menuStr));

            //// download.htm
            //doc.LoadHtml(IOUtil.ReadFile(_basePath + "download.htm"));
            //contentStr = doc.DocumentNode.SelectSingleNode("//div[@id='MainContent']").InnerHtml;
            //menuStr = doc.DocumentNode.SelectSingleNode("//div[@id='Menu']").InnerHtml;
            //IOUtil.WriteFile(_releasePath + "download.htm", templateStr.Replace("##MainContent##", contentStr).Replace("##Menu##", menuStr));

            _log.Info("创建主页面default about log");
        }
        #endregion

        #region CreateGameJS
        ///// <summary>
        ///// 创建game.js
        ///// </summary>
        //public static void CreateGameJS()
        //{
        //    _log.Info("开始创建game.js");

        //    StringBuilder sb = new StringBuilder();

        //    // 读取所有文件
        //    _log.Info("开始读取用于创建game.js的js文件");
        //    string[] classNameArray = _classNames.Split(',');
        //    foreach (string className in classNameArray)
        //    {
        //        if (!String.IsNullOrEmpty(className))
        //        {
        //            sb.Append(IOUtil.ReadFile(_basePath + "js\\class\\" + className + ".js"));
        //        }
        //    }
        //    _log.Info("结束读取用于创建game.js的js文件");

        //    string gameJsStr = _jsr.Replace(_jsc.Compress(sb.ToString()));

        //    IOUtil.WriteFile(_releasePath + "\\js\\game.js", gameJsStr);

        //    _log.Info("结束创建game.js");
        //}
        #endregion

        #region ConvertGamePages
        /// <summary>
        /// 转换所有游戏
        /// </summary>
        public static void ConvertGamePages()
        {
            // 创建压缩加密过的 game.js 文件
            _gameJsStr = IOUtil.ReadFile(_basePath + "js\\game.js");
            if (_isCompress)
            {
                _gameJsStr = _jsr.Replace(_jsc.Compress(_gameJsStr));
                _log.Info("创建压缩加密过的 game.js 字符串");
            }

            //string mainStr = IOUtil.ReadFile(_basePath + "js\\main.js");
            //mainStr = _jsr.Replace(_jsc.Compress(mainStr));
            //IOUtil.WriteFile(_releasePath + "\\js\\main.js", mainStr);
            //_log.Info("创建压缩加密过的 main.js 文件");

            // 首先取得游戏模板
            string templateStr = IOUtil.ReadFile(_basePath + "template\\game.htm");
            templateStr = templateStr.Replace("##Title##", _title);
            templateStr = templateStr.Replace("##Keywords##", _keywords);
            templateStr = templateStr.Replace("##Description##", _description);
            //templateStr = templateStr.Replace("##Footer##", _mainFooter);

            string[] gameNameArray = _gameNames.Split(',');
            foreach (string gameName in gameNameArray)
            {
                ConvertGame(gameName, templateStr);
            }
        }
        #endregion

        #region ConvertGame
        /// <summary>
        /// 转换单个游戏
        /// </summary>
        /// <param name="gameName"></param>
        /// <param name="templateStr">游戏页面模板</param>
        public static void ConvertGame(string gameName, string templateStr)
        {
            _log.Info("开始转换游戏：" + gameName);

            // 创建拷贝游戏目录
            CreateAndCopyGameDiectory(gameName);

            // 转换游戏HTML
            ConvertGameHtml(gameName, templateStr);

            ConvertGameJS(gameName);

            CreateGameZIP(gameName);

            _log.Info("结束转换游戏：" + gameName);
        }
        #endregion

        #region CreateAndCopyGameDiectory
        /// <summary>
        /// 创建拷贝游戏目录
        /// </summary>
        /// <param name="gameName"></param>
        public static void CreateAndCopyGameDiectory(string gameName)
        {
            try
            {
                if (Directory.Exists(_releasePath + gameName + "\\"))
                {
                    //_log.Info("删除游戏目录：" + gameName);
                    Directory.Delete(_releasePath + gameName + "\\", true);
                }
                //_log.Info("创建游戏目录：" + gameName);
                Directory.CreateDirectory(_releasePath + gameName);
                Directory.CreateDirectory(_releasePath + gameName + "\\css\\");
                Directory.CreateDirectory(_releasePath + gameName + "\\img\\");
                Directory.CreateDirectory(_releasePath + gameName + "\\js\\");
                Directory.CreateDirectory(_releasePath + gameName + "\\js\\lib\\");

                // 拷贝主css/img
                IOUtil.CopyDiectory(_basePath + "\\css\\", _releasePath + gameName + "\\css\\");
                IOUtil.CopyFile(_basePath + "\\img\\" + "download.gif", _releasePath + gameName + "\\img\\" + "download.gif");
                IOUtil.CopyFile(_basePath + "\\img\\" + "home.gif", _releasePath + gameName + "\\img\\" + "home.gif");

                // 拷贝主js
                IOUtil.CopyDiectory(_basePath + "\\js\\lib\\", _releasePath + gameName + "\\js\\lib\\");

                // 拷贝游戏的css/img下的文件到目标目录
                IOUtil.CopyDiectory(_basePath + gameName + "\\css\\", _releasePath + gameName + "\\css\\");
                IOUtil.CopyDiectory(_basePath + gameName + "\\img\\", _releasePath + gameName + "\\img\\");

                //_log.Info("拷贝css/img到游戏目录：" + gameName);
            }
            catch (Exception ex)
            {
                _log.Error("创建游戏目录失败：" + gameName, ex);
            }
        }
        #endregion

        #region ConvertGameHtml
        /// <summary>
        /// 转换游戏HTML
        /// </summary>
        /// <param name="gameName"></param>
        public static void ConvertGameHtml(string gameName, string templateStr)
        {
            HtmlDocument doc = new HtmlDocument();
            doc.OptionFixNestedTags = true;
            doc.OptionOutputAsXml = true;

            doc.LoadHtml(IOUtil.ReadFile(_basePath + gameName + "\\" + gameName + ".htm"));

            //// 当前游戏标题
            //string gameTitle = GetStaticValue(GetPascalTitle(gameName));
            //// 当前游戏描述
            //string gameDescription = GetStaticValue(GetPascalDescription(gameName));

            string gameTitle = doc.DocumentNode.SelectSingleNode("//div[@id='gameTitle']").InnerHtml;
            string gameVersion = doc.DocumentNode.SelectSingleNode("//div[@id='gameVersion']").InnerHtml;
            string gameDescription = doc.DocumentNode.SelectSingleNode("//div[@id='gameDescription']").InnerHtml;
            string leftcaozuoStr = doc.DocumentNode.SelectSingleNode("//div[@id='leftcaozuo']").InnerHtml;
            string leftshezhiStr = doc.DocumentNode.SelectSingleNode("//div[@id='leftshezhi']").InnerHtml;
            string leftzhuangtaiStr = doc.DocumentNode.SelectSingleNode("//div[@id='leftzhuangtai']").InnerHtml;
            string mainStr = doc.DocumentNode.SelectSingleNode("//div[@id='main']").InnerHtml;
            // 页脚
            string gameFooter = String.Format("&copy;{0}&nbsp;&nbsp;版本：v{1}&nbsp;&nbsp;{2}",
                gameTitle, gameVersion, _yanzheng);

            templateStr = templateStr.Replace("##GameTitle##", gameTitle);
            templateStr = templateStr.Replace("##GameDescription##", gameDescription);
            templateStr = templateStr.Replace("##GameName##", gameName);
            templateStr = templateStr.Replace("##leftcaozuo##", leftcaozuoStr);
            templateStr = templateStr.Replace("##leftshezhi##", leftshezhiStr);
            templateStr = templateStr.Replace("##leftzhuangtai##", leftzhuangtaiStr);
            templateStr = templateStr.Replace("##main##", mainStr);
            templateStr = templateStr.Replace("##Footer##", gameFooter);

            //<a href="">单机版下载</a><br />
            //    <a href="http://code.google.com/p/minigame/">小石头网页游戏</a>
            string downloadStr = String.Format("<a href=\"./{0}.zip\"><img alt=\"download\" class=\"reset-margin\" src=\"./img/download.gif\" />单机版下载</a><br />" +
                "<a href=\"../default.htm\"><img alt=\"home\" class=\"reset-margin\" src=\"./img/home.gif\" />小石头网页游戏</a>", gameName);
            templateStr = templateStr.Replace("##download##", downloadStr);

            IOUtil.WriteFile(_releasePath + gameName + "\\" + gameName + ".htm", templateStr);

            _log.Info("完成转换游戏HTML：" + gameName);
        }
        #endregion

        #region ConvertGameJS
        /// <summary>
        /// 转换游戏JS
        /// </summary>
        /// <param name="gameName"></param>
        public static void ConvertGameJS(string gameName)
        {
            // JS主文件
            //_log.Info("转换游戏主JS：" + gameName);
            string jsContent = IOUtil.ReadFile(_basePath + gameName + "\\js\\" + gameName + ".js");
            if (_isCompress)
            {
                jsContent = _jsr.Replace(_jsc.Compress(jsContent));
            }

            // 判断是否有包含JS
            string includejs = String.Empty;
            string includejsPath = _basePath + gameName + "\\include_js\\";
            if (Directory.Exists(includejsPath))
            {
                //_log.Info("加载游戏IncludeJS：" + gameName);
                StringBuilder includejsSb = new StringBuilder();
                string[] files = Directory.GetFiles(includejsPath);
                foreach (string filePath in files)
                {
                    includejsSb.Append(IOUtil.ReadFile(filePath));
                }
                includejs = includejsSb.ToString();
                if (_isCompress)
                {
                    includejs = _jsr.Replace(_jsc.Compress(includejs));
                }
            }

            // 写入最终JS文件
            IOUtil.WriteFile(_releasePath + gameName + "\\js\\" + gameName + ".js", _gameJsStr + includejs + jsContent);
            //_log.Info("完成游戏JS转换：" + gameName);
        }

        #endregion

        #region CreateGameZIP
        /// <summary>
        /// 创建游戏目录的压缩文件
        /// </summary>
        /// <param name="gameName"></param>
        public static void CreateGameZIP(string gameName)
        {
            ZipUtil.FastCreateZipFile(_releasePath + gameName + ".zip", _releasePath + gameName);

            IOUtil.CopyFile(_releasePath + gameName + ".zip", _releasePath + gameName + "\\" + gameName + ".zip");

            File.Delete(_releasePath + gameName + ".zip");
        } 
        #endregion

        #region util
        //public static string GetStaticValue(string name)
        //{
        //    if (name == "Footer")
        //    {
        //        if (_footer == String.Empty)
        //        {
        //            string sFooter = ConvertResource.ResourceManager.GetString("Footer").ToString();
        //            string sTitle = ConvertResource.ResourceManager.GetString("Title").ToString();

        //            _footer = String.Format(sFooter, sTitle, GetVersion(), "zlei7~mail.ustc.edu.cn");
        //        }
        //        return _footer;
        //    }

        //    return ConvertResource.ResourceManager.GetString(name).ToString();
        //}

        //private static string GetVersion()
        //{
        //    return DateTime.Now.ToString("yyyyMMdd") + "." + _version;
        //}


        //public static string GetPascalTitle(string gameName)
        //{
        //    return gameName[0].ToString().ToUpper() + gameName.Substring(1).ToLower() + "Title";
        //}
        //public static string GetPascalDescription(string gameName)
        //{
        //    return gameName[0].ToString().ToUpper() + gameName.Substring(1).ToLower() + "Description";
        //}
        #endregion

    }
}
