/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /*
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;

        this.nodes = [];
        this.rootId = null;
        this.components = [];
        this.materials = [];
        this.textures = [];
        this.animations = [];
        this.spritesheets = [];
        this.spriteAnimations = [];


        /*TP3*/
        this.gameOrchestrator = null;
        /**/

        // Helper values for texture assignment
        this.textures["null"] = "null";
        this.textures["clear"] = "clear";

        this.lights = [];
        this.stack_material = [];
        this.stack_texture = [];
        this.stack = [];
        this.cameras = [];
        this.currCamera = null;

        this.firstTime = true;


    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        
        this.sceneInited = false;

        this.initCameras();
        
        this.enableTextures(true);
        
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        
        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;
        
        this.defaultAppearance=new CGFappearance(this);
        
        this.setPickEnabled(true);
        this.gameOrchestrator = new MyGameOrchestrator(this);
        
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();

        this.sceneInited = true;

        this.interface.addLightsGUI();
        this.interface.addOptionsGUI();
        this.interface.addSettings();

        this.setUpdatePeriod(100);

    }

    update(time){ // Time in milliseconds
        if(this.firstTime){
            this.previous = time - 1;
            this.deltaTime = 0;
            this.countOneSecond = 0;
            this.firstTime = false;
        }

        this.deltaTime = (time - this.previous) / 1000;
        // Update animations

        for(const animation in this.animations){
            this.animations[animation].update(this.deltaTime);
        }

        for (const spriteAnimation in this.spriteAnimations){
            this.spriteAnimations[spriteAnimation].update(this.deltaTime);
        }

        if(this.gameOrchestrator.replayMode)
        {
            this.gameOrchestrator.animator.update(this.deltaTime);
        }

        this.handleTimer();


        this.previous = time;

    }

    handleTimer(){

        if(this.gameOrchestrator.gameMode === "Bot vs Bot" || this.gameOrchestrator.gameMode === "Player vs Bot" || this.gameOrchestrator.replayMode == true)
            this.gameOrchestrator.gameBoard.timer.changeText("Time: ---");

        else {
            this.gameOrchestrator.gameBoard.timer.changeText("Time: " + this.gameOrchestrator.time);
            this.countOneSecond += this.deltaTime;

            if(this.countOneSecond > 1){
                this.gameOrchestrator.decreaseTime();
                this.countOneSecond = 0;
            }
    
            if(this.gameOrchestrator.time === 0){
                this.gameOrchestrator.currentState = this.gameOrchestrator.gameStates.gameOver;
    
                /*
                    if(this.gameOrchestrator.currentPlayer === 1) winner é 2
                    else winner é 1
                */
            }

        }
    }
    

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity(); 

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].update();
        }

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();
 
            this.defaultAppearance.apply();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
            
            
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup

        this.gameOrchestrator.managePick(this.pickMode, this.pickResults);
        this.clearPickRegistration();
    }
}