"use strict";(self["webpackChunkspotter"]=self["webpackChunkspotter"]||[]).push([[3318],{98654:function(e,a,t){t.d(a,{Mt:function(){return r},qn:function(){return n}});var i=t(17283);i.ZP`
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
`,r=i.ZP`
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
`},70362:function(e,a,t){t.r(a),t.d(a,{default:function(){return x}});t(57658);var i=t(66252),n=t(2262),r=t(3577),l=t(31810),s=t(19239),o=t(88218),u=t(23582),d=t(10121),v=t(54354),c=t(33200),_=t(36019),m=t(61081),w=t(83782),p=t(49316),g=t(87794),f=t(22201),k=t(98654);const h={class:"rating ion-padding-horizontal"},y={class:"rating-star"},b={class:"rating-star__title"},Z={class:"tabs-holder"},$={class:"content ion-padding-horizontal"},U={key:1};var P=(0,i.aZ)({__name:"Reviews",setup(e){const a=(0,f.yj)(),t=[{name:g.dX.Recent,label:"Recent"},{name:g.dX.Positive,label:"Positive"},{name:g.dX.Negative,label:"Negative"}],P=(0,n.iH)(g.dX.Recent),W=e=>{P.value=e},D=()=>{w.Z.push({name:m.N.WriteReview,params:{id:a.params.id}})},x=()=>{w.Z.go(-1)},{result:F,loading:R,refetch:z}=(0,p.aM)(g.Y_,(()=>({id:a.params.id,type:g.pP.Facility,review_type:P.value})));(0,i.bv)((()=>{z()}));const I=(0,i.Fl)((()=>F?.value?.reviews?.data.reduce(((e,a)=>(e.push({id:a.id,date:a.created_at,rating:a.score||0,text:a.review,avatarUrl:a.author?.avatarUrl||"",fullName:`${a.author?.first_name} ${a.author?.last_name}`}),e)),[]))),{result:N,loading:S}=(0,p.aM)(k.Mt,{id:a.params.id}),T=(0,i.Fl)((()=>N.value?.facility)),j=(0,i.Fl)((()=>T.value?.was_visited_by_me&&!T.value?.was_commented_by_me)),q=(0,i.Fl)((()=>T.value?.positive_reviews_count&&T.value?.negative_reviews_count&&T.value?.score?(T.value?.positive_reviews_count+T.value?.negative_reviews_count)/T.value?.score*100:0));return(e,a)=>{const m=(0,i.up)("ion-spinner");return(0,i.wg)(),(0,i.j4)(d.Z,null,{header:(0,i.w5)((()=>[(0,i.Wm)(s.Z,{onBack:x,"back-btn":"",title:"Reviews"})])),content:(0,i.w5)((()=>[(0,n.SU)(S)?((0,i.wg)(),(0,i.j4)(m,{key:0,name:"lines",class:"spinner"})):((0,i.wg)(),(0,i.iD)(i.HY,{key:1},[(0,i._)("div",h,[(0,i._)("div",y,[(0,i._)("span",b,(0,r.zw)(T.value?.score),1),(0,i.Wm)(o.Z,{"model-value":T.value?.score||0,size:"medium"},null,8,["model-value"]),(0,i.Wm)((0,n.SU)(l.yW),{color:"medium",class:"rating-star__reviews"},{default:(0,i.w5)((()=>[(0,i.Uk)(" based on "+(0,r.zw)(T.value?.reviews_count)+" reviews ",1)])),_:1})]),(0,i.Wm)(u.Z,{likes:T.value?.positive_reviews_count||0,total:T.value?.reviews_count||0,dislikes:T.value?.negative_reviews_count||0,progressValue:q.value},null,8,["likes","total","dislikes","progressValue"])]),(0,i._)("div",Z,[(0,i.Wm)(v.Z,{tabs:t,class:"page-tabs ion-padding-horizontal",value:P.value,onChange:W},null,8,["value"]),(0,i._)("div",$,[(0,n.SU)(R)?((0,i.wg)(),(0,i.j4)(m,{key:0,name:"lines",class:"spinner"})):((0,i.wg)(),(0,i.iD)("div",U,[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(I.value,(e=>((0,i.wg)(),(0,i.j4)(c.Z,{key:e.id,class:"review-item","avatar-url":e.avatarUrl,"full-name":e.fullName,date:e.date,rating:e.rating,text:e.text},null,8,["avatar-url","full-name","date","rating","text"])))),128))]))])])],64))])),footer:(0,i.w5)((()=>[(0,i.Wm)(_.Z,{title:T.value?.name||"",location:T.value?.address?.street||""},(0,i.Nv)({_:2},[j.value?{name:"button",fn:(0,i.w5)((()=>[(0,i.Wm)((0,n.SU)(l.YG),{expand:"block",color:"primary",class:"fixed-holder__button",onClick:D},{default:(0,i.w5)((()=>[(0,i.Uk)(" Add review ")])),_:1})])),key:"0"}:void 0]),1032,["title","location"])])),_:1})}}}),W=t(83744);const D=(0,W.Z)(P,[["__scopeId","data-v-80fd9cf2"]]);var x=D}}]);
//# sourceMappingURL=3318.3279bf27.js.map