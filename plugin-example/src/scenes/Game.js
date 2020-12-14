import handR from '../assets/handR.png'
import handL from '../assets/handL.png'

export class GameScene extends Phaser.Scene{
    constructor(config){
    super(config);
    }

    skeleton = {
        "leftWrist": {part: "leftWrist", x: (window.innerWidth/2), y: (window.innerHeight/2)},
        "rightWrist": {part: "rightWrist", x: (window.innerWidth/2), y: (window.innerHeight/2)}
    };    
    keypointsGameOjb = {
        leftWrist: undefined,
        rightWrist: undefined, 
    }
    posenetplugin;

    preload(){
        this.load.image('handR', handR);
        this.load.image('handL', handL);    
    }

    create(){
        this.posenetplugin = this.plugins.get('PoseNetPlugin');

        this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL').setScale(0.2);
        this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR').setScale(0.2);
    }

    fetchPoses = async () => {
        let poses = await this.posenetplugin.poseEstimation();
        this.handlePoses(poses);
      }

    handlePoses(poses){
        if(poses === false){
            return; 
        }

        poses.forEach(({score, keypoints}) => {
            if(score >= 0.4){ // adding a threshold to the pose
                this.drawKeypoints(keypoints);
                return; 
            }else if (score <= 0.08){ // adding a threshold to the pose
                console.log('score is too low')
            }
        })
    }

    drawKeypoints = (keypoints, scale = 1) => {
        for (let i = 0; i < keypoints.length; i++) {
            this.handleKeyPoint(keypoints[i], scale);
        }
    }

    // possibility to filter the keypoints regarding of which keypoint you want
    // in this demo only the "hands/wrists" are being handled
    handleKeyPoint = (keypoint, scale) => {
        if(!(keypoint.part === "leftWrist" || keypoint.part === "rightWrist" )) {
            return;
        }

        if(keypoint.score <= 0.25){ // additional treshold
            console.log(keypoint)
            return;
        }

        let skeletonPart = this.skeleton[keypoint.part];
        const {y, x} = keypoint.position;
        skeletonPart.x += (x - skeletonPart.x) / 10; // adding ease
        skeletonPart.y += (y - skeletonPart.y) / 10; // adding ease
    
    };

    update(){
        this.fetchPoses();

        this.keypointsGameOjb.leftWrist.x = this.skeleton.leftWrist.x;
        this.keypointsGameOjb.leftWrist.y = this.skeleton.leftWrist.y;

        this.keypointsGameOjb.rightWrist.x = this.skeleton.rightWrist.x;
        this.keypointsGameOjb.rightWrist.y = this.skeleton.rightWrist.y;
    }
}