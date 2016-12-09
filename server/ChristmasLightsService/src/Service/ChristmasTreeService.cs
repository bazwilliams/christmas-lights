namespace Linn.ChristmasLights.Service
{
    using System.IO;
    using System.Text;

    using Amazon.IotData;
    using Amazon.IotData.Model;

    using Linn.ChristmasLights.Service.Models;
    using Linn.ChristmasTreeLights.Domain;

    using Microsoft.Extensions.Configuration;

    public class ChristmasTreeService
    {


        public void CycleAnimation()
        {
            var thingShadow = this.GetThingShadow();
            
            CycleAnimationState(thingShadow);
            
            this.UpdateThingShadow(thingShadow);
        }

        public void ToggleOff()
        {
            var thingShadow = this.GetThingShadow();

            SwitchOff(thingShadow);

            this.UpdateThingShadow(thingShadow);
        }

        private static void CycleAnimationState(ChristmasTreeThingShadow thingShadow)
        {
            thingShadow.State.Desired.Animation = thingShadow.State.Reported.NextAnimationState();
            thingShadow.State.Desired.Repeat = thingShadow.State.Reported.Repeat;
            thingShadow.State.Desired.Colours = thingShadow.State.Reported.Colours;
        }

        private static void SwitchOff(ChristmasTreeThingShadow thingShadow)
        {
            thingShadow.State.Desired.Animation = ChristmasTreeState.AnimationOff;
            thingShadow.State.Desired.Repeat = thingShadow.State.Reported.Repeat;
            thingShadow.State.Desired.Colours = thingShadow.State.Reported.Colours;
        }


    }
}
