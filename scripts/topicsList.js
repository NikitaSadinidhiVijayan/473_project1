(function(window) {
    'use strict';

    var App = window.App || {};
    var $ = window.jQuery;

    function TopicsList(selector, db) {
        if (!selector) {
            throw new Error('No selector provided');
        }

        this.db = db;

        this.$element = $(selector);
        if (this.$element.length === 0) {
            throw new Error('Could not find element with selector: ' + selector);
        }
    }

    TopicsList.prototype.addRow = function(TopicSubmission) {
        // Create a new instance of a row, using the coffee order info
        var rowElement = new Row(TopicSubmission, this.db);

        // Add the new row instance's $element property
        this.$element.append(rowElement.$element);
    };

    TopicsList.prototype.removeRow = function(email) {
        this.$element.find('[value="' + email + '"]').closest('[data-coffee-order="checkbox"]').remove();
    };

    function Row(TopicSubmission, db) {

        var $div = $('<div></div>', {
            'post-topic': 'topiclist',
            'class': 'list-group-item'

        });

        //Create labels
        var $descriptionLabel = $('<label></label>');
        var $likeLabel = $('<label for="likeLabel"></label>');
        var $dislikeLabel = $('<label for="dislikeLabel"></label>');

        //initializes like/dislike labels
        $likeLabel.text(TopicSubmission.likes);
        $dislikeLabel.text(TopicSubmission.dislikes);

        var description = TopicSubmission.course + ':&emsp;' + TopicSubmission.topic;

        //Create like/dislike buttons

        //<button type='button' class='btn btn-primary btn-xs'>Button1</button>
        //$('<input type="button" class="likeBtn" value="Like" name="likeBtn" id="defaultLikeBtnID"/>');
        var $likeBtn = $('<button type="button" class="btn btn-success">Like</button>');

        var $space = $('<span> &emsp;&emsp;&emsp;</span>');

        var $dislikeBtn = $('<button type="button" class="btn btn-danger">Dislike</button>');

        //Create new id for the like/dislike buttons
        var newLikeButtonID = TopicSubmission.topic.replace(/[^a-z0-9\s]/gi, '');
        newLikeButtonID = newLikeButtonID.replace(/\s/g, '') + '_like';
        var newDislikeButtonID = TopicSubmission.topic.replace(/[^a-z0-9\s]/gi, '');
        newDislikeButtonID = newDislikeButtonID.replace(/\s/g, '') + '_dislike';

        console.log('like id: ' + newLikeButtonID);

        //Give the new id for the like/dislike buttons
        $($likeBtn).attr('id', newLikeButtonID);
        $($dislikeBtn).attr('id', newDislikeButtonID);

        //When a like button is clicked
        $(document).on('click', '#' + $($likeBtn).attr('id'), function() {
            var obj;
            obj = db.get(TopicSubmission.topic);
            // var modal_pop = true;
            $('#myModal').modal('show');
            // write a code to check if the entered email_id already in DB
            $('#emailsubmit').on('click', function() {
                var email = $('#sender-name').val();
                console.log(obj);
                console.log(obj.email.length);
                if(obj.email.length != 0){
                  var test = obj.email.includes(email);
                }
                //var test = obj.email.includes(email);
                if (test) {
                    alert("email already exist");
                    // var message= "";
                    // message = emailAddress + ' is not an authorized email address!';
                    // event.target.setCustomValidity(message);
                    console.log(true);
                } else {
                    obj.email.push(email);
                    console.log(TopicSubmission.topic);
                    db.remove(TopicSubmission.topic);

                    obj.likes = parseInt(obj.likes) + 1;

                    $likeLabel.text(obj.likes);

                    db.add(obj);

                    console.log(false);
                }

            })

            //db.remove(TopicSubmission.topic);

            //obj.likes = parseInt(obj.likes) + 1;

            //$likeLabel.text(obj.likes);

            //db.add(obj);

            /* Experimental
                        $.ajax({
                            url: SERVER_URL,
                            type: 'PUT',
                            dataType: 'json',
                            success: function(data) {
                                console.log('Load was performed.');
                            }
                        });
            */
        });

        //When a dislike button is clicked
        $(document).on('click', '#' + $($dislikeBtn).attr('id'), function() {
            var obj;
            obj = db.get(TopicSubmission.topic);

            db.remove(TopicSubmission.topic);

            obj.dislikes = parseInt(obj.dislikes) + 1;

            $dislikeLabel.text(obj.dislikes);

            db.add(obj);
        });

        $descriptionLabel.append(description);

        $div.append($descriptionLabel);

        $div.append($likeBtn);
        $div.append($likeLabel);
        $div.append($space);
        $div.append($dislikeBtn);
        $div.append($dislikeLabel);

        this.$element = $div;
    }


    App.TopicsList = TopicsList;
    window.App = App;
})(window);
