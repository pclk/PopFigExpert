# Intro

PopFigExpert presentation

- Hello [guests], welcome to my presentation on PopFigExpert

# Agenda of Presentation

Background
Project scope
Scrape process
LLM Discovery
Web app
Demo
Improvements
Learning takeaway

- To start off, we will talk about my background.
- Then, our project's scope and deliverables
- Our scraping process
- LLM Discovery,
- Development of our Web app
- A quick demo of our web app
- Potential improvements to our deliverables
- and the learning takeaway from this project

# Background

- Student in Nanyang Polytechnic
- Under course of Applied AI & Analyticss
- I only have experience with python and jupyter notebook at the time
- The only web app I developed was with flask.
- Absent Javascript knowledge

# Project scope (& deliverable)

- Build a web app
- Powered by Mistral AI
- To Search and discover
- Political Press Statements and Profiles

# Scrape

- For both press statements, which is articles, and profile, which is articles
- they use python and requests
- However, for articles, we also use beautifulsoup because we're scraping from the website HTML
- For profile, we use the Everypolitician and WikiData API.

# Scrape - Articles

- show the image
- go to data structure

# Scrape - Profile

- show the image
- do to data structure

# Scrape - Challenges

- bad retrieval, the id sucks
- go into website
- solution was to deal with it
- found everypolitician, which contains the Pid and Qid.
- still had to use Wikidata API to enrich the data.

# LLM experimentation

- List the options
- I chose Mistral large

# LLM experimentation - Mistral

- Its open weights, meanning CSIT can run on premise
- they need to do it because their workspace cannot connect to internet
- they have a intranet instead, which will run an on premise LLM of their own
- Supports function calling
- smart enough to use for this project.

# LLM experimentation - Challenges

- function call didn't work for mistral
- apparently they were having maintenance
- after 1 week, i tried again and it works

# Web app architecture

# Design choices - framework

- I have no clue what framework to start
- My mentor limits my option
- I wanted to try sveltekit
- CSIT uses react though
- She let me choose between React and Next.js
- I choose Next.js cuz its cooler

- Thinking back
- It really suited my project
- Its basically easier to work with, cuz its designed for full-stack
- What i would describe it as, would be this:
- React is a phone with just a home screen, and you have to download your camera app, file app and whatever apps you want
- This means that you have the flexibility, and its suited for advanced users who know what they're doing
- Next.js is a apple phone, with full functionality and integration
- You can use their built in best in class camera, but you also can install other camera apps.
- In the end, its the balance between customizability vs ease that you're choosing.

# Design choices - stying

- I first used Mantine, heard really good reviews on it
- I used it to set up my homepage with the side navbar and the header, works quite well
- However, I didn't like the fact that it uses padding to position the element, instead of say flexbox
- So i tried to fix it. it was so much work and i couldn't do it
- I just rewrote the entire code in tailwind, and never looked back since.

# Demo

- Your boss give you a job, to research more about ASEAN diplomatic relations
- You go to the web app, and start chatting with eve
- She returns the results you want. But you want a summary
- So you summarize
- You take this and put inside your report and submit to boss
- Boss say good job, and give you a raise
- Now you upgraded to research about the succeeding prime minister of Singapore Lawerence Wong
- You do the same thing.
- You get the same results
- Now you upgraded to senior engineer and can search using the article and profile search
- You set the date, search queries for Singapore AI in article search to look for new job.
- You get results, and find the minister [xxx] who talks about it
- You search for his name in profile search
- You go and copy paste this and ask him to write a letter of recommendation for you.
- The end

# Web app - Challenges

# What can be improved?

CRUD prompt templates
Integrate Clerk for auth
Bring searched documents into the chat.
ChatHistory with DB integration

- Create Retrieve Update Delete prompt templates, as of now, not able to do that.
- Integrate Clerk for auth, which allows us for multitenancy, and to
- do ChatHistory with DB integration unique to each user.
- Bring manually searched documents into chat, to link these two part tgt

# Learnings and Takes

- Increased productivity under pressure.
  - I had to rush through the project at the very end
  - I got the template and wikidata scraping to web app all done in a day
- AI skills is better with SWE skills
  - You can create models with AI, in your notebook.
  - But most people won't see your model's worth in your notebook.
  - If you can build an app to pitch your model, you going far more places.
  - Say I built an model that predicts the price of house.
  - Most people cannot understand my notebook, and its just another generic science project.
  - But if I built a real estate website that uses my model to predict house prices, think about it.
- Best way to learn is to start doing
  - As i've said, I have no javascript experience
  - Yet I've developed quite a solid AI web app.
  - I wouldn't be able to do this by just reading documentation.
  - If I followed the academic path of doing tests and assignments, it would take 6 months to reach this level.
  - Now I can probably say, im the best at next.js compared to my entire course.
  - Insanely useful, because I can show my lecturers during presentation, a real production app based on it.
  - I can show to stakeholders in my startup a quick demo of whatever im selling.

# Thank you

- Thank you yai hui, your team, and CSIT for teaching me
- I would also like to thank my great friends for their company and the fun times we had together.
- Once again, I'm wei heng, do you have any questions for me?
