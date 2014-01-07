// Compiled by ClojureScript 0.0-2138
goog.provide('lein_templates.core');
goog.require('cljs.core');
goog.require('om.dom');
goog.require('om.dom');
goog.require('om.core');
goog.require('om.core');
cljs.core.enable_console_print_BANG_();
lein_templates.core.app_state = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 1, [cljs.core.constant$keyword$23,0], null));
lein_templates.core.button = (function button(data,owner){if(typeof lein_templates.core.t5498 !== 'undefined')
{} else
{
/**
* @constructor
*/
lein_templates.core.t5498 = (function (owner,data,button,meta5499){
this.owner = owner;
this.data = data;
this.button = button;
this.meta5499 = meta5499;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 393216;
})
lein_templates.core.t5498.cljs$lang$type = true;
lein_templates.core.t5498.cljs$lang$ctorStr = "lein-templates.core/t5498";
lein_templates.core.t5498.cljs$lang$ctorPrWriter = (function (this__3970__auto__,writer__3971__auto__,opt__3972__auto__){return cljs.core._write(writer__3971__auto__,"lein-templates.core/t5498");
});
lein_templates.core.t5498.prototype.om$core$IRender$ = true;
lein_templates.core.t5498.prototype.om$core$IRender$render$arity$1 = (function (this__4931__auto__){var self__ = this;
var this__4931__auto____$1 = this;return React.DOM.div(null,React.DOM.button({"onClick": (function (){return om.core.transact_BANG_.cljs$core$IFn$_invoke$arity$3(self__.data,cljs.core.constant$keyword$23,cljs.core.inc);
})},"Click Me"),React.DOM.span({},cljs.core.constant$keyword$23.cljs$core$IFn$_invoke$arity$1(self__.data)));
});
lein_templates.core.t5498.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_5500){var self__ = this;
var _5500__$1 = this;return self__.meta5499;
});
lein_templates.core.t5498.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_5500,meta5499__$1){var self__ = this;
var _5500__$1 = this;return (new lein_templates.core.t5498(self__.owner,self__.data,self__.button,meta5499__$1));
});
lein_templates.core.__GT_t5498 = (function __GT_t5498(owner__$1,data__$1,button__$1,meta5499){return (new lein_templates.core.t5498(owner__$1,data__$1,button__$1,meta5499));
});
}
return (new lein_templates.core.t5498(owner,data,button,null));
});
lein_templates.core.my_app = (function my_app(app,owner){if(typeof lein_templates.core.t5504 !== 'undefined')
{} else
{
/**
* @constructor
*/
lein_templates.core.t5504 = (function (owner,app,my_app,meta5505){
this.owner = owner;
this.app = app;
this.my_app = my_app;
this.meta5505 = meta5505;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 393216;
})
lein_templates.core.t5504.cljs$lang$type = true;
lein_templates.core.t5504.cljs$lang$ctorStr = "lein-templates.core/t5504";
lein_templates.core.t5504.cljs$lang$ctorPrWriter = (function (this__3970__auto__,writer__3971__auto__,opt__3972__auto__){return cljs.core._write(writer__3971__auto__,"lein-templates.core/t5504");
});
lein_templates.core.t5504.prototype.om$core$IRender$ = true;
lein_templates.core.t5504.prototype.om$core$IRender$render$arity$1 = (function (_){var self__ = this;
var ___$1 = this;return om.core.build.cljs$core$IFn$_invoke$arity$3(lein_templates.core.button,self__.app,cljs.core.PersistentArrayMap.EMPTY);
});
lein_templates.core.t5504.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_5506){var self__ = this;
var _5506__$1 = this;return self__.meta5505;
});
lein_templates.core.t5504.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_5506,meta5505__$1){var self__ = this;
var _5506__$1 = this;return (new lein_templates.core.t5504(self__.owner,self__.app,self__.my_app,meta5505__$1));
});
lein_templates.core.__GT_t5504 = (function __GT_t5504(owner__$1,app__$1,my_app__$1,meta5505){return (new lein_templates.core.t5504(owner__$1,app__$1,my_app__$1,meta5505));
});
}
return (new lein_templates.core.t5504(owner,app,my_app,null));
});
om.core.root(lein_templates.core.app_state,lein_templates.core.my_app,document.getElementById("lein-templates-example"));
