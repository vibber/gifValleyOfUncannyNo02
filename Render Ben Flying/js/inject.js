//To-do: Make it work even when no arguments are passed by doing: if (!arguments[1]) arguments[1] = {};
//How to make it work on animations that don't use requestANIMATIONFRAME    

var countPngs = 0;

overrideGetContext = function(win) {
    var base = win.HTMLCanvasElement.prototype.getContext;
    win.HTMLCanvasElement.prototype.getContext = function() {
        if (arguments[1]) {
            // var obj = arguments[1];
            // obj.preserveDrawingBuffer == true;
            arguments[1]["preserveDrawingBuffer"] = true;
        }
        console.log("overriding getContext");
        return base.apply(this, arguments);
    };
}

overrideRequestAnimationFrame = function(win) {
    console.log("in override requestAnimationFrame", win);
    var winDom = win.document;    
    console.log("overriding requestAnimationFrame");
    win.requestAnimationFrame = (function() {
        var sys_requestAnimationFrame = win.requestAnimationFrame;

        return function(callback) {
            saveCanvas(winDom);
            sys_requestAnimationFrame(callback);  
        }

    })();
}

//save canvas contents as a png
saveCanvas = function(dom) {
    var canvas = dom.getElementsByTagName("canvas")[0];
    console.log("in saveCanvas", canvas);
    var src = canvas.toDataURL();
    var path = "frames/out" + countPngs + ".png";
    var data = src.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    require("fs").writeFileSync(path, buf);
    countPngs++;
};


document.addEventListener( "DOMContentLoaded", function() {
    console.log("DOMContentLoaded");
    overrideRequestAnimationFrame(window);
}, false );

overrideGetContext(window);