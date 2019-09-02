$(document).on('turbolinks:load', function() {

var search_list = $("#user-search-result");
function appendProduct(user) {
  var html = `<div class="chat-group-user clearfix">
                <p class="chat-group-user__name">${user.name}</p>
                <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</div>
              </div>`
  search_list.append(html);
  }
  
  function appendErrMsgToHTML(msg) {
    var html = `<li>
                  <div class='chat-group-user clearfix'>${ msg }</div>
                </li>`
    search_list.append(html);
  }

  var member_list = $("#chat-group-user");

  function addUser(id,name) {
    var html = `<div class='chat-group-user'>
                <input name='group[user_ids][]' type='hidden' value='${ id }'>
                <p class='chat-group-user__name'>${ name }</p>
                <div class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</div>
              </div>`
    member_list.append(html);
      }

  $(".chat-group-form__input").on("keyup", function() {
    var input = $(this).val();
    $.ajax({
      type: 'GET',
      url: '/users',
      data: { keyword: input },
      dataType: 'json'
    })

    .done(function(users) {
      $("#user-search-result").empty();
      if (users.length !== 0) {
        users.forEach(function(user){
          appendProduct(user);
        });
      }
      else {
        appendErrMsgToHTML("一致する名前はありません");
      }
    })
    .fail(function(){
      alert('検索に失敗しました');
    });
  });
  $(document).on("click", ".chat-group-user__btn--add", function () {
      var userId = $(this).data('user-id');
      var userName = $(this).data('user-name');
      $(this).parent().remove();
      addUser(userId,userName);
    });
    $(document).on("click", ".user-search-remove", function () {
      $(this).parent().remove();
    });
});
