using System;
using System.Collections.Generic;
using System.Text;

using System.Collections;

namespace iStone.Util
{
    /// <summary>
    /// �����ַ������������Ķ������ڶ��̴߳�����
    /// </summary>
    public class Locker
    {

        private static Dictionary<string, object> _lockDic = new Dictionary<string, object>();
        //static Hashtable lockObjects = Hashtable.Synchronized(new Hashtable());

        private static object _locker = new object();


        /// <summary>
        /// �����ַ������������Ķ������ڶ��̴߳�����
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static object GetLocker(string key)
        {
            // ��������ڣ��򴴽��µ�Locker
            if (!_lockDic.ContainsKey(key))
            {
                lock (_locker)
                {
                    if (!_lockDic.ContainsKey(key))
                    {
                        object locker = new object();
                        _lockDic[key] = locker;
                    }
                }
            }

            return _lockDic[key];
        }
    }
}
