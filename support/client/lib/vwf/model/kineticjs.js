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
            
            this.state.nodes = {}; 
            //this.state.sceneRootID = "index-vwf";
           
        },


        // == Model API ============================================================================

        // -- creatingNode ------------------------------------------------------------------------
        
        creatingNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
                                childSource, childType, childURI, childName, callback ) {
            var node, parentNode, parentObj, kineticObj, prototypes, childObj;
            var kernel = this.kernel;

            if ( childExtendsID === undefined ) {
                return;
            }
            
            parentNode = this.state[ parentNode ];
            parentObj = parentNode !== undefined ? parentNode.kineticObj : undefined;
            childObj = ( parentObj !== undefined ) ? findChild.call( this, parentObj, childName ) : undefined;


            console.log(["creatingNode:",nodeID,childID,childExtendsID,childType]);
            prototypes = getPrototypes.call( this, kernel, childExtendsID );

            if ( prototypes ) {
                node = {
                    "kineticObj": childObj,
                    "vwfID": childID,
                    "name": childName,
                    "type": childType,
                    "source": childSource,
                    "extendsID": childExtendsID,
                    "uri": childURI,
                };                
                if ( isStageDefinition.call( this, prototypes ) ) {
                    if ( node.kineticObj === undefined ) {
                        node.kineticObj = new Kinectic.Stage();
                    }
                    this.state.nodes[childID] = node;
                } else if ( isLayerDefinition.call( this, prototypes ) ) {

                } else if ( isCanvasDefinition.call( this, prototypes ) ) {

                }
            }
           
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
    function isStageDefinition( prototypes ) {
        var found = false;
        if ( prototypes ) {
            for ( var i = 0; i < prototypes.length && !foundScene; i++ ) {
                found = ( prototypes[i] == "http-vwf-example-com-kinetic-stage-vwf"  );    
            }
        }
        return found;
    }
    function isLayerDefinition( prototypes ) {
        var found = false;
        if ( prototypes ) {
            for ( var i = 0; i < prototypes.length && !foundScene; i++ ) {
                found = ( prototypes[i] == "http-vwf-example-com-kinetic-layer-vwf" );    
            }
        }
        return found;
    }
    function isCanvasDefinition( prototypes ) {
        var found = false;
        if ( prototypes ) {
            for ( var i = 0; i < prototypes.length && !foundScene; i++ ) {
                found = ( prototypes[i] == "http-vwf-example-com-kinetic-canvas-vwf" );    
            }
        }
        return found;
    }
    function findChild( parentObj, childName ) {
        return undefined;
    }
});
