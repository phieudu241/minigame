namespace iStone.Util.CommandLine
{
    using System;

    /// <summary>
    /// A delegate uses to validate a switch argument.
    /// 
    /// @author aksonov
    /// @author CagedRat
    /// @copyright (c) TopCoder Software Inc. 2003, All rights reserved
    /// </summary>
    public delegate void SwitchValidator(CommandLineSwitch switchObj);

    /// <summary>
    /// A delegate uses to parse a switch argument.
    /// </summary>
    public delegate object[] SwitchParser(string arg);

    /// <summary>
    /// An enumeration for representing variable length 
    /// argument lists
    /// </summary>
    public enum FactorParams 
    {
        /// <summary>
        /// For switches the require zero or more parameters
        /// </summary>
        ZERO_OR_MORE = -1,
        
        /// <summary>
        /// For switches the require one or more parameters
        /// </summary>
        ONE_OR_MORE = -2,
        
        /// <summary>
        /// For switches the require two or more parameters
        /// </summary>
        TWO_OR_MORE = -3
    }

    /// <summary>
    /// Represents a command line switch
    /// </summary>
    public class CommandLineSwitch 
    {

        /// <summary>
        /// Ignore the case the switches or not.
        /// </summary>
        private bool ignoreCase = false; 

        /// <summary>
        /// How many arguments switch can have, zero or more by default
        /// </summary>
        private int factor = (int)FactorParams.ZERO_OR_MORE;

        /// <summary>
        /// Represents the switch key
        /// </summary>
        private string name = null;

        /// <summary>
        /// Represents the prompt for the switch
        /// </summary>
        private string prompt = ""; 

        /// <summary>
        /// Represents the description of the switch
        /// </summary>
        private string description = ""; 

        /// <summary>
        /// Represents the arguments of the switch
        /// </summary>
        private object[]  result = null; 

        /// <summary>
        /// Represents the validator use to validate the switch
        /// </summary>
        private SwitchValidator validator =  new SwitchValidator(DefaultValidator);

        /// <summary>
        /// Represents the parser use to parse the switch
        /// </summary>
        private SwitchParser parser = new SwitchParser(DefaultParser);

        /// <summary>
        /// get the switch key
        /// </summary>
        public string Switch
        {
            get
            {
                return name;
            }
        }

        /// <summary>
        /// How many arguments switch can have
        /// </summary>
        public int Factor 
        {
            get 
            {
                return factor;
            }
            set 
            {
                factor = (int)value;
            }
        }

        /// <summary>
        /// set or get the prompt of a switch
        /// </summary>
        public string Prompt 
        {
            get
            {
                return prompt;
            }
            set 
            {
                // No validation required
                prompt = value;
            }
        }

        /// <summary>
        /// get the description of a switch
        /// </summary>
        public string Description
        {
            get
            {
                return description;
            }
        }

        /// <summary>
        /// get or set the ignoreCase field
        /// </summary>
        public bool IgnoreCase
        {
            get
            {
                return ignoreCase;
            }
            set
            {
                // No validation required
                ignoreCase = value;
            }
        }

        /// <summary>
        /// get the result of a switch argument
        /// </summary>
        public object[] Result
        {
            get
            {
                return result;
            }
        }

        /// <summary>
        /// create a switch, with switch key
        /// </summary>
        /// <param name="name">the switch key</param>
        /// <exception cref="ArgumentNullException">
        /// if <c>name</c> is null
        /// </exception>
        public  CommandLineSwitch(string name) 
        {
            // Validate arguments
            if(name == null)
            {
                throw new ArgumentNullException("name");
            }

            // Set values
            this.name = name;
        }

        /// <summary>
        /// create a switch, with switch key and description
        /// </summary>
        /// <param name="name">the switch key</param>
        /// <param name="description">the description of a switch</param>
        /// <exception cref="ArgumentNullException">
        /// if <c>name</c> or <c>description</c> is null.
        /// </exception>
        public  CommandLineSwitch(string name, string description) 
        {            
            // Validate arguments
            if(name == null)
            {
                throw new ArgumentNullException("name");
            }
            if(description == null)
            {
                throw new ArgumentNullException("description");
            }

            // Set values
            this.name = name;
            this.description = description;
        }

        /// <summary>
        /// create a switch, with switch key, prompt ,description and validator
        /// </summary>
        /// <param name="name">the switch key</param>
        /// <param name="prompt">the switch prompty</param>
        /// <param name="description">the switch description</param>
        /// <exception cref="ArgumentNullException">
        /// if <c>name</c> or <c>prompt</c> or <c>description</c> is null.
        /// </exception>
        public  CommandLineSwitch(string name, string prompt, string description)
        {
            // Validate arguments
            if(name == null)
            {
                throw new ArgumentNullException("name");
            }
            if(description == null)
            {
                throw new ArgumentNullException("description");
            }
            if(prompt == null)
            {
                throw new ArgumentNullException("Prompt");
            }

            // Set values
            this.name = name;
            this.description = description;
            this.prompt = prompt;
        }

        /// <summary>
        /// Sets the validator used when validating arguments
        /// </summary>
        /// <param name="validator">
        /// The validator to use.  If null use the default validator
        /// </param>
        public void SetValidator(SwitchValidator validator)
        {
            // Set values
            if (validator == null)
            {
                this.validator = new SwitchValidator(DefaultValidator);
            }
            else
            {
                this.validator = validator;
            }
        }

        /// <summary>
        /// Sets the parser to use when parsing switches
        /// </summary>
        /// <param name="parser">
        /// The parser to use.  If null, use default parser
        /// </param>
        public void SetParser(SwitchParser parser)
        {       
            // Set values
            if (parser == null)
            {
                this.parser = new SwitchParser(DefaultParser);
            }
            else
            {
                this.parser = parser;
            }
        }

        /// <summary>
        /// Validate the switch argument.
        /// </summary>
        /// <param name="arg">The argument to validate</param>
        /// <exception cref="InvalidSwitchException">
        /// if arg is invalid.
        /// </exception>
        public void Validate(string arg)
        {            
            this.result = this.Parse(arg);

            // Validate length
            if( (this.Factor == (int)FactorParams.ONE_OR_MORE && 
                this.Result == null) ||
                (this.Factor == (int)FactorParams.TWO_OR_MORE && 
                (this.Result  == null || this.Result.Length < 2)) ||
                (this.Factor == 0 && this.Result != null) ||
                (this.Factor >  0 && 
                (this.Result == null || this.Factor != this.Result.Length)))
            {
                throw new InvalidSwitchException(
                    "Switch arguments don't match","this.Factor and this.Result");
            }
            this.validator(this);
        }

        /// <summary>
        /// Parses an argument.
        /// </summary>
        /// <param name="arg">The argument to parse.</param>
        /// <returns>The result of the parsing.</returns>
        public object[] Parse(string arg)
        {
            return this.parser(arg);
        }

        /// <summary>
        /// default validation rule
        /// </summary>
        /// <param name="sw">The switch to validate</param>
        private static void DefaultValidator(CommandLineSwitch sw)
        {
        }

        /// <summary>
        /// default parser, split by ';' delimeter
        /// </summary>
        /// <param name="arg">argument to parse</param>
        /// <returns>result</returns>
        private static object[] DefaultParser(string arg)
        {
            if (arg == null || arg.Length == 0)
            {
                return null;
            }

            // Local variables
            object[] ret;

            ret = arg.Split(';');

            if(ret == null)
            {
                ret = new string[1];
                ret[0] = arg;
            }

            return ret;
        }
    }
}