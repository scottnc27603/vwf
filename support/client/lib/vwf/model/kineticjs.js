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


	
define( [ "module", "vwf/model", "vwf/utility", "vwf/utility/color" ], function( module, model, utility, color ) {


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
            
            parentNode = this.state.nodes[ nodeID ];
            parentObj = parentNode !== undefined ? parentNode.kineticObj : undefined;
            childObj = ( parentObj !== undefined ) ? findChild.call( this, parentObj, childName ) : undefined;


            console.log(["creatingNode:",nodeID,childID,childExtendsID,childImplementsIDs,childType]);
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
                        console.info( "@@@@@ Creating Stage" );
                        node.kineticObj = new Kinetic.Stage( { container: "vwf-stage", width:800, height: 600 } );
                    }
                    this.state.nodes[childID] = node;
                } else if ( isLayerDefinition.call( this, prototypes ) ) {
                    if ( node.kineticObj === undefined ) {
                        if ( parentObj !== undefined  ) {
                            console.info( "@@@@@ Creating Layer" );
                            node.kineticObj = new Kinetic.Layer();
                            node.kineticObj.name = childName;
                            parentObj.add( node.kineticObj );
                        }
                    }
                    this.state.nodes[childID] = node;
                } else if ( isCanvasDefinition.call( this, prototypes ) ) {
                    if ( node.kineticObj === undefined ) {
                        if ( parentObj !== undefined  ) {
                            console.info( "@@@@@ Creating Kinetic.Image" );
                            node.kineticObj = new Kinetic.Image();
                            node.kineticObj.name = childName;
                            parentObj.add( node.kineticObj );
                        }
                    }
                    this.state.nodes[childID] = node;
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
          
          console.info( "kineticjs  settingProperty( "+nodeID+", "+propertyName+", "+propertyValue+" )" );
          var node = this.state.nodes[nodeID];
          var imageObj;
          var value = undefined;
          if ( node && propertyValue ) {
            var kineticObj = node.kineticObj;
            if ( kineticObj !== undefined ) {
                value = propertyValue;
                
                switch ( propertyName ) {
                    case "image":
                        imageObj = new Image();
                        imageObj.onload = function() {
                            kineticObj.image = imageObj;
                        }
                        imageObj.src = propertyValue;
                        break;
                    case "size":
                        kineticObj.width = Number( propertyValue[0] );
                        kineticObj.height = Number( propertyValue[1] );
                        break;
                    case "position":
                        kineticObj.x = Number( propertyValue[0] );
                        kineticObj.y = Number( propertyValue[1] );
                        break;
                    case "width":
                        kineticObj.width = Number( propertyValue );
                        break;
                    case "height":
                        kineticObj.height = Number( propertyValue );
                        break;
                    case "x":
                        kineticObj.x = Number( propertyValue );
                        break;
                    case "y":
                        kineticObj.y = Number( propertyValue );
                        break;
                    case "canvasDefinition":
                        console.info( "++++++++++++++++++++++++++++ setting canvasDefinition ++++++++++++++++++++++++++++" );
                        break;
                    default:
                        value = undefined;
                        break;
                }
            }
          }
          console.info("            ====>>> kineticjs set returns: " + value );
          return value;
        },

        // -- gettingProperty ----------------------------------------------------------------------

        gettingProperty: function( nodeID, propertyName, propertyValue ) {
          //console.log(["kinetic  gettingProperty: ",nodeID,propertyName,propertyValue]);
          var node = this.state.nodes[nodeID];
          var value = undefined;
          if ( node ) {
            var kineticObj = node.kineticObj;
            if ( kineticObj !== undefined ) {
                                
                switch ( propertyName ) {
                    case "image":
                        if ( kineticObj.image ) {
                            value = kineticObj.image.src;
                        }
                        break;
                    case "size":
                        value = [ kineticObj.width, kineticObj.height ];
                        break;
                    case "position":
                        value = [ kineticObj.x, kineticObj.y ];
                        break;
                    case "width":
                        value = kineticObj.width;
                        break;
                    case "height":
                        value = kineticObj.height;
                        break;
                    case "x":
                        value = kineticObj.x;
                        break;
                    case "y":
                        value = kineticObj.y;
                        break;
                    case "canvasDefinition":
                        value = "cd";
                        break;
                    default:
                        value = undefined;
                        break;
                }
            }
          }
          if ( value !== undefined ) {
            propertyValue = value;
          }
          //console.log(["kinetic get returns: ",value]);
          return value;
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
            for ( var i = 0; i < prototypes.length && !found; i++ ) {
                found = ( prototypes[i] == "http-vwf-example-com-kinetic-stage-vwf"  );    
            }
        }
        return found;
    }
    function isLayerDefinition( prototypes ) {
        var found = false;
        if ( prototypes ) {
            for ( var i = 0; i < prototypes.length && !found; i++ ) {
                found = ( prototypes[i] == "http-vwf-example-com-kinetic-layer-vwf" );    
            }
        }
        return found;
    }
    function isCanvasDefinition( prototypes ) {
        var found = false;
        if ( prototypes ) {
            for ( var i = 0; i < prototypes.length && !found; i++ ) {
                found = ( prototypes[i] == "http-vwf-example-com-kinetic-canvas-vwf" );    
            }
        }
        return found;
    }
    function findChild( parentObj, childName ) {
        return undefined;
    }
});
