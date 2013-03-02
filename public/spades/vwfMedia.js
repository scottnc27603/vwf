var vwfMedia = {
	
	streamUrl: undefined,
	stream: undefined,
	captureVideo: true,
	captureAudio: true,
	connections: {},
  debug: false,

	capture: function() {
      if ( this.localStream === undefined && ( this.captureVideo || this.captureAudio ) ) {
        var self = this;
        var capture = {
          "audio": this.captureAudio,
          "video": this.captureVideo 
        };

        try { navigator.webkitGetUserMedia( capture, function( stream ) {
          self.streamUrl = webkitURL.createObjectURL( stream );
          self.stream = stream;

          localStreamCaptured( self.streamUrl );
        
        }, function( error ) { console.info("failed to get video stream error: " + error); }
        ); } 
        catch (e) { console.info("getUserMedia error " + e) };
      }
	},	

  setMute: function( mute ) {
    if ( this.stream && this.stream.audioTracks && this.stream.audioTracks.length > 0 ) {
      if ( mute !== undefined ) {
        this.stream.audioTracks[0].enabled = !mute;
      }
    }
  },

  setPause: function( pause ) {
    if ( this.stream && this.stream.videoTracks && this.stream.videoTracks.length > 0 ) {
      if ( pause !== undefined ) {
        this.stream.videoTracks[0].enabled = !pause;
      }
    }
  },

	release: function() {
		for ( id in this.connections ) {
			this.connections[id].disconnect();
		} 
		this.connections = {};
	},	

	hasStream: function() {
		return ( this.stream !== undefined );
	},

	createPeerConnection: function( connectionID, sendOffer ) {
		if ( this.connections[ connectionID ] === undefined ) {
			this.connections[ connectionID ] = new mediaConnection( this, connectionID );
      this.connections[ connectionID ].connect( this.stream, sendOffer );
		}
	},

	findPeerConnection: function( connID ) {
		var pc = undefined;
		if ( this.connections[ connectionID ] ) {
			pc = this.connections[ connectionID ];			
		}
		return pc;
	},

	handlePeerMessage: function( msg, connectionID, sourceMoniker ) {
		if ( this.connections[ connectionID ] === undefined ) {
			this.connections[ connectionID ] = new mediaConnection( this, connectionID );
      this.connections[ connectionID ].connect( this.stream, false );
		}

		this.connections[ connectionID ].processMessage( msg );			
	},

	deletePeerConnection: function( connectionID ) {
		if ( this.connections[ connectionID ] !== undefined ) {
			this.connections[ connectionID ].disconnect();
			this.connections[ connectionID ] = undefined;
		}
	}, 
};

