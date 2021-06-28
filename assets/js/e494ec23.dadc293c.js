(self.webpackChunktd_doc=self.webpackChunktd_doc||[]).push([[3907],{3905:function(e,t,r){"use strict";r.d(t,{Zo:function(){return p},kt:function(){return f}});var n=r(67294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),d=c(r),f=a,m=d["".concat(s,".").concat(f)]||d[f]||u[f]||i;return r?n.createElement(m,l(l({ref:t},p),{},{components:r})):n.createElement(m,l({ref:t},p))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,l=new Array(i);l[0]=d;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var c=2;c<i;c++)l[c]=r[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},5956:function(e,t,r){"use strict";r.r(t),r.d(t,{frontMatter:function(){return o},metadata:function(){return s},toc:function(){return c},default:function(){return u}});var n=r(22122),a=r(19756),i=(r(67294),r(3905)),l=["components"],o={id:"scalars",title:"Scalars",slug:"scalars"},s={unversionedId:"api-reference/bsff/scalars",id:"api-reference/bsff/scalars",isDocsHomePage:!1,title:"Scalars",description:"Boolean",source:"@site/docs/api-reference/bsff/scalars.md",sourceDirName:"api-reference/bsff",slug:"/api-reference/bsff/scalars",permalink:"/api-reference/bsff/scalars",editUrl:"https://github.com/MTES-MCT/trackdechets/doc/docs/api-reference/bsff/scalars.md",version:"current",frontMatter:{id:"scalars",title:"Scalars",slug:"scalars"},sidebar:"docs",previous:{title:"Input objects",permalink:"/api-reference/bsff/inputObjects"},next:{title:"Queries",permalink:"/api-reference/bsda/queries"}},c=[{value:"Boolean",id:"boolean",children:[]},{value:"DateTime",id:"datetime",children:[]},{value:"Float",id:"float",children:[]},{value:"ID",id:"id",children:[]},{value:"Int",id:"int",children:[]},{value:"JSON",id:"json",children:[]},{value:"String",id:"string",children:[]},{value:"URL",id:"url",children:[]}],p={toc:c};function u(e){var t=e.components,r=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"boolean"},"Boolean"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"Boolean")," scalar type represents ",(0,i.kt)("inlineCode",{parentName:"p"},"true")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"false"),"."),(0,i.kt)("h2",{id:"datetime"},"DateTime"),(0,i.kt)("p",null,"Le scalaire ",(0,i.kt)("inlineCode",{parentName:"p"},"DateTime")," accepte des chaines de caract\xe8res\nformatt\xe9es selon le standard ISO 8601. Exemples:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},'"yyyy-MM-dd" (eg. 2020-11-23)'),(0,i.kt)("li",{parentName:"ul"},'"yyyy-MM-ddTHH:mm:ss" (eg. 2020-11-23T13:34:55)'),(0,i.kt)("li",{parentName:"ul"},'"yyyy-MM-ddTHH:mm:ssX" (eg. 2020-11-23T13:34:55Z)'),(0,i.kt)("li",{parentName:"ul"},"\"yyyy-MM-dd'T'HH:mm:ss.SSS\" (eg. 2020-11-23T13:34:55.987)"),(0,i.kt)("li",{parentName:"ul"},"\"yyyy-MM-dd'T'HH:mm:ss.SSSX\" (eg. 2020-11-23T13:34:55.987Z)")),(0,i.kt)("h2",{id:"float"},"Float"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"Float")," scalar type represents signed double-precision fractional values as specified by ",(0,i.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/IEEE_floating_point"},"IEEE 754"),"."),(0,i.kt)("h2",{id:"id"},"ID"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"ID")," scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as ",(0,i.kt)("inlineCode",{parentName:"p"},'"4"'),") or integer (such as ",(0,i.kt)("inlineCode",{parentName:"p"},"4"),") input value will be accepted as an ID."),(0,i.kt)("h2",{id:"int"},"Int"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"Int")," scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1."),(0,i.kt)("h2",{id:"json"},"JSON"),(0,i.kt)("h2",{id:"string"},"String"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"String")," scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text."),(0,i.kt)("h2",{id:"url"},"URL"),(0,i.kt)("p",null,"Cha\xeene de caract\xe8re au format URL, d\xe9butant par un protocole http(s)."))}u.isMDXComponent=!0}}]);