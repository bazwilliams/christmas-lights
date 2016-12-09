namespace Linn.ChristmasLights.Service.Providers
{
    using System.Threading.Tasks;

    using Amazon.IotData;
    using Amazon.IotData.Model;

    using Linn.ChristmasLights.Service.Models;
    using Linn.ChristmasTreeLights.Domain;

    using Microsoft.Extensions.Configuration;

    public class ThingProvider<T>
    {
        private readonly string thingName;

        private readonly AmazonIotDataClient client;
        
        public ThingProvider(IConfiguration config)
        {
            this.thingName = config["ThingName"];
            this.client = new AmazonIotDataClient(config["IotServiceUrl"]);
        }
        
        public async void UpdateThingShadow(T thingShadow)
        {
            var updateThingShadowRequest = new UpdateThingShadowRequest()
            {
                ThingName = this.thingName,
                Payload = Utils.ToJsonMemoryStream(thingShadow)
            };

            await this.client.UpdateThingShadowAsync(updateThingShadowRequest);
        }

        public async Task<T> GetThingShadow()
        {
            var getThingShadowRequest = new GetThingShadowRequest() { ThingName = this.thingName };
            var getThingShadowResponse = await this.client.GetThingShadowAsync(getThingShadowRequest);

            var thingShadow = Utils.Bind<ChristmasTreeThingShadow>(getThingShadowResponse.Payload);

            if (thingShadow.State.Desired == null)
            {
                thingShadow.State.Desired = new ChristmasTreeState();
            }

            return thingShadow;
        }
    }
}
