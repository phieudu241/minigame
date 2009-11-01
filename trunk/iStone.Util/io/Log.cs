using System;
using System.Collections.Generic;
using System.Text;
using System.Web;

using log4net;

namespace iStone.Util
{
    /// <summary>
    /// ��װlog4net�ĳ��ù���
    /// ������Ӧ�ó����Ŀ¼����config/log4net.config�����ļ�
    /// </summary>
    public class Log
    {
        #region field & constructor
        private ILog _log = null;

        static Log()
        {
            try
            {
                string configFilePath = IOUtil.GetFilePhysicalPath("./config/log4net.config");

                log4net.Config.DOMConfigurator.ConfigureAndWatch(new System.IO.FileInfo(configFilePath));

                
            }
            catch (Exception ex)
            {
                throw new Exception("Ӧ�ó����Ŀ¼�����������ļ���log4net.config", ex);
            }
        }

        public Log(Type type)
        {
            _log = LogManager.GetLogger(type);
        }
        #endregion

        #region method
        public void Debug(object message)
        {
            _log.Debug(message);
        }

        public void Debug(object message, Exception t)
        {
            _log.Debug(message, t);
        }

        public void Error(object message)
        {
            _log.Error(message);
        }

        public void Error(object message, Exception t)
        {
            _log.Error(message, t);
        }

        public void Fatal(object message)
        {
            _log.Fatal(message);
        }

        public void Fatal(object message, Exception t)
        {
            _log.Fatal(message, t);
        }

        public void Info(object message)
        {
            _log.Info(message);
        }

        public void Info(object message, Exception t)
        {
            _log.Info(message, t);
        }

        public void Warn(object message)
        {
            _log.Warn(message);
        }

        public void Warn(object message, Exception t)
        {
            _log.Warn(message, t);
        }
        #endregion
    }
}
