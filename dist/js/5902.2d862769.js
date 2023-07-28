"use strict";(self["webpackChunkspotter"]=self["webpackChunkspotter"]||[]).push([[5902],{98654:function(e,t,a){a.d(t,{Mt:function(){return i},qn:function(){return r}});var n=a(17283);n.ZP`
  query user($id: ID!, $email: String) {
    user(id: $id, email: $email) {
      id
      email
      gender
      created_at
      updated_at
    }
  }
`,n.ZP`
  mutation FollowTrainer($trainer_id: ID!) {
    followTrainer(input: { trainer_id: $trainer_id }) {
      id
    }
  }
`,n.ZP`
  mutation UnfollowTrainer($trainer_id: ID!) {
    unfollowTrainer(input: { trainer_id: $trainer_id }) {
      id
    }
  }
`;const r=n.ZP`
  query user($id: ID!) {
    user(id: $id) {
      id
      first_name
      last_name
      avatar
      score
      avatarUrl
      facilities {
        address {
          street
        }
      }
      settings {
        setting {
          code
        }
        value
      }
    }
  }
`,i=n.ZP`
  query Facility($id: ID!) {
    facility(id: $id) {
      was_commented_by_me
      was_visited_by_me
      address {
        lat
        lng
        street
      }
      created_at
      equipments {
        name
        id
        icon
        iconUrl
      }
      id
      is_followed
      media {
        path
        pathUrl
      }
      name
      score
      description
      not_recommended_count
      recommended_count
      reviews_count
      positive_reviews_count
      negative_reviews_count
      amenities {
        id
        name
        icon
        iconUrl
      }
    }
  }
`;n.ZP`
  mutation RefreshToken($refresh_token: String) {
    refreshToken(input: { refresh_token: $refresh_token }) {
      access_token
      refresh_token
      expires_in
      token_type
    }
  }
`},25934:function(e,t,a){var n;a.d(t,{Z:function(){return p}});var r=new Uint8Array(16);function i(){if(!n&&(n="undefined"!==typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!==typeof msCrypto&&"function"===typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto),!n))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(r)}var s=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;function o(e){return"string"===typeof e&&s.test(e)}for(var l=o,d=[],u=0;u<256;++u)d.push((u+256).toString(16).substr(1));function c(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=(d[e[t+0]]+d[e[t+1]]+d[e[t+2]]+d[e[t+3]]+"-"+d[e[t+4]]+d[e[t+5]]+"-"+d[e[t+6]]+d[e[t+7]]+"-"+d[e[t+8]]+d[e[t+9]]+"-"+d[e[t+10]]+d[e[t+11]]+d[e[t+12]]+d[e[t+13]]+d[e[t+14]]+d[e[t+15]]).toLowerCase();if(!l(a))throw TypeError("Stringified UUID is invalid");return a}var m=c;function f(e,t,a){e=e||{};var n=e.random||(e.rng||i)();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,t){a=a||0;for(var r=0;r<16;++r)t[a+r]=n[r];return t}return m(n)}var p=f},35294:function(e,t,a){a.d(t,{Z:function(){return u}});var n=a(66252),r=a(3577),i=a(2262),s=a(31810),o=(0,n.aZ)({__name:"AddressItem",props:{large:{type:Boolean,default:!1}},setup(e){return(e,t)=>((0,n.wg)(),(0,n.iD)("div",{class:(0,r.C_)([{"address--large":e.large},"address"])},[(0,n.Wm)((0,i.SU)(s.gu),{class:(0,r.C_)([{"address__icon--large":e.large},"address__icon"]),src:"assets/icon/location.svg"},null,8,["class"]),(0,n.WI)(e.$slots,"default")],2))}}),l=a(83744);const d=(0,l.Z)(o,[["__scopeId","data-v-1aaae496"]]);var u=d},64193:function(e,t,a){a.d(t,{Z:function(){return u}});var n=a(66252),r=a(2262),i=a(3577),s=a(31810),o=(0,n.aZ)({__name:"RatingNumber",props:{color:{default:"primary"}},setup(e){return(e,t)=>((0,n.wg)(),(0,n.j4)((0,r.SU)(s.yW),{color:e.color,class:(0,i.C_)(["rating-number",`rating-number--${e.color}`]),style:(0,i.j5)({"--border-color":`var(--ion-color-${e.color})`})},{default:(0,n.w5)((()=>[(0,n.WI)(e.$slots,"default")])),_:3},8,["color","class","style"]))}}),l=a(83744);const d=(0,l.Z)(o,[["__scopeId","data-v-436066f8"]]);var u=d},90599:function(e,t,a){a.d(t,{Z:function(){return g}});var n=a(66252),r=a(2262),i=a(3577),s=a(31810),o=a(64193),l=a(35294),d=a(27705),u=a(61081);const c={class:"trainer-item__inner"},m={class:"trainer-item__head"},f={class:"trainer-item__end"};var p=(0,n.aZ)({__name:"TrainerItem",props:{trainer:{}},setup(e){const t=e,a=(0,n.Fl)((()=>t.trainer.facilities?.[0]?.address?.street??"Dallas, Wall Street, 24")),p=(0,n.Fl)((()=>(t.trainer.first_name?.length?t.trainer.first_name?.charAt(0):"")+(t.trainer.last_name?.length?t.trainer.last_name?.charAt(0):"")));return(e,t)=>{const _=(0,n.up)("router-link");return(0,n.wg)(),(0,n.j4)(_,{class:"item-wrap",to:{name:(0,r.SU)(u.N).Trainer,params:{id:e.trainer?.id}}},{default:(0,n.w5)((()=>[(0,n.Wm)((0,r.SU)(s.Ie),{lines:"none",class:"trainer-item wrap-item"},{default:(0,n.w5)((()=>[(0,n.Wm)(d.Z,{class:"trainer-item__avatar",src:e.trainer.avatarUrl,symbols:p.value},null,8,["src","symbols"]),(0,n._)("div",c,[(0,n._)("div",m,[(0,n.Wm)((0,r.SU)(s.Q$),{class:"trainer-item__title"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,i.zw)(e.trainer.first_name)+" "+(0,i.zw)(e.trainer.last_name),1)])),_:1}),(0,n.Wm)(o.Z,{class:"trainer-item__rating"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,i.zw)(String(e.trainer.score?.toFixed(1))),1)])),_:1}),(0,n._)("div",f,[(0,n.WI)(e.$slots,"end")])]),a.value?((0,n.wg)(),(0,n.j4)(l.Z,{key:0,class:"trainer-item__address"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,i.zw)(a.value),1)])),_:1})):(0,n.kq)("",!0)])])),_:3})])),_:3},8,["to"])}}}),_=a(83744);const v=(0,_.Z)(p,[["__scopeId","data-v-435af9a8"]]);var g=v},86092:function(e,t,a){a.d(t,{Z:function(){return _}});var n=a(66252),r=a(3577),i=a(2262),s=a(31810),o=a(73050),l=a(27484),d=a.n(l);const u={key:0,class:"calendar__footer"},c=["onClick"];var m=(0,n.aZ)({__name:"BaseCalendar",props:{showAdditionalContent:{type:Boolean,default:!0},darkBackground:{type:Boolean,default:!1},times:{},loading:{type:Boolean,default:!1},selected:{default:Date.now()},min:{},max:{}},emits:["change-day","change-time"],setup(e,{emit:t}){const a=e;(0,n.YP)((()=>a.times),(e=>{e?.length&&(f.value=e[0].value)}));const l=(0,i.iH)(null),m=(0,i.iH)(a.selected?d()(a.selected).toISOString():d()().toISOString()),f=(0,i.iH)(""),p=(0,i.Fl)((()=>d()().format("YYYY-MM-DD"))),_=e=>{e.detail.value&&(m.value=e.detail.value,t("change-day",e.detail.value))},v=(e,a)=>{f.value=e?.target?.textContent,t("change-time",a,e?.target?.textContent)};return(0,n.bv)((()=>{if(a.times?.length&&(f.value=a.times[0].value),l.value){const e=l.value.$el.shadowRoot,t=document.createElement("style");t.innerHTML=" .calendar-day {\n          font-size: 16px !important;\n        }\n        .calendar-month-grid {\n          padding: 0 8px !important;\n          grid-template-rows: repeat(5, 47px);\n        }\n\n         .calendar-action-buttons ion-icon {\n          font-size: 24px;\n          color: white !important;\n         }\n\n         .calendar-action-buttons ion-label {\n          margin: 0;\n          font-size: 16px;\n         }\n\n         .calendar-action-buttons {\n          padding-top: 3px;\n          padding-bottom: 6px;\n          align-items: center;\n         }\n\n         .calendar-days-of-week {\n          font-size: 14px !important;\n          color: var(--gray-500) !important;\n         }\n\n         .calendar-next-prev ion-button {\n          width: 32px !important;\n          height: 32px !important;\n         }\n\n         .calendar-next-prev ion-button::part(native) {\n          padding-inline-start: 0 !important;\n          padding-inline-end: 0 !important;\n         }\n\n         .calendar-next-prev > ion-buttons {\n         padding-right: 10px !important;\n          padding-top: 0 !important;\n         }\n\n         :host(.datetime-presentation-date:not(.datetime-prefer-wheel)) {\n          min-height: 350px !important;\n         }\n        ",e.appendChild(t)}})),(e,t)=>((0,n.wg)(),(0,n.iD)("div",{class:(0,r.C_)([{"calendar--dark":e.darkBackground},"calendar"])},[(0,n.Wm)((0,i.SU)(s.x4),{ref_key:"calendar",ref:l,value:m.value,class:(0,r.C_)({"calendar--dark":e.darkBackground}),onIonChange:_,presentation:"date",mode:"ios",min:(0,i.SU)(p)||e.min?(0,i.SU)(d())(e.min).toISOString():void 0,max:e.max?(0,i.SU)(d())(e.max).toISOString():void 0},null,8,["value","class","min","max"]),e.showAdditionalContent?((0,n.wg)(),(0,n.iD)("div",u,[(0,n.Wm)((0,i.SU)(s.yW),{class:"time__label"},{default:(0,n.w5)((()=>[(0,n.Uk)(" Time")])),_:1})])):(0,n.kq)("",!0),e.loading?((0,n.wg)(),(0,n.j4)((0,i.SU)(s.PQ),{key:1,name:"lines",class:"spinner"})):(0,n.kq)("",!0),!e.loading&&e.showAdditionalContent?((0,n.wg)(),(0,n.j4)(o.Z,{key:2,items:e.times,"width-auto":""},{default:(0,n.w5)((e=>[(0,n._)("div",{class:(0,r.C_)([{"carousel__item--on-selected":f.value===e.item.value},"carousel__item"]),onClick:t=>v(t,e.item.paymentTime)},(0,r.zw)(e.item.value),11,c)])),_:1},8,["items"])):(0,n.kq)("",!0)],2))}}),f=a(83744);const p=(0,f.Z)(m,[["__scopeId","data-v-03dd7286"]]);var _=p},73050:function(e,t,a){a.d(t,{Z:function(){return m}});var n=a(66252),r=a(2262),i=a(3577),s=a(38014),o=a(71911),l=a(25934),d=(0,n.aZ)({__name:"BaseCarousel",props:{items:{},slidesOffsetBefore:{default:22},slidesOffsetAfter:{default:22},showStart:{type:Boolean,default:!1},widthAuto:{type:Boolean}},setup(e){const t=e,a=(0,n.Fl)((()=>t?.items?.length?t.items.map((e=>e.id?{...e}:{...e,id:(0,l.Z)()})):[]));return(e,t)=>a.value.length?((0,n.wg)(),(0,n.j4)((0,r.SU)(s.tq),{key:0,"free-mode":"",slidesPerView:"auto",spaceBetween:16,slidesOffsetAfter:e.slidesOffsetAfter,slidesOffsetBefore:e.slidesOffsetBefore,modules:[(0,r.SU)(o.Rv)]},{default:(0,n.w5)((()=>[e.showStart?((0,n.wg)(),(0,n.j4)((0,r.SU)(s.o5),{key:0,class:"swiper-slide swiper-slide--width-auto"},{default:(0,n.w5)((()=>[(0,n.WI)(e.$slots,"start")])),_:3})):(0,n.kq)("",!0),((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(a.value,(t=>((0,n.wg)(),(0,n.j4)((0,r.SU)(s.o5),{key:t.id,class:(0,i.C_)(["swiper-slide",{"swiper-slide--width-auto":e.widthAuto}])},{default:(0,n.w5)((()=>[(0,n.WI)(e.$slots,"default",{item:t})])),_:2},1032,["class"])))),128))])),_:3},8,["slidesOffsetAfter","slidesOffsetBefore","modules"])):(0,n.kq)("",!0)}}),u=a(83744);const c=(0,u.Z)(d,[["__scopeId","data-v-8c3d8524"]]);var m=c},27705:function(e,t,a){a.d(t,{Z:function(){return c}});var n=a(66252),r=a(2262),i=a(3577),s=a(31810);const o=["src"],l={key:2,class:"avatar__online-indicator"};var d=(0,n.aZ)({__name:"Avatar",props:{src:{},symbols:{},isOnline:{type:Boolean},square:{type:Boolean}},setup(e){return(e,t)=>((0,n.wg)(),(0,n.j4)((0,r.SU)(s.Bs),{slot:"start",class:"avatar"},{default:(0,n.w5)((()=>[e.src?((0,n.wg)(),(0,n.iD)("img",{key:0,src:e.src,class:(0,i.C_)(["avatar__image",{"avatar__image--online":e.isOnline,"avatar__image--square":e.square}])},null,10,o)):((0,n.wg)(),(0,n.iD)(n.HY,{key:1},[(0,n.Uk)((0,i.zw)(e.symbols),1)],64)),e.isOnline?((0,n.wg)(),(0,n.iD)("div",l)):(0,n.kq)("",!0)])),_:1}))}});const u=d;var c=u},65902:function(e,t,a){a.r(t),a.d(t,{default:function(){return U}});a(57658);var n=a(66252),r=a(2262),i=a(22201),s=a(61081),o=a(31810),l=a(10121),d=a(86092),u=a(90599),c=a(49316),m=a(87794),f=a(98654),p=a(19239),_=a(27484),v=a.n(_),g=a(70178),h=a.n(g),w=a(81902);const y={key:1,class:"content__container"};var k=(0,n.aZ)({__name:"Trainer",setup(e){v().extend(h());const t=(0,i.tv)(),a=(0,i.yj)(),_=(0,r.iH)(v().utc()),g=(0,r.iH)(null),k=(0,w.h)(),{result:b,loading:S}=(0,c.aM)(f.qn,{id:a.params.id}),U=e=>v().utc(e).diff(v().utc(new Date),"minute")<=0,Z=()=>{const e=_.value;return{id:a.params.id,from:U(e)?v().utc(new Date).format("YYYY-MM-DD HH:mm:ss"):`${v().utc(e).format("YYYY-MM-DD")} 00:01:00`,to:`${v().utc(e).format("YYYY-MM-DD")} 23:59:00`}},{result:C,refetch:$,loading:x}=(0,c.aM)(m.MF,Z()),D=(0,n.Fl)((()=>b.value?.user)),I=(0,n.Fl)((()=>C.value?.userAvailability.hours?.reduce(((e,t)=>{const a=C.value?.userAvailability.trainings?.reduce(((e,t)=>(e.push(v()(t.start_date).format("hh:mm A")),e)),[]),n=v()(t.from),r=v()(t.to);for(let i=0;i<r.diff(n,"hour");i++){const n=v()(t.from).add(i,"hour").format("hh:mm A"),r=v()(t.from).add(60*i-30,"minute").format("hh:mm A"),s=v()(t.from).add(60*i+30,"minute").format("hh:mm A"),o=v()(t.from).add(60*i+60,"minute").format("hh:mm A");a?.includes(n)||a?.includes(r)||a?.includes(r)||(e.push({value:n,paymentTime:v()(t.from).add(i,"hour")}),a?.includes(o)||e.push({value:s,paymentTime:v()(t.from).add(60*i+30,"minute")}))}return e.length&&(k.setValue("date",_.value),k.setValue("time",e[0].value),k.setValue("paymentTime",e[0].paymentTime),g.value=e[0].paymentTime),e}),[]))),A=(0,n.Fl)((()=>C.value?.userAvailability?.hours?.length)),T=(0,n.Fl)((()=>!_.value||!g.value||!A.value)),B=()=>{t.go(-1)},Y=e=>{_.value=e,k.setValue("date",e),$(Z())},W=(e,t)=>{g.value=e,k.setValue("paymentTime",e),k.setValue("time",t)},q=async()=>{if(U(g.value)){const e=await o.Mn.create({message:"The booking time already passed. Please, choose another time.",duration:2e3,icon:"assets/icon/info.svg",cssClass:"warning-toast"});e.present()}else{const e=[{key:"date",value:_.value},{key:"purchasable",value:m.$R.Training},{key:"title",value:`${D.value?.first_name} ${D.value?.last_name}`}];e.forEach((e=>k.setValue(e.key,e.value))),t.push({name:s.N.ConfirmOrder,params:{id:a.params.id}})}};return(e,t)=>((0,n.wg)(),(0,n.j4)(l.Z,{"full-width-footer":!1,"header-fixed":!1,"content-full-height":!1},{header:(0,n.w5)((()=>[(0,n.Wm)(p.Z,{"back-btn":"",title:"Book your trainer",onBack:B})])),content:(0,n.w5)((()=>[(0,r.SU)(S)?((0,n.wg)(),(0,n.j4)((0,r.SU)(o.PQ),{key:0,class:"spinner"})):((0,n.wg)(),(0,n.iD)("div",y,[(0,n.Wm)(u.Z,{trainer:D.value,class:"trainer"},null,8,["trainer"]),(0,n.Wm)(d.Z,{times:I.value,onChangeDay:Y,loading:(0,r.SU)(x),onChangeTime:W,selected:_.value},null,8,["times","loading","selected"])]))])),footer:(0,n.w5)((()=>[(0,n.Wm)((0,r.SU)(o.YG),{onClick:q,class:"submit-btn",disabled:T.value},{default:(0,n.w5)((()=>[(0,n.Uk)(" Next")])),_:1},8,["disabled"])])),_:1}))}}),b=a(83744);const S=(0,b.Z)(k,[["__scopeId","data-v-926d28ae"]]);var U=S}}]);
//# sourceMappingURL=5902.2d862769.js.map