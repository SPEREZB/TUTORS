import{s as d,e as _,i as k,d as y,Z as I}from"./scheduler.a12d0be3.js";import{S as w,i as M,g as A,t as f,c as C,a as m,b as g,d as p,m as h,e as b}from"./index.208b70fa.js";import{l as H}from"./stores.ee858f52.js";import{I as S}from"./Icon.24b4d7b9.js";import"./ProgressBar.svelte_svelte_type_style_lang.0f792c6b.js";import{A as $}from"./Avatar.1c82e981.js";function q(c){let o,t;return o=new $({props:{src:c[0].img,alt:c[0].title,width:c[1],rounded:"rounded-xl",background:"none"}}),{c(){g(o.$$.fragment)},l(e){p(o.$$.fragment,e)},m(e,n){h(o,e,n),t=!0},p(e,n){const i={};n&1&&(i.src=e[0].img),n&1&&(i.alt=e[0].title),n&2&&(i.width=e[1]),o.$set(i)},i(e){t||(m(o.$$.fragment,e),t=!0)},o(e){f(o.$$.fragment,e),t=!1},d(e){b(o,e)}}}function D(c){let o,t;return o=new S({props:{icon:c[0].icon.type,color:""+(c[3]+c[0].icon.color),height:c[2]}}),{c(){g(o.$$.fragment)},l(e){p(o.$$.fragment,e)},m(e,n){h(o,e,n),t=!0},p(e,n){const i={};n&1&&(i.icon=e[0].icon.type),n&9&&(i.color=""+(e[3]+e[0].icon.color)),n&4&&(i.height=e[2]),o.$set(i)},i(e){t||(m(o.$$.fragment,e),t=!0)},o(e){f(o.$$.fragment,e),t=!1},d(e){b(o,e)}}}function N(c){let o,t,e,n;const i=[D,q],a=[];function l(r,s){return r[0].icon?0:1}return o=l(c),t=a[o]=i[o](c),{c(){t.c(),e=_()},l(r){t.l(r),e=_()},m(r,s){a[o].m(r,s),k(r,e,s),n=!0},p(r,[s]){let u=o;o=l(r),o===u?a[o].p(r,s):(A(),f(a[u],1,1,()=>{a[u]=null}),C(),t=a[o],t?t.p(r,s):(t=a[o]=i[o](r),t.c()),m(t,1),t.m(e.parentNode,e))},i(r){n||(m(t),n=!0)},o(r){f(t),n=!1},d(r){r&&y(e),a[o].d(r)}}}function P(c){return!0}function Z(c,o,t){let{lo:e}=o,{miniImage:n=!1}=o,i="",a="",l="";e&&!e.icon&&e.frontMatter&&e.frontMatter.icon&&(e.icon={type:e.frontMatter.icon.type,color:e.frontMatter.icon.color}),e.icon&&P(e.icon.color),n&&(i="h-10",a="48");const r=H.subscribe(s=>{n||(s==="compacted"?(t(2,a="90"),t(1,i="h-20")):(t(2,a="180"),t(1,i="h-48")))});return I(r),c.$$set=s=>{"lo"in s&&t(0,e=s.lo),"miniImage"in s&&t(4,n=s.miniImage)},[e,i,a,l,n]}class G extends w{constructor(o){super(),M(this,o,Z,N,d,{lo:0,miniImage:4})}}export{G as I};