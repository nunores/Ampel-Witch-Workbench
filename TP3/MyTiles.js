class MyTiles extends CGFobject {
	constructor(scene) {
        super(scene);
        this.firstX = 0;
        this.firstY = 0;
        this.tiles = [];
        this.initBuffers();
    }
    
    initBuffers(){
        let index = 0;
        for (let i = 1; i < 12; i++) {
            for(let n = 0; n < i; n++)
            {
                let tile = new MyTile(this.scene, this.firstX, this.firstY);
                this.tiles[index] = tile;
                console.log("Welelel");
                index++;
                this.firstX -= 1.1;
            }
            this.firstX = 0.51*i;
            this.firstY += 1.1;

        }        
    }

    logPicking() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
					var obj = this.scene.pickResults[i][0];
					if (obj) {
						var customId = this.scene.pickResults[i][1];
						console.log("Picked object: " + obj + ", with pick id " + customId);						
					}
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
	}

	display(){
        this.logPicking();
		for(let i = 0; i < this.tiles.length; i++){
            this.scene.registerForPick(i + 1, this.tiles[i]);
            this.tiles[i].display();
        }
        this.scene.clearPickRegistration();
    }
}