namespace Service.Console
{
    using System;

    using Amazon.Lambda.Core;

    using Linn.ChristmasLights.Service;
    
    public class Program
    {
        public static void Main(string[] args)
        {
            var lambda = new LambdaHandler();
            lambda.Handler(null, new AppContext(new ConsoleLogger()));
            Console.ReadLine();
        }

        public class AppContext : ILambdaContext
        {
            public AppContext(ILambdaLogger logger)
            {
                this.Logger = logger;
            }

            public string AwsRequestId { get; }

            public IClientContext ClientContext { get; }

            public string FunctionName { get; }

            public string FunctionVersion { get; }

            public ICognitoIdentity Identity { get; }

            public string InvokedFunctionArn { get; }

            public ILambdaLogger Logger { get; }

            public string LogGroupName { get; }

            public string LogStreamName { get; }

            public int MemoryLimitInMB { get; }

            public TimeSpan RemainingTime { get; }
        }

        public class ConsoleLogger : ILambdaLogger
        {
            public void Log(string message)
            {
                Console.Write(message);
            }

            public void LogLine(string message)
            {
                Console.WriteLine(message);
            }
        }
    }
}
