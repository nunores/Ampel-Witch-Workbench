class MySpriteAnimation extends MySpriteSheet {

    constructor(scene, texture, sizeM, sizeN, duration, startCell, endCell) {
        super(scene, texture, sizeM, sizeN);
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;
        this.currTime = 0;
        this.totalIterations = this.endCell - this.startCell;
        this.iterationDuration = this.totalIterations / this.duration;
        this.currP = this.startCell;

    }


    /**
     * 
     * @param {*} deltaTime - Time difference between updates
     */
    update(deltaTime) {
        if (this.currP != this.endCell) {
            this.currTime += deltaTime;
            if (this.currTime >= this.iterationDuration) {
                this.currTime -= this.iterationDuration;
                this.currP++;
            }
        }

    }

    display() {
        this.scene.pushMatrix();
        this.scene.stack_texture.push(this.defaultTexture);
        this.scene.stack_material.push(this.defaultAppearance);
        

        this.scene.setActiveShaderSimple(this.shader);
        this.defaultAppearance.setTexture(this.defaultTexture);
        this.defaultAppearance.apply();

        this.activateCellP(this.currP);
        super.display();

        this.scene.stack_material.pop();
        this.scene.stack_texture.pop();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);

    }










}