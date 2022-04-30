const imgPath = $('#posts-list-container').attr('likeImgPath');

// central notification function

    let noty = function(text,type){
        new Noty({
            theme: 'relax',
            text: text,
            type: type,
            layout: 'topRight',
            timeout: 1500
            
        }).show();
    }


    // method to send post create request via ajax

   let createPost = function(){
       let newPostForm = $('#new-post-form');
       newPostForm.submit(function(event){
           event.preventDefault();
           $.ajax({
            type: 'POST',
            url: '/posts/create',
            data:newPostForm.serialize(),
            success: function(data){
                let newPost = newPostDom(data.data.post,data.data.user_name,data.data.user_id);
                $('#posts-list-container>ul').prepend(newPost);
                noty(data.data.noty_text,'success')
                new ToggleLike($('.toggle-like-button',newPost));
                new CommentForm($('.addComment',newPost));
                new DeleteItem($('.delete-button',newPost));
            },
            error: function(){
                console.log(error.responseText);
            }
        })
       });
   } 

//    method to create a post in DOM
   let newPostDom = function(post,user_name,user_id){
       return $(`<li id="post-${post._id}">
                <a id='button-${post._id}' href='/posts/destroy/${post._id}' class="delete-button">X</a> 
                <a href='/users/profile/${user_id}'>
                    <p>${user_name}</p>
                </a>
            <p>${ post.content }</p>
            
            <small>
            <a class='toggle-like-button' likes-count=${post.likes.length} href='likes/toggle/?id=${post._id}&type=Post'>
                <img src=${imgPath} class='likeButtonWhite'>
                0 Likes 
            </a>
            </small>

            <div class="post-comments">
                    <form action="/comments/create" id='new-comment-form' method="post" class="addComment">
                        <input type="text" name="content"  class="input" placeholder="Type your comment here...">
                        <input type="hidden" name="post" value='${ post._id}'>
                        <input type='submit' value="Add comment" class="button">
                    </form> 

            </div> 
            <div class="post-comments-list">
                <ul id="post-comments-${ post._id }">
                    
                </ul>
            </div>
        </li>`)
   }

   createPost();
