namespace Linn.ChristmasLights.Service.Lambda
{
    using System.IO;

    using Amazon.Lambda.Core;

    using Linn.ChristmasLights.Domain;
    using Linn.ChristmasLights.Domain.Exceptions;
    using Linn.ChristmasLights.Iot;
    using Linn.ChristmasLights.Iot.Providers;
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

            var thingShadowProvider = new ThingShadowProvider<ChristmasTreeState>(config);

            this.christmasTreeService = new ChristmasTreeService(thingShadowProvider);
        }

        public void Handler(Stream inputStream, ILambdaContext context)
        {
            context.Logger.LogLine("Started");
            var iotButtonEvent = Utils.Bind<IotButtonEvent>(inputStream);

            context.Logger.LogLine($"Button {iotButtonEvent.SerialNumber}: Battery Voltage {iotButtonEvent.BatteryVoltage}; Click Type {iotButtonEvent.ClickType}");
            
            switch (iotButtonEvent.ClickType)
            {
                case IotButtonEvent.SingleClick:
                    context.Logger.LogLine("Cycling animation");
                    this.christmasTreeService.CycleAnimation().Wait();
                    break;
                case IotButtonEvent.DoubleClick:
                    context.Logger.LogLine("Switching off");
                    this.christmasTreeService.Off().Wait();
                    break;
                default:
                    throw new UnsupportedButtonPressException($"{iotButtonEvent.ClickType}");
            }

            context.Logger.LogLine("Complete");
        }
    }
}