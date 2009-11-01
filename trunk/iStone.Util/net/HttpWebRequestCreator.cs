using System;
using System.Collections.Generic;
using System.Text;
using System.Net;
using System.IO;
using System.Configuration;

namespace iStone.Util
{
    /// <summary>
    /// 创建 HttpWebRequest对象（Get/Post）
    /// 可以设置代理服务器，从config中寻找匹配项
    /// <add key="proxyUrl" value="http://192.168.75.28:8080/"/>
    /// <add key="proxyUserName" value="leizhang5"/>
    /// <add key="proxyUserPassword" value="######"/>
    /// </summary>
    public class HttpWebRequestCreator
    {
        #region field & constructor

        private static readonly Log _log = new Log(typeof(HttpWebRequestCreator));

        //private string _url;
        //private string _postText;
        //private Encoding _encoding;
        //private string _proxyUrl;
        //private string _proxyUserName;
        //private string _proxyUserPassword;

        ///// <summary>
        ///// Web地址
        ///// </summary>
        //public string Url
        //{
        //    get
        //    {
        //        return _url;
        //    }
        //}
        ///// <summary>
        ///// Post请求字符串（userid=1001&password=12345）
        ///// </summary>
        //public string PostText
        //{
        //    get
        //    {
        //        return _postText;
        //    }
        //    set
        //    {
        //        _postText = value;
        //    }
        //}
        ///// <summary>
        ///// Post请求时，对PostText编码时使用的编码方式
        ///// </summary>
        //public Encoding PostEncoding
        //{
        //    get
        //    {
        //        return _encoding;
        //    }
        //    set
        //    {
        //        _encoding = value;
        //    }
        //}
        ///// <summary>
        ///// 代理服务器地址（http://192.168.75.28:8080/）
        ///// </summary>
        //public string ProxyUrl
        //{
        //    get
        //    {
        //        return _proxyUrl;
        //    }
        //    set
        //    {
        //        _proxyUrl = value;
        //    }
        //}

        ///// <summary>
        ///// 代理服务器用户名
        ///// </summary>
        //public string ProxyUserName
        //{
        //    get
        //    {
        //        return _proxyUserName;
        //    }
        //    set
        //    {
        //        _proxyUserName = value;
        //    }
        //}

        ///// <summary>
        ///// 代理服务器用户密码
        ///// </summary>
        //public string ProxyUserPassword
        //{
        //    get
        //    {
        //        return _proxyUserPassword;
        //    }
        //    set
        //    {
        //        _proxyUserPassword = value;
        //    }
        //}
        #endregion

        #region constructor
        ///// <summary>
        ///// Get
        ///// </summary>
        ///// <param name="url"></param>
        //public HttpWebRequestCreator(string url)
        //{
        //    this._url = url;
        //}
        
        ///// <summary>
        ///// Post
        ///// </summary>
        ///// <param name="url"></param>
        ///// <param name="postText"></param>
        ///// <param name="encoding"></param>
        //public HttpWebRequestCreator(string url, string postText, Encoding encoding)
        //{
        //    this._url = url;
        //    this._postText = postText;
        //    this._encoding = encoding;
        //}
        #endregion

        #region method
        /// <summary>
        /// 创建 HttpWebRequest
        /// </summary>
        public static HttpWebRequest Create(string url)
        {
            return Create(url, null, null);
        }

        /// <summary>
        /// 创建 HttpWebRequest
        /// </summary>
        /// <param name="url"></param>
        /// <param name="postText">userid=1001&password=12345</param>
        /// <param name="encoding"></param>
        /// <returns></returns>
        public static HttpWebRequest Create(string url, string postText, Encoding encoding)
        {
            HttpWebRequest request = null;

            try
            {
                request = HttpWebRequest.Create(url) as HttpWebRequest;
                request.Headers.Add("Accept-Language", "zh-cn,en-us;q=0.5");
                request.UserAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";
                request.Timeout = 1000 * 30; // 30秒

                // 需要设置代理
                string proxyUrl = ConfigurationManager.AppSettings["proxyUrl"];
                if (!String.IsNullOrEmpty(proxyUrl))
                {
                    WebProxy proxy = new WebProxy();
                    proxy.Address = new Uri(proxyUrl);

                    string proxyUserName = ConfigurationManager.AppSettings["proxyUserName"];
                    string proxyUserPassword = ConfigurationManager.AppSettings["proxyUserPassword"];
                    if (!String.IsNullOrEmpty(proxyUserName) && !String.IsNullOrEmpty(proxyUserPassword))
                    {
                        proxy.Credentials = new NetworkCredential(proxyUserName, proxyUserPassword);
                    }
                    //request.Credentials = CredentialCache.DefaultCredentials;
                    request.Proxy = proxy;
                }

                if (!String.IsNullOrEmpty(postText))
                {
                    byte[] data = encoding.GetBytes(postText);

                    request.Method = "POST";
                    request.ContentType = "application/x-www-form-urlencoded";
                    request.ContentLength = data.Length;

                    Stream requestStream = request.GetRequestStream();

                    requestStream.Write(data, 0, data.Length);
                    requestStream.Close();
                }
                else
                {
                    request.Method = "GET";
                }
            }
            catch (Exception ex)
            {
                _log.Error("创建HttpWebRequest出错！", ex);
            }

            return request;
        }
        #endregion
    }
}
