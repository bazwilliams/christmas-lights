namespace Linn.ChristmasLights.Service.Lambda
{
    using System.IO;

    using Amazon.Lambda.Core;

    using Linn.ChristmasLights.Service;
    using Linn.ChristmasLights.Service.Lambda.Models;

    using Microsoft.Extensions.Configuration;

    public class IotButtonHandler
    {
        private readonly ChristmasTreeService christmasTreeService;

        public IotButtonHandler()
        {
            var configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddEnvironmentVariables();
            var config = configurationBuilder.Build();

            this.christmasTreeService = new ChristmasTreeService(config);
        }

        public void Handler(Stream inputStream, ILambdaContext context)
        {
            var iotButtonEvent = Utils.Bind<IotButtonEvent>(inputStream);
            
            this.christmasTreeService.CycleAnimationState();
        }
    }
}