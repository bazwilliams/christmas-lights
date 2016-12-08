namespace Linn.ChristmasLights.Service
{
    using System;
    using System.IO;
    using System.Text;

    using Amazon.IotData;
    using Amazon.IotData.Model;
    using Amazon.Lambda.Core;

    using Linn.ChristmasLights.Service.Models;
    using Linn.ChristmasTreeLights.Domain;

    using Microsoft.Extensions.Configuration;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    public class LambdaHandler
    {
        public void Handler(Stream inputStream, ILambdaContext context)
        {
            var configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddEnvironmentVariables();
            var config = configurationBuilder.Build();

            var iotConfig = new AmazonIotDataConfig() { ServiceURL = config["IotServiceUrl"] };
            var client = new AmazonIotDataClient(iotConfig);

            var getThingShadowRequest = new GetThingShadowRequest() { ThingName = config["ThingName"] };
            var getThingShadowResponse = client.GetThingShadowAsync(getThingShadowRequest).Result;

            var thingShadow = Bind<ChristmasTreeThingShadow>(getThingShadowResponse);

            if (thingShadow.State.Desired == null)
            {
                thingShadow.State.Desired = new ChristmasTreeState();
            }

            UpdateThingShadow(thingShadow);

            var str = ToJson(thingShadow);

            context.Logger.LogLine(str);

            var stream = new MemoryStream(Encoding.UTF8.GetBytes(str));

            var updateThingShadowRequest = new UpdateThingShadowRequest()
                                               {
                                                   ThingName = config["ThingName"],
                                                   Payload = stream
                                               };
            context.Logger.LogLine("UPDATING");
            var result = client.UpdateThingShadowAsync(updateThingShadowRequest).Result;
            context.Logger.LogLine($"UPDATED {result.HttpStatusCode}");
        }

        private static string ToJson(ChristmasTreeThingShadow thingShadow)
        {
            var serialiser = new JsonSerializer() { ContractResolver = new CamelCasePropertyNamesContractResolver() };

            var stringWriter = new StringWriter();
            using (var writer = new JsonTextWriter(stringWriter))
            {
                serialiser.Serialize(writer, thingShadow);
                writer.Flush();
            }
            return stringWriter.ToString();
        }

        private static void UpdateThingShadow(ChristmasTreeThingShadow thingShadow)
        {
            thingShadow.State.Desired.Animation = thingShadow.State.Reported.NextAnimationState();
            thingShadow.State.Desired.Repeat = thingShadow.State.Reported.Repeat;
            thingShadow.State.Desired.Colours = thingShadow.State.Reported.Colours;
        }

        private static T Bind<T>(GetThingShadowResponse response)
        {
            var serialiser = new JsonSerializer();

            T thingShadow;
            using (var sr = new StreamReader(response.Payload))
            {
                thingShadow = serialiser.Deserialize<T>(new JsonTextReader(sr));
            }
            return thingShadow;
        }
    }
}