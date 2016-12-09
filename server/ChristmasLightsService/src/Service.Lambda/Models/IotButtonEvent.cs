namespace Linn.ChristmasLights.Service.Lambda.Models
{
    public class IotButtonEvent
    {
        public const string SingleClick = "SINGLE";

        public const string DoubleClick = "DOUBLE";

        public const string LongClick = "LONG";

        public string SerialNumber { get; set; }

        public string BatteryVoltage { get; set; }

        public string ClickType { get; set; }
    }
}
