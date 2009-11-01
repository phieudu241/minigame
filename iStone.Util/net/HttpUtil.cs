using System;
using System.IO;
using System.Net;
using System.Text;
using System.Configuration;

namespace iStone.Util
{
    /// <summary>
    /// ������ҳ
    /// </summary>
    public class HttpUtil
    {
        #region field & constructor

        private static readonly Log _log = new Log(typeof(HttpUtil));

        /// <summary>
        /// ȱʡ���룬���ʶ������ҳ�ı��룬��ʹ��ȱʡ����
        /// </summary>
        private static string _defaultEncodingString = "UTF-8";

        /// <summary>
        /// ȱʡ�����ӳ�ʱ
        /// </summary>
        private static int _defaultTimeOutSeconds = 30;

        /// <summary>
        /// ����������
        /// </summary>
        static HttpUtil()
        {
            ServicePointManager.DefaultConnectionLimit = 1000;
        }
        #endregion

        #region GetEncodingString
        /// <summary>
        /// ȡ����ҳ��Encoding���л���48Сʱ
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
        /// ȡ����ҳ��Encoding
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
                    _log.Warn("����ʶ����վ##" + url + "##�ı��룡");

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
                _log.Error("��ȡ��վ##" + url + "##�ı������", ex);
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
        ///// ͨ��Post�ύҳ��
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
        /// ����ҳ����ı�����
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static string GetUrlContent(string url)
        {
            return GetUrlContent(url, GetEncodingString(url), _defaultTimeOutSeconds);
        }

        /// <summary>
        /// ����ҳ����ı�����
        /// </summary>
        /// <param name="url"></param>
        /// <param name="timeOutSeconds"></param>
        /// <returns></returns>
        public static string GetUrlContent(string url, int timeOutSeconds)
        {
            return GetUrlContent(url, GetEncodingString(url), timeOutSeconds);
        }

        /// <summary>
        /// ����ҳ����ı�����
        /// </summary>
        /// <param name="url"></param>
        /// <param name="encodingName"></param>
        /// <returns></returns>
        public static string GetUrlContent(string url, string encodingName)
        {
            return GetUrlContent(url, encodingName, _defaultTimeOutSeconds);
        }

        /// <summary>
        /// ����ҳ����ı�����
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

                // ���� HttpWebRequest
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
                _log.Error("����ҳ��##" + url + "##����ʧ�ܣ�", ex);
            }

            return fileContent;
        }

      
        #endregion
    }
}
