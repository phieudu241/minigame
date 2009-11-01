using System;
using System.Text;
using System.Collections.Generic;

using System.Web;
using System.IO;

namespace iStone.Util
{
    /// <summary>
    /// 写入文件或从文件读取
    /// </summary>
    public class IOUtil
    {
        #region field & constructor

        private static readonly Log _log = new Log(typeof(IOUtil));

        #endregion

        #region WriteFile
        /// <summary>
        /// 写文件
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <param name="fileContent"></param>
        public static void AppendFile(string relativeOrPhysicalFilePath, string fileContent)
        {
            WriteFileInternal(relativeOrPhysicalFilePath, fileContent, true, Encoding.UTF8);
        }
        /// <summary>
        /// 写文件
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <param name="fileContent"></param>
        public static void AppendFile(string relativeOrPhysicalFilePath, string fileContent, Encoding encoding)
        {
            WriteFileInternal(relativeOrPhysicalFilePath, fileContent, true, encoding);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <param name="fileContent"></param>
        /// <param name="encoding"></param>
        public static void WriteFile(string relativeOrPhysicalFilePath, string fileContent)
        {
            WriteFileInternal(relativeOrPhysicalFilePath, fileContent, false, Encoding.UTF8);
        }

        /// <summary>
        /// 写文件
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <param name="fileContent"></param>
        public static void WriteFile(string relativeOrPhysicalFilePath, string fileContent, Encoding encoding)
        {
            WriteFileInternal(relativeOrPhysicalFilePath, fileContent, false, encoding);
        }

        /// <summary>
        /// 写文件
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <param name="fileContent"></param>
        /// <param name="append"></param>
        /// <param name="encode"></param>
        private static void WriteFileInternal(string relativeOrPhysicalFilePath, string fileContent, bool append, Encoding encoding)
        {
            try
            {
                string physicalFilePath = GetFilePhysicalPath(relativeOrPhysicalFilePath);

                using (StreamWriter sw = new StreamWriter(physicalFilePath, append, encoding))
                {
                    sw.Write(fileContent);
                }
            }
            catch (Exception ex)
            {
                _log.Error("向文件##" + relativeOrPhysicalFilePath + "##写入内容失败！", ex);
            }
        }
        #endregion

        #region ReadFile

        //private static Dictionary<string, object> lockObjHT = new Dictionary<string, object>();

        /// <summary>
        /// 读文件
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <returns></returns>
        public static string ReadFile(string relativeOrPhysicalFilePath)
        {
            return ReadFileInternal(relativeOrPhysicalFilePath, Encoding.UTF8);
        }

        /// <summary>
        /// 读文件
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <param name="encoding"></param>
        /// <returns></returns>
        public static string ReadFile(string relativeOrPhysicalFilePath, Encoding encoding)
        {
            return ReadFileInternal(relativeOrPhysicalFilePath, encoding);
        }

        /// <summary>
        /// 读文件，有缓存，多线程安全
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <returns></returns>
        public static string ReadCacheFile(string relativeOrPhysicalFilePath)
        {
            return ReadCacheFile(relativeOrPhysicalFilePath, Encoding.UTF8);
        }

        /// <summary>
        /// 读文件，有缓存，多线程安全
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <param name="encoding"></param>
        /// <returns></returns>
        public static string ReadCacheFile(string relativeOrPhysicalFilePath, Encoding encoding)
        {
            string fileContent = String.Empty;

            string cacheKey = "ReadFile:" + relativeOrPhysicalFilePath;
            // 缓存中不存在，则缓存起来
            if (CacheUtil.GetCache(cacheKey) == null)
            {
                // 先锁定
                lock (Locker.GetLocker(cacheKey))
                {
                    // 再次判断是否存在缓存中
                    if (CacheUtil.GetCache(cacheKey) == null)
                    {
                        fileContent = ReadFileInternal(relativeOrPhysicalFilePath, encoding);

                        CacheUtil.AddCache(cacheKey, fileContent, relativeOrPhysicalFilePath);
                    }
                }
            }

            // 从缓存中取
            fileContent = CacheUtil.GetCache(cacheKey).ToString();


            return fileContent;
        }

        /// <summary>
        /// 读文件
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <param name="encoding"></param>
        /// <returns></returns>
        private static string ReadFileInternal(string relativeOrPhysicalFilePath, Encoding encoding)
        {
            try
            {
                string physicalFilePath = GetFilePhysicalPath(relativeOrPhysicalFilePath);

                using (System.IO.StreamReader sr = new StreamReader(physicalFilePath, encoding))
                {
                    return sr.ReadToEnd();
                }
            }
            catch (Exception ex)
            {
                _log.Error("从文件##" + relativeOrPhysicalFilePath + "##读取内容失败！", ex);
                return null;
            }
        }
        #endregion

        #region util
        /// <summary>
        /// 判断文件是否存在
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public static bool IsFileExists(string filePath)
        {
            return File.Exists(filePath);
        }

        /// <summary>
        /// 取得文件的物理路径
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath">相对路径或绝对路径</param>
        /// <returns></returns>
        public static string GetFilePhysicalPath(string relativeOrPhysicalFilePath)
        {
            string physicalFilePath = relativeOrPhysicalFilePath;

            // 如果不是绝对路径，则转换为相对路径
            if (!Path.IsPathRooted(physicalFilePath))
            {
                if (HttpContext.Current != null)
                {
                    // Web应用程序
                    physicalFilePath = HttpContext.Current.Server.MapPath(relativeOrPhysicalFilePath);
                }
                else
                {
                    // 桌面应用程序
                    // 得到这样的字符串： D:\JSGame\_convert\Convert\Convert\bin\Debug\config\log4net.config
                    physicalFilePath = Path.GetFullPath(relativeOrPhysicalFilePath);
                    // 得到这样的字符串： D:\JSGame\_convert\Convert\Convert\bin\Debug\./config/log4net.config
                    //physicalFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, relativeOrPhysicalFilePath);
                }
            }
            return physicalFilePath;
        }

        /// <summary>
        /// 将一个目录下的所有文件或文件夹拷贝到另一个目录下面
        /// </summary>
        /// <param name="relativeOrPhysicalSourceDiectory">源目录</param>
        /// <param name="relativeOrPhysicalAimDiectory">目标</param>
        public static void CopyDiectory(string relativeOrPhysicalSourceDiectory, string relativeOrPhysicalAimDiectory)
        {
            string sourceDiectory = GetFilePhysicalPath(relativeOrPhysicalSourceDiectory);
            string aimDiectory = GetFilePhysicalPath(relativeOrPhysicalAimDiectory);

            string[] diectories = Directory.GetDirectories(sourceDiectory);
            foreach (string diectory in diectories)
            {
                string diectoryName = diectory.Substring(sourceDiectory.Length);

                // 要先创建子目录
                Directory.CreateDirectory(aimDiectory + diectoryName);
                CopyDiectory(diectory, aimDiectory + diectoryName);
            }

            string[] files = Directory.GetFiles(sourceDiectory);
            foreach (string file in files)
            {
                string fileName = file.Substring(sourceDiectory.Length);

                File.Copy(file, aimDiectory + fileName);
            }
        }

        public static void CopyFile(string relativeOrPhysicalSourceFile, string relativeOrPhysicalAimFile)
        {
            File.Copy(relativeOrPhysicalSourceFile, relativeOrPhysicalAimFile, true);
        }
        #endregion
    }
}
