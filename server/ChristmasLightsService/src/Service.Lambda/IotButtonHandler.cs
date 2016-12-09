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
            context.Logger.LogLine($"Invocation");
            var iotButtonEvent = Utils.Bind<IotButtonEvent>(inputStream);

            context.Logger.LogLine($"Button {iotButtonEvent.SerialNumber}: Battery Voltatge {iotButtonEvent.BatteryVoltage}; Click Type {iotButtonEvent.ClickType}");

            switch (iotButtonEvent.ClickType)
            {
                case IotButtonEvent.SingleClick:
                    this.christmasTreeService.CycleAnimation();
                    break;
                case IotButtonEvent.DoubleClick:
                    this.christmasTreeService.Off();
                    break;
                default:
                    throw new UnsupportedButtonPressException("Unsupported click type");
            }
        }
    }
}