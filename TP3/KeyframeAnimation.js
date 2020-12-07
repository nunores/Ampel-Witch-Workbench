class KeyframeAnimation extends Animation {
    
    constructor(keyFrames, scene){
        super(scene);
        this.keyFrames = keyFrames;
        this.instants = [];
        this.keyFrameIndex = 0;
        this.currTime = 0;
        this.interval = null;
        
        this.currTransX = 0;
        this.currTransY = 0;
        this.currTransZ = 0;

        this.currRotX = 0;
        this.currRotY = 0;
        this.currRotZ = 0;

        this.currScaleX = 0;
        this.currScaleY = 0;
        this.currScaleZ = 0;

        this.current_matrix = mat4.create();
        mat4.scale(this.current_matrix, this.current_matrix, [0,0,0]);
        

        for (var i = 0; i < keyFrames.length; i++)
        {
            this.instants.push(keyFrames[i][0]);
        }
        this.interval = this.instants[0];

    }

    update(deltaTime){

        this.currTime += deltaTime;
        if (this.keyFrameIndex < this.keyFrames.length)
        {
            this.interval = this.keyFrames[this.keyFrameIndex][0];

            var diff;

            var transX;
            var transY;
            var transZ;

            var rotX;
            var rotY;
            var rotZ;

            var scaleX;
            var scaleY;
            var scaleZ;
            
            if (this.keyFrameIndex > 0)
            {
                diff = this.interval - this.keyFrames[this.keyFrameIndex - 1][0];

                transX = this.keyFrames[this.keyFrameIndex][1][0] - this.keyFrames[this.keyFrameIndex - 1][1][0];
                transY = this.keyFrames[this.keyFrameIndex][1][1] - this.keyFrames[this.keyFrameIndex - 1][1][1];
                transZ = this.keyFrames[this.keyFrameIndex][1][2] - this.keyFrames[this.keyFrameIndex - 1][1][2];

                rotX = this.keyFrames[this.keyFrameIndex][2][0] - this.keyFrames[this.keyFrameIndex - 1][2][0];
                rotY = this.keyFrames[this.keyFrameIndex][2][1] - this.keyFrames[this.keyFrameIndex - 1][2][1];
                rotZ = this.keyFrames[this.keyFrameIndex][2][2] - this.keyFrames[this.keyFrameIndex - 1][2][2];
                
                scaleX = this.keyFrames[this.keyFrameIndex][3][0] - this.keyFrames[this.keyFrameIndex - 1][3][0];
                scaleY = this.keyFrames[this.keyFrameIndex][3][1] - this.keyFrames[this.keyFrameIndex - 1][3][1];
                scaleZ = this.keyFrames[this.keyFrameIndex][3][2] - this.keyFrames[this.keyFrameIndex - 1][3][2];
            }
            else
            {
                diff = this.interval;

                transX = this.keyFrames[0][1][0];
                transY = this.keyFrames[0][1][1];
                transZ = this.keyFrames[0][1][2];

                rotX = this.keyFrames[0][2][0];
                rotY = this.keyFrames[0][2][1];
                rotZ = this.keyFrames[0][2][2];
                
                scaleX = 0;
                scaleY = 0;
                scaleZ = 0;
            }

            if (this.currTime <= this.interval)
            {
                this.currTransX += transX / diff * deltaTime;
                this.currTransY += transY / diff * deltaTime;
                this.currTransZ += transZ / diff * deltaTime;

                this.currRotX += rotX / diff * deltaTime;
                this.currRotY += rotY / diff * deltaTime;
                this.currRotZ += rotZ / diff * deltaTime;

                this.currScaleX += scaleX / diff * deltaTime;
                this.currScaleY += scaleY / diff * deltaTime;
                this.currScaleZ += scaleZ / diff * deltaTime;

            }

            if (this.currTime > this.keyFrames[this.keyFrameIndex][0])
            {
                if (this.keyFrameIndex == 0)
                {
                    this.currTransX = this.keyFrames[0][1][0];
                    this.currTransY = this.keyFrames[0][1][1];
                    this.currTransZ = this.keyFrames[0][1][2];

                    this.currRotX = this.keyFrames[0][2][0];
                    this.currRotY = this.keyFrames[0][2][1];
                    this.currRotZ = this.keyFrames[0][2][2];

                    this.currScaleX = this.keyFrames[0][3][0];
                    this.currScaleY = this.keyFrames[0][3][1];
                    this.currScaleZ = this.keyFrames[0][3][2];
                }
                this.keyFrameIndex++;
            }
        }

    }

    apply() {
        
        this.matrix = mat4.create();
        mat4.translate(this.matrix, this.matrix, [this.currTransX, this.currTransY, this.currTransZ]);
        mat4.rotate(this.matrix, this.matrix, this.currRotX, [1, 0, 0]);
        mat4.rotate(this.matrix, this.matrix, this.currRotY, [0, 1, 0]);
        mat4.rotate(this.matrix, this.matrix, this.currRotZ, [0, 0, 1]);
        mat4.scale(this.matrix, this.matrix, [this.currScaleX, this.currScaleY, this.currScaleZ]);

        this.scene.multMatrix(this.matrix);
    }

}