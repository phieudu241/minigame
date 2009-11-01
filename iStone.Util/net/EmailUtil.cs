using System;
using System.Net.Mail;
using System.Text;
using System.Net;

namespace iStone.Util
{
	/// <summary>
	/// 发送邮件类
	/// </summary>
	public class EmailUtil
	{
        #region field & constructor

        private static readonly Log _log = new Log(typeof(EmailUtil));

       
        
		private string _host;
		private int _port;
		private string _smtpUsername;
		private string _smtpPassword;
		private Encoding _encoding;
		
		/// <summary>
		/// SMTP port (default 25).
		/// </summary>
		public int Port
		{
			set { this._port = value; }
		}

		/// <summary>
		/// SMTP Username
		/// </summary>
		public string SmtpUsername
		{
			set { this._smtpUsername = value; }
		}

		/// <summary>
		/// SMTP Password
		/// </summary>
		public string SmtpPassword
		{
			set { this._smtpPassword = value; }
		}

		/// <summary>
		/// Email body encoding
		/// </summary>
		public string EmailEncoding
		{
			set 
			{
				if (!String.IsNullOrEmpty(value))
				{
					this._encoding = Encoding.GetEncoding(value);
				}
			}
		}
		
		/// <summary>
		/// Constructor.
		/// </summary>
		/// <param name="host">SMTP hostname is required for this service to work.</param>
        public EmailUtil(string host)
		{
			this._host = host;
			this._port = 25;
			this._encoding = Encoding.Default;
        }
        #endregion

        /// <summary>
		/// 发送邮件
		/// </summary>
		/// <param name="from"></param>
		/// <param name="to"></param>
		/// <param name="subject"></param>
		/// <param name="body"></param>
		public void Send(string from, string to, string subject, string body)
		{
			Send(from, to, subject, body, null, null);
		}

        /// <summary>
        /// 发送邮件
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        /// <param name="cc"></param>
        /// <param name="bcc"></param>
		public void Send(string from, string to, string subject, string body, string[] cc, string[] bcc)
		{
            try
            {
                // Create mail message
                MailMessage message = new MailMessage(from, to, subject, body);
                message.BodyEncoding = this._encoding;

                if (cc != null && cc.Length > 0)
                {
                    foreach (string ccAddress in cc)
                    {
                        message.CC.Add(new MailAddress(ccAddress));
                    }
                }
                if (bcc != null && bcc.Length > 0)
                {
                    foreach (string bccAddress in bcc)
                    {
                        message.Bcc.Add(new MailAddress(bccAddress));
                    }
                }

                // Send email
                SmtpClient client = new SmtpClient(this._host, this._port);
                if (!String.IsNullOrEmpty(this._smtpUsername) && !String.IsNullOrEmpty(this._smtpPassword))
                {
                    client.Credentials = new NetworkCredential(this._smtpUsername, this._smtpPassword);
                }
                client.Send(message);
            }
            catch (Exception ex)
            {
                _log.Error("发送邮件给##" + to + "##主题##"+ subject +"##失败！", ex);
            }
		}

	}
}
