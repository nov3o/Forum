/*
This is simple forum. This is my Bootstrap preactise and jQuery and other web things reminding.
Im using jQuery, Bootstrap 4 and other its frameworks.
You can create topics and replies in it. All posts adding into JSON and saving to localStorage. 
You can also delete all posts and hide topics
*/


// HTML content of top bar
topBar = '<div class="container-fluid bg-primary clearfix m-0 p-0" id="topBar"><h1 class="display-1 p-4 text-primary float-left">Disgussion</h1><button class="btn btn-primary text-primary m-5 float-right""><h5 class="display-4 p-0 m-0">New topic</h5></button></div>'

// HTML content of topic form
formNode = '<form id="topic-form" class="border p-2 rounded d-block w-50"><button type="submit" class="btn mb-2" onclick="closeForm(this)">Close form</button><div class="input-group mb-2"><input type="text" class="form-control name" placeholder="Author"><input type="text" class="form-control title" placeholder="Title"></div><div class="form-group mt-2"><textarea class="form-control text" placeholder="Text"></textarea></div><button type="submit" class="btn btn-primary" onclick="postTopic(this)">Create topic</button></form>'

/* Short time function */
function now() {
	dt = new Date()
	return dt.toDateString() + ' ' + dt.toLocaleTimeString()
}

/* Logo fixes on top when you scroll down */
$(document).on('scroll', function () {
	if ($(document).scrollTop() == 0) {
		/* If screen on top of page, properties(like height, width, etc) of elements inside of bar are changing */
		// Bar becomes unfixed
		$('#logo').removeClass('fixed-top')
		$('#logo h5').addClass('display-4')
		$('#logo h1').attr('class', 'display-1 p-4 text-light float-left')
		$('#logo button').attr('class', 'btn btn-light text-primary float-right m-5')
		// Artificial big top bar disapears
		$('#topBar').remove()
	}
	else {
		/* When screen not on top, appears artificial block with size of big top bar, top bar become smaller */
		// Fixes on top
		$('#logo').addClass('fixed-top')
		$('#logo h5').removeClass('display-4')
		$('#logo h1').attr('class', 'p-2 m-0 text-light float-left')
		$('#logo button').attr('class', 'btn btn-light text-primary float-right m-3 p-1')
		// If there no artificial bar, it appearrs
		if ($('#topBar').length < 1) {
			$('body').prepend(topBar)
		}
	}
})

/* We insert values in post or topic stringified node */
function values2Node(name, title, time, number, text, post_status) {
	/* Define color and margin values. Depends on post status 
	   Replies has margin-left and has bootstrap 'info' color. Topics has 'primary' */
	if (post_status == 'topic') {
		color = 'primary'
		margin = ' mt-4'
		// HTML content of Peply|Hide buttons. There is button only on topic posts, on replies there no
		buttonNode = '<div class="btn-group nav-item"><button type="button" class="btn btn-primary text-light"  onclick="openReplyForm(this)">Reply</button><button type="button" class="btn btn-primary text-light reply-button" onclick="checkForHide(this)">Hide</button></div>'
	}
	else {
		color = 'info'
		margin = ' ml-3 mt-1'
		buttonNode = ''
	}
	// We put values into HTML content string and get node, that could be included into DOM
	stringNode = '<div class="bg-light border border-' + color + ' rounded' + margin + ' post"><div class="clearfix border-bottom border-' + color + ' post-header"><nav class="navbar navbar-expand p-0 pl-2"><span class="navbar-text mr-2 mb-0"><h4 class="m-0">' + name + '</h4></span><span class="navbar-text mr-2 mb-0 border-left border-' + color +' pl-2"><h4 class="m-0">' + time +'</h4></span><span class="navbar-text mr-2 mb-0 border-left border-primary pl-2 d-none"><h4 class="m-0 post-id">' + number +'</h4></span>' + buttonNode + '</nav></div><div class="post-body"><h1 class="px-2">' + title + '</h1><h4 class="px-2">' + text + '</h4></div></div>'
	return stringNode
}

/* Function for onclick event. Removes topic form */
function closeForm(button) {
	$(button).parent().remove()
}


/* Creates topic form. Checks is there from in document. If there no, function creates it */
function openTopicForm() {
	if ($('#topic-form').length == 0) {
		$('div.container').prepend(formNode)
	}
}

/* Function opens reply form(that just like topic, but has one more input - topic number, but disabled) 
   after topic post */
function openReplyForm(topicPost) {
	// Getting post-id fom topic post
	number = $(topicPost).parent().prev().text()
	// If reply-form in document and in uther topic, form reopens in current topic. If in current topic, does nothin
	if ($('#reply-form').length != 0) {
		if ($('#reply-form').prev().find('.post-id').text() != number) {
			$('#reply-form').remove()
		}
		else {
			return
		}
	}
	// Getting form reply node with HTML content string with inserted post-id as value into disabled input 
	replyNode = '<form id="reply-form" class="border p-2 mt-1 ml-3 rounded d-block w-50"><button type="submit" class="btn mb-2" onclick="closeForm(this)">Close form</button><div class="input-group mb-2"><input type="text" class="form-control name" placeholder="Author"><input type="text" class="form-control title" placeholder="Title"></div><div class="form-group mt-2"><textarea class="form-control text" placeholder="Text"></textarea></div><input type="text" value="' + number + '"" class="number d-none"><button type="submit" class="btn btn-primary" onclick="postReply(this)">Reply</button></form>'
	// Adds after topic post
	$(topicPost).parents('.post').after(replyNode)
}

