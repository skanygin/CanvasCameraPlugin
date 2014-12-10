//
//  CanvasCamera.js
//  PhoneGap iOS Cordova Plugin to capture Camera streaming into a HTML5 Canvas or an IMG tag.
//
//  Created by Diego Araos <d@wehack.it> on 12/29/12.
//   Modificado por Roger Zavala - Koiosoft
//
//  MIT License

cordova.define("cordova/plugin/CanvasCamera", function(require, exports, module) {
    var exec = require('cordova/exec');
    var CanvasCamera = function(){
        var _orientation = 'landscape';
        var _obj = null;
        var _context = null;
        var _camImage = null;

        var _x = 0;
        var _y = 0;
        var _width = 0;
        var _height = 0;
    };




    CanvasCamera.prototype.initialize = function(obj) {
        var _this = this;
        this._obj = obj;

        this._context = obj.getContext("2d");

        this._camImage = new Image();

        this._camImage.onload = function() {

            _this._context.clearRect(0, 0, _this._obj.width, _this._obj.height);

            _this._context.save();
            _this._context.translate( 320, 0);
            _this._context.rotate((90 - window.orientation)*Math.PI/180);
            _this._context.drawImage(_this._camImage, 0, 0, 288, 288, 0, 0, 320, 320 );
            _this._context.restore();

            //  solamente para pruebas
            lastCanvas        = document.createElement('canvas');
            lastCanvas.width  = _this._obj.width;
            lastCanvas.height = _this._obj.height;
            var lastCanvasCtx = lastCanvas.getContext('2d');
            lastCanvasCtx.drawImage( _this._obj, 0, 0, _this._obj.width, _this._obj.height,  0, 0, _this._obj.width, _this._obj.height);

        };

        // register orientation change event
        window.addEventListener('orientationchange', this.doOrientationChange);
        this.doOrientationChange();
    };


    CanvasCamera.prototype.start = function(options) {
        cordova.exec(false, false, "CanvasCamera", "startCapture", [options]);
    };



    CanvasCamera.prototype.capture = function(data) {
        this._camImage.src = data;
    };

    CanvasCamera.prototype.setFlashMode = function(flashMode) {
        cordova.exec(function(){}, function(){}, "CanvasCamera", "setFlashMode", [flashMode]);
    };

    CanvasCamera.prototype.setCameraPosition = function(cameraPosition) {
        cordova.exec(function(){}, function(){}, "CanvasCamera", "setCameraPosition", [cameraPosition]);
    };

    CanvasCamera.prototype.doOrientationChange = function() {
        switch(window.orientation)
        {
            case -90:
            case 90:
                this._orientation = 'landscape';
                break;
            default:
                this._orientation = 'portrait';
                break;
        }

        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var pixelRatio = window.devicePixelRatio || 1; /// get pixel ratio of device

        this._x = 0;
        this._y = 0;
        this._width = windowWidth;
        this._height = windowHeight;
    };

    CanvasCamera.prototype.takePicture = function(onsuccess) {
        cordova.exec(onsuccess, function(){}, "CanvasCamera", "captureImage", []);
    };

    var myplugin = new CanvasCamera();
    module.exports = myplugin;
});

var CanvasCamera = cordova.require("cordova/plugin/CanvasCamera");


var DestinationType = {
    DATA_URL : 0,
    FILE_URI : 1
};

var PictureSourceType = {
    PHOTOLIBRARY : 0,
    CAMERA : 1,
    SAVEDPHOTOALBUM : 2
};

var EncodingType = {
    JPEG : 0,
    PNG : 1
};

var CameraPosition = {
    BACK : 0,
    FRONT : 1
};

var CameraPosition = {
    BACK : 1,
    FRONT : 2
};

var FlashMode = {
    OFF : 0,
    ON : 1,
    AUTO : 2
};

CanvasCamera.DestinationType = DestinationType;
CanvasCamera.PictureSourceType = PictureSourceType;
CanvasCamera.EncodingType = EncodingType;
CanvasCamera.CameraPosition = CameraPosition;
CanvasCamera.FlashMode = FlashMode;

module.exports = CanvasCamera;
