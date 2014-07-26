/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');
import BrowserEvents = require("../Core/BrowserEvents");
import InvalidActionException = require('../Core/InvalidActionException');
import InvalidArgumentException = require("../Core/InvalidArgumentException");
import Set = require('../DataStructures/Set');

class View 
{
    private static JQUERY_DATA_KEY = 'view_object';
    private static _viewCount = 0; // Used to make sure toString() is unique
    private _viewNumber: number;
    _$el: JQuery = null;
    _parentView: View = null;
    _children: Set<View> = new Set<View>();
    /******************************************************************
      Properties
      ****************************************************************/

    /**
      * The parent view of the view, if exists. Null if no parent
      */
    get parentView(): View
    {
        return this._parentView;
    }

    /**
      * Immutable array of child views
      */
    get children(): View[]
    {
        return this._children.toArray();
    }

    /**
      * Physical width of the view
      */
    get width(): number
    {
        return this._$el.width();
    }
    set width(newValue: number)
    {
        this._$el.width(newValue);
    }

    /**
      * Physical height of the view
      */
    get height(): number
    {
        return this._$el.height();
    }
    set height(newValue: number)
    {
        this._$el.height(newValue);
    }

    /******************************************************************
      Methods
      ****************************************************************/
    
    /**
      * Initialize a new View object from the JQuery element.
      * Throws an error if the JQuery element already belongs to another
      * View object.
      */
    constructor($element: JQuery)
    {
        if ($element === null)
        {
            throw new InvalidArgumentException('A JQuery element must be specified');
        }
        if ($element.data(View.JQUERY_DATA_KEY) instanceof View)
        {
            throw new InvalidActionException('View is already initialized.');
        }
        if ($element.length != 1)
        {
            throw new InvalidArgumentException('The JQuery element must have exactly one html DOM object.');
        }
        this._viewNumber = View._viewCount++;
        this._$el = $element;
        this._$el.data(View.JQUERY_DATA_KEY, this);
    }

    /**
      * Returns true if the view associated with the jQuery element has
      * been initialized.
      */
    static _viewIsInitialized($element: JQuery) : boolean
    {
        return $element.data(View.JQUERY_DATA_KEY) instanceof View;
    }

    /**
      * Initialize a new View object from the JQuery element, or return
      * an existing one.
      * NOTE: initialization must happen top-down. That is, once a view is
      * initialized, all its ancestors (parent, grandparent, etc.) must
      * either already be initialized, or they can be initialized as a 
      * generic view class.
      */
    public static fromJQuery($element: JQuery) : View
    {
        if (this._viewIsInitialized($element))
        {
            return $element.data(View.JQUERY_DATA_KEY);
        }
        // because the view has not been initalized, it will not belong to
        // the parent's children list yet. We can safely add it
        var view = new this($element);
        if ($element.parent().length > 0)
        {
            // parent exists
            var parentView = View.fromJQuery($element.parent()); // use View instead of 'this' so we assume that parent is a generic view
            parentView._children.add(view)
        }
        return view;
    }

    /**
      * Append childView to this view. childView cannot already have a parent
      */
    public append(childView: View) : void 
    {
        if (this._children.contains(childView))
        {
            throw new InvalidActionException('Cannot add a child view twice.');
        }
        if (childView._parentView != null)
        {
            throw new InvalidActionException('A view can only have one parent.');
        }
        this._$el.append(childView._$el);
        this._children.add(childView);
        childView._parentView = this;
        this.triggerEvent(BrowserEvents.viewWasAppended, {
            childView: childView,
            parentView: this,
        });
    }

    /**
      * Remove this view from its parent. Cannot be called if this view 
      * does not have a parent.
      */
    public removeFromParent() : void
    {
        var parentView = this._parentView;
        if (parentView !== null)
        {
            throw new InvalidActionException('Cannot call removeFromParent() on a view that does not have a parent.');
        }
        this._$el.detach();
        parentView._children.remove(this);
        this._parentView = null;
        parentView.triggerEvent(BrowserEvents.viewWasRemoved, {
            childView: this,
            parentView: parentView,
        });
    }

    /**
      * Attach an event handler to the view
      */
    public attachEventHandler(ev : string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    public attachEventHandler(ev : string, selector: string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any);
    public attachEventHandler(ev : string, argumentThree: any, handler?: (eventObject: JQueryEventObject, ...eventData: any[]) => any)
    {
        var eventName = ev;
        var $element = this._$el;
        if (typeof argumentThree === 'string' || argumentThree instanceof String || argumentThree.constructor === String)
        {
            if (handler === undefined)
            {
                throw new InvalidArgumentException("No handler provided.");
            }
            $element.on(eventName, <string> argumentThree, handler);
        }
        else if (typeof argumentThree === 'function')
        {
            $element.on(eventName, argumentThree);
        }
        else
        {
            throw new InvalidArgumentException("The second argument must either be a string or a function.");
        }
    }

    public triggerEvent(ev: string);
    public triggerEvent(ev: string, extraParameter : any);
    public triggerEvent(ev: string, extraParameter? : any)
    {
        var eventName = ev;
        if (extraParameter === undefined || extraParameter === null)
        {
            extraParameter = {};
        }
        extraParameter.view = this;
        this._$el.trigger(eventName, extraParameter);
    }

    /**
      * Returns true if $element is the view itself
      * or is a descendent of the view.
      */
    public containsJQueryElement($element : JQuery) : boolean
    {
        return this._$el.is($element) || this._$el.find($element).length != 0;
    }

    public removeAllChildren() : void
    {
        $.each(this.children, (index: number, child: View) =>
                {
                    child.removeFromParent();
                });
        this._children = new Set<View>();
    }

    /**
      * Unique
      */
    public toString() : string
    {
        return 'View no. ' + this._viewNumber;
    }
}
export = View;