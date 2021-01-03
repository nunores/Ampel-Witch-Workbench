const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 8;
/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];


        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        //Parse animations block
        index = nodeNames.indexOf("animations");
        if (index != -1) {
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        //Parse spritesheets
        index = nodeNames.indexOf("spritesheets");
        if (index != -1) {
            if ((error = this.parseSpriteSheets(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if (rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        this.scene.currCamera = viewsNode.attributes[0].value;

        for (var i = 0; i < viewsNode.children.length; i++) {
            var attNames = [];

            for (var n = 0; n < viewsNode.children[i].attributes.length; n++) {
                attNames.push(viewsNode.children[i].attributes[n].nodeName);
            }

            // Extracting information on perspective, near, far and angle

            if (viewsNode.children[i].nodeName == "perspective") {
                var nearIndex = attNames.indexOf("near");
                var farIndex = attNames.indexOf("far");
                var angleIndex = attNames.indexOf("angle");

                if (nearIndex == -1 || farIndex == -1 || angleIndex == -1)
                    return "Missing arguments";

                var nearValue = Number(viewsNode.children[i].attributes[nearIndex].value);
                var farValue = Number(viewsNode.children[i].attributes[farIndex].value);
                var angleValue = Number(viewsNode.children[i].attributes[angleIndex].value);

                // Extracting information on to and from

                var childrenNames = [];

                for (var j = 0; j < viewsNode.children[i].children.length; j++) {
                    childrenNames.push(viewsNode.children[i].children[j].nodeName);
                }

                var fromIndex = childrenNames.indexOf("from");
                var toIndex = childrenNames.indexOf("to");

                if (fromIndex == -1 || toIndex == -1)
                    return "Missing children";

                // Extracting information on coordinates of from

                var coordinatesFromNames = [];

                for (var j = 0; j < viewsNode.children[i].children[fromIndex].attributes.length; j++) {
                    coordinatesFromNames.push(viewsNode.children[i].children[fromIndex].attributes[j].nodeName);
                }

                var fromXIndex = coordinatesFromNames.indexOf("x");
                var fromYIndex = coordinatesFromNames.indexOf("y");
                var fromZIndex = coordinatesFromNames.indexOf("z");

                if (fromXIndex == -1 || fromYIndex == -1 || fromZIndex == -1)
                    return "Missing arguments";

                var fromXValue = Number(viewsNode.children[i].children[fromIndex].attributes[fromXIndex].value);
                var fromYValue = Number(viewsNode.children[i].children[fromIndex].attributes[fromYIndex].value);
                var fromZValue = Number(viewsNode.children[i].children[fromIndex].attributes[fromZIndex].value);

                // Extracting information on coordinates of to

                var coordinatesToNames = [];

                for (var j = 0; j < viewsNode.children[i].children[toIndex].attributes.length; j++) {
                    coordinatesToNames.push(viewsNode.children[i].children[toIndex].attributes[j].nodeName);
                }

                var toXIndex = coordinatesToNames.indexOf("x");
                var toYIndex = coordinatesToNames.indexOf("y");
                var toZIndex = coordinatesToNames.indexOf("z");

                if (toXIndex == -1 || toYIndex == -1 || toZIndex == -1)
                    return "Missing arguments";

                var toXValue = Number(viewsNode.children[i].children[toIndex].attributes[toXIndex].value);
                var toYValue = Number(viewsNode.children[i].children[toIndex].attributes[toYIndex].value);
                var toZValue = Number(viewsNode.children[i].children[toIndex].attributes[toZIndex].value);


                var camera = new CGFcamera(angleValue * DEGREE_TO_RAD, nearValue, farValue, vec3.fromValues(fromXValue, fromYValue, fromZValue), vec3.fromValues(toXValue, toYValue, toZValue));
            }

            else {
                if (viewsNode.children[i].nodeName == "ortho") {

                    // Extracting information on ortho parameters

                    var nearIndex = attNames.indexOf("near");
                    var farIndex = attNames.indexOf("far");
                    var leftIndex = attNames.indexOf("left");
                    var rightIndex = attNames.indexOf("right");
                    var topIndex = attNames.indexOf("top");
                    var bottomIndex = attNames.indexOf("bottom");

                    if (nearIndex == -1 || farIndex == -1 || leftIndex == -1 || rightIndex == -1 || topIndex == -1 || bottomIndex == -1)
                        return "Missing arguments";

                    var nearValue = Number(viewsNode.children[i].attributes[nearIndex].value);
                    var farValue = Number(viewsNode.children[i].attributes[farIndex].value);
                    var leftValue = Number(viewsNode.children[i].attributes[leftIndex].value);
                    var rightValue = Number(viewsNode.children[i].attributes[rightIndex].value);
                    var topValue = Number(viewsNode.children[i].attributes[topIndex].value);
                    var bottomValue = Number(viewsNode.children[i].attributes[bottomIndex].value);

                    var childrenNames = [];

                    for (var j = 0; j < viewsNode.children[i].children.length; j++) {
                        childrenNames.push(viewsNode.children[i].children[j].nodeName);
                    }

                    // Extracting information on to, from and potentially up

                    var fromIndex = childrenNames.indexOf("from");
                    var toIndex = childrenNames.indexOf("to");
                    var upIndex = childrenNames.indexOf("up");

                    if (fromIndex == -1 || toIndex == -1)
                        return "Missing children";

                    // Extracting information on coordinates of from

                    var coordinatesFromNames = [];

                    for (var j = 0; j < viewsNode.children[i].children[fromIndex].attributes.length; j++) {
                        coordinatesFromNames.push(viewsNode.children[i].children[fromIndex].attributes[j].nodeName);
                    }

                    var fromXIndex = coordinatesFromNames.indexOf("x");
                    var fromYIndex = coordinatesFromNames.indexOf("y");
                    var fromZIndex = coordinatesFromNames.indexOf("z");

                    if (fromXIndex == -1 || fromYIndex == -1 || fromZIndex == -1)
                        return "Missing arguments";

                    var fromXValue = Number(viewsNode.children[i].children[fromIndex].attributes[fromXIndex].value);
                    var fromYValue = Number(viewsNode.children[i].children[fromIndex].attributes[fromYIndex].value);
                    var fromZValue = Number(viewsNode.children[i].children[fromIndex].attributes[fromZIndex].value);


                    // Extracting information on coordinates of to

                    var coordinatesToNames = [];

                    for (var j = 0; j < viewsNode.children[i].children[toIndex].attributes.length; j++) {
                        coordinatesToNames.push(viewsNode.children[i].children[toIndex].attributes[j].nodeName);
                    }

                    var toXIndex = coordinatesToNames.indexOf("x");
                    var toYIndex = coordinatesToNames.indexOf("y");
                    var toZIndex = coordinatesToNames.indexOf("z");

                    if (toXIndex == -1 || toYIndex == -1 || toZIndex == -1)
                        return "Missing arguments";

                    var toXValue = Number(viewsNode.children[i].children[toIndex].attributes[toXIndex].value);
                    var toYValue = Number(viewsNode.children[i].children[toIndex].attributes[toYIndex].value);
                    var toZValue = Number(viewsNode.children[i].children[toIndex].attributes[toZIndex].value);

                    var coordinatesUpNames = [];

                    // Setting default values
                    if (upIndex == -1) {
                        var upXValue = 0;
                        var upYValue = 1;
                        var upZValue = 0;
                    }
                    else {
                        // Extracting information on up values if tag exists

                        for (var j = 0; j < viewsNode.children[i].children[upIndex].attributes.length; j++) {
                            coordinatesUpNames.push(viewsNode.children[i].children[upIndex].attributes[j].nodeName);
                        }

                        var upXIndex = coordinatesUpNames.indexOf("x");
                        var upYIndex = coordinatesUpNames.indexOf("y");
                        var upZIndex = coordinatesUpNames.indexOf("z");

                        if (upXIndex == -1 || upYIndex == -1 || upZIndex == -1)
                            return "Missing arguments";

                        var upXValue = Number(viewsNode.children[i].children[upIndex].attributes[upXIndex].value);
                        var upYValue = Number(viewsNode.children[i].children[upIndex].attributes[upYIndex].value);
                        var upZValue = Number(viewsNode.children[i].children[upIndex].attributes[upZIndex].value);
                    }

                    var camera = new CGFcameraOrtho(leftValue, rightValue, bottomValue, topValue, nearValue, farValue,
                        vec3.fromValues(fromXValue, fromYValue, fromZValue), vec3.fromValues(toXValue, toYValue, toZValue), vec3.fromValues(upXValue, upYValue, upZValue));

                }
            }

            // Adding to list of cameras
            this.scene.cameras[viewsNode.children[i].attributes[0].value] = camera;

        }

        this.scene.camera = this.scene.cameras[this.scene.currCamera];
        this.scene.interface.setActiveCamera(this.scene.cameras[this.scene.currCamera]);

        this.log("Parsed Views.");

        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        if (ambientIndex == -1 || backgroundIndex == -1)
            return "Missing children";

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        for (var i = 0; i < texturesNode.children.length; i++) {
            this.scene.textures[texturesNode.children[i].id] = texturesNode.children[i].attributes[1].value;
        }

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";


            var nodeNames = [];

            // Extracting information on material parameters

            for (var j = 0; j < children[i].children.length; j++) {
                nodeNames.push(children[i].children[j].nodeName);
            }


            var shininessIndex = nodeNames.indexOf("shininess");
            var specularIndex = nodeNames.indexOf("specular");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var ambientIndex = nodeNames.indexOf("ambient");
            var emissiveIndex = nodeNames.indexOf("emissive");

            if (shininessIndex == -1 || specularIndex == -1 || diffuseIndex == -1 || ambientIndex == -1 || emissiveIndex == -1)
                return "Missing children";

            var shininessValue = Number(children[i].children[shininessIndex].attributes[0].value);

            // Specular Indexes and Values

            var nodeNames = [];

            for (var j = 0; j < children[i].children[specularIndex].attributes.length; j++) {
                nodeNames.push(children[i].children[specularIndex].attributes[j].nodeName);
            }

            var specularIndexR = nodeNames.indexOf("r");
            var specularIndexG = nodeNames.indexOf("g");
            var specularIndexB = nodeNames.indexOf("b");
            var specularIndexA = nodeNames.indexOf("a");

            if (specularIndexR == -1 || specularIndexG == -1 || specularIndexB == -1 || specularIndexA == -1)
                return "Missing arguments";

            var specularValueR = Number(children[i].children[specularIndex].attributes[specularIndexR].value);
            var specularValueG = Number(children[i].children[specularIndex].attributes[specularIndexG].value);
            var specularValueB = Number(children[i].children[specularIndex].attributes[specularIndexB].value);
            var specularValueA = Number(children[i].children[specularIndex].attributes[specularIndexA].value);

            // Diffuse Indexes and Values

            var nodeNames = [];

            for (var j = 0; j < children[i].children[diffuseIndex].attributes.length; j++) {
                nodeNames.push(children[i].children[diffuseIndex].attributes[j].nodeName);
            }

            var diffuseIndexR = nodeNames.indexOf("r");
            var diffuseIndexG = nodeNames.indexOf("g");
            var diffuseIndexB = nodeNames.indexOf("b");
            var diffuseIndexA = nodeNames.indexOf("a");

            if (diffuseIndexR == -1 || diffuseIndexG == -1 || diffuseIndexB == -1 || diffuseIndexA == -1)
                return "Missing arguments";

            var diffuseValueR = Number(children[i].children[diffuseIndex].attributes[diffuseIndexR].value);
            var diffuseValueG = Number(children[i].children[diffuseIndex].attributes[diffuseIndexG].value);
            var diffuseValueB = Number(children[i].children[diffuseIndex].attributes[diffuseIndexB].value);
            var diffuseValueA = Number(children[i].children[diffuseIndex].attributes[diffuseIndexA].value);

            // Ambient Indexes and Values

            var nodeNames = [];

            for (var j = 0; j < children[i].children[ambientIndex].attributes.length; j++) {
                nodeNames.push(children[i].children[ambientIndex].attributes[j].nodeName);
            }

            var ambientIndexR = nodeNames.indexOf("r");
            var ambientIndexG = nodeNames.indexOf("g");
            var ambientIndexB = nodeNames.indexOf("b");
            var ambientIndexA = nodeNames.indexOf("a");

            if (ambientIndexR == -1 || ambientIndexG == -1 || ambientIndexB == -1 || ambientIndexA == -1)
                return "Missing arguments";

            var ambientValueR = Number(children[i].children[ambientIndex].attributes[ambientIndexR].value);
            var ambientValueG = Number(children[i].children[ambientIndex].attributes[ambientIndexG].value);
            var ambientValueB = Number(children[i].children[ambientIndex].attributes[ambientIndexB].value);
            var ambientValueA = Number(children[i].children[ambientIndex].attributes[ambientIndexA].value);

            // Emissive Indexes and Values

            var nodeNames = [];

            for (var j = 0; j < children[i].children[emissiveIndex].attributes.length; j++) {
                nodeNames.push(children[i].children[emissiveIndex].attributes[j].nodeName);
            }

            var emissiveIndexR = nodeNames.indexOf("r");
            var emissiveIndexG = nodeNames.indexOf("g");
            var emissiveIndexB = nodeNames.indexOf("b");
            var emissiveIndexA = nodeNames.indexOf("a");

            if (emissiveIndexR == -1 || emissiveIndexG == -1 || emissiveIndexB == -1 || emissiveIndexA == -1)
                return "Missing arguments";

            var emissiveValueR = Number(children[i].children[emissiveIndex].attributes[emissiveIndexR].value);
            var emissiveValueG = Number(children[i].children[emissiveIndex].attributes[emissiveIndexG].value);
            var emissiveValueB = Number(children[i].children[emissiveIndex].attributes[emissiveIndexB].value);
            var emissiveValueA = Number(children[i].children[emissiveIndex].attributes[emissiveIndexA].value);

            var material = new CGFappearance(this.scene);

            material.setShininess(shininessValue);
            material.setAmbient(ambientValueR, ambientValueG, ambientValueB, ambientValueA);
            material.setDiffuse(diffuseValueR, diffuseValueG, diffuseValueB, diffuseValueA);
            material.setEmission(emissiveValueR, emissiveValueG, emissiveValueB, emissiveValueA);
            material.setSpecular(specularValueR, specularValueG, specularValueB, specularValueA);

            this.scene.materials[materialID] = material;

        }
        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <spritesheets> node.
     * @param {animations block element} spriteSheetsNode
     */
    parseSpriteSheets(spriteSheetsNode)
    {
        let children = spriteSheetsNode.children;

        for (let i = 0; i < children.length; i++)
        {

            for (let n = 0; n < this.scene.spritesheets.length; n++) {

                // Verifying repeated IDs

                if (children[i].attributes[0].value == this.scene.spritesheets[n])
                    return "Repeated IDs";        
            }

            let attNames = [];
            for (let n = 0; n < children[i].attributes.length; n++)
            {
                attNames.push(children[i].attributes[n].name);
            }
            
            let idIndex = attNames.indexOf("id");
            let pathIndex = attNames.indexOf("path");
            let sizeMIndex = attNames.indexOf("sizeM")
            let sizeNIndex = attNames.indexOf("sizeN");

            if ((idIndex == -1) || (pathIndex == -1) || (sizeMIndex == -1) || (sizeNIndex == -1))
                return "Missing children";

            let idValue = children[i].attributes[idIndex].nodeValue;
            let pathValue = children[i].attributes[pathIndex].nodeValue;
            let sizeMValue = Number(children[i].attributes[sizeMIndex].nodeValue);
            let sizeNValue = Number(children[i].attributes[sizeNIndex].nodeValue);


            let spritesheet = [pathValue, sizeMValue, sizeNValue];
            this.scene.spritesheets[idValue] = spritesheet;
        }

    }

    /**
     * Parses the <animations> node.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {

        var children = animationsNode.children;

        // Iterating through animations
        for (var i = 0; i < children.length; i++) {

            for (var n = 0; n < this.scene.animations.length; n++) {

                // Verifying repeated IDs

                if (children[i].attributes[0].value == this.scene.animations[n])
                    return "Repeated IDs";        
            }

            var animationID = children[i].attributes[0].value;
            var keyFrames = [];
            // Building each keyFrame

            for (var j = 0; j < children[i].children.length; j++) {
                var keyFrame = [];

                var instant = Number(children[i].children[j].attributes[0].value);

                keyFrame.push(instant);

                // Adding translation elements to keyFrame

                var attNames = [];

                for (var k = 0; k < children[i].children[j].children[0].attributes.length; k++) {
                    attNames.push(children[i].children[j].children[0].attributes[k].nodeName);
                }

                var translationXIndex = attNames.indexOf("x");
                var translationYIndex = attNames.indexOf("y");
                var translationZIndex = attNames.indexOf("z");

                var translationXValue = Number(children[i].children[j].children[0].attributes[translationXIndex].value);
                var translationYValue = Number(children[i].children[j].children[0].attributes[translationYIndex].value);
                var translationZValue = Number(children[i].children[j].children[0].attributes[translationZIndex].value);

                keyFrame.push(vec3.fromValues(translationXValue, translationYValue, translationZValue));


                // Adding rotation elements to keyFrame


                var attNames = [];

                for (var k = 0; k < children[i].children[j].children[1].attributes.length; k++) {
                    attNames.push(children[i].children[j].children[1].attributes[k].nodeName);
                }

                var rotationXAxisIndex = attNames.indexOf("axis");
                var rotationXAngleIndex = attNames.indexOf("angle");

                var rotationXAxisValue = Number(children[i].children[j].children[1].attributes[rotationXAxisIndex].value);
                var rotationXAngleValue = Number(children[i].children[j].children[1].attributes[rotationXAngleIndex].value);

                var attNames = [];

                for (var k = 0; k < children[i].children[j].children[2].attributes.length; k++) {
                    attNames.push(children[i].children[j].children[2].attributes[k].nodeName);
                }

                var rotationYAxisIndex = attNames.indexOf("axis");
                var rotationYAngleIndex = attNames.indexOf("angle");

                var rotationYAxisValue = Number(children[i].children[j].children[2].attributes[rotationYAxisIndex].value);
                var rotationYAngleValue = Number(children[i].children[j].children[2].attributes[rotationYAngleIndex].value);

                var attNames = [];

                for (var k = 0; k < children[i].children[j].children[3].attributes.length; k++) {
                    attNames.push(children[i].children[j].children[3].attributes[k].nodeName);
                }

                var rotationZAxisIndex = attNames.indexOf("axis");
                var rotationZAngleIndex = attNames.indexOf("angle");

                var rotationZAxisValue = Number(children[i].children[j].children[3].attributes[rotationZAxisIndex].value);
                var rotationZAngleValue = Number(children[i].children[j].children[3].attributes[rotationZAngleIndex].value);

                keyFrame.push(vec3.fromValues(rotationXAngleValue*DEGREE_TO_RAD, rotationYAngleValue*DEGREE_TO_RAD, rotationZAngleValue*DEGREE_TO_RAD));

                // Adding scale elements to keyFrame

                var attNames = [];

                for (var k = 0; k < children[i].children[j].children[4].attributes.length; k++) {
                    attNames.push(children[i].children[j].children[4].attributes[k].nodeName);
                }

                var scaleSXIndex = attNames.indexOf("sx");
                var scaleSYIndex = attNames.indexOf("sy");
                var scaleSZIndex = attNames.indexOf("sz");

                var scaleSXValue = Number(children[i].children[j].children[4].attributes[scaleSXIndex].value);
                var scaleSYValue = Number(children[i].children[j].children[4].attributes[scaleSYIndex].value);
                var scaleSZValue = Number(children[i].children[j].children[4].attributes[scaleSZIndex].value);


                keyFrame.push(vec3.fromValues(scaleSXValue, scaleSYValue, scaleSZValue));
                
                keyFrames.push(keyFrame);
            }

            var keyFrameAnimation = new KeyframeAnimation(keyFrames, this.scene);
            this.scene.animations[animationID] = keyFrameAnimation;

        }
        

        this.log("Parsed animations");
        return null;
    }


    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
    parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");

            if (materialIndex == -1 || textureIndex == -1 || descendantsIndex == -1)
                return "Missing children";

            if (transformationsIndex == -1)
                this.onXMLMinorError("Missing transformations");

            this.scene.nodes[this.reader.getString(children[i], 'id')] = children[i];

        }

        // Adding and building components
        for (const nodeId in this.scene.nodes) {
            const node = this.scene.nodes[nodeId];
            var component = new MyComponent(this.scene, nodeId);
            grandChildren = node.children;
            nodeNames = [];

            // Extracting information on nodes' tags

            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var descendantsIndex = nodeNames.indexOf("descendants");
            var textureIndex = nodeNames.indexOf("texture");
            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var animationIndex = nodeNames.indexOf("animationref");

            var amplificationsNames = [];

            if (node.children[textureIndex].children.length == 0) {

                this.onXMLMinorError("Missing amplifications");
                var afsValue = 1;
                var aftValue = 1;
            }
            else {

                // Extracting afs and aft values

                for (var p = 0; p < node.children[textureIndex].children[0].attributes.length; p++) {
                    amplificationsNames.push(node.children[textureIndex].children[0].attributes[p].nodeName);
                }

                var afsIndex = amplificationsNames.indexOf("afs");
                var aftIndex = amplificationsNames.indexOf("aft");

                if (afsIndex == -1 || aftIndex == -1)
                    return "Missing arguments";

                var afsValue = Number(node.children[textureIndex].children[0].attributes[afsIndex].value);
                var aftValue = Number(node.children[textureIndex].children[0].attributes[aftIndex].value);
            }

            component.setAmplifications(afsValue, aftValue);

            if (animationIndex != -1)
            {
                component.setAnimation(this.scene.animations[node.children[animationIndex].attributes[0].nodeValue]);
            }

            
            // Handling Transformations

            // Indexes 
            var xIndex = null;
            var yIndex = null;
            var zIndex = null;

            var axisIndex = null;
            var angleIndex = null;

            var axisValue = null;
            var angleValue = null;

            var sxIndex = null;
            var syIndex = null;
            var szIndex = null;

            // Values

            var sxValue = null;
            var syValue = null;
            var szValue = null;

            var xValue = null;
            var yValue = null;
            var zValue = null;

            var rotationXValue = null;
            var rotationYValue = null;
            var rotationZValue = null;

            var matrix = mat4.create();

            if (transformationsIndex >= 0) {
                for (var i = 0; i < node.children[transformationsIndex].children.length; i++) {

                    //Handling translation
                    if (node.children[transformationsIndex].children[i].nodeName == "translation") {
                        var attributeNames = [];
                        var attributes = [];
                        attributes = node.children[transformationsIndex].children[i].attributes;
                        for (var j = 0; j < attributes.length; j++) {
                            attributeNames.push(attributes[j].name);
                        }
                        xIndex = attributeNames.indexOf("x");
                        yIndex = attributeNames.indexOf("y");
                        zIndex = attributeNames.indexOf("z");

                        if (xIndex == -1 || yIndex == -1 || zIndex == -1)
                            return "Missing arguments";

                        xValue = Number(node.children[transformationsIndex].children[i].attributes[xIndex].value);
                        yValue = Number(node.children[transformationsIndex].children[i].attributes[yIndex].value);
                        zValue = Number(node.children[transformationsIndex].children[i].attributes[zIndex].value);

                        matrix = mat4.translate(matrix, matrix, [xValue, yValue, zValue]);
                    }
                    //Handling rotation
                    else if (node.children[transformationsIndex].children[i].nodeName == "rotation") {
                        var attributeNames = [];
                        var attributes = [];
                        attributes = node.children[transformationsIndex].children[i].attributes;
                        for (var j = 0; j < attributes.length; j++) {
                            attributeNames.push(attributes[j].name);
                        }
                        axisIndex = attributeNames.indexOf("axis");
                        angleIndex = attributeNames.indexOf("angle");

                        if (axisIndex == -1 || angleIndex == -1)
                            return "Missing arguments";

                        axisValue = node.children[transformationsIndex].children[i].attributes[axisIndex].value;
                        angleValue = Number(node.children[transformationsIndex].children[i].attributes[angleIndex].value);
                        if (axisValue == "x") {
                            rotationXValue = 1;
                            rotationYValue = 0;
                            rotationZValue = 0;
                        }
                        if (axisValue == "y") {
                            rotationXValue = 0;
                            rotationYValue = 1;
                            rotationZValue = 0;
                        }
                        if (axisValue == "z") {
                            rotationXValue = 0;
                            rotationYValue = 0;
                            rotationZValue = 1;
                        }

                        matrix = mat4.rotate(matrix, matrix, angleValue * DEGREE_TO_RAD, [rotationXValue, rotationYValue, rotationZValue]);
                    }
                    //Handling scale
                    else if (node.children[transformationsIndex].children[i].nodeName == "scale") {
                        var attributeNames = [];
                        var attributes = [];
                        attributes = node.children[transformationsIndex].children[i].attributes;
                        for (var j = 0; j < attributes.length; j++) {
                            attributeNames.push(attributes[j].name);
                        }
                        sxIndex = attributeNames.indexOf("sx");
                        syIndex = attributeNames.indexOf("sy");
                        szIndex = attributeNames.indexOf("sz");

                        if (syIndex == -1 || sxIndex == -1 || szIndex == -1)
                            return "Missing arguments";

                        sxValue = Number(node.children[transformationsIndex].children[i].attributes[sxIndex].value);
                        syValue = Number(node.children[transformationsIndex].children[i].attributes[syIndex].value);
                        szValue = Number(node.children[transformationsIndex].children[i].attributes[szIndex].value);

                        matrix = mat4.scale(matrix, matrix, [sxValue, syValue, szValue]);
                    }
                }
            }

            component.setTransformations(matrix);

            // Setting Texture
            if (node.children[textureIndex].attributes.length != 1)
                return "Missing/Too many arguments";

            var texture_key = node.children[textureIndex].attributes[0].value;

            if (typeof texture_key !== 'string') {
                return "Missing id";
            }

            if (texture_key == "clear")
                component.setTexturePath("clear");
            else
                component.setTexturePath(this.scene.textures[texture_key]);

            // Setting Material

            if (node.children[materialIndex].attributes.length != 1)
                return "Missing/Too many arguments";

            if (typeof node.children[materialIndex].id !== 'string') {
                return "Missing id";
            }

            if (node.children[materialIndex].id != "null") {
                component.setMaterial(this.scene.materials[node.children[materialIndex].id]);
            }
            else {
                component.setMaterial(null);
            }

            // Setting node order and children

            for (var l = 0; l < node.children[descendantsIndex].children.length; l++) {
                var type = node.children[descendantsIndex].children[l].nodeName;

                if (type == "leaf") {
                    let primitive = node.children[descendantsIndex].children[l].attributes[0].value;

                    //Handling sphere
                    if (primitive == "sphere") {
                        var attributeNames = [];
                        var attributes = [];
                        attributes = node.children[descendantsIndex].children[l].attributes;
                        for (var j = 0; j < attributes.length; j++) {
                            attributeNames.push(attributes[j].name);
                        }

                        let radiusIndex = attributeNames.indexOf("radius");
                        let slicesIndex = attributeNames.indexOf("slices");
                        let stacksIndex = attributeNames.indexOf("stacks");

                        if (radiusIndex == -1 || slicesIndex == -1 || stacksIndex == -1)
                            return "Missing arguments";

                        var radius = Number(node.children[descendantsIndex].children[l].attributes[radiusIndex].nodeValue);
                        var slices = Number(node.children[descendantsIndex].children[l].attributes[slicesIndex].nodeValue);
                        var stacks = Number(node.children[descendantsIndex].children[l].attributes[stacksIndex].nodeValue);

                        component.addChildren(new MySphere(this.scene, radius, slices, stacks));

                    }
                    //Handling cylinder
                    else if (primitive == "cylinder") {
                        var attributeNames = [];
                        var attributes = [];
                        attributes = node.children[descendantsIndex].children[l].attributes;
                        for (var j = 0; j < attributes.length; j++) {
                            attributeNames.push(attributes[j].name);
                        }

                        let heightIndex = attributeNames.indexOf("height");
                        let topRadiusIndex = attributeNames.indexOf("topRadius");
                        let bottomRadiusIndex = attributeNames.indexOf("bottomRadius");
                        let slicesIndex = attributeNames.indexOf("slices");
                        let stacksIndex = attributeNames.indexOf("stacks");

                        if (heightIndex == -1 || topRadiusIndex == -1 || bottomRadiusIndex == -1 || slicesIndex == -1 || stacksIndex == -1)
                            return "Missing arguments";

                        var height = parseFloat(node.children[descendantsIndex].children[l].attributes[heightIndex].nodeValue);
                        var topRadius = parseFloat(node.children[descendantsIndex].children[l].attributes[topRadiusIndex].nodeValue)
                        var bottomRadius = parseFloat(node.children[descendantsIndex].children[l].attributes[bottomRadiusIndex].nodeValue);
                        var slices = Number(node.children[descendantsIndex].children[l].attributes[slicesIndex].nodeValue);
                        var stacks = Number(node.children[descendantsIndex].children[l].attributes[stacksIndex].nodeValue);

                        component.addChildren(new MyCylinder(this.scene, slices, stacks, height, bottomRadius, topRadius));

                    }
                    //Handling rectangle
                    else if (primitive == "rectangle") {
                        var attributeNames = [];
                        var attributes = [];
                        attributes = node.children[descendantsIndex].children[l].attributes;
                        for (var j = 0; j < attributes.length; j++) {
                            attributeNames.push(attributes[j].name);
                        }

                        let x1Index = attributeNames.indexOf("x1");
                        let y1Index = attributeNames.indexOf("y1");
                        let x2Index = attributeNames.indexOf("x2");
                        let y2Index = attributeNames.indexOf("y2");

                        if (x1Index == -1 || y1Index == -1 || x2Index == -1 || y2Index == -1)
                            return "Missing arguments";

                        var x1 = Number(node.children[descendantsIndex].children[l].attributes[x1Index].nodeValue);
                        var y1 = Number(node.children[descendantsIndex].children[l].attributes[y1Index].nodeValue);
                        var x2 = Number(node.children[descendantsIndex].children[l].attributes[x2Index].nodeValue);
                        var y2 = Number(node.children[descendantsIndex].children[l].attributes[y2Index].nodeValue);

                        component.addChildren(new MyRectangle(this.scene, x1, y1, x2, y2));
                    }
                    //Handling triangle
                    else if (primitive == "triangle") {
                        var attributeNames = [];
                        var attributes = [];
                        attributes = node.children[descendantsIndex].children[l].attributes;
                        for (var j = 0; j < attributes.length; j++) {
                            attributeNames.push(attributes[j].name);
                        }

                        let x1Index = attributeNames.indexOf("x1");
                        let y1Index = attributeNames.indexOf("y1");
                        let x2Index = attributeNames.indexOf("x2");
                        let y2Index = attributeNames.indexOf("y2");
                        let x3Index = attributeNames.indexOf("x3");
                        let y3Index = attributeNames.indexOf("y3");

                        if (x1Index == -1 || y1Index == -1 || x2Index == -1 || y2Index == -1 || x3Index == -1 || y3Index == -1)
                            return "Missing arguments";

                        var x1 = Number(node.children[descendantsIndex].children[l].attributes[x1Index].nodeValue);
                        var y1 = Number(node.children[descendantsIndex].children[l].attributes[y1Index].nodeValue);
                        var x2 = Number(node.children[descendantsIndex].children[l].attributes[x2Index].nodeValue);
                        var y2 = Number(node.children[descendantsIndex].children[l].attributes[y2Index].nodeValue);
                        var x3 = Number(node.children[descendantsIndex].children[l].attributes[x3Index].nodeValue);
                        var y3 = Number(node.children[descendantsIndex].children[l].attributes[y3Index].nodeValue);

                        component.addChildren(new MyTriangle(this.scene, x1, y1, 0, x2, y2, 0, x3, y3, 0));
                    }
                    //Handling torus
                    else if (primitive == "torus") {
                        var attributeNames = [];
                        var attributes = [];
                        attributes = node.children[descendantsIndex].children[l].attributes;
                        for (var j = 0; j < attributes.length; j++) {
                            attributeNames.push(attributes[j].name);
                        }

                        let innerIndex = attributeNames.indexOf("inner");
                        let outerIndex = attributeNames.indexOf("outer");
                        let slicesIndex = attributeNames.indexOf("slices");
                        let loopsIndex = attributeNames.indexOf("loops");

                        if (innerIndex == -1 || outerIndex == -1 || slicesIndex == -1 || loopsIndex == -1)
                            return "Missing arguments";

                        var inner = Number(node.children[descendantsIndex].children[l].attributes[innerIndex].nodeValue);
                        var outer = Number(node.children[descendantsIndex].children[l].attributes[outerIndex].nodeValue);
                        var slices = Number(node.children[descendantsIndex].children[l].attributes[slicesIndex].nodeValue);
                        var loops = Number(node.children[descendantsIndex].children[l].attributes[loopsIndex].nodeValue);


                        component.addChildren(new MyTorus(this.scene, inner, outer, slices, loops));
                    }
                    // Handling Spritesheets
                    else if (primitive == "spritetext") {
                        
                        var attributeNames = [];
                        var attributes = [];
                        attributes = node.children[descendantsIndex].children[l].attributes;
                        for (var j = 0; j < attributes.length; j++) {
                            attributeNames.push(attributes[j].name);
                        }
                    
                        let textIndex = attributeNames.indexOf("text");

                        if (textIndex == -1)
                            return "Missing arguments";
                        
                        let text = node.children[descendantsIndex].children[l].attributes[textIndex].nodeValue;
                    
                        component.addChildren(new MySpriteText(this.scene, text));
                    }
                    
                    else if (primitive == "spriteanim") {
                        
                        var attributeNames = [];
                        var attributes = [];
                        attributes = node.children[descendantsIndex].children[l].attributes;
                        for (var j = 0; j < attributes.length; j++) {
                            attributeNames.push(attributes[j].name);
                        }
                    
                        let ssidIndex = attributeNames.indexOf("ssid");
                        let startCellIndex = attributeNames.indexOf("startCell");
                        let endCellIndex = attributeNames.indexOf("endCell");
                        let durationIndex = attributeNames.indexOf("duration");
                        
                        if (ssidIndex == -1 || startCellIndex == -1 || endCellIndex == -1 || durationIndex == -1)
                        return "Missing arguments";
                        
                        let ssidValue = node.children[descendantsIndex].children[l].attributes[ssidIndex].nodeValue;
                        let startCellValue = Number(node.children[descendantsIndex].children[l].attributes[startCellIndex].nodeValue);
                        let endCellValue = Number(node.children[descendantsIndex].children[l].attributes[endCellIndex].nodeValue);
                        let durationValue = Number(node.children[descendantsIndex].children[l].attributes[durationIndex].nodeValue);

                        let texture = this.scene.spritesheets[ssidValue][0];
                        let sizeM = this.scene.spritesheets[ssidValue][1];
                        let sizeN = this.scene.spritesheets[ssidValue][2];

                        let spriteAnimation = new MySpriteAnimation(this.scene, texture, sizeM, sizeN, durationValue, startCellValue, endCellValue)

                        component.addChildren(spriteAnimation);
                        this.scene.spriteAnimations.push(spriteAnimation);
                    }

                    else if(primitive == "plane"){
                        var attributeNames = [];
                        var attributes = [];
                        attributes = node.children[descendantsIndex].children[l].attributes;
                        for (var j = 0; j < attributes.length; j++) {
                            attributeNames.push(attributes[j].name);
                        }

                        let npartsUIndex = attributeNames.indexOf("npartsU");
                        let npartsVIndex = attributeNames.indexOf("npartsV");
                        let npartsUValue = Number(node.children[descendantsIndex].children[l].attributes[npartsUIndex].nodeValue);
                        let npartsVValue = Number(node.children[descendantsIndex].children[l].attributes[npartsVIndex].nodeValue);

                            
                        if (npartsUIndex == -1 || npartsVIndex == -1)
                            return "Missing arguments";

                        let plane = new Plane(this.scene, npartsUValue, npartsVValue);
                        
                        component.addChildren(plane);
                    }

                    else if(primitive == "patch"){

                        var attributeNames = [];
                        var attributes = [];
                        attributes = node.children[descendantsIndex].children[l].attributes;
                        for (var j = 0; j < attributes.length; j++) {
                            attributeNames.push(attributes[j].name);
                        }

                        let npointsUIndex = attributeNames.indexOf("npointsU");
                        let npointsVIndex = attributeNames.indexOf("npointsV");
                        let npartsUIndex = attributeNames.indexOf("npartsV");
                        let npartsVIndex = attributeNames.indexOf("npartsV");
                        let npointsUValue = Number(node.children[descendantsIndex].children[l].attributes[npointsUIndex].nodeValue);
                        let npointsVValue = Number(node.children[descendantsIndex].children[l].attributes[npointsVIndex].nodeValue);
                        let npartsUValue = Number(node.children[descendantsIndex].children[l].attributes[npartsUIndex].nodeValue);
                        let npartsVValue = Number(node.children[descendantsIndex].children[l].attributes[npartsVIndex].nodeValue);
                            
                        if (npartsUIndex == -1 || npartsVIndex == -1 || npointsUIndex == -1 || npointsVIndex == -1)
                            return "Missing arguments";

                        if(npointsUValue*npointsVValue != node.children[descendantsIndex].children[l].children.length)
                            return "Too many/little controlpoints";
                            
                        let array = [];
                        for (let h = 0; h < node.children[descendantsIndex].children[l].children.length; h++) {
                            let controlPoint = [];
                            let attributesNames = [];
                            let attributes = node.children[descendantsIndex].children[l].children[h].attributes;
                            for(let m = 0; m < attributes.length; m++)
                            {
                                attributesNames.push(attributes[m].name);
                            }
                            
                            let xIndex = attributesNames.indexOf("x");
                            let yIndex = attributesNames.indexOf("y");
                            let zIndex = attributesNames.indexOf("z");
                            let xValue = Number(node.children[descendantsIndex].children[l].children[h].attributes[xIndex].value);
                            let yValue = Number(node.children[descendantsIndex].children[l].children[h].attributes[yIndex].value);
                            let zValue = Number(node.children[descendantsIndex].children[l].children[h].attributes[zIndex].value);
                            controlPoint.push(xValue);
                            controlPoint.push(yValue);
                            controlPoint.push(zValue);
                            array.push(controlPoint);
                        }                 
                        
                        let patch = new Patch(this.scene, npointsUValue, npointsVValue, npartsUValue, npartsVValue, array);
                        component.addChildren(patch);
                    }

                    else if (primitive == "defbarrel") {
                        
                        var attributeNames = [];
                        var attributes = [];
                        attributes = node.children[descendantsIndex].children[l].attributes;
                        for (var j = 0; j < attributes.length; j++) {
                            attributeNames.push(attributes[j].name);
                        }

                        let baseIndex = attributeNames.indexOf("base");
                        let middleIndex = attributeNames.indexOf("middle");
                        let heightIndex = attributeNames.indexOf("height");
                        let slicesIndex = attributeNames.indexOf("slices");
                        let stacksIndex = attributeNames.indexOf("stacks");

                        let baseValue = Number(node.children[descendantsIndex].children[l].attributes[baseIndex].nodeValue);
                        let middleValue = Number(node.children[descendantsIndex].children[l].attributes[middleIndex].nodeValue);
                        let heightValue = Number(node.children[descendantsIndex].children[l].attributes[heightIndex].nodeValue);
                        let slicesValue = Number(node.children[descendantsIndex].children[l].attributes[slicesIndex].nodeValue);
                        let stacksValue = Number(node.children[descendantsIndex].children[l].attributes[stacksIndex].nodeValue);
                            
                        if (baseIndex == -1 || middleIndex == -1 || heightIndex == -1 || slicesIndex == -1 || stacksIndex == -1)
                            return "Missing arguments";


                        let defBarrel = new DefBarrel(this.scene, baseValue, middleValue, heightValue, slicesValue, stacksValue);
                        component.addChildren(defBarrel);
                        
                    }

                    

                }
                else {

                    // Adding intermediate nodes
                    component.addChildren(node.children[descendantsIndex].children[l].id);
                }
            }


            // Adicionar componentes
            this.scene.components.push(component);


        }
        for (var n = 0; n < this.scene.components.length; n++) {
            this.scene.components[n].assignTextures();
        }

    }


    parseBoolean(node, name, messageError) {
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal || 0;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        
        
        this.scene.stack_texture.pop();
        this.scene.stack_material.pop();
        this.scene.stack_material.push(this.scene.defaultAppearance);
        this.scene.stack_texture.push(null);

        this.scene.pushMatrix();

        this.scene.rotate(90*DEGREE_TO_RAD, -1, 0, 0)

        this.scene.gameOrchestrator.display();

        //Looking for root node
        for (var i = 0; i < this.scene.components.length; i++) {
            if (this.scene.components[i].id == this.idRoot) {
                this.scene.components[i].display();
            }
        }

        this.scene.popMatrix();
    }
}