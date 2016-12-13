namespace Linn.ChristmasLights.Domain.Exceptions
{
    using System;

    public class UnsupportedButtonPressException : Exception
    {
        public UnsupportedButtonPressException()
        {
        }

        public UnsupportedButtonPressException(string message) : base(message)
        {
        }

        public UnsupportedButtonPressException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}