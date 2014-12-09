;(function(window, document, Darkroom, fabric) {
    'use strict';

    Darkroom.plugins['rotate'] = Darkroom.Plugin.extend({
        initialize: function InitDarkroomRotatePlugin() {
            var buttonGroup = this.darkroom.toolbar.createButtonGroup();

            this.leftButton = buttonGroup.createButton({
                image: 'rotate-left'
            });

            this.rightButton = buttonGroup.createButton({
                image: 'rotate-right'
            });

            this.leftButton.addEventListener('click', this.rotateLeft.bind(this));
            this.rightButton.addEventListener('click', this.rotateRight.bind(this));
        },

        rotateLeft: function rotateLeft() {
            this.rotate(-90);
        },

        rotateRight: function rotateRight() {
            this.rotate(90);
        },

        rotate: function rotate(angle) {
            var _this = this;

            var darkroom = this.darkroom;
            var canvas = darkroom.canvas;
            darkroom.image.clone(function(copyImage) {
                angle = (copyImage.getAngle() + angle) % 360;

                var width, height;
                if (Math.abs(angle) % 180) {
                    height = copyImage.getWidth();
                    width = copyImage.getHeight();
                } else {
                    width = copyImage.getWidth();
                    height = copyImage.getHeight();
                }
                copyImage.rotate(angle);
                canvas.setWidth(width);
                canvas.setHeight(height);
                darkroom.image.remove();
                darkroom.image = copyImage;
                canvas.add(copyImage);
                canvas.centerObject(copyImage);

                canvas.renderAll();

                darkroom.dispatchEvent('image:change');
            });

        }
    });
})(window, document, Darkroom, fabric);