/* Function creates new topic with'Submit' button handling */
function postTopic(button) {
	form = $(button).parent()
	// Geiting current last post-id
	number = data.postCount.toString()
	// Increasing of number of posts
	data.postCount += 1
	// Creating and filling post object
	postObject = {
		"name": $(form).find('.name').val(),
		"title": $(form).find('.title').val(),
		"text": $(form).find('.text').val(),
		"number": parseInt(number),
		"time": now()
	}
	/* Setting data.topics[id] object with info and posts. */
	data.topics[number] = {}
	data.topics[number].info = postObject
	data.topics[number].posts = []
	/* Getting string topic post node, form removing, adding new topic and saving updated data to localeStorage */
	topicNode = values2Node(postObject.name, postObject.title, postObject.time, number, postObject.text, 'topic')
	$(form).parent().prepend('<div class="topic">' + topicNode + '</div>')
	$(button).parent().remove()
	localStorage.setItem('data', JSON.stringify(data))
}

// Almost the same as postTopic()
function postReply(button) {
	form = $(button).parent()
	// var number is topic id, str; postObject attr "number" its post id, int
	number = $(form).find('.number').val()
	postObject = {
		"name": $(form).find('.name').val(),
		"title": $(form).find('.title').val(),
		"text": $(form).find('.text').val(),
		"number": data.postCount,
		"time": now()
	}
	data.postCount += 1
	// Pushing new reply object to posts atribute of current topic
	data.topics[number].posts.push(postObject)
	replyNode = values2Node(postObject.name, postObject.title, postObject.time, postObject.number, postObject.text, 'post')
	/* Adding to end of topic and form removing */
	$(form).parent().append(replyNode)
	$(button).parent().remove()
	localStorage.setItem('data', JSON.stringify(data))
}

function reset() {
	data = {}
	data.postCount = 0
	data.topics = {}
	hidden = []
}

/* All data removing and resetting. Deleting of posts */
function clearData() {
	localStorage.removeItem('data')
	localStorage.removeItem('hidden')
	reset()
	localStorage.setItem('data', JSON.stringify(data))
	localStorage.setItem('hidden', JSON.stringify(hidden))
	$('.container').children().remove()
}

/* Toggling of text inside button. Hiding of post-body and other posts in topic */
function hiding(button) {
	if ($(button).text() == 'Hide') {
		$(button).text('Show')
	}
	else {
		$(button).text('Hide')
	}
	post = $(button).parents('.post')
	$(post).find('.post-body').toggleClass('d-none')
	$(post).find('.post-header').toggleClass('border-bottom')
	$(post).parent().children().toggleClass('d-none')
	$(post).toggleClass('d-none')
}

/* Function check if number of topic in array of hidden topics. Then send updated array to localeStorage.
   Next sends buttonn DOM object to function that hides topic */
function checkForHide(button) {
	number = parseInt($(button).parents('.navbar').find('.post-id').text())
	index = hidden.indexOf(number)
	if (index !== -1) {
		hidden.splice(index, 1)
	}
	else {
		hidden.push(number)
	}
	localStorage.setItem('hidden', JSON.stringify(hidden))
	hiding(button)
}

// On click on 'Delete all posts' button modal dialogue appears
function openDeleteModal() {
	$('#delete-modal').modal('show')
}

$(document).ready(function () {
	/* Bootstrap tooltip */
	$('[data-toggle="tooltip"]').tooltip({trigger: "hover"}) 
	$('[data-toggle="tooltip"]').tooltip()

	// Initializing of data after page loading from localeStorag 
	data = JSON.parse(localStorage.getItem('data'))
	hidden = JSON.parse(localStorage.getItem('hidden'))
	/* Does nothing if there no posts */
	if (data) {
		// Loop for topic inserting
		for (t in data.topics) {
			data.topics[t]
			/* Getting general values of topic post, getting string node and adding in beggining of topic-list */
			topicObject = data.topics[t].info
			topicNode = values2Node(topicObject.name, topicObject.title, topicObject.time, topicObject.number, topicObject.text, 'topic')
			$('.container').prepend('<div class="topic">' + topicNode + '</div>')
			topicDOMNode = $('.topic').first()
			// Loop for reply inserting
			for (p in data.topics[t].posts) {
				replyObject = data.topics[t].posts[p]
				replyNode = values2Node(replyObject.name, replyObject.title, replyObject.time, replyObject.number, replyObject.text, 'post')
				topicDOMNode.append(replyNode)
			}
			// If id of topic post in 'hidden' array, topic hides
			if (hidden.indexOf(topicObject.number) !== -1) {
				hiding($(topicDOMNode).find('.reply-button'))
			}
		}
	}
	// if there no data, we need to reset, mean to init empty vars to prevent 'data/hidden is null' error
	else {
		reset()
	}
})