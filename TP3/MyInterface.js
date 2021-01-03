/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    //processMouseMove() {}

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    // Adds lights to the GUI in a folder
    addLightsGUI(){
        var keyNames = Object.keys(this.scene.graph.lights);
        var lightsFolder = this.gui.addFolder('Lights');

        for(var i = 0; i < keyNames.length; i++){
            lightsFolder.add(this.scene.lights[i], 'enabled').name(keyNames[i]);
        }
    }

    addSettings(){
        let group = this.gui.addFolder("Settings");
        group.open();

        group.add(this.scene.gameOrchestrator, "gameMode", [ "Player vs Player", "Player vs Bot", "Bot vs Bot" ] ).name("Game Mode");
        group.add(this.scene.gameOrchestrator, "difficultyLevel", [ "Easy", "Hard" ] ).name("Difficulty");
    }

    updateView(){
        this.scene.camera = this.scene.cameras[this.scene.currCamera];
        this.setActiveCamera(this.scene.cameras[this.scene.currCamera]); 
    }

    addOptionsGUI(){
        const optionsFolder = this.gui.addFolder('Options');

        optionsFolder.open();

        optionsFolder.add(this.scene.gameOrchestrator, "undo").name("Undo");
        optionsFolder.add(this.scene.gameOrchestrator, "reset").name("Reset");
        optionsFolder.add(this.scene.gameOrchestrator, "replay").name("Replay");
    }

    addScenesGUI(){
        const scenesFolder = this.gui.addFolder('Scenes');

        scenesFolder.open();

        scenesFolder.add(this.scene, "selectedScene", [ "root", "root2" ] ).name("Scenes");

    }

    /*addBotOptions(){
        this.gui.add(this.scene.gameOrchestrator, 'botOption', Object.keys(this.scene.gameOrchestrator.botOptions)).name('Players').onChange(this.changeBot.bind(this));
    }*/

}
