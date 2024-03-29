using System;
using System.Collections.Generic;
using System.Text;

namespace iStone.Util
{
    /// <summary>
    /// 对JSCompressor过的字符串进行变量名替换
    /// 系统命名和用户自定义的命名（jsreplacer.config）不替换
    /// </summary>
    public class JSReplacer
    {
        #region field & constructor

        private Dictionary<string, string> replaceValues = new Dictionary<string, string>();
        /// <summary>
        /// 分隔符
        /// </summary>
        private static List<char> separateNames = new List<char>();
        /// <summary>
        /// 替换字符
        /// </summary>
        private static string Letters = UtilResource.JSReplacers;
        /// <summary>
        /// 数字
        /// </summary>
        private static string Numbers = UtilResource.JSNumbers;

        static JSReplacer()
        {
            string separateLiterals = UtilResource.JSSeparators;
            foreach (char c in separateLiterals)
            {
                separateNames.Add(c);
            }
        }
        #endregion

        #region public method
        /// <summary>
        /// 对JSCompressor过的字符串进行变量名替换
        /// </summary>
        /// <param name="strScript"></param>
        /// <returns></returns>
        public string Replace(string strScript)
        {
            StringBuilder sb = new StringBuilder();
            StringBuilder sb1 = new StringBuilder();

            // 当前是否在字符串中
            bool isInStr = false;
            // 字符串开头字符 ' 或 "
            char strStartChar = '"';
            // 上一个字符是否转义字符
            bool isZhuanYi = false;

            //// 识别的上一个单词
            //string lastWord = String.Empty;

            // 是否在数字中
            bool isInNumber = false;

            for (int i = 0; i < strScript.Length; i++)
            {
                char c = strScript[i];

                if (isInStr)
                {
                    // 如果上一个字符是转义字符，则不管此字母是什么了
                    if (isZhuanYi)
                    {
                        isZhuanYi = false;
                    }
                    if (c == '\\')
                    {
                        isZhuanYi = true;
                    }
                    if (c == strStartChar)
                    {
                        isInStr = false;
                    }

                    sb.Append(c);
                    continue;
                }

                if (isInNumber)
                {
                    if (IsNumber(c) || c == '.')
                    {
                        sb.Append(c);
                        continue;
                    }
                    else
                    {
                        isInNumber = false;
                    }
                }

                if (c == '"' || c == '\'')
                {
                    ProcessLastWord(ref sb, ref sb1);

                    isInStr = true;
                    strStartChar = c;
                    sb.Append(c);
                    continue;
                }

                if (IsNumber(c))
                {
                    ProcessLastWord(ref sb, ref sb1);

                    sb.Append(c);
                    continue;
                }

                if (separateNames.Contains(c))
                {
                    ProcessLastWord(ref sb, ref sb1);

                    sb.Append(c);
                    continue;
                }

                sb1.Append(c);

            }

            return sb.ToString();
        }
        #endregion

        #region private method
        /// <summary>
        /// 把sb1转换成其他名称，并添加到sb的末尾，同时清空sb1
        /// </summary>
        /// <param name="sb">需要扩展的字符串</param>
        /// <param name="sb1">上一个识别出来的字符串</param>
        private void ProcessLastWord(ref StringBuilder sb, ref StringBuilder sb1)
        {
            string lastWord = sb1.ToString();
            if (lastWord != "")
            {
                // 如果上一个识别出来的是系统变量，不替代
                if (JSSystemNames.Contains(lastWord))
                {
                    sb.Append(lastWord);
                }
                else
                {
                    sb.Append(GetReplaceValue(lastWord));
                }

                sb1 = new StringBuilder();
            }
        }

        /// <summary>
        /// c0是否数字
        /// </summary>
        /// <param name="c0"></param>
        /// <returns></returns>
        private bool IsNumber(char c0)
        {
            foreach (char c in Numbers)
            {
                if (c == c0)
                {
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// 取得originalValue替换成的值（混淆的名称）
        /// </summary>
        /// <param name="originalValue"></param>
        /// <returns></returns>
        private string GetReplaceValue(string originalValue)
        {
            // 如果存在混淆的名称，直接返回，否则需要创建一个新的
            if (replaceValues.ContainsKey(originalValue))
            {
                return replaceValues[originalValue];
            }
            else
            {
                string rValue = String.Empty;
                do
                {
                    rValue = GetARandomValue();
                }
                while (replaceValues.ContainsValue(rValue));

                replaceValues[originalValue] = rValue;

                return rValue;
            }
        }

        /// <summary>
        /// 随机一个变量名（混淆的名称）
        /// </summary>
        /// <returns></returns>
        private string GetARandomValue()
        {
            int length = Letters.Length;
            Random r = new Random();

            int count = r.Next(0, 3);
            switch(count)
            {
                case 0:
                    return String.Format("{0}",
                        Letters[r.Next(0, length)]);
                case 1:
                    return String.Format("{0}{1}",
                        Letters[r.Next(0, length)],
                        Letters[r.Next(0, length)]);
                case 2:
                    return String.Format("{0}{1}{2}",
                        Letters[r.Next(0, length)],
                        Letters[r.Next(0, length)],
                        Letters[r.Next(0, length)]);
            }
            return "ERROR";
            
            //return Letters[lIndex].ToString() + r.Next(0, 100).ToString();
        }
        #endregion
    }
}
