///////////////////////////////////////////////////////////////////////////////////////////
namespace iStone.Util.CommandLine
{
    using System;
    using System.Collections;

    /// <summary>
    /// Represents a commandline parser, users can add switches and parse the
    /// commandline with it.
    /// 
    /// @author aksonov
    /// @author CagedRat
    /// @copyright (c) TopCoder Software Inc. 2003, All rights reserved
    /// </summary>
    public class CommandLineParser 
    {

        /// <summary>
        /// Throw exceptions on finding unexcepted switches or not.
        /// </summary>
        private bool failedOnInvalidSwitch = false; 

        /// <summary>
        /// Represent the switch prefix, the defaults is "/" and "-".
        /// </summary>
        private string[] switchPrefix = {"/", "-"}; 

        /// <summary>
        /// Throw exceptions when duplicate switches occur in command line or 
        /// not.
        /// </summary>
        private bool failedOnDuplicateSwitch = false;

        /// <summary>
        /// Represent the available switches. It is IDictionary, the 
        /// key is a string, and the value is a CommandLineSwitch object.
        /// </summary>
        private IDictionary availableSwitches = new Hashtable(); 

        /// <summary>
        /// Represent the switches in a command line, it is IDictionary where
        /// key is a string, and the value is a CommandLineSwitch objects
        /// </summary>
        private IDictionary inputtedSwitches = new Hashtable(); 

        /// <summary>
        /// Represent the non-switch arguments.
        /// </summary>
        private ArrayList arguments = new ArrayList();
 
        /// <summary>
        /// the delimiter between switch and its arguments
        /// </summary>
        private char[] switchDivider = new char[]{':'};

        /// <summary>
        /// get or set the failedOnInvalidSwitch field
        /// </summary>
        public bool FailedOnInvalidSwitch
        {
            get
            {
                return this.failedOnInvalidSwitch;
            }
            set
            {
                this.failedOnInvalidSwitch = value;
            }
        }

        /// <summary>
        /// get or set the failedOnInvalidSwitch field
        /// </summary>
        public bool FailedOnDuplicateSwitch
        {
            get
            {
                return this.failedOnDuplicateSwitch;
            }
            set
            {
                // No validation required
                this.failedOnDuplicateSwitch = value;
            }
        }

        /// <summary>
        /// get or set the switchPrefix field
        /// </summary>
        /// <remarks>
        /// Sorts the switch prefixes so the longest of similar
        /// prefixes are checked first.
        /// </remarks>
        /// <exception cref="ArgumentNullException">
        /// if set null
        /// </exception>
        public string[] SwitchPrefix
        {
            get
            {
                return this.switchPrefix;
            }
            set
            {
                // Validate value
                if (value == null)
                {
                    throw new ArgumentNullException("value");
                }

                this.switchPrefix = value;
                
                // Sort prefixes so longest prefix is used
                Array.Sort(this.switchPrefix);
                Array.Reverse(this.switchPrefix);
            }
        }

        /// <summary>
        /// get a collection of available switches
        /// </summary>
        public ICollection AvailableSwitches
        {
            get
            {
                return availableSwitches.Values;
            }
        }

        /// <summary>
        /// get the inputted switches
        /// </summary>
        public IDictionary InputtedSwitches
        {
            get
            {
                return inputtedSwitches;
            }
        }

        /// <summary>
        /// delimiter between switch and its arguments
        /// </summary>
        public char[] SwitchDivider
        {
            get 
            {
                return switchDivider;
            }
            set 
            {
                // No validation required
                switchDivider = value;
            }
        }

        /// <summary>
        /// get the non-switch arguments
        /// </summary>
        public string[] Arguments
        {
            get
            {
                return (string[])arguments.ToArray(typeof(string));
            }
        }

        /// <summary>
        /// Add a parsable switch to the parser.
        /// </summary>
        /// <param name="sw">the switch to add</param>
        /// <exception cref="ArgumentNullException">
        /// if <c>sw</c> is null.
        /// </exception>
        public void AddSwitch(CommandLineSwitch sw) 
        {
            // Validate arguments
            if (sw == null)
            {
                throw new ArgumentNullException("sw");
            }

            availableSwitches.Add(sw.Switch, sw);
        }

