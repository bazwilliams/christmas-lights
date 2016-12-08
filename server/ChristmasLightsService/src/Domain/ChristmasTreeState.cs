namespace Linn.ChristmasTreeLights.Domain
{
    public class ChristmasTreeState
    {
        private const string AnimationBlink = "blink";

        private const string AnimationOff = "off";

        private const string AnimationChase = "chase";

        public string Animation { get; set; }

        public string[] Colours { get; set; }

        public bool Repeat { get; set; }

        public string NextAnimationState()
        {
            switch (this.Animation)
            {
                case AnimationOff:
                    return AnimationBlink;
                case AnimationBlink:
                    return AnimationChase;
                default:
                    return AnimationOff;
            }
        }
    }
}