class ToggleLike{constructor(t){this.toggler=t,this.toggleLike()}toggleLike(){$(this.toggler).click((function(t){t.preventDefault();let e=this;$.ajax({type:"GET",url:$(e).attr("href")}).done((function(t){const l=$(e).attr("href"),i=l.lastIndexOf("=");let o;o="Comment"===l.substring(i+1)?$("#posts-list-container").attr("likeImgPath1"):$("#posts-list-container").attr("likeImgPath");let s,n=parseInt($(e).attr("likes-count"));!0===t.data.deleted?(n-=1,s="likeButtonWhite"):(n+=1,s="likeButtonBlue"),$(e).html(`<img src=${o} class=${s}>${n} Likes`),$(e).attr("likes-count",n)})).fail((function(t){console.log("error in completing request")}))}))}}