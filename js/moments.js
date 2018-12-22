//实现逻辑
//一，上拉加载部分
//1.页面首次加载执行一次加载函数 请求第一页数据 渲染10条
//2.触发下拉加载执行一次加载函数 如何还有数据 最多追加渲染10条信息
//3.如果没有更多数据提示没有更多数据



$(function(){
  //页面滚动
  mui('.mui-scroll-wrapper').scroll({
          deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
  //图片预览功能开启
  mui.previewImage();


  var page = 1;
  mui.init({
    pullRefresh: {
      container: '#pullrefresh',
      up: {
        auto:true,//默认执行一次
        contentrefresh: '正在加载...',
        contentnomore:'没有更多数据了',
        callback: pullupRefresh(page)//上拉加载执行的函数
      }
    }
  });

  function pullupRefresh(page){
    var page = page;
    console.log("pullupRefresh");
    //this.endPullupToRefresh(true);
    return addData;
  }


  function addData(){
    var that = this;
    Mock.mock("http://123.com?page="+page,{
      "page":page,
      "status|1-3":2,
      "data|10":[
        {
          'm_id|+1':1,
          'userName': '@cname',  // 用户名称
          'userPortrait|1': ["img/portrait-1.png","img/portrait-2.png","img/portrait-3.png","img/portrait-4.png","img/portrait-5.png"],   //用户头像
          "content":"@csentence(12)",//发布内容
          "picUrl|1-6":["img/banner"+'@natural(1,3)'+".jpg"],
          "comment|1-5":[
            {
              "commentUserName":"@cname",//评论人名称
              "commentContent":"@csentence(12)"//评论内容
            }
          ],
          "date":'@date()'
        }
      ]
    })
    $.ajax({
      type: "get",
      url: "http://123.com",
      data: {
        page:page++
      },
      dataType: "json",
      success: function (res) {
        console.log(res);
        if(res.status == 3){
          that.endPullupToRefresh(false);
          that.endPullupToRefresh(true);
          return;
        }
        setTimeout(() => {
          var html = template("moments-tpl",res)
          $(".moments-wrap").append(html)
          that.endPullupToRefresh(false);
        }, 500);
      }
    });
  }




  document.addEventListener("tap",function(e){
    var $dom = $(e.target);
    console.log($dom.context.nodeName,)
    if($dom.context.className == "js-reply-ctrl mui-icon mui-icon-chatboxes"){
      if(!$dom.data("comment")){
        $dom.parents(".moments-comment").children(".comment-textarea").show();
        $dom.data("comment",true);
        return;
      }else if($dom.data("comment")){
          $dom.parents(".moments-comment").children(".comment-textarea").hide();
          $dom.data("comment",false);
          return;
      }
    }else if($dom.context.className == "js-reply mui-btn mui-btn-blue mui-pull-right"){
        //console.log($dom.context.className);
        //清除所有的空格
      var content = ($dom.siblings("textarea").val()).replace(/\s/g,'');
      if(content == ""){
        mui.alert("请输入内容！！");
        return;
      }
      var username = $dom.data("username"),
          html = `<p><span class="username">${username}</span>
                    ${content}
                  </p>`;
      //插入评论
      $dom.parents(".moments-comment").children(".comment-list").append(html);
      //清空输入框 并隐藏
      $dom.siblings("textarea").val("").parent().hide().siblings(".comment")
      .children(".js-reply-ctrl").data("comment",false);

      //把评论的内容发送给后台
      $.ajax({
        type: "post",
        url: "接口地址是啥？？？？",
        data: {
          content:content//评论内容
        },
        dataType: "json",
        success: function (res) {
          console.log(res)
        }
      });
    }else if($dom.context.nodeName == "A"){
      window.location.href = $dom.attr("href");
    }


  })

})