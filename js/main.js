function createElemWithText( html = "p", textContent = "", className = null )
{
	var element = document.createElement( html );
	element.textContent = textContent;
	if( className ) { element.className = className; }
	return element;
}

function createSelectOptions( users )
{
	if( typeof users === "undefined" || !users ) { return undefined; }
	else
	{
		var array = [];
		users.forEach(user => {
			var element = document.createElement("option");
			element.id = user.id;
			element.value = user.id;
			element.textContent = user.name;
			array.push( element );
		});
		return array;
	}
}

function toggleCommentSection( postId )
{
	if( typeof postId === "undefined" ) { return undefined; }
	else
	{
		var element = document.body.querySelector('section[data-post-id="' + postId + '"]');
		if( !element ) { return null; }
		else
		{
			element.classList.toggle("hide");
			return element;
		}
	}
}

function toggleCommentButton( postId )
{
	if( typeof postId === "undefined" ) { return undefined; }
	else
	{
		var element = document.body.querySelector('button[data-post-id="' + postId + '"]');
		if( !element ) { return null; }
		else
		{
			element.textContent = element.textContent == "Show Comments" ? "Hide Comments" : "Show Comments";
			return element;
		}
	}
}

function deleteChildElements( parentElement )
{
	if( typeof parentElement === "undefined" ) { return undefined; }
	else
	{
		if( !parentElement.tagName ) { return undefined; }
		else
		{
			var child = parentElement.lastElementChild;
			while (child) {
				parentElement.removeChild(child);
				child = parentElement.lastElementChild;
			}
			return parentElement;
		}
	}
}

function addButtonListeners()
{
	var buttons = document.querySelectorAll("main button");
	if( buttons.length )
	{
		buttons.forEach(button => {
			button.addEventListener("click", function(event) {
				toggleComments( event, button.dataset.postId );
			});
		});
	}
	return buttons;
}

function removeButtonListeners()
{
	var buttons = document.querySelectorAll("main button");
	if( buttons.length )
	{
		buttons.forEach(button => {
			button.removeEventListener("click", function(event) {
				toggleComments( event, button.dataset.postId );
			});
		});
	}
	return buttons;
}

function createComments( comments )
{
	if( typeof comments === "undefined" ) { return undefined; }
	else
	{
		var fragment = document.createDocumentFragment();
		comments.forEach(comment => {
			var article = document.createElement("article");
			var h3 = createElemWithText('h3', comment.name);
			var p = createElemWithText('p', comment.body);
			var mail = createElemWithText('p', `From: ${comment.email}`);
			article.appendChild(h3);
			article.appendChild(p);
			article.appendChild(mail);
			fragment.appendChild(article);
		});
		return fragment;
	}
}

function populateSelectMenu( users )
{
	if( typeof users === "undefined" ) { return undefined; }
	else
	{
		var menu = document.getElementById("selectMenu");
		var options = createSelectOptions( users );
		options.forEach(option => {
			menu.appendChild(option);
		});
		return menu;
	}
}

async function getUsers()
{
	try {
		var response = await fetch("https://jsonplaceholder.typicode.com/users");
		return response.json();
	} catch (error) {
		return undefined;
	}
}

async function getComments()
{
	try {
		var response = await fetch("https://jsonplaceholder.typicode.com/comments");
		return response.json();
	} catch (error) {
		return undefined;
	}
}

async function getUserPosts( user_id )
{
	if( typeof user_id === "undefined" ) { return undefined; }
	else
	{
		try {
			var response = await fetch("https://jsonplaceholder.typicode.com/posts?userId=" + user_id);
			return response.json();
		} catch (error) {
			return undefined;
		}
	}
}

async function getUser( user_id )
{
	if( typeof user_id === "undefined" ) { return undefined; }
	else
	{
		try {
			var response = await fetch("https://jsonplaceholder.typicode.com/users/" + user_id);
			return response.json();
		} catch (error) {
			return undefined;
		}
	}
}

async function getPostComments( postId )
{
	if( typeof postId === "undefined" ) { return undefined; }
	else
	{
		try {
			var response = await fetch("https://jsonplaceholder.typicode.com/posts/" + postId + "/comments");
			return response.json();
		} catch (error) {
			return undefined;
		}
	}
}

async function displayComments( postId )
{
	if( typeof postId === "undefined" ) { return undefined; }
	else
	{
		var section = document.createElement("section");
		section.dataset.postId = postId;
		section.classList.add("comments", "hide");
		var comments = await getPostComments(postId);
		var fragment = createComments(comments);
		section.appendChild( fragment );
		return section;
	}
}

async function createPosts( posts )
{
	if( typeof posts === "undefined" ) { return undefined; }
	else
	{
		var fragment = document.createDocumentFragment();
		for (var post of posts) 
		{
			var article = document.createElement("article");
			var post_title = createElemWithText('h2', post.title);
			var post_body = createElemWithText('p', post.body);
			var post_id = createElemWithText('p', `Post ID: ${post.id}`);
			var author = await getUser(post.userId);
			var author_p = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
			var company_catch = createElemWithText('p', author.company.catchPhrase);
			var button = document.createElement("button");
			button.textContent = "Show Comments";
			button.dataset.postId = post.id;
			article.appendChild(post_title);
			article.appendChild(post_body);
			article.appendChild(post_id);
			article.appendChild(author_p);
			article.appendChild(company_catch);
			article.appendChild(button);
			fragment.appendChild(article);
			var section = await displayComments(post.id);
			article.appendChild(section);
		}
		return fragment;
	}
}

async function displayPosts( posts )
{
	if( typeof posts === "undefined" ) { return createElemWithText("p", "Select an Employee to display their posts.", "default-text"); }
	else
	{
		var fragment = document.createDocumentFragment();
		var element = await createPosts(posts);
		fragment.appendChild( element );
		var main = document.querySelector("main");
		main.appendChild( fragment );
		return fragment;
	}
}

function toggleComments( event, postId )
{
	if( typeof event === "undefined" || typeof postId === "undefined" ) { return undefined; }
	else
	{
		event.target.listener = true;
		var a = toggleCommentSection(postId);
		var b = toggleCommentButton(postId);
		return [a, b];
	}
}

async function refreshPosts( posts )
{
	if( typeof posts === "undefined" ) { return undefined; }
	else
	{
		var buttons = removeButtonListeners();
		var main = deleteChildElements( document.querySelector("main") );
		var fragment = await displayPosts( posts );
		var addButtons = addButtonListeners();
		return [buttons, main, fragment, addButtons];
	}
}

async function selectMenuChangeEventHandler(event)
{
	var userId = typeof event === "undefined" ? 1 : event.target.value || 1;
	var posts = await getUserPosts( userId );
	var refreshPostsArray = await refreshPosts( posts );
	return [userId, posts, refreshPostsArray];
}

async function initPage()
{
	var users = await getUsers();
	var select = populateSelectMenu( users );
	return [users, select];
}

function initApp()
{
	initPage();
	document.getElementById("selectMenu").addEventListener("change", function(event){
		selectMenuChangeEventHandler(event);
	});
}

document.addEventListener("DOMContentLoaded", function(){ initApp(); });
