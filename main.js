var devPath;
var connectId;
var txBufLen = 16;
var txBuf = new ArrayBuffer(txBufLen);
var txView = new Uint8Array(txBuf);


// call back from serial connect
function connect(info) {

   var txView = new Uint8Array(txBuf);
    /// ugh
    var str = 'hello\n';
    connectId = info.connectionId;

    println('connected');
    // I guess typed arrays can be referenced just like normal arrays? 
    for(var i=0; i<6; i++) {
	   txView[i] = str.charCodeAt(i);
    }
    // null termination
     txView[7] = 0;
    // try 'hello' , should get loopback... not happening

    chrome.serial.send(connectId, txBuf, tx);   
  }

// click button to connect
$('.connect').click(function(e){
    e.preventDefault();
    var opt = {
//	bitrate : 500000
	  bitrate : 115200,
    name: 'Aleph'
    };

    clear();

    //uncomment below to hardcode
    //devPath = '/dev/tty.usbmodemfd12431';  


    print('connecting to ' + devPath + ' ... ');
    chrome.serial.connect(devPath, opt, connect );       

} );

chrome.serial.onReceiveError.addListener(function(data){
    println('serial rx error');
});

// this listener will get called on every character, seems like.
chrome.serial.onReceive.addListener( function(info){
	 // data passed is ArrayBuf, which we can't see directly
	 // "view" it as an array of bytes
    var view = new Int8Array(info.data);
  	 // this incantation interprets byte array as ascii
    var str = String.fromCharCode.apply(null, view);
    // zap newlines (actullay '\r\n')
    print( str.replace("\r","<br />") );
});


function init(){
      // spin through the devices
      chrome.serial.getDevices( function (ports) {
      // easy enough to put these in dropdown or something i suppose
       for(var i = 0; i < ports.length; i++){
          println(ports[i].path);
          var port_test = ports[i].path.match(/tty.usbmodem/g);
          if(port_test != null){
            devPath = ports[i].path;
          }
        }
    });
}

setTimeout(init, 500);

function log(x){
  console.log(x);
}

function print(msg) {
    $('#buffer').append(msg);
}

function println(msg) {
    $('#buffer').append(msg + '<br/>');
}

function clear(msg) {
    $('#buffer').empty();
}

function tx (info) {
    log(info);
}

