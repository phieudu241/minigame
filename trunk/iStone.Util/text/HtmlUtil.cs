using System;
using System.IO;
using System.Text;

using HtmlAgilityPack;

namespace iStone.Util
{
    /// <summary>
    /// HTML解析帮助
    /// </summary>
    public class HtmlUtil
    {
        #region field & constructor

        private static readonly Log _log = new Log(typeof(HtmlUtil));

        #endregion

        #region ChangeLinkTargetToBlank
        /// <summary>
        /// 将Html内容中的所有链接都改为在新窗口打开
        /// </summary>
        public static string ChangeLinkTargetToBlank(string htmlContent, string baseUrl)
        {
            if(String.IsNullOrEmpty(htmlContent))
            {
                return String.Empty;
            }

            try
            {
                HtmlDocument doc = new HtmlDocument();
                doc.OptionFixNestedTags = true;
                doc.LoadHtml(htmlContent);

                ModifyLinkTargetToBlank(doc, baseUrl);
                ModifyImagePath(doc, baseUrl);

                StringBuilder sb = new StringBuilder();
                using (TextWriter tw = new StringWriter(sb))
                {
                    doc.Save(tw);
                }

                return sb.ToString();
            }
            catch (Exception ex)
            {
                _log.Error("更改##"+ baseUrl +"##中的链接失败！", ex);

                return String.Empty;
            }
        }

        /// <summary>
        /// 所有链接改成在新窗口打开，并且更改链接地址为绝对Url
        /// </summary>
        /// <param name="html"></param>
        /// <param name="baseUrl"></param>
        private static void ModifyLinkTargetToBlank(HtmlDocument html, string baseUrl)
        {
            HtmlNodeCollection links = html.DocumentNode.SelectNodes("//a[@href]");
            if (links != null && links.Count > 0)
            {
                foreach (HtmlNode node in links)
                {
                    HtmlAttribute targetAttr = node.Attributes["target"];
                    if (targetAttr == null)
                    {
                        node.Attributes.Append("target", "_blank");
                    }
                    else
                    {
                        targetAttr.Value = "_blank";
                    }

                    HtmlAttribute hrefAttr = node.Attributes["href"];
                    hrefAttr.Value = UrlUtil.GetAbosoluteUrl(baseUrl, hrefAttr.Value);

                }
            }
        }

        /// <summary>
        /// 在有的blog里边，生成的rss内容中图片链接为相对路径，那么为了在我们的RssReader正常显示，
        /// 就需要将相对路径转换为绝对路径
        /// </summary>
        private static void ModifyImagePath(HtmlDocument html, string baseUrl)
        {
            HtmlNodeCollection images = html.DocumentNode.SelectNodes("//img[@src]");
            if (images != null && images.Count > 0)
            {
                foreach (HtmlNode node in images)
                {
                    try
                    {
                        HtmlAttribute srcAttr = node.Attributes["src"];

                        srcAttr.Value = UrlUtil.GetAbosoluteUrl(baseUrl, srcAttr.Value);
                    }
                    catch (Exception ex)
                    {
                        _log.Error("处理##" + baseUrl + "##中的图片时出错！", ex);
                    }
                }
            }
        }
        #endregion

        #region ConvertHtmlToText
        /// <summary>
        /// 将HTML转换成Text
        /// 在TextUtil中，有使用正规表达式匹配掉所有html标签的方法（StripHtml）
        /// </summary>
        /// <param name="html"></param>
        /// <returns></returns>
        public static string ConvertHtmlToText(string html)
        {
            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(html);

            StringWriter sw = new StringWriter();
            ConvertTo(doc.DocumentNode, sw);
            sw.Flush();
            return sw.ToString();
        }

        private static void ConvertTo(HtmlNode node, TextWriter outText)
        {
            string html;
            switch (node.NodeType)
            {
                case HtmlNodeType.Comment:
                    // don't output comments
                    break;

                case HtmlNodeType.Document:
                    ConvertContentTo(node, outText);
                    break;

                case HtmlNodeType.Text:
                    // script and style must not be output
                    string parentName = node.ParentNode.Name;
                    if ((parentName == "script") || (parentName == "style"))
                        break;

                    // get text
                    html = ((HtmlTextNode)node).Text;

                    // is it in fact a special closing node output as text?
                    if (HtmlNode.IsOverlappedClosingElement(html))
                        break;

                    // check the text is meaningful and not a bunch of whitespaces
                    if (html.Trim().Length > 0)
                    {
                        outText.Write(HtmlEntity.DeEntitize(html));
                    }
                    break;

                case HtmlNodeType.Element:
                    switch (node.Name)
                    {
                        case "p":
                            // treat paragraphs as crlf
                            outText.Write("\r\n");
                            break;
                    }

                    if (node.HasChildNodes)
                    {
                        ConvertContentTo(node, outText);
                    }
                    break;
            }
        }

        private static void ConvertContentTo(HtmlNode node, TextWriter outText)
        {
            foreach (HtmlNode subnode in node.ChildNodes)
            {
                ConvertTo(subnode, outText);
            }
        }
        #endregion
    }
}
