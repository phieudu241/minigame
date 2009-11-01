using System;
using System.Text;
using System.Text.RegularExpressions;

namespace iStone.Util
{
    /// <summary>
    /// 字符串相关操作
    /// </summary>
    public class TextUtil
    {
        #region field & constructor

        private static readonly Log _log = new Log(typeof(TextUtil));

        #endregion
        /// <summary>
        /// 截断字符串到一定的长度，确保不会把单词截断
        /// </summary>
        /// <param name="fullText"></param>
        /// <param name="numberOfCharacters"></param>
        /// <returns></returns>
        public static string TruncateText(string fullText, int numberOfCharacters)
        {
            //string text;
            //if (fullText.Length > numberOfCharacters)
            //{
            //    int spacePos = fullText.IndexOf(" ", numberOfCharacters);
            //    if (spacePos > -1)
            //    {
            //        text = fullText.Substring(0, spacePos) + "...";
            //    }
            //    else
            //    {
            //        text = fullText;
            //    }
            //}
            //else
            //{
            //    text = fullText;
            //}

            //return text;

            if (String.IsNullOrEmpty(fullText))
            {
                return String.Empty;
            }

            fullText = fullText.Trim();

            if (fullText.Length <= numberOfCharacters - 3)
            {
                return fullText;
            }
            else
            {
                return fullText.Substring(0, numberOfCharacters - 3) + "...";
            }
        }

        /// <summary>
        /// 去除字符串中的HTML标记
        /// </summary>
        /// <param name="fullText"></param>
        /// <returns></returns>
        public static string StripHtml(string fullHtml)
        {
            if (String.IsNullOrEmpty(fullHtml))
            {
                return String.Empty;
            }


            Regex regexStripHTML = new Regex("<[^>]+>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
            string text = regexStripHTML.Replace(fullHtml, "");
            text = text.Replace("&nbsp;", "").Trim();
            return text;

        }

        /// <summary>
        /// 确保字符串以"/"结尾
        /// </summary>
        /// <param name="stringThatNeedsTrailingSlash"></param>
        /// <returns></returns>
        public static string EnsureTrailingSlash(string stringThatNeedsTrailingSlash)
        {
            if (!stringThatNeedsTrailingSlash.EndsWith("/"))
            {
                return stringThatNeedsTrailingSlash + "/";
            }
            else
            {
                return stringThatNeedsTrailingSlash;
            }
        }

        /// <summary>
        /// 返回时间的字符串表示
        /// </summary>
        /// <param name="time"></param>
        /// <returns></returns>
        public static string GetDateTimeString(DateTime time)
        {
            return String.Format("{0:D4}{1:D2}{2:D2}{3:D2}{4:D2}{5:D2}",
                time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
        }

        /// <summary>
        /// 去除字符串中的非数字
        /// </summary>
        /// <param name="numberStr"></param>
        /// <returns></returns>
        public static string GetPureNumber(string numberStr)
        {
            string NUMBERS = "0123456789";

            StringBuilder sb = new StringBuilder();

            foreach (Char c in numberStr)
            {
                if (NUMBERS.Contains(c.ToString()))
                {
                    sb.Append(c);
                }
            }

            return sb.ToString();
        }
    }
}
