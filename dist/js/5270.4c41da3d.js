"use strict";(self["webpackChunkspotter"]=self["webpackChunkspotter"]||[]).push([[5270],{40411:function(e,t,a){a.d(t,{b:function(){return n}});var i=a(29895);const n=(0,i.fo)("Geolocation",{web:()=>a.e(6642).then(a.bind(a,56642)).then((e=>new e.GeolocationWeb))})},98654:function(e,t,a){a.d(t,{Mt:function(){return s},qn:function(){return n}});var i=a(17283);i.ZP`
  query user($id: ID!, $email: String) {
    user(id: $id, email: $email) {
      id
      email
      gender
      created_at
      updated_at
    }
  }
`,i.ZP`
  mutation FollowTrainer($trainer_id: ID!) {
    followTrainer(input: { trainer_id: $trainer_id }) {
      id
    }
  }
`,i.ZP`
  mutation UnfollowTrainer($trainer_id: ID!) {
    unfollowTrainer(input: { trainer_id: $trainer_id }) {
      id
    }
  }
`;const n=i.ZP`
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
`,s=i.ZP`
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
`;i.ZP`
  mutation RefreshToken($refresh_token: String) {
    refreshToken(input: { refresh_token: $refresh_token }) {
      access_token
      refresh_token
      expires_in
      token_type
    }
  }
`},14602:function(e,t,a){a.d(t,{J:function(){return i}});const i=(e,t)=>{const a=3958.8,i=n(t.lat-e.lat),s=n(t.lng-e.lng),r=Math.sin(i/2)*Math.sin(i/2)+Math.cos(n(e.lat))*Math.cos(n(t.lat))*Math.sin(s/2)*Math.sin(s/2),l=2*Math.atan2(Math.sqrt(r),Math.sqrt(1-r));return a*l},n=e=>e*(Math.PI/180)},24634:function(e,t,a){a.d(t,{Z:function(){return u}});var i=a(66252),n=a(2262),s=a(3577),r=a(31810);const l={class:"certificate"};var o=(0,i.aZ)({__name:"AdvantageItem",props:{icon:{},title:{}},setup(e){return(e,t)=>((0,i.wg)(),(0,i.iD)("div",l,[(0,i.Wm)((0,n.SU)(r.gu),{src:e.icon,class:"certificate-icon"},null,8,["src"]),(0,i.Uk)(" "+(0,s.zw)(e.title),1)]))}}),c=a(83744);const d=(0,c.Z)(o,[["__scopeId","data-v-20d89745"]]);var u=d},27705:function(e,t,a){a.d(t,{Z:function(){return u}});var i=a(66252),n=a(2262),s=a(3577),r=a(31810);const l=["src"],o={key:2,class:"avatar__online-indicator"};var c=(0,i.aZ)({__name:"Avatar",props:{src:{},symbols:{},isOnline:{type:Boolean},square:{type:Boolean}},setup(e){return(e,t)=>((0,i.wg)(),(0,i.j4)((0,n.SU)(r.Bs),{slot:"start",class:"avatar"},{default:(0,i.w5)((()=>[e.src?((0,i.wg)(),(0,i.iD)("img",{key:0,src:e.src,class:(0,s.C_)(["avatar__image",{"avatar__image--online":e.isOnline,"avatar__image--square":e.square}])},null,10,l)):((0,i.wg)(),(0,i.iD)(i.HY,{key:1},[(0,i.Uk)((0,s.zw)(e.symbols),1)],64)),e.isOnline?((0,i.wg)(),(0,i.iD)("div",o)):(0,i.kq)("",!0)])),_:1}))}});const d=c;var u=d},33200:function(e,t,a){a.d(t,{Z:function(){return w}});var i=a(66252),n=a(3577),s=a(2262),r=a(31810),l=a(72076),o=a(27705),c=a(27484),d=a.n(c);const u={class:"review__header"},v={class:"ion-text-start"};var _=(0,i.aZ)({__name:"ReviewItem",props:{avatarUrl:{},fullName:{},rating:{},date:{},text:{},heightFixed:{type:Boolean}},setup(e){const t=e,a=(0,i.Fl)((()=>d()(t.date).format("D MMMM, YYYY")));return(e,t)=>((0,i.wg)(),(0,i.iD)("div",{class:(0,n.C_)(["review__container",{"review__container--height-fixed":e.heightFixed}])},[(0,i._)("div",u,[(0,i.Wm)(o.Z,{class:"review__avatar",src:e.avatarUrl},null,8,["src"]),(0,i.Wm)((0,s.SU)(r.yW),{class:"review__user"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(e.fullName),1)])),_:1}),(0,i.Wm)(l.Z,{value:e.rating},null,8,["value"]),(0,i.Wm)((0,s.SU)(r.yW),{class:"review__date"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(a.value),1)])),_:1})]),(0,i._)("div",v,[(0,i.Wm)((0,s.SU)(r.yW),{class:"review__text",color:"secondary"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(e.text),1)])),_:1})])],2))}}),m=a(83744);const f=(0,m.Z)(_,[["__scopeId","data-v-020be6c7"]]);var w=f},95943:function(e,t,a){a.d(t,{Z:function(){return u}});var i=a(66252),n=a(2262),s=a(38014),r=a(71911),l=a(33200),o=(0,i.aZ)({__name:"ReviewSlides",props:{reviews:{}},setup(e){return(e,t)=>((0,i.wg)(),(0,i.j4)((0,n.SU)(s.tq),{"free-mode":"",slidesPerView:"auto",spaceBetween:16,slidesOffsetAfter:16,slidesOffsetBefore:16,modules:[(0,n.SU)(r.Rv)]},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(e.reviews,(e=>((0,i.wg)(),(0,i.j4)((0,n.SU)(s.o5),{key:e.id,class:"review-slide"},{default:(0,i.w5)((()=>[(0,i.Wm)(l.Z,{date:e.date,"avatar-url":e.avatarUrl,rating:e.rating,"full-name":e.fullName,text:e.text,heightFixed:""},null,8,["date","avatar-url","rating","full-name","text"])])),_:2},1024)))),128))])),_:1},8,["modules"]))}}),c=a(83744);const d=(0,c.Z)(o,[["__scopeId","data-v-0abc0f62"]]);var u=d},37925:function(e,t,a){a.r(t),a.d(t,{default:function(){return U}});a(57658);var i=a(66252),n=a(2262),s=a(3577),r=a(31810),l=a(22201),o=a(66578),c=a(49316),d=a(87794),u=a(98654),v=a(24634),_=a(61081),m=a(95943),f=a(14602),w=a(40411);const g={class:"info"};var p=(0,i.aZ)({__name:"Detail",setup(e){const t=(0,l.yj)(),a=(0,l.tv)(),p=(0,n.iH)(!1),h=(0,n.iH)(!1),{result:y,loading:U,onResult:k}=(0,c.aM)(u.Mt,{id:t.params.id}),{mutate:Z,onDone:S}=(0,c.Db)(u.FollowFacilityDocument,{variables:{facility_id:t.params.id}}),{mutate:D,onDone:b}=(0,c.Db)(u.UnfollowFacilityDocument,{variables:{facility_id:t.params.id}}),M=(0,i.Fl)((()=>({NODE_ENV:"production",BASE_URL:"/"}.VUE_APP_CDN?y?.value?.facility?.media?.map((e=>`${{NODE_ENV:"production",BASE_URL:"/"}.VUE_APP_CDN}${e?.path}`)):[]))),P=()=>{p.value?D():Z()},$=()=>{a.push({name:_.N.FacilitySubscription})};k((()=>{y?.value?.facility?.is_followed&&(p.value=y?.value?.facility?.is_followed)})),S((()=>{p.value=!0})),b((()=>{p.value=!1}));const{result:F}=(0,c.aM)(d.Y_,{id:t.params.id}),x=(0,i.Fl)((()=>F?.value?.reviews?.data.reduce(((e,t)=>(e.push({id:t.id,date:t.created_at,rating:t.score||0,text:t.review,avatarUrl:t.author?.avatarUrl||"",fullName:`${t.author?.first_name} ${t.author?.last_name}`}),e)),[]))),W=(0,n.iH)({lat:0,lng:0}),{onResult:q}=(0,c.aM)(d.en,{},{fetchPolicy:"no-cache"});q((async e=>{h.value=!!e.data?.me?.settings?.find((e=>e.setting.code===d.Lm.VerifiedUser))?.value,e.data.me.settings.find((e=>e.setting.code===d.Lm.UsePhoneLocation))?.value?W.value=await I():W.value={lat:e.data.me.address.lat,lng:e.data.me.address.lng}}));const I=async()=>new Promise(((e,t)=>{w.b.getCurrentPosition().then((t=>{e({lat:t.coords.latitude,lng:t.coords.longitude})})).catch((async()=>{const e=await r.Mn.create({message:"Failed to get your location. Check the permissions for the application.",duration:2e3,icon:"assets/icon/info.svg",cssClass:"warning-toast"});e.present(),await w.b.requestPermissions(),t()}))})),N=(0,i.Fl)((()=>`(${(0,f.J)({lat:y.value?.facility?.address?.lat||0,lng:y.value?.facility?.address?.lng||0},{lat:W.value.lat||0,lng:W.value.lng||0}).toFixed(1)} mi)`));return(e,t)=>(0,n.SU)(U)?((0,i.wg)(),(0,i.j4)((0,n.SU)(r.PQ),{key:0,name:"lines",class:"spinner"})):((0,i.wg)(),(0,i.j4)(o.Z,{key:1,name:(0,n.SU)(y)?.facility?.name??"","photos-url":M.value,likes:(0,n.SU)(y)?.facility?.positive_reviews_count||0,"total-rating":(0,n.SU)(y)?.facility?.score||0,dislikes:(0,n.SU)(y)?.facility?.negative_reviews_count||0,"is-followed":p.value,address:(0,n.SU)(y)?.facility?.address?.street??"",distance:N.value,"is-trusted":h.value,"button-text":"Buy","advantages-title":"Equipment",onHandleFollow:P,onHandleBook:$,viewAllLink:(0,n.SU)(_.N).FacilityReviews},{info:(0,i.w5)((()=>[(0,i._)("div",g,(0,s.zw)((0,n.SU)(y)?.facility?.description),1)])),reviews:(0,i.w5)((()=>[(0,i.Wm)(m.Z,{reviews:x.value},null,8,["reviews"])])),advantages:(0,i.w5)((()=>[(0,i.Wm)(v.Z,{icon:"heart",title:"Cardio Items"}),(0,i.Wm)(v.Z,{icon:"pool",title:"Pool"}),(0,i.Wm)(v.Z,{icon:"shower",title:"Shower & bath"})])),_:1},8,["name","photos-url","likes","total-rating","dislikes","is-followed","address","distance","is-trusted","viewAllLink"]))}}),h=a(83744);const y=(0,h.Z)(p,[["__scopeId","data-v-7a3f8d5c"]]);var U=y}}]);
//# sourceMappingURL=5270.4c41da3d.js.map