using System;
using System.Net;
using System.Web;

namespace iStone.Util
{
    /// <summary>
    /// UrlUtil 的摘要说明
    /// </summary>
    public class UrlUtil
    {
        #region field & constructor

        private static readonly Log _log = new Log(typeof(UrlUtil));

        #endregion

        /// <summary>
        /// 获取应用程序根路径，确保以"/"结束
        /// </summary>
        /// <returns></returns>
        public static string GetApplicationPath()
        {
            return TextUtil.EnsureTrailingSlash(HttpContext.Current.Request.ApplicationPath);
        }

        /// <summary>
        /// 获取主机的Url
        /// </summary>
        /// <returns></returns>
        private static string GetHostUrl()
        {
            string securePort = HttpContext.Current.Request.ServerVariables["SERVER_PORT_SECURE"];
            string protocol = securePort == null || securePort == "0" ? "http" : "https";
            string serverPort = HttpContext.Current.Request.ServerVariables["SERVER_PORT"];
            string port = serverPort == "80" ? string.Empty : ":" + serverPort;
            string serverName = HttpContext.Current.Request.ServerVariables["SERVER_NAME"];
            return string.Format("{0}://{1}{2}", protocol, serverName, port);
        }

        /// <summary>
        /// 获得网站的Url地址，不以"/"结束
        /// </summary>
        /// <returns></returns>
        public static string GetSiteUrl()
        {
            string path = HttpContext.Current.Request.ApplicationPath;
            if (path.EndsWith("/") && path.Length == 1)
            {
                return GetHostUrl();
            }
            else
            {
                return GetHostUrl() + path.ToLower();
            }
        }

        /// <summary>
        /// 取得绝对Url
        /// </summary>
        /// <param name="baseUrl"></param>
        /// <param name="relativeUrl"></param>
        public static string GetAbosoluteUrl(string baseUrl, string relativeUrl)
        {
            if (relativeUrl.ToLower().StartsWith("http"))
            {
                return relativeUrl;
            }
            else
            {
                return new Uri(new Uri(baseUrl), relativeUrl).ToString();
            }
        }

        public static string Resolve(string shortUrl)
        {
            //测试的url地址是http://www.test.com/testweb/default.aspx, 结果如下：
            //Request.ApplicationPath: /testweb
            //Request.CurrentExecutionFilePath: /testweb/default.aspx
            //Request.FilePath: /testweb/default.aspx
            //Request.Path: /testweb/default.aspx
            //Request.PathInfo:
            //Request.PhysicalApplicationPath: E:\WWW\testweb\
            //Request.PhysicalPath: E:\WWW\testweb\default.aspx
            //Request.RawUrl: /testweb/default.aspx
            //Request.Url.AbsolutePath: /testweb/default.aspx
            //Request.Url.AbsoluteUri: http://www.test.com/testweb/default.aspx
            //Request.Url.Host: www.test.com
            //Request.Url.LocalPath: /testweb/default.aspx 

            //if (shortUrl.StartsWith("http://"))
            //{
            //    return shortUrl;
            //}

            ////获取服务器上 ASP.NET 应用程序的虚拟应用程序根路径
            //string appPath;
            //if (request.ApplicationPath == "/")
            //{
            //    appPath = request.ApplicationPath;
            //}
            //else
            //{
            //    appPath = request.ApplicationPath + "/";
            //}

            //string domainUrl =
            //    request.Url.AbsoluteUri.Substring(0, request.Url.AbsoluteUri.IndexOf(request.Url.AbsolutePath));

            //string fullUrl = domainUrl + appPath;

            //return GetSiteUrl() + shortUrl;

            Uri uri = new Uri(new Uri(GetSiteUrl()), shortUrl);

            return uri.AbsolutePath;
        }

        /// <summary>
        /// 输入http://www.codeproject.com/test/test.htm
        /// </summary>
        /// <param name="url"></param>
        /// <returns>http://www.codeproject.com/</returns>
        public static string GetBaseUrl(string url)
        {
            if (String.IsNullOrEmpty(url))
            {
                return String.Empty;
            }

            Uri uri = new Uri(url);

            return uri.Host;
        }

        public static string GetDeepBaseUrl(string url)
        {
            if (String.IsNullOrEmpty(url))
            {
                return String.Empty;
            }

            Uri uri = new Uri(url);
            url = uri.Host;

            string backupUrl = url;

            string domainStr = "com.net.org.cn.gov.tv.cc.info.biz.mobi.name";
            string[] domains = domainStr.Split('.');

            bool needReLoop = false;

            do
            {
                needReLoop = false;

                foreach (string domain in domains)
                {
                    string domainName = "." + domain;
                    if (url.EndsWith(domainName))
                    {
                        url = url.Substring(0, url.LastIndexOf(domainName));
                        needReLoop = true;
                    }
                }
            }
            while (needReLoop);

            string mainName = url;
            if (url.LastIndexOf(".") >= 0)
            {
                mainName = url.Substring(url.LastIndexOf(".") + 1);
            }

            return "http://www." + backupUrl.Substring(backupUrl.LastIndexOf(mainName));
        }

    }
}