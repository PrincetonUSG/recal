/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'moment', './AgendaTableViewCell', '../../library/Table/TableViewController'], function(require, exports, moment, AgendaTableViewCell, TableViewController) {
    var AgendaTableViewController = (function (_super) {
        __extends(AgendaTableViewController, _super);
        function AgendaTableViewController() {
            _super.apply(this, arguments);
            this._loading = false;
        }
        AgendaTableViewController.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);

            // when events change
            EventsMan_addUpdateListener(function () {
                // TODO check if visible
                _this.reload();
            });

            // when settings close
            $('#' + SE_id).on('close', function (ev) {
                // TODO check if visible
                _this.reload();
            });

            // when switching between agenda and calendar
            $('#agenda.tab-pane').each(function (index, pane) {
                $(pane).on('transitionend', function (ev) {
                    if ($(pane).hasClass('in')) {
                        _this.reload();
                    }
                });
            });

            // unhighlight closed events
            PopUp_addCloseListener(function (eventId) {
                // TODO get cell based on eventId and unhighlight it
            });

            // reload
            this.reload();
        };

        AgendaTableViewController.prototype.reload = function () {
            // TODO handle timezone and separate time logic into a datetime module
            // TODO don't expose momentjs
            // TODO Agenda_filter
            // TODO EventSectionRangeProvider
            if (this._loading) {
                return;
            }
            this._loading = true;
            LO_showLoading(AgendaTableViewController.LO_MESSAGE);
            this._eventSectionArray = new Array();

            // yesterday 0:00:00 AM to before midnight
            var curDate = moment();
            var startDate = moment().date(curDate.date() - 1).hours(0).minutes(0).seconds(0);
            var endDate = moment().date(curDate.date()).hours(0).minutes(0).seconds(0);
            var eventIds = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
            if (eventIds.length > 0) {
                this._eventSectionArray.push(new EventSection('Yesterday', eventIds));
            }

            // today to midnight
            startDate = endDate;
            endDate = moment().date(curDate.date() + 1).hours(0).minutes(0).seconds(0);
            eventIds = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
            if (eventIds.length > 0) {
                this._eventSectionArray.push(new EventSection('Today', eventIds));
            }

            // this week
            startDate = endDate;
            endDate = moment().date(curDate.date() + 7).hours(0).minutes(0).seconds(0);
            eventIds = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
            if (eventIds.length > 0) {
                this._eventSectionArray.push(new EventSection('This Week', eventIds));
            }

            // this month
            startDate = endDate;
            endDate = moment().month(curDate.month() + 1).date(0).hours(0).minutes(0).seconds(0);
            eventIds = EventsMan_getEventIDForRange(startDate.unix(), endDate.unix());
            if (eventIds.length > 0) {
                this._eventSectionArray.push(new EventSection('This Month', eventIds));
            }

            LO_hideLoading(AgendaTableViewController.LO_MESSAGE);
            this._loading = false;
        };

        /*******************************************************************
        * Table View Data Source
        *****************************************************************/
        /**
        * Return a unique identifier for cell at the given index path.
        * Useful for when there are more than one types of cells in
        * a table view
        */
        AgendaTableViewController.prototype.identifierForCellAtIndexPath = function (indexPath) {
            return 'agenda';
        };

        /**
        * Create a new table view cell for the given identifier
        */
        AgendaTableViewController.prototype.createCell = function (identifier) {
            return new AgendaTableViewCell();
        };

        /**
        * Make any changes to the cell before it goes on screen.
        * Return (not necessarily the same) cell.
        */
        AgendaTableViewController.prototype.decorateCell = function (cell) {
            var agendaCell = cell;
            var indexPath = cell.indexPath;
            var eventSection = this._eventSectionArray[indexPath.section];
            var eventId = eventSection.eventIds[indexPath.item];
            var eventDict = EventsMan_getEventByID(eventId);

            agendaCell.setToEvent(eventDict);

            // TODO window resizing
            if (UI_isPinned(eventId) || UI_isMain(eventId)) {
                this.view.selectCell(agendaCell);
            }

            return cell;
        };

        /**
        * The number of sections in this table view.
        */
        AgendaTableViewController.prototype.numberOfSections = function () {
            return this._eventSectionArray.length;
        };

        /**
        * The number of items in this section.
        */
        AgendaTableViewController.prototype.numberOfItemsInSection = function (section) {
            return this._eventSectionArray[section].eventIds.length;
        };
        AgendaTableViewController.LO_MESSAGE = 'agenda loading';
        return AgendaTableViewController;
    })(TableViewController);

    var EventSection = (function () {
        function EventSection(_sectionName, _eventIds) {
            this._sectionName = _sectionName;
            this._eventIds = _eventIds;
        }
        Object.defineProperty(EventSection.prototype, "sectionName", {
            get: function () {
                return this._sectionName;
            },
            set: function (value) {
                this._sectionName = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventSection.prototype, "eventIds", {
            get: function () {
                return this._eventIds;
            },
            set: function (value) {
                this._eventIds = value;
            },
            enumerable: true,
            configurable: true
        });
        return EventSection;
    })();

    
    return AgendaTableViewController;
});