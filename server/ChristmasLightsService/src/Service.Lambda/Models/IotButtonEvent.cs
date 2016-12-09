namespace Linn.ChristmasLights.Service.Lambda.Models
{
    public class IotButtonEvent
    {
        public string SerialNumber { get; set; }

        public string BatteryVoltage { get; set; }

        public string ClickType { get; set; }
    }
}
