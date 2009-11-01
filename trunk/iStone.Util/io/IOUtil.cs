using System;
using System.Text;
using System.Collections.Generic;

using System.Web;
using System.IO;

namespace iStone.Util
{
    /// <summary>
    /// д���ļ�����ļ���ȡ
    /// </summary>
    public class IOUtil
    {
        #region field & constructor

        private static readonly Log _log = new Log(typeof(IOUtil));

        #endregion

        #region WriteFile
        /// <summary>
        /// д�ļ�
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <param name="fileContent"></param>
        public static void AppendFile(string relativeOrPhysicalFilePath, string fileContent)
        {
            WriteFileInternal(relativeOrPhysicalFilePath, fileContent, true, Encoding.UTF8);
        }
        /// <summary>
        /// д�ļ�
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
        /// д�ļ�
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <param name="fileContent"></param>
        public static void WriteFile(string relativeOrPhysicalFilePath, string fileContent, Encoding encoding)
        {
            WriteFileInternal(relativeOrPhysicalFilePath, fileContent, false, encoding);
        }

        /// <summary>
        /// д�ļ�
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
                _log.Error("���ļ�##" + relativeOrPhysicalFilePath + "##д������ʧ�ܣ�", ex);
            }
        }
        #endregion

        #region ReadFile

        //private static Dictionary<string, object> lockObjHT = new Dictionary<string, object>();

        /// <summary>
        /// ���ļ�
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <returns></returns>
        public static string ReadFile(string relativeOrPhysicalFilePath)
        {
            return ReadFileInternal(relativeOrPhysicalFilePath, Encoding.UTF8);
        }

        /// <summary>
        /// ���ļ�
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <param name="encoding"></param>
        /// <returns></returns>
        public static string ReadFile(string relativeOrPhysicalFilePath, Encoding encoding)
        {
            return ReadFileInternal(relativeOrPhysicalFilePath, encoding);
        }

        /// <summary>
        /// ���ļ����л��棬���̰߳�ȫ
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <returns></returns>
        public static string ReadCacheFile(string relativeOrPhysicalFilePath)
        {
            return ReadCacheFile(relativeOrPhysicalFilePath, Encoding.UTF8);
        }

        /// <summary>
        /// ���ļ����л��棬���̰߳�ȫ
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath"></param>
        /// <param name="encoding"></param>
        /// <returns></returns>
        public static string ReadCacheFile(string relativeOrPhysicalFilePath, Encoding encoding)
        {
            string fileContent = String.Empty;

            string cacheKey = "ReadFile:" + relativeOrPhysicalFilePath;
            // �����в����ڣ��򻺴�����
            if (CacheUtil.GetCache(cacheKey) == null)
            {
                // ������
                lock (Locker.GetLocker(cacheKey))
                {
                    // �ٴ��ж��Ƿ���ڻ�����
                    if (CacheUtil.GetCache(cacheKey) == null)
                    {
                        fileContent = ReadFileInternal(relativeOrPhysicalFilePath, encoding);

                        CacheUtil.AddCache(cacheKey, fileContent, relativeOrPhysicalFilePath);
                    }
                }
            }

            // �ӻ�����ȡ
            fileContent = CacheUtil.GetCache(cacheKey).ToString();


            return fileContent;
        }

        /// <summary>
        /// ���ļ�
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
                _log.Error("���ļ�##" + relativeOrPhysicalFilePath + "##��ȡ����ʧ�ܣ�", ex);
                return null;
            }
        }
        #endregion

        #region util
        /// <summary>
        /// �ж��ļ��Ƿ����
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public static bool IsFileExists(string filePath)
        {
            return File.Exists(filePath);
        }

        /// <summary>
        /// ȡ���ļ�������·��
        /// </summary>
        /// <param name="relativeOrPhysicalFilePath">���·�������·��</param>
        /// <returns></returns>
        public static string GetFilePhysicalPath(string relativeOrPhysicalFilePath)
        {
            string physicalFilePath = relativeOrPhysicalFilePath;

            // ������Ǿ���·������ת��Ϊ���·��
            if (!Path.IsPathRooted(physicalFilePath))
            {
                if (HttpContext.Current != null)
                {
                    // WebӦ�ó���
                    physicalFilePath = HttpContext.Current.Server.MapPath(relativeOrPhysicalFilePath);
                }
                else
                {
                    // ����Ӧ�ó���
                    // �õ��������ַ����� D:\JSGame\_convert\Convert\Convert\bin\Debug\config\log4net.config
                    physicalFilePath = Path.GetFullPath(relativeOrPhysicalFilePath);
                    // �õ��������ַ����� D:\JSGame\_convert\Convert\Convert\bin\Debug\./config/log4net.config
                    //physicalFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, relativeOrPhysicalFilePath);
                }
            }
            return physicalFilePath;
        }

        /// <summary>
        /// ��һ��Ŀ¼�µ������ļ����ļ��п�������һ��Ŀ¼����
        /// </summary>
        /// <param name="relativeOrPhysicalSourceDiectory">ԴĿ¼</param>
        /// <param name="relativeOrPhysicalAimDiectory">Ŀ��</param>
        public static void CopyDiectory(string relativeOrPhysicalSourceDiectory, string relativeOrPhysicalAimDiectory)
        {
            string sourceDiectory = GetFilePhysicalPath(relativeOrPhysicalSourceDiectory);
            string aimDiectory = GetFilePhysicalPath(relativeOrPhysicalAimDiectory);

            string[] diectories = Directory.GetDirectories(sourceDiectory);
            foreach (string diectory in diectories)
            {
                string diectoryName = diectory.Substring(sourceDiectory.Length);

                // Ҫ�ȴ�����Ŀ¼
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
