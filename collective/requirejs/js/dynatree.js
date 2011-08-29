// jquery.dynatree.js build 1.2.0_rc1
// Revision: 520, date: 2011-08-16 09:22:43
// Copyright (c) 2008-10  Martin Wendt (http://dynatree.googlecode.com/)
// Dual licensed under the MIT or GPL Version 2 licenses.
define(['jquery-1.6.2', 'jquery-ui-1.8.14'], function(jQuery){
var _canLog=true;function _log(mode,msg){if(!_canLog){return;}
var args=Array.prototype.slice.apply(arguments,[1]);var dt=new Date();var tag=dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds()+"."+dt.getMilliseconds();args[0]=tag+" - "+args[0];try{switch(mode){case"info":window.console.info.apply(window.console,args);break;case"warn":window.console.warn.apply(window.console,args);break;default:window.console.log.apply(window.console,args);break;}}catch(e){if(!window.console){_canLog=false;}}}
function logMsg(msg){Array.prototype.unshift.apply(arguments,["debug"]);_log.apply(this,arguments);}
var getDynaTreePersistData=null;var DTNodeStatus_Error=-1;var DTNodeStatus_Loading=1;var DTNodeStatus_Ok=0;(function($){var Class={create:function(){return function(){this.initialize.apply(this,arguments);};}};function getDtNodeFromElement(el){var iMax=5;while(el&&iMax--){if(el.dtnode){return el.dtnode;}
el=el.parentNode;}
return null;}
function noop(){}
var DynaTreeNode=Class.create();DynaTreeNode.prototype={initialize:function(parent,tree,data){this.parent=parent;this.tree=tree;if(typeof data==="string"){data={title:data};}
if(data.key===undefined){data.key="_"+tree._nodeCount++;}
this.data=$.extend({},$.ui.dynatree.nodedatadefaults,data);this.li=null;this.span=null;this.ul=null;this.childList=null;this.isLoading=false;this.hasSubSel=false;this.bExpanded=false;this.bSelected=false;},toString:function(){return"DynaTreeNode<"+this.data.key+">: '"+this.data.title+"'";},toDict:function(recursive,callback){var dict=$.extend({},this.data);dict.activate=(this.tree.activeNode===this);dict.focus=(this.tree.focusNode===this);dict.expand=this.bExpanded;dict.select=this.bSelected;if(callback){callback(dict);}
if(recursive&&this.childList){dict.children=[];for(var i=0,l=this.childList.length;i<l;i++){dict.children.push(this.childList[i].toDict(true,callback));}}else{delete dict.children;}
return dict;},fromDict:function(dict){var children=dict.children;if(children===undefined){this.data=$.extend(this.data,dict);this.render();return;}
dict=$.extend({},dict);dict.children=undefined;this.data=$.extend(this.data,dict);this.removeChildren();this.addChild(children);},_getInnerHtml:function(){var tree=this.tree,opts=tree.options,cache=tree.cache,level=this.getLevel(),data=this.data,res="";if(level<opts.minExpandLevel){if(level>1){res+=cache.tagConnector;}}else if(this.hasChildren()!==false){res+=cache.tagExpander;}else{res+=cache.tagConnector;}
if(opts.checkbox&&data.hideCheckbox!==true&&!data.isStatusNode){res+=cache.tagCheckbox;}
if(data.icon){res+="<img src='"+opts.imagePath+data.icon+"' alt='' />";}else if(data.icon===false){noop();}else{res+=cache.tagNodeIcon;}
var nodeTitle="";if(opts.onCustomRender){nodeTitle=opts.onCustomRender.call(tree,this)||"";}
if(!nodeTitle){var tooltip=data.tooltip?" title='"+data.tooltip+"'":"";if(opts.noLink||data.noLink){nodeTitle="<span style='display: inline-block;' class='"+opts.classNames.title+"'"+tooltip+">"+data.title+"</span>";}else{nodeTitle="<a href='#' class='"+opts.classNames.title+"'"+tooltip+">"+data.title+"</a>";}}
res+=nodeTitle;return res;},_fixOrder:function(){var cl=this.childList;if(!cl||!this.ul){return;}
var childLI=this.ul.firstChild;for(var i=0,l=cl.length-1;i<l;i++){var childNode1=cl[i];var childNode2=childLI.dtnode;if(childNode1!==childNode2){this.tree.logDebug("_fixOrder: mismatch at index "+i+": "+childNode1+" != "+childNode2);this.ul.insertBefore(childNode1.li,childNode2.li);}else{childLI=childLI.nextSibling;}}},render:function(useEffects,includeInvisible){var tree=this.tree,parent=this.parent,data=this.data,opts=tree.options,cn=opts.classNames,isLastSib=this.isLastSibling(),firstTime=false;if(!parent&&!this.ul){this.li=this.span=null;this.ul=document.createElement("ul");if(opts.minExpandLevel>1){this.ul.className=cn.container+" "+cn.noConnector;}else{this.ul.className=cn.container;}}else if(parent){if(!this.li){firstTime=true;this.li=document.createElement("li");this.li.dtnode=this;if(data.key&&opts.generateIds){this.li.id=opts.idPrefix+data.key;}
this.span=document.createElement("span");this.span.className=cn.title;this.li.appendChild(this.span);if(!parent.ul){parent.ul=document.createElement("ul");parent.ul.style.display="none";parent.li.appendChild(parent.ul);}
parent.ul.appendChild(this.li);}
this.span.innerHTML=this._getInnerHtml();var cnList=[];cnList.push(cn.node);if(data.isFolder){cnList.push(cn.folder);}
if(this.bExpanded){cnList.push(cn.expanded);}
if(this.hasChildren()!==false){cnList.push(cn.hasChildren);}
if(data.isLazy&&this.childList===null){cnList.push(cn.lazy);}
if(isLastSib){cnList.push(cn.lastsib);}
if(this.bSelected){cnList.push(cn.selected);}
if(this.hasSubSel){cnList.push(cn.partsel);}
if(tree.activeNode===this){cnList.push(cn.active);}
if(data.addClass){cnList.push(data.addClass);}
cnList.push(cn.combinedExpanderPrefix
+(this.bExpanded?"e":"c")
+(data.isLazy&&this.childList===null?"d":"")
+(isLastSib?"l":""));cnList.push(cn.combinedIconPrefix
+(this.bExpanded?"e":"c")
+(data.isFolder?"f":""));this.span.className=cnList.join(" ");this.li.className=isLastSib?cn.lastsib:"";if(firstTime&&opts.onCreate){opts.onCreate.call(tree,this,this.span);}
if(opts.onRender){opts.onRender.call(tree,this,this.span);}}
if((this.bExpanded||includeInvisible===true)&&this.childList){for(var i=0,l=this.childList.length;i<l;i++){this.childList[i].render(false,includeInvisible);}
this._fixOrder();}
if(this.ul){var isHidden=(this.ul.style.display==="none");var isExpanded=!!this.bExpanded;if(useEffects&&opts.fx&&(isHidden===isExpanded)){var duration=opts.fx.duration||200;$(this.ul).animate(opts.fx,duration);}else{this.ul.style.display=(this.bExpanded||!parent)?"":"none";}}},getKeyPath:function(excludeSelf){var path=[];this.visitParents(function(node){if(node.parent){path.unshift(node.data.key);}},!excludeSelf);return"/"+path.join(this.tree.options.keyPathSeparator);},getParent:function(){return this.parent;},getChildren:function(){if(this.hasChildren()===undefined){return undefined;}
return this.childList;},hasChildren:function(){if(this.data.isLazy){if(this.childList===null||this.childList===undefined){return undefined;}else if(this.childList.length===0){return false;}else if(this.childList.length===1&&this.childList[0].isStatusNode()){return undefined;}
return true;}
return!!this.childList;},isFirstSibling:function(){var p=this.parent;return!p||p.childList[0]===this;},isLastSibling:function(){var p=this.parent;return!p||p.childList[p.childList.length-1]===this;},getPrevSibling:function(){if(!this.parent){return null;}
var ac=this.parent.childList;for(var i=1,l=ac.length;i<l;i++){if(ac[i]===this){return ac[i-1];}}
return null;},getNextSibling:function(){if(!this.parent){return null;}
var ac=this.parent.childList;for(var i=0,l=ac.length-1;i<l;i++){if(ac[i]===this){return ac[i+1];}}
return null;},isStatusNode:function(){return(this.data.isStatusNode===true);},isChildOf:function(otherNode){return(this.parent&&this.parent===otherNode);},isDescendantOf:function(otherNode){if(!otherNode){return false;}
var p=this.parent;while(p){if(p===otherNode){return true;}
p=p.parent;}
return false;},countChildren:function(){var cl=this.childList;if(!cl){return 0;}
var n=cl.length;for(var i=0,l=n;i<l;i++){var child=cl[i];n+=child.countChildren();}
return n;},sortChildren:function(cmp,deep){var cl=this.childList;if(!cl){return;}
cmp=cmp||function(a,b){var x=a.data.title.toLowerCase(),y=b.data.title.toLowerCase();return x===y?0:x>y?1:-1;};cl.sort(cmp);if(deep){for(var i=0,l=cl.length;i<l;i++){if(cl[i].childList){cl[i].sortChildren(cmp,"$norender$");}}}
if(deep!=="$norender$"){this.render();}},_setStatusNode:function(data){var firstChild=(this.childList?this.childList[0]:null);if(!data){if(firstChild&&firstChild.isStatusNode()){try{if(this.ul){this.ul.removeChild(firstChild.li);firstChild.li=null;}}catch(e){}
if(this.childList.length===1){this.childList=[];}else{this.childList.shift();}}}else if(firstChild){data.isStatusNode=true;data.key="_statusNode";firstChild.data=data;firstChild.render();}else{data.isStatusNode=true;data.key="_statusNode";firstChild=this.addChild(data);}},setLazyNodeStatus:function(lts,opts){var tooltip=(opts&&opts.tooltip)?opts.tooltip:null;var info=(opts&&opts.info)?" ("+opts.info+")":"";switch(lts){case DTNodeStatus_Ok:this._setStatusNode(null);$(this.span).removeClass(this.tree.options.classNames.nodeLoading);this.isLoading=false;if(this.tree.options.autoFocus){if(this===this.tree.tnRoot&&this.childList&&this.childList.length>0){this.childList[0].focus();}else{this.focus();}}
break;case DTNodeStatus_Loading:this.isLoading=true;$(this.span).addClass(this.tree.options.classNames.nodeLoading);if(!this.parent){this._setStatusNode({title:this.tree.options.strings.loading+info,tooltip:tooltip,addClass:this.tree.options.classNames.nodeWait});}
break;case DTNodeStatus_Error:this.isLoading=false;this._setStatusNode({title:this.tree.options.strings.loadError+info,tooltip:tooltip,addClass:this.tree.options.classNames.nodeError});break;default:throw"Bad LazyNodeStatus: '"+lts+"'.";}},_parentList:function(includeRoot,includeSelf){var l=[];var dtn=includeSelf?this:this.parent;while(dtn){if(includeRoot||dtn.parent){l.unshift(dtn);}
dtn=dtn.parent;}
return l;},getLevel:function(){var level=0;var dtn=this.parent;while(dtn){level++;dtn=dtn.parent;}
return level;},_getTypeForOuterNodeEvent:function(event){var cns=this.tree.options.classNames;var target=event.target;if(target.className.indexOf(cns.node)<0){return null;}
var eventX=event.pageX-target.offsetLeft;var eventY=event.pageY-target.offsetTop;for(var i=0,l=target.childNodes.length;i<l;i++){var cn=target.childNodes[i];var x=cn.offsetLeft-target.offsetLeft;var y=cn.offsetTop-target.offsetTop;var nx=cn.clientWidth,ny=cn.clientHeight;if(eventX>=x&&eventX<=(x+nx)&&eventY>=y&&eventY<=(y+ny)){if(cn.className==cns.title){return"title";}else if(cn.className==cns.expander){return"expander";}else if(cn.className==cns.checkbox){return"checkbox";}else if(cn.className==cns.nodeIcon){return"icon";}}}
return"prefix";},getEventTargetType:function(event){var tcn=event&&event.target?event.target.className:"";var cns=this.tree.options.classNames;if(tcn===cns.title){return"title";}else if(tcn===cns.expander){return"expander";}else if(tcn===cns.checkbox){return"checkbox";}else if(tcn===cns.nodeIcon){return"icon";}else if(tcn===cns.empty||tcn===cns.vline||tcn===cns.connector){return"prefix";}else if(tcn.indexOf(cns.node)>=0){return this._getTypeForOuterNodeEvent(event);}
return null;},isVisible:function(){var parents=this._parentList(true,false);for(var i=0,l=parents.length;i<l;i++){if(!parents[i].bExpanded){return false;}}
return true;},makeVisible:function(){var parents=this._parentList(true,false);for(var i=0,l=parents.length;i<l;i++){parents[i]._expand(true);}},focus:function(){this.makeVisible();try{$(this.span).find(">a").focus();}catch(e){}},isFocused:function(){return(this.tree.tnFocused===this);},_activate:function(flag,fireEvents){this.tree.logDebug("dtnode._activate(%o, fireEvents=%o) - %o",flag,fireEvents,this);var opts=this.tree.options;if(this.data.isStatusNode){return;}
if(fireEvents&&opts.onQueryActivate&&opts.onQueryActivate.call(this.tree,flag,this)===false){return;}
if(flag){if(this.tree.activeNode){if(this.tree.activeNode===this){return;}
this.tree.activeNode.deactivate();}
if(opts.activeVisible){this.makeVisible();}
this.tree.activeNode=this;if(opts.persist){$.cookie(opts.cookieId+"-active",this.data.key,opts.cookie);}
this.tree.persistence.activeKey=this.data.key;$(this.span).addClass(opts.classNames.active);if(fireEvents&&opts.onActivate){opts.onActivate.call(this.tree,this);}}else{if(this.tree.activeNode===this){if(opts.onQueryActivate&&opts.onQueryActivate.call(this.tree,false,this)===false){return;}
$(this.span).removeClass(opts.classNames.active);if(opts.persist){$.cookie(opts.cookieId+"-active","",opts.cookie);}
this.tree.persistence.activeKey=null;this.tree.activeNode=null;if(fireEvents&&opts.onDeactivate){opts.onDeactivate.call(this.tree,this);}}}},activate:function(){this._activate(true,true);},activateSilently:function(){this._activate(true,false);},deactivate:function(){this._activate(false,true);},isActive:function(){return(this.tree.activeNode===this);},_userActivate:function(){var activate=true;var expand=false;if(this.data.isFolder){switch(this.tree.options.clickFolderMode){case 2:activate=false;expand=true;break;case 3:activate=expand=true;break;}}
if(this.parent===null){expand=false;}
if(expand){this.toggleExpand();this.focus();}
if(activate){this.activate();}},_setSubSel:function(hasSubSel){if(hasSubSel){this.hasSubSel=true;$(this.span).addClass(this.tree.options.classNames.partsel);}else{this.hasSubSel=false;$(this.span).removeClass(this.tree.options.classNames.partsel);}},_updatePartSelectionState:function(){var sel;if(!this.hasChildren()){sel=(this.bSelected&&!this.data.unselectable&&!this.data.isStatusNode);this._setSubSel(false);return sel;}
var i,l,cl=this.childList,allSelected=true,allDeselected=true;for(i=0,l=cl.length;i<l;i++){var n=cl[i],s=n._updatePartSelectionState();if(s!==false){allDeselected=false;}
if(s!==true){allSelected=false;}}
if(allSelected){sel=true;}else if(allDeselected){sel=false;}else{sel=undefined;}
this._setSubSel(sel===undefined);this.bSelected=(sel===true);return sel;},_fixSelectionState:function(){var p,i,l;if(this.bSelected){this.visit(function(node){node.parent._setSubSel(true);if(!node.data.unselectable){node._select(true,false,false);}});p=this.parent;while(p){p._setSubSel(true);var allChildsSelected=true;for(i=0,l=p.childList.length;i<l;i++){var n=p.childList[i];if(!n.bSelected&&!n.data.isStatusNode&&!n.data.unselectable){allChildsSelected=false;break;}}
if(allChildsSelected){p._select(true,false,false);}
p=p.parent;}}else{this._setSubSel(false);this.visit(function(node){node._setSubSel(false);node._select(false,false,false);});p=this.parent;while(p){p._select(false,false,false);var isPartSel=false;for(i=0,l=p.childList.length;i<l;i++){if(p.childList[i].bSelected||p.childList[i].hasSubSel){isPartSel=true;break;}}
p._setSubSel(isPartSel);p=p.parent;}}},_select:function(sel,fireEvents,deep){var opts=this.tree.options;if(this.data.isStatusNode){return;}
if(this.bSelected===sel){return;}
if(fireEvents&&opts.onQuerySelect&&opts.onQuerySelect.call(this.tree,sel,this)===false){return;}
if(opts.selectMode==1&&sel){this.tree.visit(function(node){if(node.bSelected){node._select(false,false,false);return false;}});}
this.bSelected=sel;if(sel){if(opts.persist){this.tree.persistence.addSelect(this.data.key);}
$(this.span).addClass(opts.classNames.selected);if(deep&&opts.selectMode===3){this._fixSelectionState();}
if(fireEvents&&opts.onSelect){opts.onSelect.call(this.tree,true,this);}}else{if(opts.persist){this.tree.persistence.clearSelect(this.data.key);}
$(this.span).removeClass(opts.classNames.selected);if(deep&&opts.selectMode===3){this._fixSelectionState();}
if(fireEvents&&opts.onSelect){opts.onSelect.call(this.tree,false,this);}}},select:function(sel){if(this.data.unselectable){return this.bSelected;}
return this._select(sel!==false,true,true);},toggleSelect:function(){return this.select(!this.bSelected);},isSelected:function(){return this.bSelected;},isLazy:function(){return!!this.data.isLazy;},_loadContent:function(){try{var opts=this.tree.options;this.tree.logDebug("_loadContent: start - %o",this);this.setLazyNodeStatus(DTNodeStatus_Loading);if(true===opts.onLazyRead.call(this.tree,this)){this.setLazyNodeStatus(DTNodeStatus_Ok);this.tree.logDebug("_loadContent: succeeded - %o",this);}}catch(e){this.tree.logWarning("_loadContent: failed - %o",e);this.setLazyNodeStatus(DTNodeStatus_Error,{tooltip:""+e});}},_expand:function(bExpand,forceSync){if(this.bExpanded===bExpand){this.tree.logDebug("dtnode._expand(%o) IGNORED - %o",bExpand,this);return;}
this.tree.logDebug("dtnode._expand(%o) - %o",bExpand,this);var opts=this.tree.options;if(!bExpand&&this.getLevel()<opts.minExpandLevel){this.tree.logDebug("dtnode._expand(%o) prevented collapse - %o",bExpand,this);return;}
if(opts.onQueryExpand&&opts.onQueryExpand.call(this.tree,bExpand,this)===false){return;}
this.bExpanded=bExpand;if(opts.persist){if(bExpand){this.tree.persistence.addExpand(this.data.key);}else{this.tree.persistence.clearExpand(this.data.key);}}
var allowEffects=!(this.data.isLazy&&this.childList===null)&&!this.isLoading&&!forceSync;this.render(allowEffects);if(this.bExpanded&&this.parent&&opts.autoCollapse){var parents=this._parentList(false,true);for(var i=0,l=parents.length;i<l;i++){parents[i].collapseSiblings();}}
if(opts.activeVisible&&this.tree.activeNode&&!this.tree.activeNode.isVisible()){this.tree.activeNode.deactivate();}
if(bExpand&&this.data.isLazy&&this.childList===null&&!this.isLoading){this._loadContent();return;}
if(opts.onExpand){opts.onExpand.call(this.tree,bExpand,this);}},isExpanded:function(){return this.bExpanded;},expand:function(flag){flag=(flag!==false);if(!this.childList&&!this.data.isLazy&&flag){return;}else if(this.parent===null&&!flag){return;}
this._expand(flag);},scheduleAction:function(mode,ms){if(this.tree.timer){clearTimeout(this.tree.timer);this.tree.logDebug("clearTimeout(%o)",this.tree.timer);}
var self=this;switch(mode){case"cancel":break;case"expand":this.tree.timer=setTimeout(function(){self.tree.logDebug("setTimeout: trigger expand");self.expand(true);},ms);break;case"activate":this.tree.timer=setTimeout(function(){self.tree.logDebug("setTimeout: trigger activate");self.activate();},ms);break;default:throw"Invalid mode "+mode;}
this.tree.logDebug("setTimeout(%s, %s): %s",mode,ms,this.tree.timer);},toggleExpand:function(){this.expand(!this.bExpanded);},collapseSiblings:function(){if(this.parent===null){return;}
var ac=this.parent.childList;for(var i=0,l=ac.length;i<l;i++){if(ac[i]!==this&&ac[i].bExpanded){ac[i]._expand(false);}}},_onClick:function(event){var targetType=this.getEventTargetType(event);if(targetType==="expander"){this.toggleExpand();this.focus();}else if(targetType==="checkbox"){this.toggleSelect();this.focus();}else{this._userActivate();var aTag=this.span.getElementsByTagName("a");if(aTag[0]){if(!$.browser.msie){aTag[0].focus();}}else{return true;}}
event.preventDefault();},_onDblClick:function(event){},_onKeydown:function(event){var handled=true,sib;switch(event.which){case 107:case 187:if(!this.bExpanded){this.toggleExpand();}
break;case 109:case 189:if(this.bExpanded){this.toggleExpand();}
break;case 32:this._userActivate();break;case 8:if(this.parent){this.parent.focus();}
break;case 37:if(this.bExpanded){this.toggleExpand();this.focus();}else if(this.parent&&this.parent.parent){this.parent.focus();}
break;case 39:if(!this.bExpanded&&(this.childList||this.data.isLazy)){this.toggleExpand();this.focus();}else if(this.childList){this.childList[0].focus();}
break;case 38:sib=this.getPrevSibling();while(sib&&sib.bExpanded&&sib.childList){sib=sib.childList[sib.childList.length-1];}
if(!sib&&this.parent&&this.parent.parent){sib=this.parent;}
if(sib){sib.focus();}
break;case 40:if(this.bExpanded&&this.childList){sib=this.childList[0];}else{var parents=this._parentList(false,true);for(var i=parents.length-1;i>=0;i--){sib=parents[i].getNextSibling();if(sib){break;}}}
if(sib){sib.focus();}
break;default:handled=false;}
if(handled){event.preventDefault();}},_onKeypress:function(event){},_onFocus:function(event){var opts=this.tree.options;if(event.type=="blur"||event.type=="focusout"){if(opts.onBlur){opts.onBlur.call(this.tree,this);}
if(this.tree.tnFocused){$(this.tree.tnFocused.span).removeClass(opts.classNames.focused);}
this.tree.tnFocused=null;if(opts.persist){$.cookie(opts.cookieId+"-focus","",opts.cookie);}}else if(event.type=="focus"||event.type=="focusin"){if(this.tree.tnFocused&&this.tree.tnFocused!==this){this.tree.logDebug("dtnode.onFocus: out of sync: curFocus: %o",this.tree.tnFocused);$(this.tree.tnFocused.span).removeClass(opts.classNames.focused);}
this.tree.tnFocused=this;if(opts.onFocus){opts.onFocus.call(this.tree,this);}
$(this.tree.tnFocused.span).addClass(opts.classNames.focused);if(opts.persist){$.cookie(opts.cookieId+"-focus",this.data.key,opts.cookie);}}},visit:function(fn,includeSelf){var res=true;if(includeSelf===true){res=fn(this);if(res===false||res=="skip"){return res;}}
if(this.childList){for(var i=0,l=this.childList.length;i<l;i++){res=this.childList[i].visit(fn,true);if(res===false){break;}}}
return res;},visitParents:function(fn,includeSelf){if(includeSelf&&fn(this)===false){return false;}
var p=this.parent;while(p){if(fn(p)===false){return false;}
p=p.parent;}
return true;},remove:function(){if(this===this.tree.root){throw"Cannot remove system root";}
return this.parent.removeChild(this);},removeChild:function(tn){var ac=this.childList;if(ac.length==1){if(tn!==ac[0]){throw"removeChild: invalid child";}
return this.removeChildren();}
if(tn===this.tree.activeNode){tn.deactivate();}
if(this.tree.options.persist){if(tn.bSelected){this.tree.persistence.clearSelect(tn.data.key);}
if(tn.bExpanded){this.tree.persistence.clearExpand(tn.data.key);}}
tn.removeChildren(true);this.ul.removeChild(tn.li);for(var i=0,l=ac.length;i<l;i++){if(ac[i]===tn){this.childList.splice(i,1);break;}}},removeChildren:function(isRecursiveCall,retainPersistence){this.tree.logDebug("%s.removeChildren(%o)",this,isRecursiveCall);var tree=this.tree;var ac=this.childList;if(ac){for(var i=0,l=ac.length;i<l;i++){var tn=ac[i];if(tn===tree.activeNode&&!retainPersistence){tn.deactivate();}
if(this.tree.options.persist&&!retainPersistence){if(tn.bSelected){this.tree.persistence.clearSelect(tn.data.key);}
if(tn.bExpanded){this.tree.persistence.clearExpand(tn.data.key);}}
tn.removeChildren(true,retainPersistence);if(this.ul){this.ul.removeChild(tn.li);}}
this.childList=null;}
if(!isRecursiveCall){this.isLoading=false;this.render();}},setTitle:function(title){this.fromDict({title:title});},reload:function(force){throw"Use reloadChildren() instead";},reloadChildren:function(callback){if(this.parent===null){throw"Use tree.reload() instead";}else if(!this.data.isLazy){throw"node.reloadChildren() requires lazy nodes.";}
if(callback){var self=this;var eventType="nodeLoaded.dynatree."+this.tree.$tree.attr("id")
+"."+this.data.key;this.tree.$tree.bind(eventType,function(e,node,isOk){self.tree.$tree.unbind(eventType);self.tree.logDebug("loaded %o, %o, %o",e,node,isOk);if(node!==self){throw"got invalid load event";}
callback.call(self.tree,node,isOk);});}
this.removeChildren();this._loadContent();},_loadKeyPath:function(keyPath,callback){var tree=this.tree;tree.logDebug("%s._loadKeyPath(%s)",this,keyPath);if(keyPath===""){throw"Key path must not be empty";}
var segList=keyPath.split(tree.options.keyPathSeparator);if(segList[0]===""){throw"Key path must be relative (don't start with '/')";}
var seg=segList.shift();for(var i=0,l=this.childList.length;i<l;i++){var child=this.childList[i];if(child.data.key===seg){if(segList.length===0){callback.call(tree,child,"ok");}else if(child.data.isLazy&&(child.childList===null||child.childList===undefined)){tree.logDebug("%s._loadKeyPath(%s) -> reloading %s...",this,keyPath,child);var self=this;child.reloadChildren(function(node,isOk){if(isOk){tree.logDebug("%s._loadKeyPath(%s) -> reloaded %s.",node,keyPath,node);callback.call(tree,child,"loaded");node._loadKeyPath(segList.join(tree.options.keyPathSeparator),callback);}else{tree.logWarning("%s._loadKeyPath(%s) -> reloadChildren() failed.",self,keyPath);callback.call(tree,child,"error");}});}else{callback.call(tree,child,"loaded");child._loadKeyPath(segList.join(tree.options.keyPathSeparator),callback);}
return;}}
tree.logWarning("Node not found: "+seg);return;},resetLazy:function(){if(this.parent===null){throw"Use tree.reload() instead";}else if(!this.data.isLazy){throw"node.resetLazy() requires lazy nodes.";}
this.expand(false);this.removeChildren();},_addChildNode:function(dtnode,beforeNode){var tree=this.tree,opts=tree.options,pers=tree.persistence;dtnode.parent=this;if(this.childList===null){this.childList=[];}else if(!beforeNode){if(this.childList.length>0){$(this.childList[this.childList.length-1].span).removeClass(opts.classNames.lastsib);}}
if(beforeNode){var iBefore=$.inArray(beforeNode,this.childList);if(iBefore<0){throw"<beforeNode> must be a child of <this>";}
this.childList.splice(iBefore,0,dtnode);}else{this.childList.push(dtnode);}
var isInitializing=tree.isInitializing();if(opts.persist&&pers.cookiesFound&&isInitializing){if(pers.activeKey===dtnode.data.key){tree.activeNode=dtnode;}
if(pers.focusedKey===dtnode.data.key){tree.focusNode=dtnode;}
dtnode.bExpanded=($.inArray(dtnode.data.key,pers.expandedKeyList)>=0);dtnode.bSelected=($.inArray(dtnode.data.key,pers.selectedKeyList)>=0);}else{if(dtnode.data.activate){tree.activeNode=dtnode;if(opts.persist){pers.activeKey=dtnode.data.key;}}
if(dtnode.data.focus){tree.focusNode=dtnode;if(opts.persist){pers.focusedKey=dtnode.data.key;}}
dtnode.bExpanded=(dtnode.data.expand===true);if(dtnode.bExpanded&&opts.persist){pers.addExpand(dtnode.data.key);}
dtnode.bSelected=(dtnode.data.select===true);if(dtnode.bSelected&&opts.persist){pers.addSelect(dtnode.data.key);}}
if(opts.minExpandLevel>=dtnode.getLevel()){this.bExpanded=true;}
if(dtnode.bSelected&&opts.selectMode==3){var p=this;while(p){if(!p.hasSubSel){p._setSubSel(true);}
p=p.parent;}}
if(tree.bEnableUpdate){this.render();}
return dtnode;},addChild:function(obj,beforeNode){if(typeof(obj)=="string"){throw"Invalid data type for "+obj;}else if(!obj||obj.length===0){return;}else if(obj instanceof DynaTreeNode){return this._addChildNode(obj,beforeNode);}
if(!obj.length){obj=[obj];}
var prevFlag=this.tree.enableUpdate(false);var tnFirst=null;for(var i=0,l=obj.length;i<l;i++){var data=obj[i];var dtnode=this._addChildNode(new DynaTreeNode(this,this.tree,data),beforeNode);if(!tnFirst){tnFirst=dtnode;}
if(data.children){dtnode.addChild(data.children,null);}}
this.tree.enableUpdate(prevFlag);return tnFirst;},append:function(obj){this.tree.logWarning("node.append() is deprecated (use node.addChild() instead).");return this.addChild(obj,null);},appendAjax:function(ajaxOptions){var self=this;this.removeChildren(false,true);this.setLazyNodeStatus(DTNodeStatus_Loading);if(ajaxOptions.debugLazyDelay){var ms=ajaxOptions.debugLazyDelay;ajaxOptions.debugLazyDelay=0;this.tree.logInfo("appendAjax: waiting for debugLazyDelay "+ms);setTimeout(function(){self.appendAjax(ajaxOptions);},ms);return;}
var orgSuccess=ajaxOptions.success;var orgError=ajaxOptions.error;var eventType="nodeLoaded.dynatree."+this.tree.$tree.attr("id")
+"."+this.data.key;var options=$.extend({},this.tree.options.ajaxDefaults,ajaxOptions,{success:function(data,textStatus){var prevPhase=self.tree.phase;self.tree.phase="init";if(options.postProcess){data=options.postProcess.call(this,data,this.dataType);}
else if(data&&data.hasOwnProperty("d")){data=data.d;}
if(!$.isArray(data)||data.length!==0){self.addChild(data,null);}
self.tree.phase="postInit";if(orgSuccess){orgSuccess.call(options,self);}
self.tree.logDebug("trigger "+eventType);self.tree.$tree.trigger(eventType,[self,true]);self.tree.phase=prevPhase;self.setLazyNodeStatus(DTNodeStatus_Ok);if($.isArray(data)&&data.length===0){self.childList=[];self.render();}},error:function(XMLHttpRequest,textStatus,errorThrown){self.tree.logWarning("appendAjax failed:",textStatus,":\n",XMLHttpRequest,"\n",errorThrown);if(orgError){orgError.call(options,self,XMLHttpRequest,textStatus,errorThrown);}
self.tree.$tree.trigger(eventType,[self,false]);self.setLazyNodeStatus(DTNodeStatus_Error,{info:textStatus,tooltip:""+errorThrown});}});$.ajax(options);},move:function(targetNode,mode){var pos;if(this===targetNode){return;}
if(!this.parent){throw"Cannot move system root";}
if(mode===undefined||mode=="over"){mode="child";}
var prevParent=this.parent;var targetParent=(mode==="child")?targetNode:targetNode.parent;if(targetParent.isDescendantOf(this)){throw"Cannot move a node to it's own descendant";}
if(this.parent.childList.length==1){this.parent.childList=null;this.parent.bExpanded=false;}else{pos=$.inArray(this,this.parent.childList);if(pos<0){throw"Internal error";}
this.parent.childList.splice(pos,1);}
this.parent.ul.removeChild(this.li);this.parent=targetParent;if(targetParent.hasChildren()){switch(mode){case"child":targetParent.childList.push(this);break;case"before":pos=$.inArray(targetNode,targetParent.childList);if(pos<0){throw"Internal error";}
targetParent.childList.splice(pos,0,this);break;case"after":pos=$.inArray(targetNode,targetParent.childList);if(pos<0){throw"Internal error";}
targetParent.childList.splice(pos+1,0,this);break;default:throw"Invalid mode "+mode;}}else{targetParent.childList=[this];}
if(!targetParent.ul){targetParent.ul=document.createElement("ul");targetParent.ul.style.display="none";targetParent.li.appendChild(targetParent.ul);}
targetParent.ul.appendChild(this.li);if(this.tree!==targetNode.tree){this.visit(function(node){node.tree=targetNode.tree;},null,true);throw"Not yet implemented.";}
if(!prevParent.isDescendantOf(targetParent)){prevParent.render();}
if(!targetParent.isDescendantOf(prevParent)){targetParent.render();}},lastentry:undefined};var DynaTreeStatus=Class.create();DynaTreeStatus._getTreePersistData=function(cookieId,cookieOpts){var ts=new DynaTreeStatus(cookieId,cookieOpts);ts.read();return ts.toDict();};getDynaTreePersistData=DynaTreeStatus._getTreePersistData;DynaTreeStatus.prototype={initialize:function(cookieId,cookieOpts){if(cookieId===undefined){cookieId=$.ui.dynatree.prototype.options.cookieId;}
cookieOpts=$.extend({},$.ui.dynatree.prototype.options.cookie,cookieOpts);this.cookieId=cookieId;this.cookieOpts=cookieOpts;this.cookiesFound=undefined;this.activeKey=null;this.focusedKey=null;this.expandedKeyList=null;this.selectedKeyList=null;},_log:function(msg){Array.prototype.unshift.apply(arguments,["debug"]);_log.apply(this,arguments);},read:function(){this.cookiesFound=false;var cookie=$.cookie(this.cookieId+"-active");this.activeKey=(cookie===null)?"":cookie;if(cookie!==null){this.cookiesFound=true;}
cookie=$.cookie(this.cookieId+"-focus");this.focusedKey=(cookie===null)?"":cookie;if(cookie!==null){this.cookiesFound=true;}
cookie=$.cookie(this.cookieId+"-expand");this.expandedKeyList=(cookie===null)?[]:cookie.split(",");if(cookie!==null){this.cookiesFound=true;}
cookie=$.cookie(this.cookieId+"-select");this.selectedKeyList=(cookie===null)?[]:cookie.split(",");if(cookie!==null){this.cookiesFound=true;}},write:function(){$.cookie(this.cookieId+"-active",(this.activeKey===null)?"":this.activeKey,this.cookieOpts);$.cookie(this.cookieId+"-focus",(this.focusedKey===null)?"":this.focusedKey,this.cookieOpts);$.cookie(this.cookieId+"-expand",(this.expandedKeyList===null)?"":this.expandedKeyList.join(","),this.cookieOpts);$.cookie(this.cookieId+"-select",(this.selectedKeyList===null)?"":this.selectedKeyList.join(","),this.cookieOpts);},addExpand:function(key){if($.inArray(key,this.expandedKeyList)<0){this.expandedKeyList.push(key);$.cookie(this.cookieId+"-expand",this.expandedKeyList.join(","),this.cookieOpts);}},clearExpand:function(key){var idx=$.inArray(key,this.expandedKeyList);if(idx>=0){this.expandedKeyList.splice(idx,1);$.cookie(this.cookieId+"-expand",this.expandedKeyList.join(","),this.cookieOpts);}},addSelect:function(key){if($.inArray(key,this.selectedKeyList)<0){this.selectedKeyList.push(key);$.cookie(this.cookieId+"-select",this.selectedKeyList.join(","),this.cookieOpts);}},clearSelect:function(key){var idx=$.inArray(key,this.selectedKeyList);if(idx>=0){this.selectedKeyList.splice(idx,1);$.cookie(this.cookieId+"-select",this.selectedKeyList.join(","),this.cookieOpts);}},isReloading:function(){return this.cookiesFound===true;},toDict:function(){return{cookiesFound:this.cookiesFound,activeKey:this.activeKey,focusedKey:this.activeKey,expandedKeyList:this.expandedKeyList,selectedKeyList:this.selectedKeyList};},lastentry:undefined};var DynaTree=Class.create();DynaTree.version="$Version: 1.2.0_rc1$";DynaTree.prototype={initialize:function($widget){this.phase="init";this.$widget=$widget;this.options=$widget.options;this.$tree=$widget.element;this.timer=null;this.divTree=this.$tree.get(0);_initDragAndDrop(this);},_load:function(callback){var $widget=this.$widget;var opts=this.options,self=this;this.bEnableUpdate=true;this._nodeCount=1;this.activeNode=null;this.focusNode=null;if(opts.rootVisible!==undefined){this.logWarning("Option 'rootVisible' is no longer supported.");}
if(opts.minExpandLevel<1){this.logWarning("Option 'minExpandLevel' must be >= 1.");opts.minExpandLevel=1;}
if(opts.classNames!==$.ui.dynatree.prototype.options.classNames){opts.classNames=$.extend({},$.ui.dynatree.prototype.options.classNames,opts.classNames);}
if(opts.ajaxDefaults!==$.ui.dynatree.prototype.options.ajaxDefaults){opts.ajaxDefaults=$.extend({},$.ui.dynatree.prototype.options.ajaxDefaults,opts.ajaxDefaults);}
if(opts.dnd!==$.ui.dynatree.prototype.options.dnd){opts.dnd=$.extend({},$.ui.dynatree.prototype.options.dnd,opts.dnd);}
if(!opts.imagePath){$("script").each(function(){var _rexDtLibName=/.*dynatree[^\/]*\.js$/i;if(this.src.search(_rexDtLibName)>=0){if(this.src.indexOf("/")>=0){opts.imagePath=this.src.slice(0,this.src.lastIndexOf("/"))+"/skin/";}else{opts.imagePath="skin/";}
self.logDebug("Guessing imagePath from '%s': '%s'",this.src,opts.imagePath);return false;}});}
this.persistence=new DynaTreeStatus(opts.cookieId,opts.cookie);if(opts.persist){if(!$.cookie){_log("warn","Please include jquery.cookie.js to use persistence.");}
this.persistence.read();}
this.logDebug("DynaTree.persistence: %o",this.persistence.toDict());this.cache={tagEmpty:"<span class='"+opts.classNames.empty+"'></span>",tagVline:"<span class='"+opts.classNames.vline+"'></span>",tagExpander:"<span class='"+opts.classNames.expander+"'></span>",tagConnector:"<span class='"+opts.classNames.connector+"'></span>",tagNodeIcon:"<span class='"+opts.classNames.nodeIcon+"'></span>",tagCheckbox:"<span class='"+opts.classNames.checkbox+"'></span>",lastentry:undefined};if(opts.children||(opts.initAjax&&opts.initAjax.url)||opts.initId){$(this.divTree).empty();}
var $ulInitialize=this.$tree.find(">ul:first").hide();this.tnRoot=new DynaTreeNode(null,this,{});this.tnRoot.bExpanded=true;this.tnRoot.render();this.divTree.appendChild(this.tnRoot.ul);var root=this.tnRoot;var isReloading=(opts.persist&&this.persistence.isReloading());var isLazy=false;var prevFlag=this.enableUpdate(false);this.logDebug("Dynatree._load(): read tree structure...");if(opts.children){root.addChild(opts.children);}else if(opts.initAjax&&opts.initAjax.url){isLazy=true;root.data.isLazy=true;this._reloadAjax(callback);}else if(opts.initId){this._createFromTag(root,$("#"+opts.initId));}else{this._createFromTag(root,$ulInitialize);$ulInitialize.remove();}
this._checkConsistency();if(!isLazy&&opts.selectMode==3){root._updatePartSelectionState();}
this.logDebug("Dynatree._load(): render nodes...");this.enableUpdate(prevFlag);this.logDebug("Dynatree._load(): bind events...");this.$widget.bind();this.logDebug("Dynatree._load(): postInit...");this.phase="postInit";if(opts.persist){this.persistence.write();}
if(this.focusNode&&this.focusNode.isVisible()){this.logDebug("Focus on init: %o",this.focusNode);this.focusNode.focus();}
if(!isLazy&&opts.onPostInit){opts.onPostInit.call(this,isReloading,false);}
this.phase="idle";},_reloadAjax:function(callback){var opts=this.options;if(!opts.initAjax||!opts.initAjax.url){throw"tree.reload() requires 'initAjax' mode.";}
var pers=this.persistence;var ajaxOpts=$.extend({},opts.initAjax);if(ajaxOpts.addActiveKey){ajaxOpts.data.activeKey=pers.activeKey;}
if(ajaxOpts.addFocusedKey){ajaxOpts.data.focusedKey=pers.focusedKey;}
if(ajaxOpts.addExpandedKeyList){ajaxOpts.data.expandedKeyList=pers.expandedKeyList.join(",");}
if(ajaxOpts.addSelectedKeyList){ajaxOpts.data.selectedKeyList=pers.selectedKeyList.join(",");}
if(ajaxOpts.success){this.logError("initAjax: success callback is ignored; use onPostInit instead.");}
if(ajaxOpts.error){this.logError("initAjax: error callback is ignored; use onPostInit instead.");}
var isReloading=pers.isReloading();ajaxOpts.success=function(dtnode){if(opts.selectMode==3){dtnode.tree.tnRoot._updatePartSelectionState();}
if(opts.onPostInit){opts.onPostInit.call(dtnode.tree,isReloading,false);}
if(callback){callback.call(dtnode.tree,"ok");}};ajaxOpts.error=function(dtnode){if(opts.onPostInit){opts.onPostInit.call(dtnode.tree,isReloading,true);}
if(callback){callback.call(dtnode.tree,"error");}};this.logDebug("Dynatree._init(): send Ajax request...");this.tnRoot.appendAjax(ajaxOpts);},toString:function(){return"Dynatree '"+this.$tree.attr("id")+"'";},toDict:function(){return this.tnRoot.toDict(true);},serializeArray:function(stopOnParents){var nodeList=this.getSelectedNodes(stopOnParents),name=this.$tree.attr("name")||this.$tree.attr("id"),arr=[];for(var i=0,l=nodeList.length;i<l;i++){arr.push({name:name,value:nodeList[i].data.key});}
return arr;},getPersistData:function(){return this.persistence.toDict();},logDebug:function(msg){if(this.options.debugLevel>=2){Array.prototype.unshift.apply(arguments,["debug"]);_log.apply(this,arguments);}},logInfo:function(msg){if(this.options.debugLevel>=1){Array.prototype.unshift.apply(arguments,["info"]);_log.apply(this,arguments);}},logWarning:function(msg){Array.prototype.unshift.apply(arguments,["warn"]);_log.apply(this,arguments);},isInitializing:function(){return(this.phase=="init"||this.phase=="postInit");},isReloading:function(){return(this.phase=="init"||this.phase=="postInit")&&this.options.persist&&this.persistence.cookiesFound;},isUserEvent:function(){return(this.phase=="userEvent");},redraw:function(){this.tnRoot.render(false,false);},renderInvisibleNodes:function(){this.tnRoot.render(false,true);},reload:function(callback){this._load(callback);},getRoot:function(){return this.tnRoot;},enable:function(){this.$widget.enable();},disable:function(){this.$widget.disable();},getNodeByKey:function(key){var el=document.getElementById(this.options.idPrefix+key);if(el){return el.dtnode?el.dtnode:null;}
var match=null;this.visit(function(node){if(node.data.key==key){match=node;return false;}},true);return match;},getActiveNode:function(){return this.activeNode;},reactivate:function(setFocus){var node=this.activeNode;if(node){this.activeNode=null;node.activate();if(setFocus){node.focus();}}},getSelectedNodes:function(stopOnParents){var nodeList=[];this.tnRoot.visit(function(node){if(node.bSelected){nodeList.push(node);if(stopOnParents===true){return"skip";}}});return nodeList;},activateKey:function(key){var dtnode=(key===null)?null:this.getNodeByKey(key);if(!dtnode){if(this.activeNode){this.activeNode.deactivate();}
this.activeNode=null;return null;}
dtnode.focus();dtnode.activate();return dtnode;},loadKeyPath:function(keyPath,callback){var segList=keyPath.split(this.options.keyPathSeparator);if(segList[0]===""){segList.shift();}
if(segList[0]==this.tnRoot.data.key){this.logDebug("Removed leading root key.");segList.shift();}
keyPath=segList.join(this.options.keyPathSeparator);return this.tnRoot._loadKeyPath(keyPath,callback);},selectKey:function(key,select){var dtnode=this.getNodeByKey(key);if(!dtnode){return null;}
dtnode.select(select);return dtnode;},enableUpdate:function(bEnable){if(this.bEnableUpdate==bEnable){return bEnable;}
this.bEnableUpdate=bEnable;if(bEnable){this.redraw();}
return!bEnable;},count:function(){return this.tnRoot.countChildren();},visit:function(fn,includeRoot){return this.tnRoot.visit(fn,includeRoot);},_createFromTag:function(parentTreeNode,$ulParent){var self=this;$ulParent.find(">li").each(function(){var $li=$(this),$liSpan=$li.find(">span:first"),$liA=$li.find(">a:first"),title,href=null,target=null,tooltip;if($liSpan.length){title=$liSpan.html();}else if($liA.length){title=$liA.html();href=$liA.attr("href");target=$liA.attr("target");tooltip=$liA.attr("title");}else{title=$li.html();var iPos=title.search(/<ul/i);if(iPos>=0){title=$.trim(title.substring(0,iPos));}else{title=$.trim(title);}}
var data={title:title,tooltip:tooltip,isFolder:$li.hasClass("folder"),isLazy:$li.hasClass("lazy"),expand:$li.hasClass("expanded"),select:$li.hasClass("selected"),activate:$li.hasClass("active"),focus:$li.hasClass("focused"),noLink:$li.hasClass("noLink")};if(href){data.href=href;data.target=target;}
if($li.attr("title")){data.tooltip=$li.attr("title");}
if($li.attr("id")){data.key=$li.attr("id");}
if($li.attr("data")){var dataAttr=$.trim($li.attr("data"));if(dataAttr){if(dataAttr.charAt(0)!="{"){dataAttr="{"+dataAttr+"}";}
try{$.extend(data,eval("("+dataAttr+")"));}catch(e){throw("Error parsing node data: "+e+"\ndata:\n'"+dataAttr+"'");}}}
var childNode=parentTreeNode.addChild(data);var $ul=$li.find(">ul:first");if($ul.length){self._createFromTag(childNode,$ul);}});},_checkConsistency:function(){},_setDndStatus:function(sourceNode,targetNode,helper,hitMode,accept){var $source=sourceNode?$(sourceNode.span):null,$target=$(targetNode.span);if(!this.$dndMarker){this.$dndMarker=$("<div id='dynatree-drop-marker'></div>").hide().prependTo($(this.divTree).parent());}
if(hitMode==="after"||hitMode==="before"||hitMode==="over"){var pos=$target.offset();switch(hitMode){case"before":this.$dndMarker.removeClass("dynatree-drop-after dynatree-drop-over");this.$dndMarker.addClass("dynatree-drop-before");pos.top-=8;break;case"after":this.$dndMarker.removeClass("dynatree-drop-before dynatree-drop-over");this.$dndMarker.addClass("dynatree-drop-after");pos.top+=8;break;default:this.$dndMarker.removeClass("dynatree-drop-after dynatree-drop-before");this.$dndMarker.addClass("dynatree-drop-over");$target.addClass("dynatree-drop-target");pos.left+=8;}
this.$dndMarker.offset({left:pos.left,top:pos.top}).css({"z-index":1000}).show();}else{$target.removeClass("dynatree-drop-target");this.$dndMarker.hide();}
if(hitMode==="after"){$target.addClass("dynatree-drop-after");}else{$target.removeClass("dynatree-drop-after");}
if(hitMode==="before"){$target.addClass("dynatree-drop-before");}else{$target.removeClass("dynatree-drop-before");}
if(accept===true){if($source){$source.addClass("dynatree-drop-accept");}
$target.addClass("dynatree-drop-accept");helper.addClass("dynatree-drop-accept");}else{if($source){$source.removeClass("dynatree-drop-accept");}
$target.removeClass("dynatree-drop-accept");helper.removeClass("dynatree-drop-accept");}
if(accept===false){if($source){$source.addClass("dynatree-drop-reject");}
$target.addClass("dynatree-drop-reject");helper.addClass("dynatree-drop-reject");}else{if($source){$source.removeClass("dynatree-drop-reject");}
$target.removeClass("dynatree-drop-reject");helper.removeClass("dynatree-drop-reject");}},_onDragEvent:function(eventName,node,otherNode,event,ui,draggable){var opts=this.options;var dnd=this.options.dnd;var res=null;var nodeTag=$(node.span);var hitMode;switch(eventName){case"helper":var helper=$("<div class='dynatree-drag-helper'><span class='dynatree-drag-helper-img' /></div>").append($(event.target).closest('a').clone());helper.data("dtSourceNode",node);res=helper;break;case"start":if(node.isStatusNode()){res=false;}else if(dnd.onDragStart){res=dnd.onDragStart(node);}
if(res===false){this.logDebug("tree.onDragStart() cancelled");ui.helper.trigger("mouseup");ui.helper.hide();}else{nodeTag.addClass("dynatree-drag-source");}
break;case"enter":res=dnd.onDragEnter?dnd.onDragEnter(node,otherNode):null;res={over:(res!==false)&&((res===true)||(res==="over")||$.inArray("over",res)>=0),before:(res!==false)&&((res===true)||(res==="before")||$.inArray("before",res)>=0),after:(res!==false)&&((res===true)||(res==="after")||$.inArray("after",res)>=0)};ui.helper.data("enterResponse",res);break;case"over":var enterResponse=ui.helper.data("enterResponse");hitMode=null;if(enterResponse===false){break;}else if(typeof enterResponse==="string"){hitMode=enterResponse;}else{var nodeOfs=nodeTag.offset();var relPos={x:event.pageX-nodeOfs.left,y:event.pageY-nodeOfs.top};var relPos2={x:relPos.x/nodeTag.width(),y:relPos.y/nodeTag.height()};if(enterResponse.after&&relPos2.y>0.75){hitMode="after";}else if(!enterResponse.over&&enterResponse.after&&relPos2.y>0.5){hitMode="after";}else if(enterResponse.before&&relPos2.y<=0.25){hitMode="before";}else if(!enterResponse.over&&enterResponse.before&&relPos2.y<=0.5){hitMode="before";}else if(enterResponse.over){hitMode="over";}
if(dnd.preventVoidMoves){if(node===otherNode){hitMode=null;}else if(hitMode==="before"&&otherNode&&node===otherNode.getNextSibling()){hitMode=null;}else if(hitMode==="after"&&otherNode&&node===otherNode.getPrevSibling()){hitMode=null;}else if(hitMode==="over"&&otherNode&&otherNode.parent===node&&otherNode.isLastSibling()){hitMode=null;}}
ui.helper.data("hitMode",hitMode);}
if(hitMode==="over"&&dnd.autoExpandMS&&node.hasChildren()!==false&&!node.bExpanded){node.scheduleAction("expand",dnd.autoExpandMS);}
if(hitMode&&dnd.onDragOver){res=dnd.onDragOver(node,otherNode,hitMode);}
this._setDndStatus(otherNode,node,ui.helper,hitMode,res!==false);break;case"drop":hitMode=ui.helper.data("hitMode");if(hitMode&&dnd.onDrop){dnd.onDrop(node,otherNode,hitMode,ui,draggable);}
break;case"leave":node.scheduleAction("cancel");ui.helper.data("enterResponse",null);ui.helper.data("hitMode",null);this._setDndStatus(otherNode,node,ui.helper,"out",undefined);if(dnd.onDragLeave){dnd.onDragLeave(node,otherNode);}
break;case"stop":nodeTag.removeClass("dynatree-drag-source");if(dnd.onDragStop){dnd.onDragStop(node);}
break;default:throw"Unsupported drag event: "+eventName;}
return res;},cancelDrag:function(){var dd=$.ui.ddmanager.current;if(dd){dd.cancel();}},lastentry:undefined};$.widget("ui.dynatree",{_init:function(){if(parseFloat($.ui.version)<1.8){if(this.options.debugLevel>=0){_log("warn","ui.dynatree._init() was called; you should upgrade to jquery.ui.core.js v1.8 or higher.");}
return this._create();}
if(this.options.debugLevel>=2){_log("debug","ui.dynatree._init() was called; no current default functionality.");}},_create:function(){var opts=this.options;if(opts.debugLevel>=1){logMsg("Dynatree._create(): version='%s', debugLevel=%o.",$.ui.dynatree.version,this.options.debugLevel);}
this.options.event+=".dynatree";var divTree=this.element.get(0);this.tree=new DynaTree(this);this.tree._load();this.tree.logDebug("Dynatree._init(): done.");},bind:function(){this.unbind();var eventNames="click.dynatree dblclick.dynatree";if(this.options.keyboard){eventNames+=" keypress.dynatree keydown.dynatree";}
this.element.bind(eventNames,function(event){var dtnode=getDtNodeFromElement(event.target);if(!dtnode){return true;}
var tree=dtnode.tree;var o=tree.options;tree.logDebug("event(%s): dtnode: %s",event.type,dtnode);var prevPhase=tree.phase;tree.phase="userEvent";try{switch(event.type){case"click":return(o.onClick&&o.onClick.call(tree,dtnode,event)===false)?false:dtnode._onClick(event);case"dblclick":return(o.onDblClick&&o.onDblClick.call(tree,dtnode,event)===false)?false:dtnode._onDblClick(event);case"keydown":return(o.onKeydown&&o.onKeydown.call(tree,dtnode,event)===false)?false:dtnode._onKeydown(event);case"keypress":return(o.onKeypress&&o.onKeypress.call(tree,dtnode,event)===false)?false:dtnode._onKeypress(event);}}catch(e){var _=null;tree.logWarning("bind(%o): dtnode: %o, error: %o",event,dtnode,e);}finally{tree.phase=prevPhase;}});function __focusHandler(event){event=$.event.fix(event||window.event);var dtnode=getDtNodeFromElement(event.target);return dtnode?dtnode._onFocus(event):false;}
var div=this.tree.divTree;if(div.addEventListener){div.addEventListener("focus",__focusHandler,true);div.addEventListener("blur",__focusHandler,true);}else{div.onfocusin=div.onfocusout=__focusHandler;}},unbind:function(){this.element.unbind(".dynatree");},enable:function(){this.bind();$.Widget.prototype.enable.apply(this,arguments);},disable:function(){this.unbind();$.Widget.prototype.disable.apply(this,arguments);},getTree:function(){return this.tree;},getRoot:function(){return this.tree.getRoot();},getActiveNode:function(){return this.tree.getActiveNode();},getSelectedNodes:function(){return this.tree.getSelectedNodes();},lastentry:undefined});if(parseFloat($.ui.version)<1.8){$.ui.dynatree.getter="getTree getRoot getActiveNode getSelectedNodes";}
$.ui.dynatree.version="$Version: 1.2.0_rc1$";$.ui.dynatree.getNode=function(el){if(el instanceof DynaTreeNode){return el;}
var $el=el.selector===undefined?$(el):el,parent=$el.parents("[dtnode]").first(),node;if(typeof parent.prop=="function"){node=parent.prop("dtnode");}else{node=parent.attr("dtnode");}
return node;}
$.ui.dynatree.getPersistData=DynaTreeStatus._getTreePersistData;$.ui.dynatree.prototype.options={title:"Dynatree",minExpandLevel:1,imagePath:null,children:null,initId:null,initAjax:null,autoFocus:true,keyboard:true,persist:false,autoCollapse:false,clickFolderMode:3,activeVisible:true,checkbox:false,selectMode:2,fx:null,noLink:false,onClick:null,onDblClick:null,onKeydown:null,onKeypress:null,onFocus:null,onBlur:null,onQueryActivate:null,onQuerySelect:null,onQueryExpand:null,onPostInit:null,onActivate:null,onDeactivate:null,onSelect:null,onExpand:null,onLazyRead:null,onCustomRender:null,onCreate:null,onRender:null,dnd:{onDragStart:null,onDragStop:null,autoExpandMS:1000,preventVoidMoves:true,onDragEnter:null,onDragOver:null,onDrop:null,onDragLeave:null},ajaxDefaults:{cache:false,dataType:"json"},strings:{loading:"Loading&#8230;",loadError:"Load error!"},generateIds:false,idPrefix:"dynatree-id-",keyPathSeparator:"/",cookieId:"dynatree",cookie:{expires:null},classNames:{container:"dynatree-container",node:"dynatree-node",folder:"dynatree-folder",empty:"dynatree-empty",vline:"dynatree-vline",expander:"dynatree-expander",connector:"dynatree-connector",checkbox:"dynatree-checkbox",nodeIcon:"dynatree-icon",title:"dynatree-title",noConnector:"dynatree-no-connector",nodeError:"dynatree-statusnode-error",nodeWait:"dynatree-statusnode-wait",hidden:"dynatree-hidden",combinedExpanderPrefix:"dynatree-exp-",combinedIconPrefix:"dynatree-ico-",nodeLoading:"dynatree-loading",hasChildren:"dynatree-has-children",active:"dynatree-active",selected:"dynatree-selected",expanded:"dynatree-expanded",lazy:"dynatree-lazy",focused:"dynatree-focused",partsel:"dynatree-partsel",lastsib:"dynatree-lastsib"},debugLevel:1,lastentry:undefined};if(parseFloat($.ui.version)<1.8){$.ui.dynatree.defaults=$.ui.dynatree.prototype.options;}
$.ui.dynatree.nodedatadefaults={title:null,key:null,isFolder:false,isLazy:false,tooltip:null,icon:null,addClass:null,noLink:false,activate:false,focus:false,expand:false,select:false,hideCheckbox:false,unselectable:false,children:null,lastentry:undefined};function _initDragAndDrop(tree){var dnd=tree.options.dnd||null;if(dnd&&(dnd.onDragStart||dnd.onDrop)){_registerDnd();}
if(dnd&&dnd.onDragStart){tree.$tree.draggable({addClasses:false,appendTo:"body",containment:false,delay:0,distance:4,revert:false,connectToDynatree:true,helper:function(event){var sourceNode=getDtNodeFromElement(event.target);return sourceNode.tree._onDragEvent("helper",sourceNode,null,event,null,null);},_last:null});}
if(dnd&&dnd.onDrop){tree.$tree.droppable({addClasses:false,tolerance:"intersect",greedy:false,_last:null});}}
var didRegisterDnd=false;var _registerDnd=function(){if(didRegisterDnd){return;}
$.ui.plugin.add("draggable","connectToDynatree",{start:function(event,ui){var draggable=$(this).data("draggable");var sourceNode=ui.helper.data("dtSourceNode")||null;if(sourceNode){draggable.offset.click.top=-2;draggable.offset.click.left=+16;return sourceNode.tree._onDragEvent("start",sourceNode,null,event,ui,draggable);}},drag:function(event,ui){var draggable=$(this).data("draggable");var sourceNode=ui.helper.data("dtSourceNode")||null;var prevTargetNode=ui.helper.data("dtTargetNode")||null;var targetNode=getDtNodeFromElement(event.target);if(event.target&&!targetNode){var isHelper=$(event.target).closest("div.dynatree-drag-helper,#dynatree-drop-marker").length>0;if(isHelper){return;}}
ui.helper.data("dtTargetNode",targetNode);if(prevTargetNode&&prevTargetNode!==targetNode){prevTargetNode.tree._onDragEvent("leave",prevTargetNode,sourceNode,event,ui,draggable);}
if(targetNode){if(!targetNode.tree.options.dnd.onDrop){noop();}else if(targetNode===prevTargetNode){targetNode.tree._onDragEvent("over",targetNode,sourceNode,event,ui,draggable);}else{targetNode.tree._onDragEvent("enter",targetNode,sourceNode,event,ui,draggable);}}},stop:function(event,ui){var draggable=$(this).data("draggable");var sourceNode=ui.helper.data("dtSourceNode")||null;var targetNode=ui.helper.data("dtTargetNode")||null;var mouseDownEvent=draggable._mouseDownEvent;var eventType=event.type;var dropped=(eventType=="mouseup"&&event.which==1);if(!dropped){logMsg("Drag was cancelled");}
if(targetNode){if(dropped){targetNode.tree._onDragEvent("drop",targetNode,sourceNode,event,ui,draggable);}
targetNode.tree._onDragEvent("leave",targetNode,sourceNode,event,ui,draggable);}
if(sourceNode){sourceNode.tree._onDragEvent("stop",sourceNode,null,event,ui,draggable);}}});didRegisterDnd=true;};})(jQuery);
});
