namespace Linn.ChristmasLights.Service.Models
{
    public class State<T>
    {
        public T Reported { get; set; }

        public T Desired { get; set; }
    }
}