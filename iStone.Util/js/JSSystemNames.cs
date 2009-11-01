using System;
using System.Collections.Generic;
using System.Text;

using System.Web;

namespace iStone.Util
{
    /// <summary>
    /// ���ܱ��滻��Javascript������
    /// ���Ӧ�ó����Ŀ¼�´���config/jsreplacer.config����ͬʱ���ص�JSSystemNames��
    /// </summary>
    public class JSSystemNames
    {
        #region field & constructor
        private static readonly Log _log = new Log(typeof(JSSystemNames));

        private static List<string> _names = new List<string>();

        /// <summary>
        /// ��ʼ��JSSystemNames
        /// </summary>
        static JSSystemNames()
        {
            try
            {
                // Ƕ�����Դ��ʹ����Դ�ļ�
                AddNames(UtilResource.SystemNames);

                string configFilePath = IOUtil.GetFilePhysicalPath("./config/jsreplacer.config");

                if (IOUtil.IsFileExists(configFilePath))
                {
                    AddNames(IOUtil.ReadFile(configFilePath));
                }
                else
                {
                    _log.Error("������Ҫ��Ӧ�ó����Ŀ¼�¶���jsreplacer.config�ļ���");
                }

            }
            catch (Exception ex)
            {
                _log.Error("�Ҳ�����Դ�ļ�SystemNames.txt��", ex);
            }
        }

        /// <summary>
        /// ת���ַ�������ʽ��SystemNames.txt
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
        /// SystemNames���Ƿ����name
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
