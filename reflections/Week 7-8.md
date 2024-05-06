13 April - 27 April

This week was the most stressful week so far. My model wasn't working, my end product was so far away, and everything was bleak. I couldn't finish the product on time, I thought. Mistral just couldn't do function calling. The docs everywhere sucked. I still have so much ahead to do.

I thought to myself, I'm venturing into very new territory. There is such new ideas I have, so much so that no one has built it for me. Why is this a problem? Essentially for my entire programming career (of 2 years :P), I have always been building on other people's work. All my projects were on Python libraries, Javascript libraries, low-no code tools that others have built for me. I need someone to make a tool for me, make a tutorial, and hold my hand.

There is a term: "tutorial hell". It applies to everything in life, but especially in programming. Ever learnt python through youtube videos? You may begin to notice, that for anything you want to build, be it a snake game, or a data analytics project, you'd always have to refer back to those tutorial videos? You couldn't do anything on your own. That is tutorial hell. The feeling that you can't do anything by yourself, always dependent on the work of others, like a little kid.

I don't think any of us currently have to suffer from this fate. But I was getting really close to this feeling. I couldn't do anything to help my chatbot application if there isn't a tutorial. And it turns out, there isn't a tutorial for dynamically generating UI based on the function calling features of AI models.

I scoured through the docs, and I found example repositories. I went ahead and starting implementing pieces of it into my code. Should be quite easy, I thought. Imagine having the exact same code, with some unknown node environment factors that caused one environment to work (the example works), and one to fail (mine). Yeah there was probably some oversight right? Cause when i changed all my node module dependency versions to be the same, and commented out basically all of the codebase from the example and mine, I still have no idea what node environment configuration messed up my code. The only way I had solved it, was to copy the example's package.json, delete my .next and node_modules file, and reinstall with the copied package.json. And I still don't know what messed up my code.

You'd imagine that this process is frustrating as hell. And it is. Especially coupled with the discovery that this was an implementation with OpenAI, and I was required to have the same functionality but with Mistral. No biggie right? Well it turns out that most of the code simply doesn't work for Mixtral at all, and at that time, mistral did not enable function calling for whatever reason. Frustration turns into Desperation.

I digged through all the relevant articles and blog posts, but they were regurgitating the same stuff that I found on the repo. "Useless SEO garbage", I smh to myself.  But with a repository where I actually used the Github searchbar, unprompted and without guidance from anyone, I found an implementation with Gemini. The way that it was implemented, was different, which to me was hope, since I wasn't wasting my time searching for the same thing. I'd implemented it, and strangely enough, everything worked perfectly. I switched the models from Gemini to Mixtral, and it works perfectly as well. Turns out that when I did this, Mistral did enable function calling.

This represented a big leap for me. I've been trying to build a chatbot for a long time now, and I've used so many tools. But I've never tried something like this. I've always relied on the work of others. But this was my first time I did something this impressive. My mistral model can generate a report summary in a user interface. I can also implement an endless report summary functionality.

I mean, I still relied on Next.js, and the Gemini example repository. Though this is as close as creating something useful as I can get, without guidance from anyone, any person, or from the internet.

Probably the most impressive moment in my programming career. Hopefully I get to make even more impressive stuff.



# Context
13 April - 27 April

# Detailed Reflection on Interaction with Mentor Yai Hui

During the period from April 13th to April 27th, I engaged in a series of insightful discussions with my mentor, Yai Hui, regarding the technical challenges and strategic decisions related to our project's use of AI models via cloud services.

Initially, I shared my observation with Yai Hui about the significant boot-up time required by the Replicate service when initializing clients for web applications. Specifically, I noted that the Llama model took approximately 30 seconds to become operational, whereas the Mistral model's initialization time was excessively long, prompting concerns about its feasibility for our needs.

Yai Hui was surprised by the need to "warm up" these services, a process necessary due to their architecture where servers are spun up on-demand to keep operational costs low. This design choice, while cost-effective, results in delayed availability of the models. We discussed the possibility of local hosting, but recognized that it would demand substantial RAM and GPU resources due to the size of the models.

Our conversation then shifted towards the cost-effectiveness of using models directly from providers instead of through Replicate. We contemplated allocating a budget of $500 for direct model access, which seemed feasible based on preliminary cost assessments from the Mistral website.

