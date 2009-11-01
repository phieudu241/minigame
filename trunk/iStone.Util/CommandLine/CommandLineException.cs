namespace iStone.Util.CommandLine
{
    using System;
    using System.IO;
    using System.Runtime.Serialization;

    /// <summary>
    /// the invalid switch exception
    /// thrown by CommandLineParser's Parse method
    /// 
    /// @author aksonov
    /// @author CagedRat
    /// @copyright (c) TopCoder Software Inc. 2003, All rights reserved
    /// </summary>
    public class InvalidSwitchException : ArgumentException
    {
        /// <summary>
        /// Initializes a new instance of the InvalidSwitchException class
        /// </summary>
        public InvalidSwitchException():base(){}

        /// <summary>
        /// Initializes a new instance of the InvalidSwitchException class with
        /// a specified error message.
        /// </summary>
        /// <param name="message">
        /// The error message that explains the reason for the exception.
        /// </param>
        public InvalidSwitchException(string message):base(message){}

        /// <summary>
        /// Initializes a new instance of the InvalidSwitchException class with 
        /// serialized data.
        /// </summary>
        /// <param name="info">
        /// The object that holds the serialized object data.
        /// </param>
        /// <param name="context">
        /// The contextual information about the source or destination.
        /// </param>
        protected InvalidSwitchException
            (SerializationInfo info, StreamingContext context)
            :base(info, context){}

        /// <summary>
        /// Initializes a new instance of the InvalidSwitchException class with 
        /// a specified error message and a reference to the inner exception 
        /// that is the cause of this exception.
        /// </summary>
        /// <param name="message">
        /// The error message that explains the reason for the exception.
        /// </param>
        /// <param name="innerException">
        /// The exception that is the cause of the current exception. If the 
        /// innerException parameter is not a null reference, the current 
        /// exception is raised in a catch block that handles the inner 
        /// exception.
        /// </param>
        public InvalidSwitchException(string message, Exception innerException)
            :base(message, innerException){}

        /// <summary>
        /// Initializes a new instance of the InvalidSwitchException class with
        /// a specified error message and the name of the parameter that causes 
        /// this exception.
        /// </summary>
        /// <param name="message">
        /// The error message that explains the reason for the exception.
        /// </param>
        /// <param name="paramName">
        /// The name of the parameter that caused the current exception. 
        /// </param>
        public InvalidSwitchException(string message, string paramName)
            :base(message, paramName){}

        /// <summary>
        /// Initializes a new instance of the InvalidSwitchException class with 
        /// a specified error message, the parameter name, and a reference to 
        /// the inner exception that is the cause of this exception.
        /// </summary>
        /// <param name="message">
        /// The error message that explains the reason for the exception.
        /// </param>
        /// <param name="paramName">
        /// The name of the parameter that caused the current exception. 
        /// </param>
        /// <param name="innerException">
        /// The exception that is the cause of the current exception. If the 
        /// innerException parameter is not a null reference, the current 
        /// exception is raised in a catch block that handles the inner 
        /// exception.
        /// </param>
        public InvalidSwitchException
            (string message, string paramName, Exception innerException)
            :base(message, paramName, innerException){}
    }

    /// <summary>
    /// the duplicate switch exception
    /// thrown by CommandLineParser's Parse method
    /// 
    /// @author aksonov
    /// @copyright (c) TopCoder Software Inc. 2003, All rights reserved
    /// </summary>
    public class DuplicateSwitchException : ArgumentException
    {
        /// <summary>
        /// Initializes a new instance of the DuplicateSwitchException class
        /// </summary>
        public DuplicateSwitchException():base(){}

        /// <summary>
        /// Initializes a new instance of the DuplicateSwitchException class 
        /// with a specified error message.
        /// </summary>
        /// <param name="message">
        /// The error message that explains the reason for the exception.
        /// </param>
        public DuplicateSwitchException(string message):base(message){}

        /// <summary>
        /// Initializes a new instance of the DuplicateSwitchException class 
        /// with serialized data.
        /// </summary>
        /// <param name="info">
        /// The object that holds the serialized object data.
        /// </param>
        /// <param name="context">
        /// The contextual information about the source or destination.
        /// </param>
        protected DuplicateSwitchException
            (SerializationInfo info, StreamingContext context)
            :base(info, context){}

        /// <summary>
        /// Initializes a new instance of the DuplicateSwitchException class 
        /// with a specified error message and a reference to the inner 
        /// exception that is the cause of this exception.
        /// </summary>
        /// <param name="message">
        /// The error message that explains the reason for the exception.
        /// </param>
        /// <param name="innerException">
        /// The exception that is the cause of the current exception. If the 
        /// innerException parameter is not a null reference, the current 
        /// exception is raised in a catch block that handles the inner 
        /// exception.
        /// </param>
        public DuplicateSwitchException
            (string message, Exception innerException)
            :base(message, innerException){}

        /// <summary>
        /// Initializes a new instance of the DuplicateSwitchException class 
        /// with a specified error message and the name of the parameter that 
        /// causes this exception.
        /// </summary>
        /// <param name="message">
        /// The error message that explains the reason for the exception.
        /// </param>
        /// <param name="paramName">
        /// The name of the parameter that caused the current exception. 
        /// </param>
        public DuplicateSwitchException(string message, string paramName)
            :base(message, paramName){}

        /// <summary>
        /// Initializes a new instance of the DuplicateSwitchException class 
        /// with a specified error message, the parameter name, and a reference 
        /// to the inner exception that is the cause of this exception.
        /// </summary>
        /// <param name="message">
        /// The error message that explains the reason for the exception.
        /// </param>
        /// <param name="paramName">
        /// The name of the parameter that caused the current exception. 
        /// </param>
        /// <param name="innerException">
        /// The exception that is the cause of the current exception. If the 
        /// innerException parameter is not a null reference, the current 
        /// exception is raised in a catch block that handles the inner 
        /// exception.
        /// </param>
        public DuplicateSwitchException
            (string message, string paramName, Exception innerException)
            :base(message, paramName, innerException){}
    }
}
