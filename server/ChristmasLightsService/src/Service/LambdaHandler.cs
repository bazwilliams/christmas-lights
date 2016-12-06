namespace Linn.ChristmasLights.Service
{
    using System.IO;

    using Amazon.Lambda.Core;

    public class LambdaHandler
    {
        public Stream Handler(Stream inputStream, ILambdaContext context)
        {
            context.Logger.LogLine("Not implemented");
            return null;
        }
    }
}