        /// <summary>
        /// Add a collection of parsable switches to the parser
        /// </summary>
        /// <param name="switches">The switch collection to add</param>
        /// <exception cref="ArgumentNullException">
        /// if <c>switches</c> is null.
        /// </exception>
        public void AddSwitches(params string[] switches) 
        {
            // Validate parameters
            if (switches == null)
            {
                throw new ArgumentNullException("sw");
            }

            // Add switches
            foreach (string sw in switches)
            {
                this.AddSwitch(new CommandLineSwitch(sw));
            }
        }

        /// <summary>
        /// Default constructor.
        /// </summary>
        public  CommandLineParser() 
        {
            // Nothing to do
        }


        /// <summary>
        /// create a CommandLineParser using a collection of switches
        /// </summary>
        /// <param name="switches">the switches to add</param>
        /// <exception cref="ArgumentNullException">
        /// if <c>switches</c> is null
        /// </exception>
        public  CommandLineParser(ICollection switches) 
        {
            // Validate parameters
            if (switches == null)
            {
                throw new ArgumentNullException("switches");
            }
        
            // Add switches
            foreach(CommandLineSwitch sw in switches)
            {
                this.AddSwitch(sw);
            }
        }

        /// <summary>
        /// create a CommandLineParser using a collection of switches
        /// and specified igore case or not, failed on invalid switch
        /// or not.
        /// </summary>
        /// <param name="switches">the switches to add</param>
        /// <param name="failOnInvalidSwitch">
        /// failed on invalid switch or not
        /// </param>
        /// <exception cref="ArgumentNullException">
        /// if <c>switches</c> is null
        /// </exception>
        /// 
        public CommandLineParser(ICollection switches, bool failOnInvalidSwitch) 
        {
            // Validate parameters
            if (switches == null)
            {
                throw new ArgumentNullException("switches");
            }

            // Add switches
            foreach(CommandLineSwitch sw in switches)
            {
                this.AddSwitch(sw);
            }

            this.failedOnInvalidSwitch = failOnInvalidSwitch;
        }

        /// <summary>
        /// Parses command line arguments.
        /// </summary>
        /// <remarks>
        /// Puts parsed switches with parsed and validated in the 
        /// InputtedSwitches member.  Puts other commandline arguments
        /// in the Arguments member.
        /// </remarks>
        /// <param name="args">the command line arguments to parse</param>
        /// <exception cref="ArgumentNullException">
        /// if <c>args</c> is null
        /// </exception>
        /// <exception cref="InvalidSwitchException">
        /// if <c>args</c> contains a invalid switch, and the 
        /// FailedOnInvalidSwitch is set to true.
        /// </exception>
        /// <exception cref="DuplicateSwitchException">
        /// if a switch occurs in <c>args</c> more than once. and the 
        /// FailedOnDuplicateSwitch is set to true.
        /// </exception>
        public void Parse(string[] args) 
        {
            // Validate arguments
            if (args == null)
            {
                throw new ArgumentNullException("args");
            }

            // Local variables
            CommandLineSwitch sw = null;
            string argument = null;
            string prefix = null;

            for (int curr = 0; curr < args.Length; ++curr)
            {
                argument = args[curr];
                //1.Get an argument; determine whether it is a switch 
                //  (not using IsSwitch.  Instead calling FindPrefix once,
                //  so that the prefixes are iterated through only once).
                //2.If it is a switch, 
                prefix = this.FindPrefix(argument);
                if (prefix != null)
                {
                    //2.1.Remove the switch prefix,
                    argument = argument.Remove(0,prefix.Length);
                    //argument = argument.Remove(0,this.FindPrefix(argument).Length);

                    //2.2.Use GetSwitch method to get the switch, 
                    sw = this.GetSwitch(argument);                    
                    
                    //2.3.If is an available switch
                    if (sw != null)
                    {
                        //2.3.1.Remove the switch from the argument string
                        if(argument.Length == sw.Switch.Length)
                        {
                            argument = "";
                        }
                        else
                        {
                            argument = argument.Remove(0, sw.Switch.Length+1);
                        }
                      
                        //2.3.2.Get the corresponding CommandLineSwitch object 
                        //      from the availableSwitch field
                        //2.3.3.Use the Validate method to parse the argument.
                        try
                        {
                            sw.Validate(argument);
                        }
                        catch (InvalidSwitchException e)
                        {
                            if (this.failedOnInvalidSwitch)
                            {
                                throw e;
                            }
                        }
                        
                        // If failedOnDuplicateSwitch and switch is a duplicate
                        //    Throw DuplicateSwitchException
                        if (this.inputtedSwitches[sw.Switch] != null && 
                            this.failedOnDuplicateSwitch == true)
                        {
                            throw new DuplicateSwitchException
                                ("Duplicate switch found", sw.Switch);
                        }
                        
                        this.inputtedSwitches[sw.Switch] = sw;
                    }
                    //2.4.Else 
                    //2.4.1.If failedOnInvalidSwitch throw an 
                    //      InvalidSwitchException
                    else if (this.failedOnInvalidSwitch)
                    {
                        throw new InvalidSwitchException
                            ("Attempted to parse invalid switch", argument);
                    }
                }
                    //3.Else (not a switch)
                else
                {
                    //3.1.Add the argument to arguments field.
                    this.arguments.Add(argument);
                }    
            }
            //4.If there are more arguments go to 1
            //5.Else end.
        }

