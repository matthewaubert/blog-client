# Blog Client Notes

## Assignment
> Ref: https://www.theodinproject.com/lessons/nodejs-blog-api

1. Begin by designing your back end models and schemas. How you design it is up to you, but you might want to think through a few things:
   - For a blog with only a single author you might not need a user model, but you might want to set up authentication so that you can protect the editing functions with a username and password. In that case, it might make sense to set up a minimal user model, even if you are the only user.
   - Your blog should have posts and comments, so think about the fields you are going to want to include for each of those.
   - Are you going to require users to leave a username or email with their comments?
   - Are you going to display a date or a timestamp for posts and comments?
Posts should probably have a title, but should comments?
   - A useful feature for a blog is the ability to have posts that are in the database but not published for the public to read. How might you designate published vs unpublished posts in your DB?
2. Set up your express app, and define the models in mongoose.
3. Set up your routes and controllers! Think about RESTful organization for this one. Most of the examples in the previous lesson were centered around posts and comments so this shouldn’t be too tricky.
   - You can test your routes however you want. Using curl in a terminal is one handy way, but it can be just as effective to use a web browser. There are some platforms that allow you to send PUT and POST requests without needing to set up and fill out HTML forms. Postman is probably the most popular.
4. Once your API is working you can focus on your front-end code. Really, how you go about this is up to you. If you are comfortable with a front-end framework then go for it! If you’re happier using plain HTML and CSS that’s fine too. All you should have to do to get your posts into a website is to fetch the correct API endpoint and then display the results. Working with fetch and APIs from a front-end perspective is covered in this lesson
5. Create a second website for authoring and editing your posts. You can set this up however you like but the following features might be useful:
   - A list of all posts that shows whether or not they have been published.
   - A button to publish unpublished posts, or to unpublish published ones!
   - A ‘NEW POST’ form. If you want to get fancy, you could use a rich text editor such as TinyMCE.
   - The ability to manage comments (i.e. delete or edit them).
6. How much work you want to put into the front-end code on this one is up to you. - Technically this is a back-end focused course so if you don’t actually need or want a blog on your website feel free to focus mainly on getting a REST API up and running.

## 5/2/24

To do:
- [x] [Create a new React app](https://gist.github.com/matthewaubert/e809ae8ccfe41442bb588b3c49d9c63d)

## 5/4/24

To do:
- [x] Fetch Posts from API for homepage

## 5/5/24
To do:
- [x] Build PostThumbnail component

## 5/6/24

To do:
- [x] Build Header component
  - [x] Set shadow to appear/disappear on scroll
  - [x] Build DropdownMenu

## 5/7/24

To do:
- [x] Fetch Categories list from API for nav menu
- [x] Implement React Router
  - [x] Install, set up, and configure
  - [x] Create routes for signup, login, logout, Users, Posts, and Categories links
- [x] Close DropdownMenu when user clicks a link or outside of menu

## 5/8/24

To do:
- [x] Modify API endpoints to support querying resources by slug

## 5/9/24

To do:
- [x] Create page for individual Posts
- [x] Create page for individual Users
- [x] Create page for individual Categories
- [x] Create signup page

## 5/10/24

To do:
- [ ] Signup Page
   - [x] Enable User signup
   - [x] Navigate to login page after signup
   - [x] Show success message after signup, before navigation

## 5/11/24

To do:
- [x] Signup Page
  - [x] Enable immediate form validation
  - [x] Show form submission errors

## 5/13/24

To do:
- [x] Refactor Form to separate component?
- [x] Login Page

## 5/14/23

To do:
- [x] Create Auth context and enable logout
- [x] Decode token and store in app AuthProvider context
- [x] Memoize AuthProvider

## 5/16/24

To do:
- [x] Display comments on PostPage
  - Anyone can see comments

## 5/18/24

To do:
- [x] Create form to write comments
  - Only users who are logged in can make new comments
  - If not logged in, include a message explaining you need to be logged in to write comments
- [x] Style
  - [x] Layout
  - [x] Colors
  - [x] Make responsive
  - [x] Choose typeface
- [x] Create splash page
- [x] Choose name

## 5/19/24

To do:
- [x] Develop `LoadingIndicator`
- [x] Develop error page
- [x] Clean up, comment out console.logs
- [x] Adjust Splash height to account for mobile browsers with address bar
- [x] Deploy
  - [x] Back end
  - [x] Front end
- [x] Write a bit in README

## 5/24/24

To do:
- [x] Refactor Form to optionally take fields
- [x] Create BecomeAuthor page to trigger verification email

## 5/25/24

To do:
- [x] Create VerifyEmail page to send verification JWT

## 5/28/24

To do:
- [x] Research rich-text editors and choose one
  - **TinyMCE**
  - ~~TipTap~~
  - ~~CSEditor~~
  - ~~Quill~~
  - ~~Slate~~
  - ~~react-markdown~~
  - [Rich Text Editor](https://richtexteditor.com/)
- [x] Create account and go through setup

## 6/1/24

To do:
- [ ] Configure editor
- [ ] Serve up API key from back end
