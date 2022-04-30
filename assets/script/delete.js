class DeleteItem {
    constructor(deleteButton) {
        this.deleteButton = deleteButton;
        this.delete()
    }

    delete() {
        $(this.deleteButton).click(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: "GET",
                url: $(self).attr("href"),
            }).done(function(response){
                let id;
                let idString;
                const{noty_text} = response.data;
                if(response.data.post_id){
                    idString = 'post'
                    id = response.data.post_id
                }else{
                    id = response.data.comment_id;
                    idString = 'comment'
                }
                $(`#${idString}-${id}`).remove();
                noty(noty_text,'success');
            }).fail(function(err){
                noty(response.data.noty_text,'error')
                console.log('error in completing request');
            });
        })
    };

}
