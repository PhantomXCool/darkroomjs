;(function(window, document, Darkroom, fabric) {
    'use strict';

    Darkroom.plugins['history'] = Darkroom.Plugin.extend({
        initialize: function InitDarkroomHistoryPlugin() {
            this._initButtons();

            this.backHistoryStack = [];
            this.forwardHistoryStack = [];

            this._snapshotImage();

            this.darkroom.addEventListener('image:change', this._onImageChange.bind(this));
        },

        goBack: function() {
            if (this.backHistoryStack.length === 0) {
                return;
            }

            this.forwardHistoryStack.push(this.curFabricImage);
            this.curFabricImage = this.backHistoryStack.pop();
            this._applyImage(this.curFabricImage);
            this._updateButtons();
        },

        goForward: function() {
            if (this.forwardHistoryStack.length === 0) {
                return;
            }

            this.backHistoryStack.push(this.curFabricImage);
            this.curFabricImage = this.forwardHistoryStack.pop();
            this._applyImage(this.curFabricImage);
            this._updateButtons();
        },

        _initButtons: function() {
            var buttonGroup = this.darkroom.toolbar.createButtonGroup();

            this.backButton = buttonGroup.createButton({
                image: 'back',
                disabled: true
            });

            this.forwardButton = buttonGroup.createButton({
                image: 'forward',
                disabled: true
            });

            this.backButton.addEventListener('click', this.goBack.bind(this));
            this.forwardButton.addEventListener('click', this.goForward.bind(this));

            return this;
        },

        _updateButtons: function() {
            this.backButton.disable((this.backHistoryStack.length === 0))
            this.forwardButton.disable((this.forwardHistoryStack.length === 0))
        },

        _snapshotImage: function() {
            this.curFabricImage = this.darkroom.image;
            /*var _this = this;

            var image = new Image();
            image.src = this.darkroom.snapshotImage();

            this.currentImage = image;
            */
        },

        _onImageChange: function() {
//            this.backHistoryStack.push(this.currentImage);
            this.backHistoryStack.push(this.curFabricImage);
            this._snapshotImage();
            this.forwardHistoryStack.length = 0;
            this._updateButtons();
        },

        // Apply image to the canvas
        _applyImage: function(imgInstance) {
            var canvas = this.darkroom.canvas;


            var angle = imgInstance.getAngle();

            var width, height;
            if (Math.abs(angle) % 180) {
                height = imgInstance.getWidth();
                width = imgInstance.getHeight();
            } else {
                width = imgInstance.getWidth();
                height = imgInstance.getHeight();
            }
            // Update canvas size
            canvas.setWidth(width);
            canvas.setHeight(height);


            canvas.centerObject(imgInstance);
            imgInstance.setCoords();

            canvas.renderAll();

            // Add image
            this.darkroom.image.remove();
            this.darkroom.image = imgInstance;
            canvas.add(imgInstance);
        }
    });
})(window, document, Darkroom, fabric);