        /// <summary>
        /// Removes given switch from the list of parseable switches.
        /// </summary>
        /// <param name="sw">The switch to remove</param>
        /// <exception cref="ArgumentException">
        /// if sw is not a switch
        /// </exception>
        public void RemoveSwitch(String sw)
        {
            if(!this.availableSwitches.Contains(sw))
            {
                throw new ArgumentException(sw + " is not a valid switch", "sw");
            }
            this.availableSwitches.Remove(sw);
        }

        /// <summary>
        /// determine whether a command line argument is a switch
        /// </summary>
        /// <param name="arg">the command line argument</param>
        /// <returns>true, if the <c>arg</c> is a switch; otherwise, false</returns>
        private bool IsSwitch(string arg) 
        {
            // Check each prefix to see in arg starts with it
            return (this.FindPrefix(arg) != null);
        }

        /// <summary>
        /// Finds the switch prefix of a command line argument
        /// </summary>
        /// <param name="arg">The argument to check for a switch prefix</param>
        /// <returns>
        /// The prefix of the switch or null if arg doesn't begin with a 
        /// switch prefix.
        /// </returns>
        private string FindPrefix(string arg)
        {
            // Look through switches
            foreach (string prefix in this.switchPrefix)
            {
                // Find the prefix that argument starts with
                if (arg.StartsWith(prefix))
                {
                    return prefix;
                }
            }

            // No prefix
            return null;
        }

        /// <summary>
        /// Gets the switch of the command line argument.
        /// </summary>
        /// <remarks>
        /// Assumes that the prefix has been stripped from the argument.
        /// </remarks>
        /// <param name="arg">the switch</param>
        /// <returns>the switch, or null, if arg is not an available switch</returns>
        private CommandLineSwitch GetSwitch(string arg) 
        {
            // local variables
            CommandLineSwitch sw;
            string swText;
            string swLower;
            int iDivider = arg.IndexOfAny(this.switchDivider);

            // Get switch
            if(iDivider < 0)
            {
                // No divider so all of arg is switch
                swText = arg.Clone() as string;
            }
            else
            {   
                // Uses everything before the divider
                swText = arg.Substring(0, iDivider);
            }

            // Convert switch to lower
            swLower = swText.ToLower();

            // Compare switch to available switches
            foreach (string name in this.availableSwitches.Keys)
            {
                sw = (CommandLineSwitch)availableSwitches[name];

                if ((!sw.IgnoreCase && swText.Equals(sw.Switch) ||
                    (sw.IgnoreCase && swLower.Equals(sw.Switch.ToLower()))))
                {
                    return sw;
                }
            }

            // Switch not available
            return null;
        }

    }
}