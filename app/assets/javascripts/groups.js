$(function(){
  var preName;
  var preFunc;

  function searchUserResult(users) {
    var html = '';
    $.each(users, function(index, user) {
      html += '<div class="chat-group-user clearfix">' +
                '<p class="chat-group-user__name">' +
                  user.name +
                  '<span class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="' + user.id + '" data-user-name="' + user.name + '">' +
                    '追加' +
                  '</span>' +
                '</p>' +
              '</div>';
    });
    return html;
  }

  function addUserList(id, name){
    var html = '<div class="chat-group-user clearfix" id="chat-group-user-' + id + '">' +
                 '<input type="hidden" name="group[user_ids][]" value="' + id + '">' +
                   '<p class="chat-group-user__name">' +
                     name +
                     '<span class="user-search-remove chat-group-user__btn chat-group-user__btn--remove" data-user-id="' + id + '">' +
                       '削除' +
                     '</span>' +
                   '</p>' +
               '</div>';
    return html;
  }

  $('#user-search-field').on('keyup', function() {
    var name = $(this).val();

    // 入力されたキーワードからユーザ名で検索をかける
    var ajaxSearch = function(){
      $.ajax({
        type: 'GET',
        url: '/users.json',
        data: {
          keyword: name
        }
      })
      .done(function(data) {
        var html = searchUserResult(data);
        $('#user-search-result').html(html);
      });
    };

    // 500ミリ秒の入力待機時間あるとajaxSearch実行
    if (name != preName && name.length !== 0){
      clearTimeout(preFunc);
      preFunc = setTimeout(ajaxSearch, 500);
    }
    preName = name;
  });

  // 「追加」ボタンを押すとリストに追加
  $(document).on('click', '.user-search-add', function(){
    var id = $(this).data('user-id');
    var name = $(this).data('user-name');
    $(this).parent().hide();
    var html = addUserList(id, name);
    $('#chat-group-users').append(html);
  });

  // 「削除」ボタンを押すとリストから消す
  $(document).on('click', '.user-search-remove', function(){
    var id = $(this).data('user-id');
    $('.user-search-add[data-user-id=' + id + ']').parent().show();
    $(this).parent().remove();
  });
});
