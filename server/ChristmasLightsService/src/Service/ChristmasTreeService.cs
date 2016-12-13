namespace Linn.ChristmasLights.Service
{
    using System.Threading.Tasks;

    using Linn.ChristmasLights.Domain;
    using Linn.ChristmasLights.Domain.Exceptions;
    using Linn.ChristmasLights.Iot.Models;
    using Linn.ChristmasLights.Iot.Providers;

    public class ChristmasTreeService
    {
        private readonly ThingShadowProvider<ChristmasTreeState> thingShadowProvider;

        public ChristmasTreeService(ThingShadowProvider<ChristmasTreeState> thingShadowProvider)
        {
            this.thingShadowProvider = thingShadowProvider;
        }

        public async Task CycleAnimation()
        {
            var thingShadow = await this.thingShadowProvider.GetThingShadow();
            
            CycleAnimationState(thingShadow);
            
            this.thingShadowProvider.UpdateThingShadow(thingShadow).Wait();
        }

        public async Task Off()
        {
            var thingShadow = await this.thingShadowProvider.GetThingShadow();

            SwitchOff(thingShadow);

            this.thingShadowProvider.UpdateThingShadow(thingShadow).Wait();
        }

        private static void CycleAnimationState(ThingShadow<ChristmasTreeState> thingShadow)
        {
            thingShadow.State.Desired.Animation = thingShadow.State.Reported.NextAnimationState();
        }

        private static void SwitchOff(ThingShadow<ChristmasTreeState> thingShadow)
        {
            thingShadow.State.Desired.Animation = ChristmasTreeState.AnimationOff;
        }
    }
}