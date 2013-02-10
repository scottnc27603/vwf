"use strict";

// Copyright 2012 United States Government, as represented by the Secretary of Defense, Under
// Secretary of Defense (Personnel & Readiness).
// 
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
// in compliance with the License. You may obtain a copy of the License at
// 
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License
// is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
// or implied. See the License for the specific language governing permissions and limitations under
// the License.


	
define( [ "module", "vwf/model", "vwf/utility", "vwf/utility/color" ], function( module, model, utility, Color ) {


    return model.load( module, {

        // == Module Definition ====================================================================

        // -- initialize ---------------------------------------------------------------------------

        initialize: function() {
            
            this.state.stages = { "layers": {}, }; // id => { glgeDocument: new GLGE.Document(), glgeRenderer: new GLGE.Renderer(), glgeScene: new GLGE.Scene() }
            //this.state.canvas = {}; // id => { name: string, glgeObject: GLGE.Object, GLGE.Collada, GLGE.Light, or other...? }
            //this.state.sceneRootID = "index-vwf";
           
        },


        // == Model API ============================================================================

        // -- creatingNode ------------------------------------------------------------------------
        
        creatingNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
                                childSource, childType, childURI, childName, callback ) {
            
            //console.log(["creatingNode:",nodeID,childID,childExtendsID,childType]);
           
        },
         
        // -- deletingNode -------------------------------------------------------------------------

        deletingNode: function( nodeID ) {

            
        },

        // -- addingChild ------------------------------------------------------------------------
        
        addingChild: function( nodeID, childID, childName ) {
            
        },

        // -- movingChild ------------------------------------------------------------------------
        
        movingChild: function( nodeID, childID, childName ) {
        },

        // -- removingChild ------------------------------------------------------------------------
        
        removingChild: function( nodeID, childID, childName ) {
        },

        // -- creatingProperty ---------------------------------------------------------------------

        creatingProperty: function( nodeID, propertyName, propertyValue ) {
        },

        // -- initializingProperty -----------------------------------------------------------------

        initializingProperty: function( nodeID, propertyName, propertyValue ) {

            var value = undefined;
            //console.log(["initializingProperty: ",nodeID,propertyName,propertyValue]);

            return value;
            
        },

        // -- settingProperty ----------------------------------------------------------------------

        settingProperty: function( nodeID, propertyName, propertyValue ) {
        
          //console.log(["settingProperty: ",nodeID,propertyName,propertyValue]);
        },

        // -- gettingProperty ----------------------------------------------------------------------

        gettingProperty: function( nodeID, propertyName ) {

        },


        // TODO: deletingMethod

        // -- callingMethod --------------------------------------------------------------------------

        callingMethod: function( nodeID, methodName /* [, parameter1, parameter2, ... ] */ ) { // TODO: parameters
            return undefined;
        },


        // TODO: creatingEvent, deltetingEvent, firingEvent

        // -- executing ------------------------------------------------------------------------------

        executing: function( nodeID, scriptText, scriptType ) {
            return undefined;
        },

    } );
    // == PRIVATE  ========================================================================================
    function getPrototypes( kernel, extendsID ) {
        var prototypes = [];
        var id = extendsID;

        while ( id !== undefined ) {
            prototypes.push( id );
            id = kernel.prototype( id );
        }
                
        return prototypes;
    }
    function isSceneDefinition( prototypes ) {
        var foundScene = false;
        if ( prototypes ) {
            for ( var i = 0; i < prototypes.length && !foundScene; i++ ) {
                foundScene = ( prototypes[i] == "http-vwf-example-com-navscene-vwf" || prototypes[i] == "http-vwf-example-com-scene-vwf" );    
            }
        }

        return foundScene;
    }


});
