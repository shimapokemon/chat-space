$(function(){
  function buildHTML(message){
    console.log(message.image);
    var image = message.image ? `<img src=${message.image}>` : "";


    var html = 
              `<div class="message" data-message-id=${message.id}>
                  <div class="upper-message">
                    <div class="upper-message__user-name">
                      ${message.user_name}
                    </div>
                    <div class="upper-message__date">
                      ${message.date}
                    </div>
                  </div>
                  <div class="lower-message">
                    <p class="lower-message__content">
                      ${message.content}
                    </p>  
                  </div>        
                  ${image} 
                  </div>  
                </div>`
    return html;
  };

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(message){
      var html = buildHTML(message);
      $('.messages').append(html);
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast'); 
      $('form')[0].reset();
    })
    .fail(function(){
      alert('メッセージを入力してください。');
    })
    return false;
  })

  var reloadMessages = function() {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
      var last_message_id = $(`.message:last`).data("message-id");
      // binding.pry
      $.ajax({
      url: "api/messages",      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      type: 'get',      //ルーティングで設定した通りhttpメソッドをgetに指定
      dataType: 'json',
      data: {last_id: last_message_id}     //dataオプションでリクエストに値を含める
      })
    .done(function(messages) {
      var insertHTML = '';      //追加するHTMLの入れ物を作る

      messages.forEach(function (message) {//配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        console.log('キタキタ');
        insertHTML = buildHTML(message);//メッセージが入ったHTMLを取得
        $('.messages').append(insertHTML); //メッセージを追加
      console.log('success');
      })
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');//最新のメッセージが一番下に表示されようにスクロールする。
    })
    .fail(function() {
      alert('自動更新に失敗しました');//ダメだったらアラートを出す
      console.log('error');
    });
    }
  };
    setInterval(reloadMessages, 5000);
});
