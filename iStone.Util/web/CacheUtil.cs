using System;
using System.Collections.Generic;
using System.Text;

using System.Web;
using System.Web.Caching;

namespace iStone.Util
{
    public class CacheUtil
    {
        #region field & constructor

        private static readonly Log _log = new Log(typeof(CacheUtil));

        /// <summary>
        /// ����ʵ��
        /// </summary>
        private static Cache _cacheInstance = null;
        private static object _lockobj = new object();

        #endregion

        #region ��������
        /// <summary>
        /// ����ģʽ������Cacheʵ��
        /// </summary>
        public static Cache Instance
        {
            get
            {
                if (_cacheInstance == null)
                {
                    lock (_lockobj)
                    {
                        if (_cacheInstance == null)
                        {
                            try
                            {
                                if (HttpContext.Current == null)
                                {
                                    HttpRuntime httpr = new HttpRuntime();
                                }

                                _cacheInstance = HttpRuntime.Cache;
                            }
                            catch (Exception ex)
                            {
                                _log.Error("��������ʵ��ʧ�ܣ�", ex);
                            }
                        }
                    }
                }

                return _cacheInstance;
            }
        }

        /// <summary>
        /// ��ӵ�������
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="elapsedSeconds">������ô��ʱ�䣬����ʧЧ</param>
        public static void AddCache(string key, object value, double elapsedMinutes)
        {
            Instance.Insert(key, value, null, DateTime.Now.AddMinutes(elapsedMinutes), Cache.NoSlidingExpiration);
        }

        /// <summary>
        /// ��ӵ�������
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="filePath"></param>
        public static void AddCache(string key, object value, string relativeFilePath)
        {
            string physicalFilePath = IOUtil.GetFilePhysicalPath(relativeFilePath);

            Instance.Insert(key, value, new CacheDependency(physicalFilePath));
        }

        /// <summary>
        /// ��ӵ�������
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="filePath"></param>
        public static void AddCache(string key, object value, double elapsedMinutes, string relativeFilePath)
        {
            string physicalFilePath = IOUtil.GetFilePhysicalPath(relativeFilePath);

            Instance.Insert(key, value, new CacheDependency(physicalFilePath), DateTime.Now.AddMinutes(elapsedMinutes), Cache.NoSlidingExpiration);
        }

        /// <summary>
        /// ��ӵ�������
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="filePath"></param>
        public static void AddCache(string key, object value)
        {
            Instance.Insert(key, value);
        }

        /// <summary>
        /// ��ӵ�������
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="dependency"></param>
        /// <param name="absoluteExpiration"></param>
        /// <param name="slidingExpiration"></param>
        /// <param name="priority"></param>
        /// <param name="onRemoveCallback"></param>
        public static void AddCache(string key,
            object value,
            CacheDependency dependency,
            DateTime absoluteExpiration,
            TimeSpan slidingExpiration,
            CacheItemPriority priority,
            CacheItemRemovedCallback onRemoveCallback)
        {
            Instance.Insert(key, value, dependency, absoluteExpiration, slidingExpiration, priority, onRemoveCallback);
        }

        /// <summary>
        /// ȡ�û���
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static object GetCache(string key)
        {
            return Instance[key];
        }
        #endregion
    }
}
