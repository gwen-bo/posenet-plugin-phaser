class PoseNetPlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super('PoseNetPlugin', pluginManager);
    }

    poseNet;
    poses;
    $webcam; 
    videostream; 
    loaded = false; 

    init = async () => {
        console.log('PoseNetPlugin has started');
        this.$webcam = document.querySelector('#webcam');

        this.poses = [];
        this.$webcam.width = window.innerWidth;
        this.$webcam.height = window.innerHeight;

        this.poseNet = await posenet.load();
        try {
            this.videostream = await navigator.mediaDevices.getUserMedia({ video: { width: 1080, height: 1920 } });
            if (!this.$webcam.captureStream) {
                this.$webcam.captureStream = () => this.videostream;
            };
            this.$webcam.srcObject = this.videostream;
          } catch(err) {
            /* handle the error */
            console.log('Error: videostream failed');
          }


        this.$webcam.addEventListener('loadeddata', () => {
            console.log('webcam loaded');
            this.loaded = true; 
        });
    }

    poseEstimation = async () => {
        if(this.loaded === false){
            return false;
        }

        const pose = await this.poseNet.estimateSinglePose(this.$webcam, {flipHorizontal: true});
        this.poses = this.poses.concat(pose);
        return this.poses; // returning the poses to the scene (to handle it there)
    }

    start(){
        this.poseEstimation();
    }

    stop(){
    }

    destroy()
{
        this.pluginManager = null;
        this.game = null;
        this.scene = null;
        this.systems = null;
    }
}

module.exports = PoseNetPlugin;
