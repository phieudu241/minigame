using System;
using System.IO;
using System.Net;
using System.Text;
using System.Configuration;

namespace iStone.Util
{
    /// <summary>
    /// 下载网页
    /// </summary>
    public class HttpUtil
    {
        #region field & constructor

        private static readonly Log _log = new Log(typeof(HttpUtil));

        /// <summary>
        /// 缺省编码，如果识别不了网页的编码，则使用缺省编码
        /// </summary>
        private static string _defaultEncodingString = "UTF-8";

        /// <summary>
        /// 缺省的连接超时
        /// </summary>
        private static int _defaultTimeOutSeconds = 30;

        /// <summary>
        /// 限制链接数
        /// </summary>
        static HttpUtil()
        {
            ServicePointManager.DefaultConnectionLimit = 1000;
        }
        #endregion

        #region GetEncodingString
        /// <summary>
        /// 取得网页的Encoding，有缓存48小时
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static string GetEncodingString(string url)
        {
            string encodingStr = String.Empty;

            string cacheKey = "GetEncodingString:" + url;
            if (CacheUtil.GetCache(cacheKey) == null)
            {
                encodingStr = GetEncodingStringInternal(url);

                CacheUtil.AddCache(cacheKey, encodingStr, 48 * 60);
            }
            else
            {
                encodingStr = CacheUtil.GetCache(cacheKey).ToString();
            }

            return encodingStr;
        }

        /// <summary>
        /// 取得网页的Encoding
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        private static string GetEncodingStringInternal(string url)
        {
            string encodingStr = String.Empty;

            try
            {
                encodingStr = IdentifyEncoding.Instance.GetEncodingString(new Uri(url));
                if (encodingStr == "OTHER")
                {
                    _log.Warn("不能识别网站##" + url + "##的编码！");

                    encodingStr = _defaultEncodingString;
                }
                else if (encodingStr == "GBK")
                {
                    encodingStr = "GB18030";
                }
                else if (encodingStr == "ASCII")
                {
                    encodingStr = _defaultEncodingString;
                }
            }
            catch (Exception ex)
            {
                _log.Error("获取网站##" + url + "##的编码错误！", ex);
                encodingStr = _defaultEncodingString;
            }

            return encodingStr;
        }

        #endregion

        #region GetUrlContent
        //public static string PostWebUrl(string url, string postData)
        //{
        //    return PostWebUrl(url, postData, null);
        //}
        ///// <summary>
        ///// 通过Post提交页面
        ///// </summary>
        ///// <param name="url"></param>
        ///// <param name="postData">userid=1001&password=12345</param>
        ///// <returns></returns>
        //public static string PostWebUrl(string url, string postData, string encodingName)
        //{
        //    StringBuilder sb = new StringBuilder();

        //    try
        //    {
        //        Encoding encoding = null;
        //        if (String.IsNullOrEmpty(encodingName))
        //        {
        //            encoding = Encoding.GetEncoding(GetEncodingString(url));
        //        }
        //        else
        //        {
        //            encoding = Encoding.GetEncoding(encodingName);
        //        }

        //        // post
        //        HttpWebRequest request = GetHttpWebRequest(url, postData, encoding);

        //        HttpWebResponse response = request.GetResponse() as HttpWebResponse;

        //        using (StreamReader sr = new StreamReader(response.GetResponseStream(), encoding))
        //        {
        //            sb.Append(sr.ReadToEnd());
        //        }

        //        response.Close();
        //    }
        //    catch (Exception ex)
        //    {
        //        Log.Write("[post] Error in download url:" + url + "\r\n ", ex);
        //    }

        //    return sb.ToString();
        //}

        /// <summary>
        /// 下载页面的文本内容
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static string GetUrlContent(string url)
        {
            return GetUrlContent(url, GetEncodingString(url), _defaultTimeOutSeconds);
        }

        /// <summary>
        /// 下载页面的文本内容
        /// </summary>
        /// <param name="url"></param>
        /// <param name="timeOutSeconds"></param>
        /// <returns></returns>
        public static string GetUrlContent(string url, int timeOutSeconds)
        {
            return GetUrlContent(url, GetEncodingString(url), timeOutSeconds);
        }

        /// <summary>
        /// 下载页面的文本内容
        /// </summary>
        /// <param name="url"></param>
        /// <param name="encodingName"></param>
        /// <returns></returns>
        public static string GetUrlContent(string url, string encodingName)
        {
            return GetUrlContent(url, encodingName, _defaultTimeOutSeconds);
        }

        /// <summary>
        /// 下载页面的文本内容
        /// </summary>
        /// <param name="url"></param>
        /// <param name="encodingName"></param>
        /// <returns></returns>
        public static string GetUrlContent(string url, string encodingName, int timeOutSeconds)
        {
            string fileContent = String.Empty;
            try
            {
                Encoding encoding = null;
                if (String.IsNullOrEmpty(encodingName))
                {
                    encoding = Encoding.GetEncoding(GetEncodingString(url));
                }
                else
                {
                    encoding = Encoding.GetEncoding(encodingName);
                }

                // 创建 HttpWebRequest
                HttpWebRequest request = HttpWebRequestCreator.Create(url);
                request.Timeout = timeOutSeconds * 1000;

                using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
                {
                    using (StreamReader sr = new StreamReader(response.GetResponseStream(), encoding))
                    {
                        fileContent = sr.ReadToEnd();
                    }
                }
            }
            catch (Exception ex)
            {
                _log.Error("下载页面##" + url + "##内容失败！", ex);
            }

            return fileContent;
        }

      
        #endregion
    }
}
