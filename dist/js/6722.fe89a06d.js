"use strict";(self["webpackChunkspotter"]=self["webpackChunkspotter"]||[]).push([[6722],{4860:function(e,a,o){var s;o.d(a,{N:function(){return s}}),function(e){e["Profile"]="PROFILE",e["Login"]="LOGIN",e["Register"]="REGISTER",e["VerifyEmail"]="VERIFY_EMAIL",e["ForgotPassword"]="FORGOT_PASSWORD",e["CheckEmail"]="CHECK_EMAIL",e["Quizz"]="QUIZZ",e["Facilities"]="FACILITIES",e["Facility"]="FACILITY",e["FacilityReviews"]="FACILITY_REVIEWS",e["Trainers"]="TRAINERS",e["Trainer"]="TRAINER",e["BookTrainer"]="BOOK-TRAINER"}(s||(s={}))},20354:function(e,a,o){var s;o.d(a,{u:function(){return s}}),function(e){e["login"]="LOGIN",e["registration"]="REGISTER",e["SelectRole"]="SELECT_ROLE",e["CheckEmail"]="CHECK_EMAIL",e["ChooseFacilityType"]="CHOOSE_FACILITY_TYPE",e["CreateFacility"]="CREATE_FACILITY",e["CreateEvent"]="CREATE_EVENT",e["CreateWorkout"]="CREATE_WORKOUT"}(s||(s={}))},56067:function(e,a,o){o.d(a,{Z:function(){return v}});var s=o(66252),r=o(3577),t=o(2262),n=o(31810),l=o(20354);const i=e=>((0,s.dD)("data-v-e64b4000"),e=e(),(0,s.Cn)(),e),u={class:"header__container"},d=i((()=>(0,s._)("div",{class:"header__circles"},null,-1))),c=i((()=>(0,s._)("br",null,null,-1))),p=i((()=>(0,s._)("br",null,null,-1)));var m=(0,s.aZ)({__name:"AuthenticationHeader",props:{mode:{},backButton:{type:Boolean,default:!1},closeButton:{type:Boolean,default:!1},backgroundImage:{default:"tamra"},hiddenLogo:{type:Boolean,default:!1}},emits:["back"],setup(e){const a=e,{mode:o}=(0,t.BK)(a),i=(0,s.Fl)((()=>o?.value===l.u.login)),m=(0,s.Fl)((()=>o?.value===l.u.registration));return(e,a)=>((0,s.wg)(),(0,s.iD)("div",u,[(0,s._)("div",{style:(0,r.j5)({backgroundImage:`url(assets/backgrounds/${e.backgroundImage}.png)`}),class:"header"},[(0,s.Wm)((0,t.SU)(n.Sm),{class:"header__buttons"},{default:(0,s.w5)((()=>[e.backButton?((0,s.wg)(),(0,s.j4)((0,t.SU)(n.oU),{key:0,class:"header-btn",onClick:a[0]||(a[0]=a=>e.$emit("back")),icon:"assets/icon/arrow-back.svg"})):(0,s.kq)("",!0),e.closeButton?((0,s.wg)(),(0,s.j4)((0,t.SU)(n.oU),{key:1,class:"header-btn",onClick:a[1]||(a[1]=a=>e.$emit("back")),icon:"assets/icon/close.svg"})):(0,s.kq)("",!0)])),_:1}),e.hiddenLogo?(0,s.kq)("",!0):((0,s.wg)(),(0,s.j4)((0,t.SU)(n.gu),{key:0,src:"assets/icon/logo.svg",class:"logo",alt:"logo"})),d,(0,s.WI)(e.$slots,"title",{},(()=>[(0,s.Wm)((0,t.SU)(n.wd),{class:"logo-title"},{default:(0,s.w5)((()=>[(0,s.Uk)(" SPOTTER")])),_:1})])),(0,s.WI)(e.$slots,"description",{},(()=>[(0,s.Wm)((0,t.SU)(n.wd),{class:"logo-description"},{default:(0,s.w5)((()=>[i.value?((0,s.wg)(),(0,s.iD)(s.HY,{key:0},[(0,s.Uk)(" Log in or Sign Up to "),c,(0,s.Uk)(" Get Started ")],64)):m.value?((0,s.wg)(),(0,s.iD)(s.HY,{key:1},[(0,s.Uk)(" Sign up and Create "),p,(0,s.Uk)(" Your Profile ")],64)):(0,s.kq)("",!0)])),_:1})]))],4)]))}}),g=o(83744);const w=(0,g.Z)(m,[["__scopeId","data-v-e64b4000"]]);var v=w},56722:function(e,a,o){o.r(a),o.d(a,{default:function(){return R}});o(57658);var s=o(66252),r=o(2262),t=o(56067),n=o(10121),l=o(31810),i=o(49316),u=o(87794),d=o(49963),c=o(3577),p=o(67273),m=o(72353),g=o(12954),w=o(8373),v=o(59483),_=(0,s.aZ)({__name:"CreateNewPasswordForm",props:{error:{},isLoading:{type:Boolean}},emits:["handle-submit"],setup(e,{emit:a}){const o=e,{value:t,errorMessage:n}=(0,g.U$)("password",w.Js),{value:i,errorMessage:u}=(0,g.U$)("password confirmation",(e=>e===t.value)),_=(0,s.Fl)((()=>o.error?(0,v.Cb)(o.error.message):null)),k=(0,s.Fl)((()=>!n.value&&!u.value&&t.value&&i.value)),f=()=>{k.value&&a("handle-submit",{password:t.value,password_confirmation:i.value})};return(e,a)=>((0,s.wg)(),(0,s.j4)(m.Z,{class:"authentication-form",onSubmit:(0,d.iM)(f,["prevent"])},{default:(0,s.w5)((()=>[(0,s.Wm)(p.Z,{value:(0,r.SU)(t),"onUpdate:value":a[0]||(a[0]=e=>(0,r.dq)(t)?t.value=e:null),"error-message":(0,r.SU)(n),disabled:e.isLoading,type:"password",placeholder:"Enter your new password"},null,8,["value","error-message","disabled"]),(0,s.Wm)(p.Z,{value:(0,r.SU)(i),"onUpdate:value":a[1]||(a[1]=e=>(0,r.dq)(i)?i.value=e:null),"error-message":(0,r.SU)(u),disabled:e.isLoading,type:"password",placeholder:"Retype your new password"},null,8,["value","error-message","disabled"]),(0,s.Wm)((0,r.SU)(l.YG),{disabled:e.isLoading,class:"button--submit",type:"submit",expand:"block"},{default:(0,s.w5)((()=>[(0,s.Uk)(" Create password ")])),_:1},8,["disabled"]),(0,s.Wm)(d.uT,null,{default:(0,s.w5)((()=>[_.value?((0,s.wg)(),(0,s.j4)((0,r.SU)(l.yW),{key:0,class:"error",color:"danger"},{default:(0,s.w5)((()=>[(0,s.Uk)((0,c.zw)(_.value),1)])),_:1})):(0,s.kq)("",!0)])),_:1})])),_:1},8,["onSubmit"]))}}),k=o(83744);const f=(0,k.Z)(_,[["__scopeId","data-v-187f505f"]]);var b=f,S=o(4860),E=o(22201);const I={class:"page--content"},U={class:"page--title"};var y=(0,s.aZ)({__name:"PasswordReset",setup(e){const a=(0,E.yj)(),o=(0,E.tv)(),d=()=>{o.push({name:S.N.Login})},{mutate:c,onDone:p,loading:m,error:g}=(0,i.Db)(u.IL),w=(0,r.iH)({password:"",password_confirmation:""}),v=a.params.id,_=e=>{c({...e,token:v,email:JSON.parse(localStorage.getItem("temporary_email")||"{}")})};return p((()=>{localStorage.removeItem("temporary_email"),o.push({name:S.N.Login})})),(e,a)=>((0,s.wg)(),(0,s.j4)(n.Z,{"hide-navigation-menu":""},{content:(0,s.w5)((()=>[(0,s.Wm)(t.Z,{"back-button":"",onBack:d}),(0,s._)("div",I,[(0,s._)("div",U,[(0,s.Wm)((0,r.SU)(l.wd),null,{default:(0,s.w5)((()=>[(0,s.Uk)("Create your new password")])),_:1}),(0,s.Wm)((0,r.SU)(l.yW),null,{default:(0,s.w5)((()=>[(0,s.Uk)(" Follow reset instructions from your email ")])),_:1})]),(0,s.Wm)(b,{password:w.value.password,"onUpdate:password":a[0]||(a[0]=e=>w.value.password=e),password_confirmation:w.value.password_confirmation,"onUpdate:password_confirmation":a[1]||(a[1]=e=>w.value.password_confirmation=e),error:(0,r.SU)(g),"is-loading":(0,r.SU)(m),onHandleSubmit:_,class:"forgot-password-form"},null,8,["password","password_confirmation","error","is-loading"])])])),_:1}))}});const C=(0,k.Z)(y,[["__scopeId","data-v-2d9a671c"]]);var R=C}}]);
//# sourceMappingURL=6722.fe89a06d.js.map