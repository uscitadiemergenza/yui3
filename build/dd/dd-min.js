YUI.add("dd-ddm-base",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};A.NAME="ddm";A.ATTRS={dragCursor:{value:"move"},clickPixelThresh:{value:3},clickTimeThresh:{value:1000},throttleTime:{value:150},dragMode:{value:"point",setter:function(C){this._setDragMode(C);return C;}}};B.extend(A,B.Base,{_active:null,_setDragMode:function(C){if(C===null){C=B.DD.DDM.get("dragMode");}switch(C){case 1:case"intersect":return 1;case 2:case"strict":return 2;case 0:case"point":return 0;}return 0;},CSS_PREFIX:"yui-dd",_activateTargets:function(){},_drags:[],activeDrag:false,_regDrag:function(C){if(this.getDrag(C.get("node"))){return false;}if(!this._active){this._setupListeners();}this._drags.push(C);return true;},_unregDrag:function(D){var C=[];B.each(this._drags,function(F,E){if(F!==D){C[C.length]=F;}});this._drags=C;},_setupListeners:function(){this._active=true;var C=B.one(document);C.on("mousemove",B.throttle(B.bind(this._move,this),this.get("throttleTime")));C.on("mouseup",B.bind(this._end,this));},_start:function(){this.fire("ddm:start");this._startDrag();},_startDrag:function(){},_endDrag:function(){},_dropMove:function(){},_end:function(){if(this.activeDrag){this._endDrag();this.fire("ddm:end");this.activeDrag.end.call(this.activeDrag);this.activeDrag=null;}},stopDrag:function(){if(this.activeDrag){this._end();}return this;},_move:function(C){if(this.activeDrag){this.activeDrag._move.call(this.activeDrag,C);this._dropMove();}},cssSizestoObject:function(D){var C=D.split(" ");switch(C.length){case 1:C[1]=C[2]=C[3]=C[0];break;case 2:C[2]=C[0];C[3]=C[1];break;case 3:C[3]=C[1];break;}return{top:parseInt(C[0],10),right:parseInt(C[1],10),bottom:parseInt(C[2],10),left:parseInt(C[3],10)};},getDrag:function(D){var C=false,E=B.one(D);if(E instanceof B.Node){B.each(this._drags,function(G,F){if(E.compareTo(G.get("node"))){C=G;}});}return C;},swapPosition:function(D,C){D=B.DD.DDM.getNode(D);C=B.DD.DDM.getNode(C);var F=D.getXY(),E=C.getXY();D.setXY(E);C.setXY(F);return D;},getNode:function(C){if(C&&C.get){if(B.Widget&&(C instanceof B.Widget)){C=C.get("boundingBox");}else{C=C.get("node");}}else{C=B.one(C);}return C;},swapNode:function(E,C){E=B.DD.DDM.getNode(E);C=B.DD.DDM.getNode(C);var F=C.get("parentNode"),D=C.get("nextSibling");if(D==E){F.insertBefore(E,C);}else{if(C==E.get("nextSibling")){F.insertBefore(C,E);}else{E.get("parentNode").replaceChild(C,E);F.insertBefore(E,D);}}return E;}});B.namespace("DD");B.DD.DDM=new A();},"@VERSION@",{requires:["node","base","yui-throttle"],skinnable:false});YUI.add("dd-ddm",function(A){A.mix(A.DD.DDM,{_pg:null,_debugShim:false,_activateTargets:function(){},_deactivateTargets:function(){},_startDrag:function(){if(this.activeDrag.get("useShim")){this._pg_activate();this._activateTargets();}},_endDrag:function(){this._pg_deactivate();this._deactivateTargets();},_pg_deactivate:function(){this._pg.setStyle("display","none");},_pg_activate:function(){var B=this.activeDrag.get("activeHandle"),C="auto";if(B){C=B.getStyle("cursor");}if(C=="auto"){C=this.get("dragCursor");}this._pg_size();this._pg.setStyles({top:0,left:0,display:"block",opacity:((this._debugShim)?".5":"0"),cursor:C});},_pg_size:function(){if(this.activeDrag){var B=A.one("body"),D=B.get("docHeight"),C=B.get("docWidth");this._pg.setStyles({height:D+"px",width:C+"px"});}},_createPG:function(){var D=A.Node.create("<div></div>"),B=A.one("body"),C;D.setStyles({top:"0",left:"0",position:"absolute",zIndex:"9999",overflow:"hidden",backgroundColor:"red",display:"none",height:"5px",width:"5px"});D.set("id",A.stamp(D));D.addClass("yui-dd-shim");if(B.get("firstChild")){B.insertBefore(D,B.get("firstChild"));}else{B.appendChild(D);}this._pg=D;this._pg.on("mouseup",A.bind(this._end,this));this._pg.on("mousemove",A.throttle(A.bind(this._move,this),this.get("throttleTime")));C=A.one(window);A.on("window:resize",A.bind(this._pg_size,this));C.on("scroll",A.bind(this._pg_size,this));}},true);A.on("domready",A.bind(A.DD.DDM._createPG,A.DD.DDM));},"@VERSION@",{requires:["dd-ddm-base","event-resize"],skinnable:false});YUI.add("dd-ddm-drop",function(A){A.mix(A.DD.DDM,{_noShim:false,_activeShims:[],_hasActiveShim:function(){if(this._noShim){return true;}return this._activeShims.length;},_addActiveShim:function(B){this._activeShims[this._activeShims.length]=B;},_removeActiveShim:function(C){var B=[];A.each(this._activeShims,function(E,D){if(E._yuid!==C._yuid){B[B.length]=E;}});this._activeShims=B;},syncActiveShims:function(B){A.later(0,this,function(C){var D=((C)?this.targets:this._lookup());A.each(D,function(F,E){F.sizeShim.call(F);},this);},B);},mode:0,POINT:0,INTERSECT:1,STRICT:2,useHash:true,activeDrop:null,validDrops:[],otherDrops:{},targets:[],_addValid:function(B){this.validDrops[this.validDrops.length]=B;return this;},_removeValid:function(B){var C=[];A.each(this.validDrops,function(E,D){if(E!==B){C[C.length]=E;}});this.validDrops=C;return this;},isOverTarget:function(C){if(this.activeDrag&&C){var G=this.activeDrag.mouseXY,F,B=this.activeDrag.get("dragMode"),E,D=C.shim;if(G&&this.activeDrag){E=this.activeDrag.region;if(B==this.STRICT){return this.activeDrag.get("dragNode").inRegion(C.region,true,E);}else{if(C&&C.shim){if((B==this.INTERSECT)&&this._noShim){F=((E)?E:this.activeDrag.get("node"));return C.get("node").intersect(F).inRegion;}else{if(this._noShim){D=C.get("node");}return D.intersect({top:G[1],bottom:G[1],left:G[0],right:G[0]},C.region).inRegion;}}else{return false;}}}else{return false;}}else{return false;}},clearCache:function(){this.validDrops=[];this.otherDrops={};this._activeShims=[];},_activateTargets:function(){this._noShim=true;this.clearCache();A.each(this.targets,function(C,B){C._activateShim.apply(C,[]);if(C.get("noShim")==true){this._noShim=false;}},this);this._handleTargetOver();},getBestMatch:function(F,D){var C=null,E=0,B;A.each(F,function(I,H){var G=this.activeDrag.get("dragNode").intersect(I.get("node"));I.region.area=G.area;if(G.inRegion){if(G.area>E){E=G.area;C=I;}}},this);if(D){B=[];
A.each(F,function(H,G){if(H!==C){B[B.length]=H;}},this);return[C,B];}else{return C;}},_deactivateTargets:function(){var B=[],C,E=this.activeDrag,D=this.activeDrop;if(E&&D&&this.otherDrops[D]){if(!E.get("dragMode")){B=this.otherDrops;delete B[D];}else{C=this.getBestMatch(this.otherDrops,true);D=C[0];B=C[1];}E.get("node").removeClass(this.CSS_PREFIX+"-drag-over");if(D){D.fire("drop:hit",{drag:E,drop:D,others:B});E.fire("drag:drophit",{drag:E,drop:D,others:B});}}else{if(E&&E.get("dragging")){E.get("node").removeClass(this.CSS_PREFIX+"-drag-over");E.fire("drag:dropmiss",{pageX:E.lastXY[0],pageY:E.lastXY[1]});}else{}}this.activeDrop=null;A.each(this.targets,function(G,F){G._deactivateShim.apply(G,[]);},this);},_dropMove:function(){if(this._hasActiveShim()){this._handleTargetOver();}else{A.each(this.otherDrops,function(C,B){C._handleOut.apply(C,[]);});}},_lookup:function(){if(!this.useHash||this._noShim){return this.validDrops;}var B=[];A.each(this.validDrops,function(D,C){if(D.shim&&D.shim.inViewportRegion(false,D.region)){B[B.length]=D;}});return B;},_handleTargetOver:function(){var B=this._lookup();A.each(B,function(D,C){D._handleTargetOver.call(D);},this);},_regTarget:function(B){this.targets[this.targets.length]=B;},_unregTarget:function(C){var B=[],D;A.each(this.targets,function(F,E){if(F!=C){B[B.length]=F;}},this);this.targets=B;D=[];A.each(this.validDrops,function(F,E){if(F!==C){D[D.length]=F;}});this.validDrops=D;},getDrop:function(C){var B=false,D=A.one(C);if(D instanceof A.Node){A.each(this.targets,function(F,E){if(D.compareTo(F.get("node"))){B=F;}});}return B;}},true);},"@VERSION@",{requires:["dd-ddm"],skinnable:false});YUI.add("dd-drag",function(D){var E=D.DD.DDM,U="node",G="dragging",N="dragNode",C="offsetHeight",K="offsetWidth",S="mouseup",P="mousedown",M="dragstart",H="drag:mouseDown",B="drag:afterMouseDown",F="drag:removeHandle",L="drag:addHandle",R="drag:removeInvalid",T="drag:addInvalid",J="drag:start",I="drag:end",O="drag:drag",Q="drag:align",A=function(W){this._lazyAddAttrs=false;A.superclass.constructor.apply(this,arguments);var V=E._regDrag(this);if(!V){D.error("Failed to register node, already in use: "+W.node);}};A.NAME="drag";A.ATTRS={node:{setter:function(V){var W=D.one(V);if(!W){D.error("DD.Drag: Invalid Node Given: "+V);}else{W=W.item(0);}return W;}},dragNode:{setter:function(V){var W=D.one(V);if(!W){D.error("DD.Drag: Invalid dragNode Given: "+V);}return W;}},offsetNode:{value:true},clickPixelThresh:{value:E.get("clickPixelThresh")},clickTimeThresh:{value:E.get("clickTimeThresh")},lock:{value:false,setter:function(V){if(V){this.get(U).addClass(E.CSS_PREFIX+"-locked");}else{this.get(U).removeClass(E.CSS_PREFIX+"-locked");}return V;}},data:{value:false},move:{value:true},useShim:{value:true},activeHandle:{value:false},primaryButtonOnly:{value:true},dragging:{value:false},parent:{value:false},target:{value:false,setter:function(V){this._handleTarget(V);return V;}},dragMode:{value:null,setter:function(V){return E._setDragMode(V);}},groups:{value:["default"],getter:function(){if(!this._groups){this._groups={};}var V=[];D.each(this._groups,function(X,W){V[V.length]=W;});return V;},setter:function(V){this._groups={};D.each(V,function(X,W){this._groups[X]=true;},this);return V;}},handles:{value:null,setter:function(V){if(V){this._handles={};D.each(V,function(X,W){this._handles[X]=true;},this);}else{this._handles=null;}return V;}},};D.extend(A,D.Base,{addToGroup:function(V){this._groups[V]=true;E._activateTargets();return this;},removeFromGroup:function(V){delete this._groups[V];E._activateTargets();return this;},target:null,_handleTarget:function(V){if(D.DD.Drop){if(V===false){if(this.target){E._unregTarget(this.target);this.target=null;}return false;}else{if(!D.Lang.isObject(V)){V={};}V.node=this.get(U);V.groups=V.groups||this.get("groups");this.target=new D.DD.Drop(V);}}else{return false;}},_groups:null,_createEvents:function(){this.publish(H,{defaultFn:this._defMouseDownFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(Q,{defaultFn:this._defAlignFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(O,{defaultFn:this._defDragFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(I,{preventedFn:this._prevEndFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});var V=[B,F,L,R,T,J,"drag:drophit","drag:dropmiss","drag:over","drag:enter","drag:exit"];D.each(V,function(X,W){this.publish(X,{type:X,emitFacade:true,bubbles:true,preventable:false,queuable:false,prefix:"drag"});},this);},_ev_md:null,_startTime:null,_endTime:null,_handles:null,_invalids:null,_invalidsDefault:{"textarea":true,"input":true,"a":true,"button":true,"select":true},_dragThreshMet:null,_fromTimeout:null,_clickTimeout:null,deltaXY:null,startXY:null,nodeXY:null,lastXY:null,actXY:null,realXY:null,mouseXY:null,region:null,_handleMouseUp:function(V){this._fixIEMouseUp();if(E.activeDrag){E._end();}},_fixDragStart:function(V){V.preventDefault();},_ieSelectFix:function(){return false;},_ieSelectBack:null,_fixIEMouseDown:function(){if(D.UA.ie){this._ieSelectBack=D.config.doc.body.onselectstart;D.config.doc.body.onselectstart=this._ieSelectFix;}},_fixIEMouseUp:function(){if(D.UA.ie){D.config.doc.body.onselectstart=this._ieSelectBack;}},_handleMouseDownEvent:function(V){this.fire(H,{ev:V});},_defMouseDownFn:function(W){var V=W.ev;this._dragThreshMet=false;this._ev_md=V;if(this.get("primaryButtonOnly")&&V.button>1){return false;}if(this.validClick(V)){this._fixIEMouseDown();V.halt();this._setStartPosition([V.pageX,V.pageY]);E.activeDrag=this;this._clickTimeout=D.later(this.get("clickTimeThresh"),this,this._timeoutCheck);}this.fire(B,{ev:V});},validClick:function(Z){var Y=false,b=false,V=Z.target,X=null,W=null,a=false;if(this._handles){D.each(this._handles,function(c,d){if(D.Lang.isString(d)){if(V.test(d+", "+d+" *")&&!X){X=d;Y=true;}}});}else{b=this.get(U);if(b.contains(V)||b.compareTo(V)){Y=true;}}if(Y){if(this._invalids){D.each(this._invalids,function(c,d){if(D.Lang.isString(d)){if(V.test(d+", "+d+" *")){Y=false;
}}});}}if(Y){if(X){W=Z.currentTarget.all(X);a=false;W.each(function(d,c){if((d.contains(V)||d.compareTo(V))&&!a){a=true;this.set("activeHandle",d);}},this);}else{this.set("activeHandle",this.get(U));}}return Y;},_setStartPosition:function(V){this.startXY=V;this.nodeXY=this.lastXY=this.realXY=this.get(U).getXY();if(this.get("offsetNode")){this.deltaXY=[(this.startXY[0]-this.nodeXY[0]),(this.startXY[1]-this.nodeXY[1])];}else{this.deltaXY=[0,0];}},_timeoutCheck:function(){if(!this.get("lock")&&!this._dragThreshMet){this._fromTimeout=this._dragThreshMet=true;this.start();this._alignNode([this._ev_md.pageX,this._ev_md.pageY],true);}},removeHandle:function(V){if(this._handles[V]){delete this._handles[V];this.fire(F,{handle:V});}return this;},addHandle:function(V){if(!this._handles){this._handles={};}if(D.Lang.isString(V)){this._handles[V]=true;this.fire(L,{handle:V});}return this;},removeInvalid:function(V){if(this._invalids[V]){this._invalids[V]=null;delete this._invalids[V];this.fire(R,{handle:V});}return this;},addInvalid:function(V){if(D.Lang.isString(V)){this._invalids[V]=true;this.fire(T,{handle:V});}return this;},initializer:function(V){if(!D.Object.hasKey(V,"bubbleTargets")){this.addTarget(D.DD.DDM);}this.get(U).dd=this;if(!this.get(U).get("id")){var W=D.stamp(this.get(U));this.get(U).set("id",W);}this.actXY=[];this._invalids=D.clone(this._invalidsDefault,true);this._createEvents();if(!this.get(N)){this.set(N,this.get(U));}this.on("initializedChange",D.bind(this._prep,this));this.set("groups",this.get("groups"));},_prep:function(){this._dragThreshMet=false;var V=this.get(U);V.addClass(E.CSS_PREFIX+"-draggable");V.on(P,D.bind(this._handleMouseDownEvent,this));V.on(S,D.bind(this._handleMouseUp,this));V.on(M,D.bind(this._fixDragStart,this));},_unprep:function(){var V=this.get(U);V.removeClass(E.CSS_PREFIX+"-draggable");V.detachAll();},start:function(){if(!this.get("lock")&&!this.get(G)){var W=this.get(U),V=W.get(K),X=W.get(C),Y;this._startTime=(new Date()).getTime();E._start();W.addClass(E.CSS_PREFIX+"-dragging");this.fire(J,{pageX:this.nodeXY[0],pageY:this.nodeXY[1],startTime:this._startTime});Y=this.nodeXY;this.region={"0":Y[0],"1":Y[1],area:0,top:Y[1],right:Y[0]+V,bottom:Y[1]+X,left:Y[0]};this.set(G,true);}return this;},end:function(){this._endTime=(new Date()).getTime();if(this._clickTimeout){this._clickTimeout.cancel();}this._dragThreshMet=false;this._fromTimeout=false;if(!this.get("lock")&&this.get(G)){this.fire(I,{pageX:this.lastXY[0],pageY:this.lastXY[1],startTime:this._startTime,endTime:this._endTime});}this.get(U).removeClass(E.CSS_PREFIX+"-dragging");this.set(G,false);this.deltaXY=[0,0];return this;},_prevEndFn:function(V){this.get(N).setXY(this.nodeXY);},_align:function(V){this.fire(Q,{pageX:V[0],pageY:V[1]});},_defAlignFn:function(V){this.actXY=[V.pageX-this.deltaXY[0],V.pageY-this.deltaXY[1]];},_alignNode:function(V){this._align(V);this._moveNode();},_moveNode:function(V){var W=[],X=[],Z=this.nodeXY,Y=this.actXY;W[0]=(Y[0]-this.lastXY[0]);W[1]=(Y[1]-this.lastXY[1]);X[0]=(Y[0]-this.nodeXY[0]);X[1]=(Y[1]-this.nodeXY[1]);this.region={"0":Y[0],"1":Y[1],area:0,top:Y[1],right:Y[0]+this.get(N).get(K),bottom:Y[1]+this.get(N).get(C),left:Y[0]};this.fire(O,{pageX:Y[0],pageY:Y[1],scroll:V,info:{start:Z,xy:Y,delta:W,offset:X}});this.lastXY=Y;},_defDragFn:function(V){if(this.get("move")){if(V.scroll){V.scroll.node.set("scrollTop",V.scroll.top);V.scroll.node.set("scrollLeft",V.scroll.left);}this.get(N).setXY([V.pageX,V.pageY]);this.realXY=[V.pageX,V.pageY];}},_move:function(X){if(this.get("lock")){return false;}else{this.mouseXY=[X.pageX,X.pageY];if(!this._dragThreshMet){var W=Math.abs(this.startXY[0]-X.pageX),V=Math.abs(this.startXY[1]-X.pageY);if(W>this.get("clickPixelThresh")||V>this.get("clickPixelThresh")){this._dragThreshMet=true;this.start();this._alignNode([X.pageX,X.pageY]);}}else{if(this._clickTimeout){this._clickTimeout.cancel();}this._alignNode([X.pageX,X.pageY]);}}},stopDrag:function(){if(this.get(G)){E._end();}return this;},destructor:function(){this._unprep();this.detachAll();if(this.target){this.target.destroy();}E._unregDrag(this);}});D.namespace("DD");D.DD.Drag=A;},"@VERSION@",{requires:["dd-ddm-base"],skinnable:false});YUI.add("dd-proxy",function(H){var F=H.DD.DDM,B="node",C="dragNode",A="host",D=true,E,G=function(I){G.superclass.constructor.apply(this,arguments);};G.NAME="DDProxy";G.NS="proxy";G.ATTRS={host:{},moveOnEnd:{value:D},hideOnEnd:{value:D},resizeFrame:{value:D},positionProxy:{value:D},borderStyle:{value:"1px solid #808080"},cloneNode:{value:false}};E={_hands:null,_init:function(){if(!F._proxy){H.on("domready",H.bind(this._init,this));return;}if(!this._hands){this._hands=[];}var K,J,L=this.get(A),I=L.get(C);if(I.compareTo(L.get(B))){if(F._proxy){L.set(C,F._proxy);}}H.each(this._hands,function(M){M.detach();});K=F.on("ddm:start",H.bind(function(){if(F.activeDrag===L){F._setFrame(L);}},this));J=F.on("ddm:end",H.bind(function(){if(L.get("dragging")){if(this.get("moveOnEnd")){L.get(B).setXY(L.lastXY);}if(this.get("hideOnEnd")){L.get(C).setStyle("display","none");}if(this.get("cloneNode")){L.get(C).remove();L.set(C,F._proxy);}}},this));this._hands=[K,J];},initializer:function(){this._init();},destructor:function(){var I=this.get(A);H.each(this._hands,function(J){J.detach();});I.set(C,I.get(B));},clone:function(){var I=this.get(A),K=I.get(B),J=K.cloneNode(true);J.set("id","");J.setStyle("position","absolute");delete J._yuid;H.stamp(J);K.get("parentNode").appendChild(J);I.set(C,J);return J;}};H.namespace("Plugin");H.extend(G,H.Base,E);H.Plugin.DDProxy=G;H.mix(F,{_createFrame:function(){if(!F._proxy){F._proxy=D;var J=H.Node.create("<div></div>"),I=H.one("body");J.setStyles({position:"absolute",display:"none",zIndex:"999",top:"-999px",left:"-999px"});I.insertBefore(J,I.get("firstChild"));J.set("id",H.stamp(J));J.addClass(F.CSS_PREFIX+"-proxy");F._proxy=J;}},_setFrame:function(J){var M=J.get(B),L=J.get(C),I,K="auto";if(J.proxy.get("resizeFrame")){F._proxy.setStyles({height:M.get("offsetHeight")+"px",width:M.get("offsetWidth")+"px"});
}I=F.activeDrag.get("activeHandle");if(I){K=I.getStyle("cursor");}if(K=="auto"){K=F.get("dragCursor");}L.setStyles({visibility:"hidden",display:"block",cursor:K,border:J.proxy.get("borderStyle")});if(J.proxy.get("cloneNode")){L=J.proxy.clone();}if(J.proxy.get("positionProxy")){L.setXY(J.nodeXY);}L.setStyle("visibility","visible");}});H.on("domready",H.bind(F._createFrame,F));},"@VERSION@",{requires:["dd-ddm","dd-drag"],skinnable:false});YUI.add("dd-constrain",function(B){var K="dragNode",M="offsetHeight",F="offsetWidth",Q="host",P="constrain2region",H="constrain2node",G="tickXArray",O="tickYArray",N=B.DD.DDM,E="top",J="right",L="bottom",D="left",I=null,A=function(C){A.superclass.constructor.apply(this,arguments);};A.NAME="ddConstrained";A.NS="con";A.ATTRS={host:{},stickX:{value:false},stickY:{value:false},tickX:{value:false},tickY:{value:false},tickXArray:{value:false},tickYArray:{value:false},constrain2region:{value:false,getter:function(C){if(B.Lang.isObject(C)){var R={};B.mix(R,C);return R;}else{return false;}},setter:function(C){if(B.Lang.isObject(C)){if(B.Lang.isNumber(C[E])&&B.Lang.isNumber(C[J])&&B.Lang.isNumber(C[D])&&B.Lang.isNumber(C[L])){var R={};B.mix(R,C);return R;}else{return false;}}else{if(C!==false){return false;}}return C;}},gutter:{value:"0",setter:function(C){return B.DD.DDM.cssSizestoObject(C);}},constrain2node:{value:false,setter:function(R){if(!this.get(P)){var C=B.one(R);if(C){return C;}}else{if(this.get(P)!==false){}}return false;}},constrain2view:{value:false},cacheRegion:{value:true}};I={initializer:function(){this.get(Q).on("drag:start",B.bind(this._handleStart,this));this.get(Q).after("drag:align",B.bind(this.align,this));},_handleStart:function(){this.resetCache();},_regionCache:null,_cacheRegion:function(){this._regionCache=this.get(H).get("region");},resetCache:function(){this._regionCache=null;},getRegion:function(V){var T={},U=null,C=null,S=this.get("gutter"),R=this.get(Q);if(this.get(H)){if(!this._regionCache){B.on("resize",B.bind(this._cacheRegion,this),window);this._cacheRegion();}T=B.clone(this._regionCache);if(!this.get("cacheRegion")){this.resetCache();}}else{if(this.get(P)){T=this.get(P);}else{if(this.get("constrain2view")){T=R.get(K).get("viewportRegion");}else{return false;}}}B.each(S,function(W,X){if((X==J)||(X==L)){T[X]-=W;}else{T[X]+=W;}});if(V){U=R.get(K).get(M);C=R.get(K).get(F);T[J]=T[J]-C;T[L]=T[L]-U;}return T;},_checkRegion:function(C){var S=C,U=this.getRegion(),T=this.get(Q),V=T.get(K).get(M),R=T.get(K).get(F);if(S[1]>(U[L]-V)){C[1]=(U[L]-V);}if(U[E]>S[1]){C[1]=U[E];}if(S[0]>(U[J]-R)){C[0]=(U[J]-R);}if(U[D]>S[0]){C[0]=U[D];}return C;},inRegion:function(S){S=S||this.get(Q).get(K).getXY();var R=this._checkRegion([S[0],S[1]]),C=false;if((S[0]===R[0])&&(S[1]===R[1])){C=true;}return C;},align:function(){var S=this.get(Q),C=S.actXY,R=this.getRegion(true);if(this.get("stickX")){C[1]=(S.startXY[1]-S.deltaXY[1]);}if(this.get("stickY")){C[0]=(S.startXY[0]-S.deltaXY[0]);}if(R){C=this._checkRegion(C);}C=this._checkTicks(C,R);S.actXY=C;},_checkTicks:function(W,U){var T=this.get(Q),V=(T.startXY[0]-T.deltaXY[0]),S=(T.startXY[1]-T.deltaXY[1]),C=this.get("tickX"),R=this.get("tickY");if(C&&!this.get(G)){W[0]=N._calcTicks(W[0],V,C,U[D],U[J]);}if(R&&!this.get(O)){W[1]=N._calcTicks(W[1],S,R,U[E],U[L]);}if(this.get(G)){W[0]=N._calcTickArray(W[0],this.get(G),U[D],U[J]);}if(this.get(O)){W[1]=N._calcTickArray(W[1],this.get(O),U[E],U[L]);}return W;}};B.namespace("Plugin");B.extend(A,B.Base,I);B.Plugin.DDConstrained=A;B.mix(N,{_calcTicks:function(X,W,T,V,U){var R=((X-W)/T),S=Math.floor(R),C=Math.ceil(R);if((S!==0)||(C!==0)){if((R>=S)&&(R<=C)){X=(W+(T*S));if(V&&U){if(X<V){X=(W+(T*(S+1)));}if(X>U){X=(W+(T*(S-1)));}}}}return X;},_calcTickArray:function(Y,Z,X,U){var R=0,V=Z.length,T=0,S,C,W;if(!Z||(Z.length===0)){return Y;}else{if(Z[0]>=Y){return Z[0];}else{for(R=0;R<V;R++){T=(R+1);if(Z[T]&&Z[T]>=Y){S=Y-Z[R];C=Z[T]-Y;W=(C>S)?Z[R]:Z[T];if(X&&U){if(W>U){if(Z[R]){W=Z[R];}else{W=Z[V-1];}}}return W;}}return Z[Z.length-1];}}}});},"@VERSION@",{requires:["dd-drag"],skinnable:false});YUI.add("dd-scroll",function(B){var H=function(){H.superclass.constructor.apply(this,arguments);},C,D,L="host",A="buffer",J="parentScroll",G="windowScroll",I="scrollTop",F="scrollLeft",E="offsetWidth",K="offsetHeight";H.ATTRS={parentScroll:{value:false,setter:function(M){if(M){return M;}return false;}},buffer:{value:30},scrollDelay:{value:235},host:{value:null},windowScroll:{value:false},vertical:{value:true},horizontal:{value:true}};B.extend(H,B.Base,{_scrolling:null,_vpRegionCache:null,_dimCache:null,_scrollTimer:null,_getVPRegion:function(){var M={},N=this.get(J),R=this.get(A),Q=this.get(G),U=((Q)?[]:N.getXY()),S=((Q)?"winWidth":E),P=((Q)?"winHeight":K),T=((Q)?N.get(I):U[1]),O=((Q)?N.get(F):U[0]);M={top:T+R,right:(N.get(S)+O)-R,bottom:(N.get(P)+T)-R,left:O+R};this._vpRegionCache=M;return M;},initializer:function(){var M=this.get(L);M.after("drag:start",B.bind(this.start,this));M.after("drag:end",B.bind(this.end,this));M.on("drag:align",B.bind(this.align,this));B.one(window).on("scroll",B.bind(function(){this._vpRegionCache=null;},this));},_checkWinScroll:function(Y){var X=this._getVPRegion(),M=this.get(L),O=this.get(G),S=M.lastXY,N=false,e=this.get(A),R=this.get(J),g=R.get(I),U=R.get(F),V=this._dimCache.w,a=this._dimCache.h,T=S[1]+a,W=S[1],d=S[0]+V,Q=S[0],f=W,P=Q,Z=g,c=U;if(this.get("horizontal")){if(Q<=X.left){N=true;P=S[0]-((O)?e:0);c=U-e;}if(d>=X.right){N=true;P=S[0]+((O)?e:0);c=U+e;}}if(this.get("vertical")){if(T>=X.bottom){N=true;f=S[1]+((O)?e:0);Z=g+e;}if(W<=X.top){N=true;f=S[1]-((O)?e:0);Z=g-e;}}if(Z<0){Z=0;f=S[1];}if(c<0){c=0;P=S[0];}if(f<0){f=S[1];}if(P<0){P=S[0];}if(Y){M.actXY=[P,f];M._moveNode({node:R,top:Z,left:c});if(!Z&&!c){this._cancelScroll();}}else{if(N){this._initScroll();}else{this._cancelScroll();}}},_initScroll:function(){this._cancelScroll();this._scrollTimer=B.Lang.later(this.get("scrollDelay"),this,this._checkWinScroll,[true],true);},_cancelScroll:function(){this._scrolling=false;
if(this._scrollTimer){this._scrollTimer.cancel();delete this._scrollTimer;}},align:function(M){if(this._scrolling){this._cancelScroll();M.preventDefault();}if(!this._scrolling){this._checkWinScroll();}},_setDimCache:function(){var M=this.get(L).get("dragNode");this._dimCache={h:M.get(K),w:M.get(E)};},start:function(){this._setDimCache();},end:function(M){this._dimCache=null;this._cancelScroll();},toString:function(){return H.NAME+" #"+this.get("node").get("id");}});B.namespace("Plugin");C=function(){C.superclass.constructor.apply(this,arguments);};C.ATTRS=B.merge(H.ATTRS,{windowScroll:{value:true,setter:function(M){if(M){this.set(J,B.one(window));}return M;}}});B.extend(C,H,{initializer:function(){this.set("windowScroll",this.get("windowScroll"));}});C.NAME=C.NS="winscroll";B.Plugin.DDWinScroll=C;D=function(){D.superclass.constructor.apply(this,arguments);};D.ATTRS=B.merge(H.ATTRS,{node:{value:false,setter:function(M){var N=B.one(M);if(!N){if(M!==false){B.error("DDNodeScroll: Invalid Node Given: "+M);}}else{N=N.item(0);this.set(J,N);}return N;}}});B.extend(D,H,{initializer:function(){this.set("node",this.get("node"));}});D.NAME=D.NS="nodescroll";B.Plugin.DDNodeScroll=D;B.DD.Scroll=H;},"@VERSION@",{skinnable:false,optional:["dd-proxy"],requires:["dd-drag"]});YUI.add("dd-plugin",function(B){var A=function(C){C.node=((B.Widget&&C.host instanceof B.Widget)?C.host.get("boundingBox"):C.host);A.superclass.constructor.call(this,C);};A.NAME="dd-plugin";A.NS="dd";B.extend(A,B.DD.Drag);B.namespace("Plugin");B.Plugin.Drag=A;},"@VERSION@",{skinnable:false,optional:["dd-constrain","dd-proxy"],requires:["dd-drag"]});YUI.add("dd-drop",function(A){var B="node",G=A.DD.DDM,F="offsetHeight",C="offsetWidth",I="drop:over",H="drop:enter",D="drop:exit",E=function(){this._lazyAddAttrs=false;E.superclass.constructor.apply(this,arguments);A.on("domready",A.bind(function(){A.later(100,this,this._createShim);},this));G._regTarget(this);};E.NAME="drop";E.ATTRS={node:{setter:function(J){var K=A.one(J);if(!K){A.error("DD.Drop: Invalid Node Given: "+J);}return K;}},groups:{value:["default"],setter:function(J){this._groups={};A.each(J,function(L,K){this._groups[L]=true;},this);return J;}},padding:{value:"0",setter:function(J){return G.cssSizestoObject(J);}},lock:{value:false,setter:function(J){if(J){this.get(B).addClass(G.CSS_PREFIX+"-drop-locked");}else{this.get(B).removeClass(G.CSS_PREFIX+"-drop-locked");}return J;}},useShim:{value:true,setter:function(J){A.DD.DDM._noShim=!J;return J;}}};A.extend(E,A.Base,{addToGroup:function(J){this._groups[J]=true;return this;},removeFromGroup:function(J){delete this._groups[J];return this;},_createEvents:function(){var J=[I,H,D,"drop:hit"];A.each(J,function(L,K){this.publish(L,{type:L,emitFacade:true,preventable:false,bubbles:true,queuable:false,prefix:"drop"});},this);},_valid:null,_groups:null,shim:null,region:null,overTarget:null,inGroup:function(J){this._valid=false;var K=false;A.each(J,function(M,L){if(this._groups[M]){K=true;this._valid=true;}},this);return K;},initializer:function(J){if(!A.Object.hasKey(J,"bubbleTargets")){this.addTarget(A.DD.DDM);}A.later(100,this,this._createEvents);var K=this.get(B),L;if(!K.get("id")){L=A.stamp(K);K.set("id",L);}K.addClass(G.CSS_PREFIX+"-drop");this.set("groups",this.get("groups"));},destructor:function(){G._unregTarget(this);if(this.shim){this.shim.detachAll();this.shim.get("parentNode").removeChild(this.shim);this.shim=null;}this.get(B).removeClass(G.CSS_PREFIX+"-drop");this.detachAll();},_deactivateShim:function(){if(!this.shim){return false;}this.get(B).removeClass(G.CSS_PREFIX+"-drop-active-valid");this.get(B).removeClass(G.CSS_PREFIX+"-drop-active-invalid");this.get(B).removeClass(G.CSS_PREFIX+"-drop-over");if(this.get("useShim")){this.shim.setStyles({top:"-999px",left:"-999px",zIndex:"1"});}this.overTarget=false;},_activateShim:function(){if(!G.activeDrag){return false;}if(this.get(B)===G.activeDrag.get(B)){return false;}if(this.get("lock")){return false;}var J=this.get(B);if(this.inGroup(G.activeDrag.get("groups"))){J.removeClass(G.CSS_PREFIX+"-drop-active-invalid");J.addClass(G.CSS_PREFIX+"-drop-active-valid");G._addValid(this);this.overTarget=false;if(this.get("useShim")){this.sizeShim();}}else{G._removeValid(this);J.removeClass(G.CSS_PREFIX+"-drop-active-valid");J.addClass(G.CSS_PREFIX+"-drop-active-invalid");}},sizeShim:function(){if(!G.activeDrag){return false;}if(this.get(B)===G.activeDrag.get(B)){return false;}if(this.get("lock")||!this.get("useShim")){return false;}if(!this.shim){A.later(100,this,this.sizeShim);return false;}var O=this.get(B),M=O.get(F),K=O.get(C),Q=O.getXY(),P=this.get("padding"),J,N,L;K=K+P.left+P.right;M=M+P.top+P.bottom;Q[0]=Q[0]-P.left;Q[1]=Q[1]-P.top;if(G.activeDrag.get("dragMode")===G.INTERSECT){J=G.activeDrag;N=J.get(B).get(F);L=J.get(B).get(C);M=(M+N);K=(K+L);Q[0]=Q[0]-(L-J.deltaXY[0]);Q[1]=Q[1]-(N-J.deltaXY[1]);}this.shim.setStyles({height:M+"px",width:K+"px",top:Q[1]+"px",left:Q[0]+"px"});this.region={"0":Q[0],"1":Q[1],area:0,top:Q[1],right:Q[0]+K,bottom:Q[1]+M,left:Q[0]};},_createShim:function(){if(!G._pg){A.later(10,this,this._createShim);return;}if(this.shim){return;}var J=this.get("node");if(this.get("useShim")){J=A.Node.create('<div id="'+this.get(B).get("id")+'_shim"></div>');J.setStyles({height:this.get(B).get(F)+"px",width:this.get(B).get(C)+"px",backgroundColor:"yellow",opacity:".5",zIndex:"1",overflow:"hidden",top:"-900px",left:"-900px",position:"absolute"});G._pg.appendChild(J);J.on("mouseover",A.bind(this._handleOverEvent,this));J.on("mouseout",A.bind(this._handleOutEvent,this));}this.shim=J;},_handleTargetOver:function(){if(G.isOverTarget(this)){this.get(B).addClass(G.CSS_PREFIX+"-drop-over");G.activeDrop=this;G.otherDrops[this]=this;if(this.overTarget){G.activeDrag.fire("drag:over",{drop:this,drag:G.activeDrag});this.fire(I,{drop:this,drag:G.activeDrag});}else{if(G.activeDrag.get("dragging")){this.overTarget=true;this.fire(H,{drop:this,drag:G.activeDrag});G.activeDrag.fire("drag:enter",{drop:this,drag:G.activeDrag});
G.activeDrag.get(B).addClass(G.CSS_PREFIX+"-drag-over");}}}else{this._handleOut();}},_handleOverEvent:function(){this.shim.setStyle("zIndex","999");G._addActiveShim(this);},_handleOutEvent:function(){this.shim.setStyle("zIndex","1");G._removeActiveShim(this);},_handleOut:function(J){if(!G.isOverTarget(this)||J){if(this.overTarget){this.overTarget=false;if(!J){G._removeActiveShim(this);}if(G.activeDrag){this.get(B).removeClass(G.CSS_PREFIX+"-drop-over");G.activeDrag.get(B).removeClass(G.CSS_PREFIX+"-drag-over");this.fire(D);G.activeDrag.fire("drag:exit",{drop:this});delete G.otherDrops[this];}}}}});A.DD.Drop=E;},"@VERSION@",{requires:["dd-ddm-drop","dd-drag"],skinnable:false});YUI.add("dd-drop-plugin",function(A){var B=function(C){C.node=C.host;B.superclass.constructor.apply(this,arguments);};B.NAME="dd-drop-plugin";B.NS="drop";A.extend(B,A.DD.Drop);A.namespace("Plugin");A.Plugin.Drop=B;},"@VERSION@",{requires:["dd-drop"],skinnable:false});YUI.add("dd-delegate",function(E){var D=function(F){D.superclass.constructor.apply(this,arguments);},C="container",B="nodes",A=E.Node.create("<div>Temp Node</div>");E.extend(D,E.Base,{dd:null,_shimState:null,_onNodeChange:function(F){this.set("dragNode",F.newVal);},_afterDragEnd:function(G){var F=this;E.DD.DDM._noShim=F._shimState;F.set("lastNode",F.dd.get("node"));F.get("lastNode").removeClass(E.DD.DDM.CSS_PREFIX+"-dragging");F.dd._unprep();F.dd.set("node",A);},_onDelegate:function(I){var G=I.currentTarget,H=this,F=H.dd;if(G.test(H.get(B))&&!G.test(H.get("invalid"))){H._shimState=E.DD.DDM._noShim;E.DD.DDM._noShim=true;H.set("currentNode",G);F.set("node",G);if(F.proxy){F.set("dragNode",E.DD.DDM._proxy);}else{F.set("dragNode",G);}F._prep();F.fire("drag:mouseDown",{ev:I});}},_onMouseEnter:function(F){this._shimState=E.DD.DDM._noShim;E.DD.DDM._noShim=true;},_onMouseLeave:function(F){E.DD.DDM._noShim=this._shimState;},initializer:function(G){if(!E.Object.hasKey(G,"bubbleTargets")){this.addTarget(E.DD.DDM);}var H=this.get("dragConfig")||{},F=this.get(C);H.node=A.cloneNode(true);H.bubbleTargets=this;if(this.get("handles")){H.handles=this.get("handles");}this.dd=new E.DD.Drag(H);this.dd.after("drag:end",E.bind(this._afterDragEnd,this));this.dd.on("dragNodeChange",E.bind(this._onNodeChange,this));E.delegate("mousedown",E.bind(this._onDelegate,this),F,this.get(B));E.on("mouseenter",E.bind(this._onMouseEnter,this),F);E.on("mouseleave",E.bind(this._onMouseLeave,this),F);E.later(10,this,this.syncTargets);E.DD.DDM.regDelegate(this);},syncTargets:function(I){if(!E.Plugin.Drop){return;}var H,F,G=this;if(G.get("target")){H=E.one(G.get(C)).all(G.get(B));F=G.dd.get("groups");if(I){F=[I];}H.each(function(J){G.createDrop(J,F);});}return G;},createDrop:function(H,F){var G={useShim:false,bubbleTargets:this};if(!H.drop){H.plug(E.Plugin.Drop,G);}H.drop.set("groups",F);return H;},destructor:function(){if(this.dd){this.dd.destroy();}if(E.Plugin.Drop){var F=E.one(this.get(C)).all(this.get(B));F.unplug(E.Plugin.Drop);}}},{NAME:"delegate",ATTRS:{container:{value:"body"},nodes:{value:".dd-draggable"},invalid:{value:""},lastNode:{value:A},currentNode:{value:A},dragNode:{value:A},over:{value:false},target:{value:false},dragConfig:{value:null},handles:{value:null}}});E.mix(E.DD.DDM,{_delegates:[],regDelegate:function(F){this._delegates.push(F);},getDelegate:function(G){var F=null;G=E.one(G);E.each(this._delegates,function(H){if(G.test(H.get(C))){F=H;}},this);return F;}});E.namespace("DD");E.DD.Delegate=D;},"@VERSION@",{skinnable:false,optional:["dd-drop-plugin"],requires:["dd-drag","event-mouseenter"]});YUI.add("dd",function(A){},"@VERSION@",{skinnable:false,use:["dd-ddm-base","dd-ddm","dd-ddm-drop","dd-drag","dd-proxy","dd-constrain","dd-plugin","dd-drop","dd-drop-plugin","dd-scroll","dd-delegate"]});