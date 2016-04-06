# link.js

## usage 
  - es6 only
  - relative, need one at both sides
  - abstract interface for communication between two parties    
  
  
    var a = new Link();       // create a to a 
    var b = new Link();       // create a to b
     
    // override send 
    a.send = b.feed.bind(b);    // 
    b.send = a.feed.bind(a);
      

## method

    on(event : string, callback, timeToListen : number)
    emit(event : string, [...args])
    
    request(event : string, data : any, callback : (err, ...args) => any, timeToWait : number)
    reply(event : string, callback : (any, (err, ...args) => any ) => any)