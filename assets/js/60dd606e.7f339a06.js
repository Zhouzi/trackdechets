(self.webpackChunktd_doc=self.webpackChunktd_doc||[]).push([[1551],{3905:function(e,t,n){"use strict";n.d(t,{Zo:function(){return l},kt:function(){return m}});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},l=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,l=u(e,["components","mdxType","originalType","parentName"]),d=s(n),m=a,f=d["".concat(c,".").concat(m)]||d[m]||p[m]||i;return n?r.createElement(f,o(o({ref:t},l),{},{components:n})):r.createElement(f,o({ref:t},l))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=d;var u={};for(var c in t)hasOwnProperty.call(t,c)&&(u[c]=t[c]);u.originalType=e,u.mdxType="string"==typeof e?e:a,o[1]=u;for(var s=2;s<i;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},94257:function(e,t,n){"use strict";n.r(t),n.d(t,{frontMatter:function(){return u},metadata:function(){return c},toc:function(){return s},default:function(){return p}});var r=n(22122),a=n(19756),i=(n(67294),n(3905)),o=["components"],u={title:"Utilisation du playground"},c={unversionedId:"guides/playground",id:"guides/playground",isDocsHomePage:!1,title:"Utilisation du playground",description:"Acc\xe8s",source:"@site/docs/guides/playground.md",sourceDirName:"guides",slug:"/guides/playground",permalink:"/guides/playground",editUrl:"https://github.com/MTES-MCT/trackdechets/doc/docs/guides/playground.md",version:"current",frontMatter:{title:"Utilisation du playground"},sidebar:"docs",previous:{title:"Obtenir un jeton d'acc\xe8s personnel",permalink:"/guides/access-token"},next:{title:"API SIRENE enrichie",permalink:"/guides/sirene"}},s=[{value:"Acc\xe8s",id:"acc\xe8s",children:[]},{value:"Authentification",id:"authentification",children:[]},{value:"Votre premiere requ\xeate",id:"votre-premiere-requ\xeate",children:[{value:"Documentation",id:"documentation",children:[]}]}],l={toc:s};function p(e){var t=e.components,u=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},l,u,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"acc\xe8s"},"Acc\xe8s"),(0,i.kt)("p",null,"Si vous acc\xe9dez au point de terminaison de l'API GraphQL depuis un navigateur, vous aurez acc\xe8s \xe0 un \xe9diteur interactif de requ\xeate GraphQL."),(0,i.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Les diff\xe9rents points de terminaisons GraphQL en fonction des environnements sont les suivants:"),(0,i.kt)("ul",{parentName:"div"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://api.trackdechets.beta.gouv.fr"},"https://api.trackdechets.beta.gouv.fr")," (production)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://api.sandbox.trackdechets.beta.gouv.fr"},"https://api.sandbox.trackdechets.beta.gouv.fr")," (bac \xe0 sable)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://api.trackdechets.fr"},"https://api.trackdechets.fr")," (recette)")),(0,i.kt)("p",{parentName:"div"},"Voir aussi ",(0,i.kt)("a",{parentName:"p",href:"/guides/environments"},"la documentation sur les environnements")))),(0,i.kt)("h2",{id:"authentification"},"Authentification"),(0,i.kt)("p",null,"La plupart des requ\xeates n\xe9cessitant d'\xeatre authentifi\xe9, vous devrez donc ",(0,i.kt)("a",{parentName:"p",href:"/guides/access-token"},"r\xe9cup\xe9rer un jeton d'acc\xe8s")),(0,i.kt)("p",null,"Le token doit \xeatre ins\xe9r\xe9 dans le cadre inf\xe9rieur gauche de l'\xe9cran sous la forme d'un header d'autorisation de type \"Bearer\""),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "Authorization": "Bearer ACCESS_TOKEN"\n}\n')),(0,i.kt)("p",null,"o\xf9 ",(0,i.kt)("inlineCode",{parentName:"p"},"ACCESS_TOKEN")," repr\xe9sente le token que vous avez r\xe9cup\xe9r\xe9 depuis votre compte Trackd\xe9chets (Mon Compte > Int\xe9gration API)."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"playground",src:n(70645).Z})),(0,i.kt)("h2",{id:"votre-premiere-requ\xeate"},"Votre premiere requ\xeate"),(0,i.kt)("p",null,"Une fois le token renseign\xe9, vous pourrez \xe9crire ",(0,i.kt)("inlineCode",{parentName:"p"},"queries")," et ",(0,i.kt)("inlineCode",{parentName:"p"},"mutations")," dans le cadre de gauche, et voir le r\xe9sultat dans celle de droite apr\xe8s avoir cliqu\xe9 sur le bouton central."),(0,i.kt)("p",null,"Dans la zone de gauche, copiez cette requ\xeate."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"query {\n  me {\n    id\n    email\n  }\n}\n")),(0,i.kt)("p",null,"En cliquant sur le bouton central, vous verrez la r\xe9ponse dans la zone de droite."),(0,i.kt)("p",null,"Notez qu\u2019il est possible d\u2019exporter vos requ\xeates au format cURL en cliquant sur le bouton situ\xe9 en haut \xe0 droite."),(0,i.kt)("h3",{id:"documentation"},"Documentation"),(0,i.kt)("p",null,"Un onglet docs \xe0 droite de la fen\xeatre vous pr\xe9sente une vue exhaustive des requ\xeates disponibles."))}p.isMDXComponent=!0},70645:function(e,t,n){"use strict";t.Z=n.p+"assets/images/playground-3ccf0c22f4e563235a583ad4ecdae4fa.png"}}]);