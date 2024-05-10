const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const mongooseUrl = "mongodb://localhost:27017/PostsDB";
DbConnect();
async function DbConnect() {
	try {
		await mongoose.connect(mongooseUrl);
		console.log("DB connection successful");
	} catch (error) {
		console.error("Error: " + error);
	}
}

const postSchema = new mongoose.Schema({
	Title: {
		type: String,
		required: true,
	},
	Paragraph: {
		type: String,
		required: true,
	},
});

const Post = mongoose.model("Post", postSchema);

const homeStartingContent =
	"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const aboutContent =
	"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const contactContent =
	"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
	const posts = await Post.find();

	content = {
		startingContent: homeStartingContent,
		post: posts,
	};

	res.render("home", content);
});

app.get("/about", (req, res) => {
	content = {
		startingContent: aboutContent,
	};
	res.render("about", content);
});
app.get("/contact", (req, res) => {
	content = {
		startingContent: contactContent,
	};
	res.render("contact", content);
});

app.get("/compose", (req, res) => {
	res.render("compose");
});

app.post("/compose", async (req, res) => {
	const { titleComposition, textComposition } = req.body;

	// Basic validation
	if (!titleComposition || !textComposition) {
		return res.status(400).send("Title and text are required.");
	}

	try {
		const posti1 = new Post({
			Title: titleComposition,
			Paragraph: textComposition,
		});

		await posti1.save();

		res.redirect("/");
	} catch (error) {
		console.error("Error: " + error);
		res.status(500).send("Internal Server Error");
	}
});

app.get("/posts/:postId", async function (req, res) {
	const toBeFoundId = req.params.postId;
	try {
		const theFoundOne = await Post.findOne({ _id: toBeFoundId });
		if (!theFoundOne) {
			// Handle case when post is not found
			return res.status(404).send("Post not found");
		}
		res.render("post", theFoundOne);
	} catch (error) {
		console.error("Error: " + error);
		res.status(500).send("Internal Server Error");
	}
});

app.listen(3000, function () {
	console.log("Server started on port 3000");
});
