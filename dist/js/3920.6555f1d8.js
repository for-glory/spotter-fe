"use strict";(self["webpackChunkspotter"]=self["webpackChunkspotter"]||[]).push([[3920],{97439:function(e,a,t){var o,n,i;t.d(a,{GW:function(){return n},dk:function(){return i},oK:function(){return o}}),function(e){e["Prompt"]="PROMPT",e["Camera"]="CAMERA",e["Photos"]="PHOTOS"}(o||(o={})),function(e){e["Rear"]="REAR",e["Front"]="FRONT"}(n||(n={})),function(e){e["Uri"]="uri",e["Base64"]="base64",e["DataUrl"]="dataUrl"}(i||(i={}))},96826:function(e,a,t){t.d(a,{V1:function(){return i},dk:function(){return n.dk},oK:function(){return n.oK}});var o=t(29895),n=t(97439);const i=(0,o.fo)("Camera",{web:()=>t.e(6806).then(t.bind(t,66806)).then((e=>new e.CameraWeb))})},78022:function(e,a,t){t.d(a,{Z:function(){return w}});var o=t(66252),n=t(3577),i=t(2262),s=t(31810),r=t(45241),l=t(96826),c=t(19312),d=t(34840),u=t(29895);const p={key:0,class:"photo-preview"},m=["src"],g={class:"photo-preview__icon"},h=["src"],f={key:2,class:"photo-area__loader"};var v;(function(e){e["Delete"]="DELETE",e["MakeAPhoto"]="MAKE_A_PHOTO",e["PhotoLibrary"]="PHOTO_LIBRARY"})(v||(v={}));var P=(0,o.aZ)({__name:"PhotoLoader",props:{photo:{},icon:{default:"person"},circleShape:{type:Boolean,default:!1},type:{default:"default"},loading:{type:Boolean},progress:{}},emits:["change"],setup(e,{emit:a}){const t=e,P=(0,i.iH)(t.photo),y=(0,i.iH)(""),_=(0,i.iH)(!1);(0,o.YP)((()=>t.photo),(e=>{P.value=e}));const w=async()=>{const e=[...P.value?[{text:"Delete photo",role:"destructive",data:{type:v.Delete}}]:[],{text:"Take photo",data:{type:v.MakeAPhoto}},{text:"Photo library",data:{type:v.PhotoLibrary}},{text:"Cancel",role:"cancel"}],a=[...P.value?[{text:"Delete photo",role:"destructive",data:{type:v.Delete}}]:[],{text:"Photo library",data:{type:v.PhotoLibrary}},{text:"Cancel",role:"cancel"}],t=await s.BO.create({mode:"ios",buttons:u.dV.isNativePlatform()?e:a});await t.present();const{data:o}=await t.onWillDismiss(),n=o?.type,i={[v.Delete]:()=>k(),[v.MakeAPhoto]:()=>b(l.oK.Camera),[v.PhotoLibrary]:()=>b(l.oK.Photos)};i[n]&&i[n]()},b=async e=>{if((0,r.a)("capacitor")){const a=await l.V1.requestPermissions();if(e===l.oK.Camera&&"denied"===a.camera||e===l.oK.Photos&&"denied"===a.photos){const a=await s.Cl.create({header:"Permissions denied",message:e===l.oK.Camera?"You have denied the app from using the camera":"You have denied the app access to your photos",buttons:["OK"]});return void await a.present()}}const a=await l.V1.getPhoto({width:750,height:750,quality:100,allowEditing:!1,resultType:l.dk.Base64,source:e});y.value=`data:image/jpeg;base64,${a.base64String}`,_.value=!0},k=e=>{P.value=e,a("change",P.value)},C=e=>{_.value=e},U=e=>{k(e),_.value=!1};return(e,a)=>((0,o.wg)(),(0,o.iD)(o.HY,null,[(0,o._)("div",{class:"photo-loader",onClick:w},["avatar"===e.type?((0,o.wg)(),(0,o.iD)("div",p,[(0,o._)("img",{class:(0,n.C_)(["photo-preview__img",{"photo-preview__img--empty":!P.value}]),src:P.value||`assets/icon/${e.icon}.svg`},null,10,m),(0,o._)("span",g,[(0,o.Wm)((0,i.SU)(s.gu),{src:"assets/icon/change-photo.svg"})])])):((0,o.wg)(),(0,o.j4)((0,i.SU)(s.Ie),{key:1,class:(0,n.C_)(["photo-area",{"photo-area--empty":!P.value}])},{default:(0,o.w5)((()=>[P.value?((0,o.wg)(),(0,o.iD)("img",{key:0,src:P.value,class:"photo-area__img"},null,8,h)):e.loading?(0,o.kq)("",!0):((0,o.wg)(),(0,o.j4)((0,i.SU)(s.gu),{key:1,src:"assets/icon/add-media.svg",class:"photo-area__add-icon"})),e.loading?((0,o.wg)(),(0,o.iD)("div",f,[(0,o.Wm)(d.Z,{percent:e.progress,class:"photo-area__progress"},null,8,["percent"])])):(0,o.kq)("",!0)])),_:1},8,["class"]))]),(0,o.Wm)(c.Z,{"is-open":_.value,onSetOpen:C,file:y.value,onGetUploadedImg:U,"circle-shape":e.circleShape},null,8,["is-open","file","circle-shape"])],64))}}),y=t(83744);const _=(0,y.Z)(P,[["__scopeId","data-v-5a5479a9"]]);var w=_},28768:function(e,a,t){t.r(a),t.d(a,{default:function(){return E}});t(57658);var o=t(66252),n=t(2262),i=t(10121),s=t(19239),r=t(78022),l=t(31810),c=t(61081),d=t(87042),u=t(22201),p=t(12712);const m={USER:[{name:c.N.ProfileEmail,label:"Change email"},{name:c.N.ProfilePassword,label:"Change password"},{name:c.N.ProfilePreferences,label:"Preferences"},{name:c.N.ProfileLocation,label:"Location"}],TRAINER:[{name:c.N.ProfileEditTrainer,label:"Edit trainer information"},{name:c.N.ProfileEmail,label:"Change email"},{name:c.N.ProfilePassword,label:"Change password"},{name:c.N.ProfilePronounce,label:"Pronounce"},{name:c.N.ProfileLocation,label:"Location"},{name:c.N.ProfileOrderConfirmation,label:"Order confirmation"}],FACILITY:[{name:c.N.ProfileEditGym,label:"Edit gym information"},{name:c.N.ProfileEmail,label:"Change email"},{name:c.N.ProfilePassword,label:"Change password"},{name:c.N.ProfileLocation,label:"Location"},{name:c.N.ProfileOrderConfirmation,label:"Order confirmation"}]};var g=t(16025),h=t(25934),f=t(43173),v=t(49316),P=t(87794),y=t(47330);const _={class:"profile-edit"},w={key:0,class:"profile-edit__photo"},b={class:"profile-edit__options"};var k=(0,o.aZ)({__name:"Edit",setup(e){const a=(0,n.iH)(!1),t=(0,n.iH)(""),k=(0,n.iH)(""),C=(0,n.iH)(),U=(0,u.tv)(),E=(0,u.yj)(),{type:N}=(0,y.Z)(),{id:O}=(0,f.Z)();let D;const{mutate:A}=(0,v.Db)(P.nu,{context:{fetchOptions:{useUpload:!0,onProgress:e=>{C.value=e.loaded/e.total*100},onAbortPossible:e=>{D=e}}}}),{mutate:L}=(0,v.Db)(P.ft),S=()=>{t.value=""},I=async e=>{if(!e?.length)return void M();const o=(0,g.U)(e,(0,h.Z)());a.value=!0,C.value=0,await A({file:o}).then((e=>{k.value=e?.data.filePreload.path,t.value=`${{NODE_ENV:"production",VUE_APP_API_URL:"https://api.spotterfitness.com/graphql",VUE_APP_GOOGLE_AUTH_CLIENT_ID:"",BASE_URL:"/"}.VUE_APP_MEDIA_URL}${e?.data.filePreload.path}`,L({id:O,input:{avatar:e?.data.filePreload.path}}).then((async()=>{const e=await l.Mn.create({message:"Image uploaded!",duration:2e3,icon:"assets/icon/success.svg",cssClass:"success-toast"});e.present(),T()})).catch((async e=>{const a=await l.Mn.create({message:"Image upload failed!",duration:2e3,icon:"assets/icon/info.svg",cssClass:"warning-toast"});a.present(),console.error(e)})),a.value=!1,C.value=void 0})).catch((async e=>{const t=await l.Mn.create({message:"Image upload failed!",duration:2e3,icon:"assets/icon/info.svg",cssClass:"warning-toast"});t.present(),console.error(e),D(),a.value=!1,C.value=void 0}))},M=()=>{L({id:O,input:{avatar:null}}).then((async()=>{const e=await l.Mn.create({message:"Profile Image was deleted!",duration:2e3,icon:"assets/icon/success.svg",cssClass:"success-toast"});e.present(),S(),T()})).catch((async e=>{const a=await l.Mn.create({message:"Action failed!",duration:2e3,icon:"assets/icon/info.svg",cssClass:"warning-toast"});a.present(),console.error(e)}))},{onResult:R,refetch:T,result:Z,loading:H}=(0,v.aM)(P.en,{},{fetchPolicy:"network-only"});R((({data:e})=>{t.value=e.me.avatarUrl}));const K=()=>{U.go(-1)},{role:q}=(0,p.Z)(),W=q===P.g8.OrganizationOwner||q===P.g8.FacilityOwner||q===P.g8.Manager?c.N.Facility:q,x=m[W],B=e=>{E.query.facilityId?U.push({name:e,query:{facilityId:E.query.facilityId}}):U.push({name:e})},V={[c.N.Language]:"English",[c.N.AppMode]:"Dark mode"},Y=(0,o.Fl)((()=>q===P.g8.User||q===P.g8.Trainer)),j=(0,o.Fl)((()=>Z.value?.me.trainer_type));return(e,l)=>{const u=(0,o.up)("ion-spinner");return(0,o.wg)(),(0,o.j4)(i.Z,{"hide-navigation-menu":""},{header:(0,o.w5)((()=>[(0,o.Wm)(s.Z,{"back-btn":"",title:Y.value?"Edit Profile":"Edit gym profile",onBack:K},null,8,["title"])])),content:(0,o.w5)((()=>[(0,o._)("div",_,[(0,n.SU)(q)===(0,n.SU)(P.g8).User?((0,o.wg)(),(0,o.iD)("div",w,[(0,o.Wm)(r.Z,{"circle-shape":"",type:"avatar",progress:C.value,loading:a.value,photo:t.value,onChange:I},null,8,["progress","loading","photo"])])):(0,o.kq)("",!0),(0,o._)("div",b,[(0,n.SU)(H)?((0,o.wg)(),(0,o.j4)(u,{key:0,class:"spinner",name:"lines"})):((0,o.wg)(!0),(0,o.iD)(o.HY,{key:1},(0,o.Ko)((0,n.SU)(x),(e=>((0,o.wg)(),(0,o.iD)(o.HY,{key:e.name},[(0,n.SU)(q)!==(0,n.SU)(P.g8).Trainer||e.name!==(0,n.SU)(c.N).ProfileLocation||j.value!==(0,n.SU)(P.w3).WorkingInGym?((0,o.wg)(),(0,o.j4)(d.Z,{key:0,title:e.label,value:V[e.value],onClick:a=>B(e.name),class:"profile-edit__option",disabled:e.name===(0,n.SU)(c.N).ProfileOrderConfirmation&&(0,n.SU)(N)!==(0,n.SU)(P.b$).Gold},null,8,["title","value","onClick","disabled"])):(0,o.kq)("",!0)],64)))),128))])])])),_:1})}}}),C=t(83744);const U=(0,C.Z)(k,[["__scopeId","data-v-261e0bf6"]]);var E=U}}]);
//# sourceMappingURL=3920.6555f1d8.js.map