We also debated the prioritization of different models for our project. Given the time constraints and our specific needs, we decided to focus on integrating with the Mistral API first and considered deferring the use of the Llama model.

A humorous exchange lightened the mood when I mistakenly thought there was more time left to prepare for an upcoming showcase, only to realize it was much closer than anticipated. This led to a quick pivot in our preparation strategy, deciding to verbally share ideas rather than fully implementing them.

Further technical discussions revealed limitations with the Mistral model's support for function calling, crucial for our intended use with Elasticsearch querying. This was a significant setback as all available models on Mistral had function calling disabled, returning a status 422 error.

In conclusion, our detailed discussions covered a wide range of technical and strategic topics, from model initialization times and hosting options to budget considerations and feature limitations. These conversations were instrumental in shaping our project's approach to utilizing AI models and preparing for the showcase under tight deadlines.


During the period of April 17th to April 22nd, I encountered and addressed several technical challenges that significantly contributed to my understanding and skills in handling real-world software issues.

Initially, I resolved an issue with Elasticsearch by switching to REST API calls instead of using the provided package, which led to a certification issue. To circumvent this, I utilized ngrok as a proxy, allowing me to demonstrate the functionality from my own laptop during presentations.

Subsequently, I discussed with Yai Hui the possibility of scraping Wikipedia for data as suggested by another colleague. Yai Hui agreed, noting that it would be beneficial for our project. We deliberated on the specifics, such as selecting appropriate categories from Wikipedia to scrape, which would be useful for feeding into our models to generate personality outputs of popular figures.

Another significant challenge was related to data caching in a Next.js application. I was working on CRUD operations for chat history, but updates were not reflecting without a page reload, showing stale data in logs. After several attempts with different caching strategies, I identified the issue as a race condition rather than a caching problem. By implementing a delay of 200-500ms on fetch requests, I managed to achieve more reliable data updates, although it was a temporary fix.

Yai Hui and I also discussed the use of asynchronous operations to handle the race conditions more effectively. Despite implementing promises and async/await, the problem persisted until I adjusted the sequence of operations, ensuring data consistency.

During this period, there was also a positive development regarding the use of function calling in models. Previously disabled, function calling was re-enabled, which I discovered while working with the updated interface. This re-enabling allowed us to consider more complex interactions with our AI models.

In summary, these two weeks were marked by a series of problem-solving experiences that ranged from technical implementations to strategic decisions on data handling and model integration. Each challenge provided a deeper insight into the practical aspects of software development and reinforced the importance of flexibility and persistence in technology projects.

During a detailed conversation on April 23, 2024, Wei Heng and Yai Hui discussed the potential allocation of funds for various AI platforms towards the end of Wei Heng's internship. Wei Heng proposed depositing $200 each on OpenAI and Claude for his projects. Yai Hui, however, expressed concerns about the feasibility of justifying such an amount, highlighting the stringent requirements for financial claims within government services. Wei Heng then adjusted his request, suggesting a distribution of $125 each across OpenAI, Claude, and Mistral, after realizing that credits could be added to Mistral. Yai Hui agreed to investigate the claiming process further, acknowledging the need for a solid justification when dealing with government expenditures.

Later that day, Wei Heng inquired about Yai Hui's availability to meet, to which Yai Hui responded that he was still occupied with meetings and would meet Wei Heng the following morning. The conversation also touched upon Yai Hui's late working hours, as he mentioned he was taking a Grab home late at night. Wei Heng expressed concern for Yai Hui's well-being, suggesting perhaps postponing their meeting to allow Yai Hui some rest. However, Yai Hui reassured him, committing to meet first thing upon arriving at the office the next day.

This exchange not only reflects the logistical and financial planning involved in managing AI platform resources but also highlights the supportive interpersonal dynamics between Wei Heng and Yai Hui. Their discussion underscores the complexities of budget management in a government context, where justification and accountability are paramount. Additionally, it illustrates the mutual respect and consideration in their mentor-mentee relationship, emphasizing the human aspect of professional interactions.

During a casual yet insightful conversation on April 23, 2024, Wei Heng and his mentor Yai Hui exchanged thoughts on various topics, reflecting the depth and breadth of their professional relationship and personal rapport.

