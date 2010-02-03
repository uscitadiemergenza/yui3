YUI.add('dd-delegate', function(Y) {

    /**
     * Provides the ability to drag multiple nodes under a container element using only one Y.DD.Drag instance as a delegate.
     * @module dd
     * @submodule dd-delegate
     */     
    /**
     * Provides the ability to drag multiple nodes under a container element using only one Y.DD.Drag instance as a delegate.
     * @class Delegate
     * @extends Base
     * @constructor
     * @namespace DD
     */


    var Delegate = function(o) {
        Delegate.superclass.constructor.apply(this, arguments);
    },
    CONT = 'container',
    NODES = 'nodes',
    _tmpNode = Y.Node.create('<div>Temp Node</div>');


    Y.extend(Delegate, Y.Base, {
        /**
        * @property dd
        * @description A reference to the temporary dd instance used under the hood.
        */    
        dd: null,
        /**
        * @property _shimState
        * @private
        * @description The state of the Y.DD.DDM._noShim property to it can be reset.
        */    
        _shimState: null,
        /**
        * @private
        * @method _onNodeChange
        * @description Listens to the nodeChange event and sets the dragNode on the temp dd instance.
        * @param {Event} e The Event.
        */
        _onNodeChange: function(e) {
            this.set('dragNode', e.newVal);
        },
        /**
        * @private
        * @method _afterDragEnd
        * @description Listens for the drag:end event and updates the temp dd instance.
        * @param {Event} e The Event.
        */
        _afterDragEnd: function(e) {
            var self = this;
            Y.DD.DDM._noShim = self._shimState;
            self.set('lastNode', self.dd.get('node'));
            self.get('lastNode').removeClass(Y.DD.DDM.CSS_PREFIX + '-dragging');
            self.dd._unprep();
            self.dd.set('node', _tmpNode);
        },
        /**
        * @private
        * @method _onDelegate
        * @description The callback for the Y.DD.Delegate instance used
        * @param {Event} e The MouseDown Event.
        */
        _onDelegate: function(e) {
            var tar = e.currentTarget,
                self = this, dd = self.dd;
            if (tar.test(self.get(NODES)) && !tar.test(self.get('invalid'))) {
                self._shimState = Y.DD.DDM._noShim;
                Y.DD.DDM._noShim = true;
                self.set('currentNode', tar);
                dd.set('node', tar);
                if (dd.proxy) {
                    dd.set('dragNode', Y.DD.DDM._proxy);
                } else {
                    dd.set('dragNode', tar);
                }
                dd._prep();
                dd.fire('drag:mouseDown', { ev: e });
            }
        },
        /**
        * @private
        * @method _onMouseEnter
        * @description Sets the target shim state
        * @param {Event} e The MouseEnter Event
        */
        _onMouseEnter: function(e) {
            this._shimState = Y.DD.DDM._noShim;
            Y.DD.DDM._noShim = true;
        },
        /**
        * @private
        * @method _onMouseLeave
        * @description Resets the target shim state
        * @param {Event} e The MouseLeave Event
        */
        _onMouseLeave: function(e) {
            Y.DD.DDM._noShim = this._shimState;
        },
        initializer: function(cfg) {
            if (!Y.Object.hasKey(cfg, 'bubbleTargets')) {
                this.addTarget(Y.DD.DDM);
            }
            //Create a tmp DD instance under the hood.
            var conf = this.get('dragConfig') || {},
                cont = this.get(CONT);

            conf.node = _tmpNode.cloneNode(true);
            conf.bubbleTargets = this;

            if (this.get('handles')) {
                conf.handles = this.get('handles');
            }

            this.dd = new Y.DD.Drag(conf);

            //On end drag, detach the listeners
            this.dd.after('drag:end', Y.bind(this._afterDragEnd, this));
            this.dd.on('dragNodeChange', Y.bind(this._onNodeChange, this));

            //Attach the delegate to the container
            Y.delegate('mousedown', Y.bind(this._onDelegate, this), cont, this.get(NODES));

            Y.on('mouseenter', Y.bind(this._onMouseEnter, this), cont);

            Y.on('mouseleave', Y.bind(this._onMouseLeave, this), cont);

            Y.later(10, this, this.syncTargets);
            Y.DD.DDM.regDelegate(this);
        },
        /**
        * @method syncTargets
        * @description Applies the Y.Plugin.Drop to all nodes matching the cont + nodes selector query.
        * @param {String} group The default group to assign this target to. Optional.
        * @return {Self}
        * @chainable
        */        
        syncTargets: function(group) {
            if (!Y.Plugin.Drop) {
                return;
            }
            var items, groups, self = this;

            if (self.get('target')) {
                items = Y.one(self.get(CONT)).all(self.get(NODES));
                groups = self.dd.get('groups');

                if (group) {
                    groups = [group];
                }

                items.each(function(i) {
                    self.createDrop(i, groups);
                });
            }
            return self;
        },
        /**
        * @method createDrop
        * @description Apply the Drop plugin to this node
        * @param {Node} node The Node to apply the plugin to
        * @param {Array} groups The default groups to assign this target to.
        * @return Node
        */
        createDrop: function(node, groups) {
            var config = {
                useShim: false,
                bubbleTargets: this
            };

            if (!node.drop) {
                node.plug(Y.Plugin.Drop, config);
            }
            node.drop.set('groups', groups);
            return node;
        },
        destructor: function() {
            if (this.dd) {
                this.dd.destroy();
            }
            if (Y.Plugin.Drop) {
                var targets = Y.one(this.get(CONT)).all(this.get(NODES));
                targets.unplug(Y.Plugin.Drop);
            }
        }
    }, {
        NAME: 'delegate',
        ATTRS: {
            /**
            * @attribute container
            * @description A selector query to get the container to listen for mousedown events on. All "nodes" should be a child of this container.
            * @type String
            */    
            container: {
                value: 'body'
            },
            /**
            * @attribute nodes
            * @description A selector query to get the children of the "container" to make draggable elements from.
            * @type String
            */        
            nodes: {
                value: '.dd-draggable'
            },
            /**
            * @attribute invalid
            * @description A selector query to test a node to see if it's an invalid item.
            * @type String
            */        
            invalid: {
                value: ''
            },
            /**
            * @attribute lastNode
            * @description Y.Node instance of the last item dragged.
            * @type Node
            */        
            lastNode: {
                value: _tmpNode
            },
            /**
            * @attribute currentNode
            * @description Y.Node instance of the dd node.
            * @type Node
            */        
            currentNode: {
                value: _tmpNode
            },
            /**
            * @attribute dragNode
            * @description Y.Node instance of the dd dragNode.
            * @type Node
            */        
            dragNode: {
                value: _tmpNode
            },
            /**
            * @attribute over
            * @description Is the mouse currently over the container
            * @type Boolean
            */        
            over: {
                value: false
            },
            /**
            * @attribute target
            * @description Should the items also be a drop target.
            * @type Boolean
            */        
            target: {
                value: false
            },
            /**
            * @attribute dragConfig
            * @description The default config to be used when creating the DD instance.
            * @type Object
            */        
            dragConfig: {
                value: null
            },
            /**
            * @attribute handles
            * @description The handles config option added to the temp DD instance.
            * @type Array
            */        
            handles: {
                value: null
            }
        }
    });

    Y.mix(Y.DD.DDM, {
        /**
        * @private
        * @for DDM
        * @property _delegates
        * @description Holder for all Y.DD.Delegate instances
        * @type Array
        */
        _delegates: [],
        /**
        * @for DDM
        * @method regDelegate
        * @description Register a Delegate with the DDM
        */
        regDelegate: function(del) {
            this._delegates.push(del);
        },
        /**
        * @for DDM
        * @method getDelegate
        * @description Get a delegate instance from a container node
        * @returns Y.DD.Delegate
        */
        getDelegate: function(node) {
            var del = null;
            node = Y.one(node);
            Y.each(this._delegates, function(v) {
                if (node.test(v.get(CONT))) {
                    del = v;
                }
            }, this);
            return del;
        }
    });

    Y.namespace('DD');    
    Y.DD.Delegate = Delegate;

}, '@VERSION@' ,{requires:['dd-drag', 'event-mouseenter'], skinnable:false});
