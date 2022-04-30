const imgPath1 = $('#posts-list-container').attr('likeImgPath1');

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


class CommentForm {
    constructor(form) {
        this.form = form;
        this.addComment();
    }

    addComment() {
        $(this.form).submit(function(e) {
            e.preventDefault();
            let form = $(this);

            $.ajax({
                type: "POST",
                url: "/comments/create",
                data: form.serialize()
            }).done(function(response) {
                const {comment,noty_text} = response.data;
                let newComment = newCommentDom(comment);
                $(`#post-comments-${comment.post}`).prepend(newComment);
                noty(noty_text,'success');
                new DeleteItem($('.delete-button',newComment));
                new ToggleLike($('.toggle-like-button',newComment));
            }).fail(function(err){
                noty(response.data.noty_text,'error');
                console.log('error in completing request');
            });
        })
    }
}

let newCommentDom = (comment) => {
    return $(`<li id='comment-${comment._id}'>
            <a id='button-${comment._id}' href='/comments/destroy/${comment._id}' class="delete-button">X</a>  

        <a href="/users/profile/${comment.user._id}">
            <small> ${comment.user.name} </small>
        </a>
        <p> ${comment.content} </p>

        <small>
                <a class='toggle-like-button' likes-count=${comment.likes.length} href='likes/toggle/?id=${comment._id}&type=Comment'>
                    <img src=${imgPath1} class='likeButtonWhite'>
                    ${comment.likes.length} Likes 
                </a>
        </small>
    
    </li>`)
}
