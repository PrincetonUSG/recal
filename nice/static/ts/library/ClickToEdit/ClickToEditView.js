/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />
/// <amd-dependency path="jeditable" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', "../Core/BrowserEvents", './ClickToEditType', '../CoreUI/FocusableView', '../Core/InvalidArgumentException', "jeditable"], function(require, exports, $, BrowserEvents, ClickToEditType, FocusableView, InvalidArgumentException) {
    $.editable.addInputType('RCText', {
        element: function (settings, original) {
            var $input = $('<input>').addClass('form-control');
            $(this).append($input);
            return $input;
        }
    });
    $.editable.addInputType('RCTextArea', {
        element: function (settings, original) {
            var $input = $('<textarea>').addClass('form-control');
            $(this).append($input);
            return $input;
        }
    });

    var ClickToEditView = (function (_super) {
        __extends(ClickToEditView, _super);
        // TODO handle focus/blur
        function ClickToEditView($element) {
            _super.call(this, $element);
            this._type = 0 /* input */;
            if (!this._$el.is('p, h1, h2, h3, h4, h5, h6')) {
                throw new InvalidArgumentException('ClickToEdit must be p, h1, h2, h3, h4, h5, or h6');
            }
            this._initializeClickToEdit();
        }
        ClickToEditView.prototype._initializeClickToEdit = function () {
            var _this = this;
            this._$el.editable(function (value, settings) {
                _this.triggerEvent(BrowserEvents.clickToEditComplete, {
                    value: value
                });
                return value;
            }, {
                type: 'RCText',
                event: BrowserEvents.clickToEditShouldBegin
            });
            this.attachEventHandler(BrowserEvents.click, function () {
                _this.triggerEvent(BrowserEvents.clickToEditShouldBegin);
            });
        };
        Object.defineProperty(ClickToEditView.prototype, "value", {
            get: function () {
                return this._$el.text();
            },
            set: function (text) {
                this._$el.text(text);
            },
            enumerable: true,
            configurable: true
        });

        ClickToEditView.prototype.focusView = function () {
            _super.prototype.focusView.call(this);

            //this._$el.editable('enable');
            this.triggerEvent(BrowserEvents.clickToEditShouldBegin);
        };
        return ClickToEditView;
    })(FocusableView);
    
    return ClickToEditView;
});
