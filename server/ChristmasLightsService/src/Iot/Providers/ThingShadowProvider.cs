namespace Linn.ChristmasLights.Iot.Providers
{
    using System;
    using System.Net;
    using System.Threading.Tasks;

    using Amazon.IotData;
    using Amazon.IotData.Model;

    using Linn.ChristmasLights.Domain.Exceptions;
    using Linn.ChristmasLights.Iot.Models;

    using Microsoft.Extensions.Configuration;

    public class ThingShadowProvider<T>
        where T : new()
    {
        private readonly string thingName;

        private readonly AmazonIotDataClient client;
        
        public ThingShadowProvider(IConfiguration config)
        {
            this.thingName = config["ThingName"];
            this.client = new AmazonIotDataClient(config["IotServiceUrl"]);
        }
        
        public async Task UpdateThingShadow(ThingShadow<T> thingShadow)
        {
            var updateThingShadowRequest = new UpdateThingShadowRequest()
            {
                ThingName = this.thingName,
                Payload = Utils.ToJsonMemoryStream(thingShadow)
            };

            var result = await this.client.UpdateThingShadowAsync(updateThingShadowRequest);

            if (result.HttpStatusCode != HttpStatusCode.OK)
            {
                throw new ThingShadowUpdateFailedException($"Received HTTP {result.HttpStatusCode}");
            }
        }

        public async Task<ThingShadow<T>> GetThingShadow()
        {
            var getThingShadowRequest = new GetThingShadowRequest() { ThingName = this.thingName };
            var getThingShadowResponse = await this.client.GetThingShadowAsync(getThingShadowRequest);

            return await Task<ThingShadow<T>>.Factory.StartNew(
                () =>
                    {
                        var thingShadow = Utils.Bind<ThingShadow<T>>(getThingShadowResponse.Payload);

                        if (thingShadow.State.Desired == null)
                        {
                            thingShadow.State.Desired = new T();
                        }

                        return thingShadow;
                    });
        }
    }
}
