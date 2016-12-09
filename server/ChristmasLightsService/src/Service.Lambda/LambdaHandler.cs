namespace Linn.ChristmasLights.Service.Lambda
{
    using System.IO;

    using Amazon.Lambda.Core;

    using Linn.ChristmasLights.Service;
    using Linn.ChristmasLights.Service.Lambda.Models;
    using Linn.ChristmasLights.Service.Providers;
    using Linn.ChristmasTreeLights.Domain;

    using Microsoft.Extensions.Configuration;

    public class IotButtonHandler
    {
        private readonly ChristmasTreeService christmasTreeService;

        public IotButtonHandler()
        {
            var configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddEnvironmentVariables();
            var config = configurationBuilder.Build();

            var thingShadowProvider = new ThingShadowProvider<ChristmasTreeState>(config);

            this.christmasTreeService = new ChristmasTreeService(thingShadowProvider);
        }

        public void Handler(Stream inputStream, ILambdaContext context)
        {
            var iotButtonEvent = Utils.Bind<IotButtonEvent>(inputStream);

            if (iotButtonEvent.ClickType == IotButtonEvent.SingleClick)
            {
                this.christmasTreeService.CycleAnimation();
            }

            if (iotButtonEvent.ClickType == IotButtonEvent.DoubleClick)
            {
                this.christmasTreeService.Off();
            }
        }
    }
}