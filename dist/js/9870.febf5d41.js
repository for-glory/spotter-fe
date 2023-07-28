"use strict";(self["webpackChunkspotter"]=self["webpackChunkspotter"]||[]).push([[9870],{98654:function(e,t,a){a.d(t,{Mt:function(){return n},qn:function(){return r}});var i=a(17283);i.ZP`
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
`;const r=i.ZP`
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
`,n=i.ZP`
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
`},24634:function(e,t,a){a.d(t,{Z:function(){return c}});var i=a(66252),r=a(2262),n=a(3577),s=a(31810);const l={class:"certificate"};var o=(0,i.aZ)({__name:"AdvantageItem",props:{icon:{},title:{}},setup(e){return(e,t)=>((0,i.wg)(),(0,i.iD)("div",l,[(0,i.Wm)((0,r.SU)(s.gu),{src:e.icon,class:"certificate-icon"},null,8,["src"]),(0,i.Uk)(" "+(0,n.zw)(e.title),1)]))}}),d=a(83744);const u=(0,d.Z)(o,[["__scopeId","data-v-20d89745"]]);var c=u},27705:function(e,t,a){a.d(t,{Z:function(){return c}});var i=a(66252),r=a(2262),n=a(3577),s=a(31810);const l=["src"],o={key:2,class:"avatar__online-indicator"};var d=(0,i.aZ)({__name:"Avatar",props:{src:{},symbols:{},isOnline:{type:Boolean},square:{type:Boolean}},setup(e){return(e,t)=>((0,i.wg)(),(0,i.j4)((0,r.SU)(s.Bs),{slot:"start",class:"avatar"},{default:(0,i.w5)((()=>[e.src?((0,i.wg)(),(0,i.iD)("img",{key:0,src:e.src,class:(0,n.C_)(["avatar__image",{"avatar__image--online":e.isOnline,"avatar__image--square":e.square}])},null,10,l)):((0,i.wg)(),(0,i.iD)(i.HY,{key:1},[(0,i.Uk)((0,n.zw)(e.symbols),1)],64)),e.isOnline?((0,i.wg)(),(0,i.iD)("div",o)):(0,i.kq)("",!0)])),_:1}))}});const u=d;var c=u},33200:function(e,t,a){a.d(t,{Z:function(){return f}});var i=a(66252),r=a(3577),n=a(2262),s=a(31810),l=a(72076),o=a(27705),d=a(27484),u=a.n(d);const c={class:"review__header"},_={class:"ion-text-start"};var v=(0,i.aZ)({__name:"ReviewItem",props:{avatarUrl:{},fullName:{},rating:{},date:{},text:{},heightFixed:{type:Boolean}},setup(e){const t=e,a=(0,i.Fl)((()=>u()(t.date).format("D MMMM, YYYY")));return(e,t)=>((0,i.wg)(),(0,i.iD)("div",{class:(0,r.C_)(["review__container",{"review__container--height-fixed":e.heightFixed}])},[(0,i._)("div",c,[(0,i.Wm)(o.Z,{class:"review__avatar",src:e.avatarUrl},null,8,["src"]),(0,i.Wm)((0,n.SU)(s.yW),{class:"review__user"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,r.zw)(e.fullName),1)])),_:1}),(0,i.Wm)(l.Z,{value:e.rating},null,8,["value"]),(0,i.Wm)((0,n.SU)(s.yW),{class:"review__date"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,r.zw)(a.value),1)])),_:1})]),(0,i._)("div",_,[(0,i.Wm)((0,n.SU)(s.yW),{class:"review__text",color:"secondary"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,r.zw)(e.text),1)])),_:1})])],2))}}),m=a(83744);const w=(0,m.Z)(v,[["__scopeId","data-v-020be6c7"]]);var f=w},95943:function(e,t,a){a.d(t,{Z:function(){return c}});var i=a(66252),r=a(2262),n=a(38014),s=a(71911),l=a(33200),o=(0,i.aZ)({__name:"ReviewSlides",props:{reviews:{}},setup(e){return(e,t)=>((0,i.wg)(),(0,i.j4)((0,r.SU)(n.tq),{"free-mode":"",slidesPerView:"auto",spaceBetween:16,slidesOffsetAfter:16,slidesOffsetBefore:16,modules:[(0,r.SU)(s.Rv)]},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(e.reviews,(e=>((0,i.wg)(),(0,i.j4)((0,r.SU)(n.o5),{key:e.id,class:"review-slide"},{default:(0,i.w5)((()=>[(0,i.Wm)(l.Z,{date:e.date,"avatar-url":e.avatarUrl,rating:e.rating,"full-name":e.fullName,text:e.text,heightFixed:""},null,8,["date","avatar-url","rating","full-name","text"])])),_:2},1024)))),128))])),_:1},8,["modules"]))}}),d=a(83744);const u=(0,d.Z)(o,[["__scopeId","data-v-0abc0f62"]]);var c=u},37704:function(e,t,a){a.r(t),a.d(t,{default:function(){return U}});a(57658);var i=a(66252),r=a(2262),n=a(3577),s=a(31810),l=a(22201),o=a(66578),d=a(49316),u=a(87794),c=a(98654),_=a(24634),v=a(95943),m=a(61081),w=a(12712);const f={class:"info"};var p;(function(e){e["DeleteGym"]="DELETE_GYM",e["EditGym"]="EDIT_GYM"})(p||(p={}));var g=(0,i.aZ)({__name:"Details",setup(e){const t=(0,l.yj)(),a=(0,l.tv)(),g=(0,r.iH)(!1),y=(0,r.iH)(!1),{result:k,loading:U,onResult:h}=(0,d.aM)(c.Mt,{id:t.params.id}),D=(0,i.Fl)((()=>k.value?.facility)),{onResult:Z}=(0,d.aM)(u.en,{},{fetchPolicy:"no-cache"});Z((async e=>{y.value=!!e.data?.me?.settings?.find((e=>e.setting.code===u.Lm.VerifiedUser))?.value}));const{mutate:S,onDone:F}=(0,d.Db)(u.GN,{variables:{id:t.params.id,type:u._F.Facility}}),{mutate:$,onDone:b}=(0,d.Db)(u.mI,{variables:{id:t.params.id,type:u._F.Facility}}),x=(0,i.Fl)((()=>({NODE_ENV:"production",BASE_URL:"/"}.VUE_APP_CDN?k?.value?.facility?.media?.map((e=>`${{NODE_ENV:"production",BASE_URL:"/"}.VUE_APP_CDN}${e?.path}`)):[]))),{result:E}=(0,d.aM)(u.Y_,{id:t.params.id}),I=(0,i.Fl)((()=>E?.value?.reviews?.data.reduce(((e,t)=>(e.push({id:t.id,date:t.created_at,rating:t.score||0,text:t.review,avatarUrl:t.author?.avatarUrl||"",fullName:`${t.author?.first_name} ${t.author?.last_name}`}),e)),[]))),N=()=>{g.value?$():S()},P=()=>{a.push({name:m.N.FacilitySubscription})},{role:q}=(0,w.Z)();h((()=>{k?.value?.facility?.is_followed&&(g.value=k?.value?.facility?.is_followed)})),F((()=>{g.value=!0})),b((()=>{g.value=!1}));const M=(0,i.Fl)((()=>{const e=JSON.parse(localStorage.getItem("user")||"")?.owned_facilities||[];return e.find((e=>e.id===t.params.id))&&(q===u.g8.OrganizationOwner||q===u.g8.FacilityOwner||q===u.g8.Manager)})),O=async()=>{const e=await s.BO.create({mode:"ios",buttons:[{text:"Delete gym",role:"destructive",data:{type:p.DeleteGym}},{text:"Edit gym",data:{type:p.EditGym}},{text:"Cancel",role:"cancel"}]});await e.present()};return(e,t)=>(0,r.SU)(U)?((0,i.wg)(),(0,i.j4)((0,r.SU)(s.PQ),{key:0,name:"lines",class:"spinner"})):((0,i.wg)(),(0,i.j4)(o.Z,{key:1,"edit-button":M.value,name:D.value?.name??"","photos-url":x.value,likes:D.value?.positive_reviews_count||0,"total-rating":D.value?.score||0,dislikes:D.value?.negative_reviews_count||0,"is-followed":g.value,address:D.value?.address?.street??"","button-text":"Buy","is-trusted":y.value,"advantages-title":"Equipment",onHandleFollow:N,onHandleBook:P,viewAllLink:(0,r.SU)(m.N).FacilityReviews,onHandleEdit:O},{info:(0,i.w5)((()=>[(0,i._)("div",f,(0,n.zw)(D.value?.description),1)])),reviews:(0,i.w5)((()=>[(0,i.Wm)(v.Z,{reviews:I.value},null,8,["reviews"])])),advantages:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(D.value?.equipments,(e=>((0,i.wg)(),(0,i.j4)(_.Z,{key:e.id,icon:e?.iconUrl||"",title:e?.name||""},null,8,["icon","title"])))),128))])),_:1},8,["edit-button","name","photos-url","likes","total-rating","dislikes","is-followed","address","is-trusted","viewAllLink"]))}}),y=a(83744);const k=(0,y.Z)(g,[["__scopeId","data-v-08118191"]]);var U=k}}]);
//# sourceMappingURL=9870.febf5d41.js.map