function mediaConnection ( media, id ) {
    this.media = media;
    this.id = id;
    this.stream = undefined;
    this.url = undefined;
    this.pc = undefined;
    this.connected = false;
    this.streamAdded = false;
    this.isRTCPeerConnection = true;

    this.connect = function( stream, sendOffer ) {
        var self = this;
        if ( this.pc === undefined ) {
          if ( this.media.debug ) console.info("Creating PeerConnection.");
          var pc_config = { "iceServers": [ { "url": "stun:stun.l.google.com:19302" } ] };
          var iceCallback = function( event ) {
            //console.info( "------------------------ iceCallback ------------------------" );
            if ( event.candidate ) {
              var sMsg = { 
                "type": 'candidate',
                "label": event.candidate.sdpMLineIndex,
                "id": event.candidate.sdpMid,
                "candidate": event.candidate.candidate
              };
              if ( self.media.debug ) console.info( "ice C->S: " + JSON.stringify( sMsg ) );
              sendSignalMessage( sMsg, self.id );
            } else {
              if ( self.media.debug ) console.info("End of candidates.");
            }
          }; 
          try {
            this.pc = new webkitRTCPeerConnection( pc_config );
            this.pc.onicecandidate = iceCallback;
            if ( self.media.debug ) console.info("Created webkitRTCPeerConnnection with config \"" + JSON.stringify( pc_config ) + "\".");
          } 
          catch (e) {
            try {
              var stun_server = "";
              if ( pc_config.iceServers.length !== 0 ) {
                stun_server = pc_config.iceServers[0].url.replace('stun:', 'STUN ');
              }
              self.pc = new webkitPeerConnection00( stun_server, function( candidate, moreToFollow ) {
                if ( candidate ) {
                  var sMsg = {
                    "type": 'candidate',
                    "label": candidate.label,
                    "candidate": candidate.toSdp()
                  };
                  if ( self.media.debug ) console.info( "C->S: " + JSON.stringify( sMsg ) );
                  sendSignalMessage( sMsg, self.id );
                }
                if ( !moreToFollow ) {
                  if ( self.media.debug ) console.info( "End of candidates." );
                }
              } );
              self.isRTCPeerConnection = false;
              if ( self.media.debug ) console.info("Created webkitPeerConnnection00 with config \"" + stun_server + "\".");
            } 
            catch ( e ) {
              console.info("Failed to create PeerConnection, exception: " + e.message);
              $("#confirmErrorDialog").html("<p>The holowall has detected that peerConnection is not defined.  Please check the chrome flags and enable peerConnection and then restart the holowall.</p>").dialog( "open" );
              return;
            }
          }

          this.pc.onconnecting = function( message ){
            if ( self.media.debug ) console.info("Session connecting.");
          };
          this.pc.onopen = function( message ) {
            if ( self.media.debug ) console.info("Session opened.");
          };
          this.pc.onaddstream = function( event ) {
            if ( self.media.debug ) console.info("Remote stream added.");
            self.stream = event.stream;
            self.url = webkitURL.createObjectURL( event.stream );
            if ( self.media.debug ) console.info("Remote stream added.  url: " + self.url );
            
            remoteUrlReceived( self.url, self.id );
          
          };
          this.pc.onremovestream = function( event ) {
            if ( self.media.debug ) console.info("Remote stream removed.");
          };
          this.pc.onstatechange = function( event ) {
            //if ( self.media.debug ) console.info( "statechange: " + JSON.stringify( event ) );
          };
          this.pc.onicechange = function( event ) {
            //if ( self.media.debug ) console.info( "icechange: " + JSON.stringify( event ) );
          };
          //this.pc.onicecandidate = function( event ) {
          //  //if ( self.media.debug ) console.info( "icecandidate: " + JSON.stringify( event ) );
          //};          
          if ( stream ) {
            if ( this.media.debug ) console.info("Adding local stream.");
            this.pc.addStream( stream );
            this.streamAdded = true;
          }
          if ( sendOffer ){
            this.call();
          }
        }
        this.connected = ( this.pc !== undefined );
    };

    this.setMute = function( mute ) {
      if ( this.stream && this.stream.audioTracks && this.stream.audioTracks.length > 0 ) {
        if ( mute !== undefined ) {
          this.stream.audioTracks[0].enabled = !mute;
        }
      }
    }

    this.setPause = function( pause ) {
      if ( this.stream && this.stream.videoTracks && this.stream.videoTracks.length > 0 ) {
        if ( pause !== undefined ) {
          this.stream.videoTracks[0].enabled = !pause;
        }
      }
    }

    this.disconnect = function() {
        if ( this.media.debug ) console.info( "PC.disconnect  " + this.id );
        if ( this.pc ) {
          this.pc.close();
          this.pc = undefined;
        }
        this.isRTCPeerConnection = true;
    };

    this.processMessage = function( msg ) {
        if ( this.media.debug ) console.info('S->C: ' + JSON.stringify( msg ) );
        if ( this.pc ) {
          if ( msg.type === 'offer') {

            // We only know JSEP version after createPeerConnection().
            if ( this.isRTCPeerConnection ) {
              this.pc.setRemoteDescription( new RTCSessionDescription( msg ) );
            } else {
              this.pc.setRemoteDescription( this.pc.SDP_OFFER, new SessionDescription( msg.sdp ) );
            }
            this.answer();
          } else if ( msg.type === 'answer' && this.streamAdded ) {
            if ( this.isRTCPeerConnection ) {
              this.pc.setRemoteDescription( new RTCSessionDescription( msg ) );
            } else { 
              this.pc.setRemoteDescription( this.pc.SDP_ANSWER, new SessionDescription( msg.sdp ));
            }
          } else if ( msg.type === 'candidate' && this.streamAdded ) {
            var candidate;
            if ( this.isRTCPeerConnection ) {
              candidate = new RTCIceCandidate( { "sdpMLineIndex": msg.label, "candidate": msg.candidate } );
              this.pc.addIceCandidate( candidate ); 
            } else {            
              candidate = new IceCandidate( msg.label, msg.candidate );
              this.pc.processIceMessage( candidate );
            }
          } else if ( msg.type === 'bye' && this.streamAdded ) {
            this.hangup();
          }
        } 
    };

    this.answer = function() {
        if ( this.media.debug ) console.info( "Send answer to peer" );
        var self = this;
        var mediaOffered = { 'has_audio': this.media.captureAudio, 'has_video': this.media.captureVideo };
        if ( this.isRTCPeerConnection ) {
          this.pc.createAnswer( function( sessionDescription ) {
            self.pc.setLocalDescription( sessionDescription );
            if ( self.media.debug ) console.info( "C->S: " + JSON.stringify( sessionDescription ) );
            sendSignalMessage( sessionDescription, self.id );
          }, null, mediaOffered );
        } else {
          var offer = this.pc.remoteDescription;
          var answer = this.pc.createAnswer( offer.toSdp(), mediaOffered );
          this.pc.setLocalDescription( this.pc.SDP_ANSWER, answer);
          var sMsg = {
            "type": 'answer',
            "sdp": answer.toSdp(),
          };
          if ( this.media.debug ) console.info( "C->S: " + JSON.stringify( sMsg ) );
          sendSignalMessage( sMsg, this.id );
          this.pc.startIce();
        }
    };

    this.call = function() {
      if ( this.media.debug ) console.info( "Send offer to peer" );
      var self = this;
      var mediaOffered = { 'has_audio': this.media.captureAudio, 'has_video': this.media.captureVideo }; 

      if ( this.isRTCPeerConnection ) {
        this.pc.createOffer( function( sessionDescription ) {
          self.pc.setLocalDescription( sessionDescription );
          if ( self.media.debug ) console.info( "C->S: " + JSON.stringify( sessionDescription ) );
          sendSignalMessage( sessionDescription, self.id );
        }, null, mediaOffered );
      } else {
        var offer = this.pc.createOffer( mediaOffered );
        this.pc.setLocalDescription( this.pc.SDP_OFFER, offer );
        var sMsg = {
          "type": 'offer',
          "sdp": offer.toSdp()
        };        
        if ( this.media.debug ) console.info( "C->S: " + JSON.stringify( sMsg ) );
        sendSignalMessage( sMsg, this.id );
        this.pc.startIce();
      }
    };

    this.hangup = function() {
        if ( this.media.debug ) console.info( "PC.hangup  " + this.id );
        if ( this.pc ) {
          this.pc.close();
          this.pc = undefined;
        }
    };

}