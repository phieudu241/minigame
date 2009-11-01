using System;
using System.Data;
using System.Configuration;

using ICSharpCode.SharpZipLib.Core;
using ICSharpCode.SharpZipLib.Zip;
using System.Collections;
using System.Collections.Generic;
using System.IO;

namespace Convert
{
    public class ZipUtil
    {
        #region FastCreateZipFile
        /// <summary>
        /// 从一个目录创建ZIP文件（不递归文件夹）
        /// </summary>
        /// <param name="zipFile"></param>
        /// <param name="sourceDirectory"></param>
        /// <returns></returns>
        public static bool FastCreateZipFile(string zipFile, string sourceDirectory)
        {
            try
            {
                FastZip zip = new FastZip();
                zip.CreateEmptyDirectories = false;
                zip.CreateZip(zipFile, sourceDirectory, true, null);

                return true;
            }
            catch
            {
                return false;
            }

        } 
        #endregion

        #region CreateZipFile
        /// <summary>
        /// 创建Zip文件
        /// </summary>
        /// <param name="zipFile"></param>
        /// <param name="sourceFiles"></param>
        /// <returns></returns>
        public static bool CreateZipFile(string zipFile, params string[] sourceFiles)
        {
            List<string> files = new List<string>(sourceFiles);
            return CreateZipFile(zipFile, files);
        }
        /// <summary>
        /// 创建Zip文件
        /// </summary>
        /// <param name="zipFile"></param>
        /// <param name="sourceFiles"></param>
        public static bool CreateZipFile(string zipFile,List<string> sourceFiles)
        {
            try
            {
                using (ZipFile zf = ZipFile.Create(zipFile))
                {
                    zf.BeginUpdate();

                    foreach (string spec in sourceFiles)
                    {
                        string path = Path.GetDirectoryName(Path.GetFullPath(spec));
                        zf.NameTransform = new ZipNameTransform(path);
                        zf.Add(spec);
                    }

                    zf.CommitUpdate();
                }

                return true;
            }
            catch
            {
                return false;
            }
        }
        
        #endregion

    }
}
