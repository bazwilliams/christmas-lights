namespace Linn.ChristmasLights.Domain.Exceptions
{
    using System;

    public class ThingShadowUpdateFailedException : Exception
    {
        public ThingShadowUpdateFailedException()
        {
        }

        public ThingShadowUpdateFailedException(string message) : base(message)
        {
        }

        public ThingShadowUpdateFailedException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}