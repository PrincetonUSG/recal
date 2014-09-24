var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/BrowserEvents', '../../../library/Core/ComparableResult', '../Events/EventsModel', './EventsPopUpView', '../../../library/CoreUI/FocusableView', '../ReCalCommonBrowserEvents'], function(require, exports, BrowserEvents, ComparableResult, EventsModel, EventsPopUpView, FocusableView, ReCalCommonBrowserEvents) {
    var EditableEventsPopUpView = (function (_super) {
        __extends(EditableEventsPopUpView, _super);
        function EditableEventsPopUpView(dependencies) {
            _super.call(this, dependencies);
            this.HIGHLIGHTED_CLASS = 'highlighted';
            this._modifiedEventsModel = null;
            this._isModified = false;
            this._saveButton = null;
            this._clickToEditViewFactory = null;
            this._clickToEditViewFactory = dependencies.clickToEditViewFactory;
            this.initialize();
        }
        Object.defineProperty(EditableEventsPopUpView.prototype, "modifiedEventsModel", {
            get: function () {
                return this._modifiedEventsModel;
            },
            set: function (value) {
                this._modifiedEventsModel = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EditableEventsPopUpView.prototype, "isModified", {
            get: function () {
                return this._isModified;
            },
            set: function (value) {
                if (this._isModified !== value) {
                    this._isModified = value;
                    this.saveButton.viewIsHidden = !value;
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EditableEventsPopUpView.prototype, "saveButton", {
            get: function () {
                return this._saveButton;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EditableEventsPopUpView.prototype, "clickToEditViewFactory", {
            get: function () {
                return this._clickToEditViewFactory;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EditableEventsPopUpView.prototype, "eventsModel", {
            // if overwrite set, must also overwrite get
            get: function () {
                return this._eventsModel;
            },
            set: function (value) {
                if (this._eventsModel !== value) {
                    this._eventsModel = value;
                    this.modifiedEventsModel = new EventsModel(this._eventsModel);
                    this.isModified = false;
                    this.refresh();
                }
            },
            enumerable: true,
            configurable: true
        });

        EditableEventsPopUpView.prototype.initialize = function () {
            var _this = this;
            // initialize save button
            this._saveButton = FocusableView.fromJQuery(this.findJQuery('#save_button'));
            this.saveButton.attachEventHandler(BrowserEvents.click, function (ev, extra) {
                _this.triggerEvent(ReCalCommonBrowserEvents.editablePopUpDidSave, {
                    modifiedEventsModel: _this.modifiedEventsModel
                });
                _this.eventsModel = _this.modifiedEventsModel; // TODO do this here?
            });

            // initialize click to edit
            this.findJQuery('.clickToEdit').each(function (index, element) {
                var $element = $(element);
                var clickToEditView = _this.clickToEditViewFactory.createFromJQuery($element);
            });

            // add event handler for click to edit
            this.attachEventHandler(BrowserEvents.clickToEditComplete, function (ev, extra) {
                var result = extra.value.trim();
                var view = extra.view;

                // if we reach this point, assume result is valid.
                if (view.is(_this.titleJQuery)) {
                    _this.processModifiedTitle(result);
                } else if (view.is(_this.descriptionJQuery)) {
                    _this.processModifiedDescription(result);
                } else if (view.is(_this.locationJQuery)) {
                    _this.processModifiedLocation(result);
                } else if (view.is(_this.sectionJQuery)) {
                } else if (view.is(_this.eventTypeJQuery)) {
                } else if (view.is(_this.dateJQuery)) {
                } else if (view.is(_this.startTimeJQuery)) {
                } else if (view.is(_this.endTimeJQuery)) {
                }
                _this.refresh();
            });
        };
        EditableEventsPopUpView.prototype.processModifiedTitle = function (value) {
            if (value !== this.modifiedEventsModel.title) {
                this.modifiedEventsModel.title = value;
                this.isModified = true;
            }
        };
        EditableEventsPopUpView.prototype.processModifiedDescription = function (value) {
            if (value !== this.modifiedEventsModel.description) {
                this.modifiedEventsModel.description = value;
                this.isModified = true;
            }
        };
        EditableEventsPopUpView.prototype.processModifiedLocation = function (value) {
            if (value !== this.modifiedEventsModel.location) {
                this.modifiedEventsModel.location = value;
                this.isModified = true;
            }
        };

        EditableEventsPopUpView.prototype.refresh = function () {
            this.refreshWithEventsModel(this.modifiedEventsModel);
            if (this.modifiedEventsModel.title !== this.eventsModel.title) {
                this.titleJQuery.addClass(this.HIGHLIGHTED_CLASS);
            } else {
                this.titleJQuery.removeClass(this.HIGHLIGHTED_CLASS);
            }
            if (this.modifiedEventsModel.description !== this.eventsModel.description) {
                this.descriptionJQuery.addClass(this.HIGHLIGHTED_CLASS);
            } else {
                this.descriptionJQuery.removeClass(this.HIGHLIGHTED_CLASS);
            }
            if (this.modifiedEventsModel.location !== this.eventsModel.location) {
                this.locationJQuery.addClass(this.HIGHLIGHTED_CLASS);
            } else {
                this.locationJQuery.removeClass(this.HIGHLIGHTED_CLASS);
            }
            if (this.modifiedEventsModel.sectionId !== this.eventsModel.sectionId) {
                this.sectionJQuery.addClass(this.HIGHLIGHTED_CLASS);
            } else {
                this.sectionJQuery.removeClass(this.HIGHLIGHTED_CLASS);
            }
            if (this.modifiedEventsModel.eventTypeCode !== this.eventsModel.eventTypeCode) {
                this.eventTypeJQuery.addClass(this.HIGHLIGHTED_CLASS);
            } else {
                this.eventTypeJQuery.removeClass(this.HIGHLIGHTED_CLASS);
            }
            if (this.modifiedEventsModel.startDate.compareTo(this.eventsModel.startDate) !== 0 /* equal */) {
            } else {
            }
            if (this.modifiedEventsModel.endDate.compareTo(this.eventsModel.endDate) !== 0 /* equal */) {
            } else {
            }
        };
        return EditableEventsPopUpView;
    })(EventsPopUpView);
    
    return EditableEventsPopUpView;
});
