namespace Linn.ChristmasLights.Iot.Models
{
    public class State<T>
    {
        public T Reported { get; set; }

        public T Desired { get; set; }
    }
}