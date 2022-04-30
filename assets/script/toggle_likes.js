class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike(){

        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;
            

            $.ajax({
                type: "GET",
                url: $(self).attr("href")
            }).done(function(data){
                const urlString = $(self).attr("href");
                const index = urlString.lastIndexOf("=");
                const type = urlString.substring(index+1)
                let path
                if (type === "Comment"){
                    path = $('#posts-list-container').attr('likeImgPath1');
                }else{
                    path = $('#posts-list-container').attr('likeImgPath');
                }
                let likesCount = parseInt($(self).attr("likes-count"));
                let colour
                if(data.data.deleted === true){
                    likesCount -= 1;
                    colour = 'likeButtonWhite'
                }else{
                    likesCount += 1;
                    colour = 'likeButtonBlue'
                }

                $(self).html(`<img src=${path} class=${colour}>${likesCount} Likes`)
                $(self).attr("likes-count", likesCount)

            }).fail(function(err){
                console.log('error in completing request');
            });
        });
    }
}