using System;
using System.Collections.Generic;
using System.Text;

using System.Runtime.InteropServices;

namespace iStone.Util
{

    /// <summary>
    /// Dos��ذ���
    /// </summary>
    public class DosUtil
    {
        [DllImport("kernel32.dll", CharSet = CharSet.Auto)]
        private static extern int GetShortPathName(
            [MarshalAs(UnmanagedType.LPTStr)]   
            string path,
            [MarshalAs(UnmanagedType.LPTStr)]   
            StringBuilder shortPath,
            int shortPathLength);


        /// <summary>
        /// ȡ��Dos�µĶ�·��
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public static string GetShortPathName(string path)
        {
            StringBuilder shortPath = new StringBuilder(80);
            int result = GetShortPathName(path, shortPath, shortPath.Capacity);
            return shortPath.ToString(); 
        }
    }
}
