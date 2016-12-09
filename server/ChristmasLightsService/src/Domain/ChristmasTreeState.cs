namespace Linn.ChristmasTreeLights.Domain
{
    public class ChristmasTreeState
    {
        public const string AnimationBlink = "blink";

        public const string AnimationOff = "off";

        public const string AnimationChase = "chase";

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
                case AnimationChase:
                    return AnimationBlink;
                default:
                    return AnimationOff;
            }
        }
    }
}