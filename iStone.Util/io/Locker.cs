using System;
using System.Collections.Generic;
using System.Text;

using System.Collections;

namespace iStone.Util
{
    /// <summary>
    /// 根据字符串返回锁定的对象，用在多线程处理中
    /// </summary>
    public class Locker
    {

        private static Dictionary<string, object> _lockDic = new Dictionary<string, object>();
        //static Hashtable lockObjects = Hashtable.Synchronized(new Hashtable());

        private static object _locker = new object();


        /// <summary>
        /// 根据字符串返回锁定的对象，用在多线程处理中
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static object GetLocker(string key)
        {
            // 如果不存在，则创建新的Locker
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
