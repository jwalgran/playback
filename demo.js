var t = require('./')();
t.on('playing', function(data){ console.dir(data);} );
t.on('paused', function(data){ console.log('paused');} );
t.play();