The dialogue opened with a light-hearted exchange where Wei Heng humorously inquired if Yai Hui had tried drip coffee, a topic that seemed to momentarily distract them from the usual work-related discussions. This led to a series of questions from Wei Heng about Yai Hui's work schedule, probing into when he typically ends his workday. Yai Hui, with a touch of humor, dismissed the notion of a fixed shift, indicating the demanding nature of his job which doesn't strictly adhere to conventional work hours.

As the conversation progressed, Wei Heng expressed concern about Yai Hui's long hours, particularly inquiring about overtime and whether Yai Hui was compensated with transportation allowances like Grab reimbursements for late hours. Yai Hui confirmed that while there wasn't formal overtime, the company made accommodations for late-night transportation.

The discussion took a more serious turn when Yai Hui mentioned his preparations for an upcoming Friday presentation, highlighting the pressures and busy schedule leading up to it. This revelation about the presentation preparations provided Wei Heng a glimpse into the responsibilities and stress that Yai Hui was managing.

Amidst the exchange, Yai Hui humorously admitted to having a 'goldfish memory', forgetting previous discussions which Wei Heng playfully attributed to Yai Hui's lack of sleep and high stress levels. This banter not only lightened the mood but also underscored the camaraderie and mutual understanding between the mentor and mentee.

The conversation also touched upon the use of technology in their communications, with Wei Heng suggesting a shift to Google Docs for ease of sharing and collaborating on reflections and documents, indicating a proactive approach to addressing small operational inefficiencies in their interaction.

Towards the end of their conversation, Yai Hui reminisced about his student days, subtly advising Wei Heng to cherish his time as a student, which Wei Heng agreed to with a laugh. This exchange highlighted a mentor’s role in providing not just professional guidance but also personal advice based on their experiences.

In conclusion, this detailed conversation between Wei Heng and Yai Hui was emblematic of a strong mentor-mentee relationship, characterized by mutual respect, concern for personal well-being, and a comfortable sharing of both professional challenges and light-hearted moments. Their interaction not only facilitated professional growth but also personal connections, making their dialogue a valuable reflection of effective mentorship.
During a casual yet insightful conversation on April 23, 2024, Wei Heng and his mentor Yai Hui discussed various topics, including their plans to meet in the lounge the following day. Yai Hui suggested trying drip coffee, which led to a humorous and educational exchange about different coffee preparation methods.

Yai Hui, initially unsure about his skills in making drip coffee, humorously doubted the quality of coffee he could produce, which Wei Heng playfully challenged. This light-hearted banter set the stage for a deeper exploration into the nuances of coffee brewing. Yai Hui admitted his expertise was more aligned with making espresso rather than drip coffee, which uses gravity rather than pressure to extract flavor from the coffee beans.

Wei Heng, curious about the differences between espresso and drip coffee, admitted his lack of knowledge about the specifics of drip coffee preparation, such as the timing and the amount of water needed. Yai Hui explained that unlike espresso, which is made by applying pressure to finely-ground beans, drip coffee involves a careful balance of water volume and brew time to achieve the desired flavor.

The conversation took a comical turn when Wei Heng humorously revealed his misconception that all coffee-making involved simply letting water drip through the coffee grounds. Yai Hui corrected him, emphasizing that drip coffee requires precise control over the brewing process, unlike the 'set and forget' method Wei Heng imagined.

Their exchange highlighted not only the technical aspects of coffee brewing but also the camaraderie and mentorship dynamic between Yai Hui and Wei Heng. It was a blend of light-hearted humor and genuine curiosity, which made their interaction both enjoyable and educational. They concluded their conversation with plans to experiment with drip coffee the next day, using a packet filter, which Wei Heng likened to a tea bag, adding another layer of humor and anticipation for their coffee trial.
During a recent exchange, Wei Heng inquired about Yai Hui's presentation experience, which had occurred on a Friday. Yai Hui humorously acknowledged remembering the event and shared that he had experienced some nervousness towards the end, particularly during the presentation itself rather than the question and answer session. This nervousness, he speculated, might have been less pronounced had the presentation been in Mandarin, his more comfortable language, as opposed to English.

