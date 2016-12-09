namespace Linn.ChristmasLights.Service
{
    using Linn.ChristmasLights.Domain;
    using Linn.ChristmasLights.Iot.Models;
    using Linn.ChristmasLights.Iot.Providers;

    public class ChristmasTreeService
    {
        private readonly ThingShadowProvider<ChristmasTreeState> thingShadowProvider;

        public ChristmasTreeService(ThingShadowProvider<ChristmasTreeState> thingShadowProvider)
        {
            this.thingShadowProvider = thingShadowProvider;
        }

        public void CycleAnimation()
        {
            var thingShadow = this.thingShadowProvider.GetThingShadow().Result;
            
            CycleAnimationState(thingShadow);
            
            this.thingShadowProvider.UpdateThingShadow(thingShadow);
        }

        public void Off()
        {
            var thingShadow = this.thingShadowProvider.GetThingShadow().Result;

            SwitchOff(thingShadow);

            this.thingShadowProvider.UpdateThingShadow(thingShadow);
        }

        private static void CycleAnimationState(ThingShadow<ChristmasTreeState> thingShadow)
        {
            thingShadow.State.Desired.Animation = thingShadow.State.Reported.NextAnimationState();
            thingShadow.State.Desired.Repeat = thingShadow.State.Reported.Repeat;
            thingShadow.State.Desired.Colours = thingShadow.State.Reported.Colours;
        }

        private static void SwitchOff(ThingShadow<ChristmasTreeState> thingShadow)
        {
            thingShadow.State.Desired.Animation = ChristmasTreeState.AnimationOff;
            thingShadow.State.Desired.Repeat = thingShadow.State.Reported.Repeat;
            thingShadow.State.Desired.Colours = thingShadow.State.Reported.Colours;
        }
    }
}