using System;
using System.Collections.Generic;
using System.Text;

using System.Web;

namespace iStone.Util
{
    /// <summary>
    /// 不能被替换的Javascript的名称
    /// 如果应用程序根目录下存在config/jsreplacer.config，则同时加载到JSSystemNames中
    /// </summary>
    public class JSSystemNames
    {
        #region field & constructor
        private static readonly Log _log = new Log(typeof(JSSystemNames));

        private static List<string> _names = new List<string>();

        /// <summary>
        /// 初始化JSSystemNames
        /// </summary>
        static JSSystemNames()
        {
            try
            {
                // 嵌入的资源，使用资源文件
                AddNames(UtilResource.SystemNames);

                string configFilePath = IOUtil.GetFilePhysicalPath("./config/jsreplacer.config");

                if (IOUtil.IsFileExists(configFilePath))
                {
                    AddNames(IOUtil.ReadFile(configFilePath));
                }
                else
                {
                    _log.Error("可能需要在应用程序根目录下定义jsreplacer.config文件！");
                }

            }
            catch (Exception ex)
            {
                _log.Error("找不到资源文件SystemNames.txt！", ex);
            }
        }

        /// <summary>
        /// 转换字符串，格式如SystemNames.txt
        /// </summary>
        /// <param name="nameStr"></param>
        private static void AddNames(string nameStr)
        {
            string[] tempArray = nameStr.Trim("\r\n".ToCharArray()).Replace("\r\n", "\n").Split('\n');

            foreach (string temp in tempArray)
            {
                string name = temp.Substring(temp.IndexOf(',') + 1).Trim();
                _names.Add(name);
            }
        }
        #endregion

        #region method
        /// <summary>
        /// SystemNames中是否包含name
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static bool Contains(string name)
        {
            if (_names.Contains(name))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        #endregion
    }
}