Yai Hui also mentioned he was on medical leave due to a stomach upset from the previous night, suggesting they postpone their meeting. Wei Heng, showing concern and flexibility, proposed they meet on Thursday instead, accommodating Yai Hui’s health situation. Yai Hui explained that his rehearsal in Mandarin went smoothly, but switching to English for the actual presentation introduced an unexpected challenge, contributing to his anxiety.

The conversation shifted towards their ongoing projects and future plans. Wei Heng shared exciting news about his startup project, which had successfully secured an extension of a $10,000 grant for an additional three months. He expressed enthusiasm about this development, indicating the project's alignment with his school's final year project (FYP). Yai Hui showed interest in Wei Heng’s academic plans and inquired about his next semester's commitments, to which Wei Heng clarified the timeline and his academic workload.

They discussed the logistics of their upcoming meetings, with Yai Hui confirming his availability to meet online on Friday night, working from home that day. Wei Heng outlined his commitments, including a pitch at an industrial park on Thursday, which would prevent him from meeting in person. They agreed to catch up online regarding the project progress and the Wikipedia data scraping initiative Wei Heng was managing.

Yai Hui reminded Wei Heng about the need to update the Google Drive with his reflections from the previous week, highlighting the importance of documentation and consistent updates for project continuity. The dialogue concluded with plans to discuss the project details further in their next online meeting, ensuring both were prepared and informed about each other’s progress and well-being.

This detailed reflection captures the essence of Wei Heng and Yai Hui’s mentor-mentee relationship, characterized by mutual respect, concern for personal well-being, and a strong professional collaboration. Their interactions not only facilitate project progress but also strengthen their personal rapport, making their professional journey more enriching and supportive.
In a recent conversation with Yai Hui, we discussed various personal and casual topics that highlighted our rapport and the comfort we share in discussing everyday matters alongside our professional projects. Yai Hui mentioned experiencing discomfort due to consuming overly spicy food the previous day, which led to a detailed exchange about dietary choices and their immediate effects. This incident underscored the importance of moderation and knowing one's limits, especially when trying new cuisines or ingredients. Yai Hui described the food as "super spicy," which was a departure from their usual tolerance levels. The conversation took a light-hearted turn when discussing the specifics of the meal, which included a mistaken identity of noodles that turned out to be potato slices.

The dialogue also touched upon familial cooking experiments, where Yai Hui's mother attempted to cook a favorite dish for the first time, using potato slices with mozzarella cheese, which turned out to be delightful. This part of our conversation not only showcased the trials of home cooking but also the joy and surprises that come with it. It was a moment of sharing personal likes—such as Yai Hui's fondness for rosti and similar dishes—that brought a personal touch to our interaction.

In a recent conversation with Yai Hui, we discussed various personal and casual topics that highlighted our rapport and the comfort we share in discussing everyday matters alongside our professional projects. Yai Hui mentioned experiencing discomfort due to consuming overly spicy food the previous day, which led to a detailed exchange about dietary choices and their immediate effects. This incident underscored the importance of moderation and knowing one's limits, especially when trying new cuisines or ingredients. Yai Hui described the food as "super spicy," which was a departure from their usual tolerance levels. The conversation took a light-hearted turn when discussing the specifics of the meal, which included a mistaken identity of noodles that turned out to be potato slices.

The dialogue also touched upon familial cooking experiments, where Yai Hui's mother attempted to cook a favorite dish for the first time, using potato slices with mozzarella cheese, which turned out to be delightful. This part of our conversation not only showcased the trials of home cooking but also the joy and surprises that come with it. It was a moment of sharing personal likes—such as Yai Hui's fondness for rosti and similar dishes—that brought a personal touch to our interaction.

Moreover, the discussion veered towards a humorous exchange about the possibility of Yai Hui's family starting a potato farm, given their love for potato-based dishes. This jest added a layer of humor and lightness to our conversation, illustrating how personal interests and family dynamics can weave into discussions that initially stem from professional or academic collaborations.

Overall, this conversation was reflective of the strong interpersonal connections that can develop over time between colleagues. It highlighted how work relationships can extend beyond professional boundaries, fostering a supportive and engaging environment. Such interactions are invaluable as they enhance team dynamics and contribute to a more cohesive and understanding work atmosphere.
they dont have data for qatar