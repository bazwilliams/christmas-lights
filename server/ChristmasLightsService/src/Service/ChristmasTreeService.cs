namespace Linn.ChristmasLights.Service
{
    using System.Threading.Tasks;

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

        public async Task<bool> CycleAnimation()
        {
            var thingShadow = await this.thingShadowProvider.GetThingShadow();
            
            CycleAnimationState(thingShadow);
            
            return await this.thingShadowProvider.UpdateThingShadow(thingShadow);
        }

        public async Task<bool> Off()
        {
            var thingShadow = await this.thingShadowProvider.GetThingShadow();

            SwitchOff(thingShadow);

            return await this.thingShadowProvider.UpdateThingShadow(thingShadow);
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