using System;
using System.Collections.Generic;
using System.Text;
using System.IO;

using iStone.Util;

namespace Convert
{
    class Program
    {
        static void Main(string[] args)
        {
            Converter.Start(false);

            System.Threading.Thread.Sleep(500);
        }

        #region old code
        //private static void ASCII()
        //{
        //    StringBuilder sb = new StringBuilder();

        //    for (int i = 0; i < 256; i++)
        //    {
        //        sb.AppendFormat("{0}", (char)i);
        //    }

        //    //Console.Write(sb.ToString());
        //    IOHelper.WriteFile("ascii.txt", sb.ToString());
        //} 
        #endregion

    }
}
