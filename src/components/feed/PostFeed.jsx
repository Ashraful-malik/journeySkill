import PostCard from "../cards/PostCard";
const PostFeed = () => {
  const posts = [
    {
      content:
        "I am doing a 30 days challenge to improve my coding skills. Each day, I am dedicating time to learn new concepts and apply them in small projects. It's been a rewarding experience so far and I'm excited to see my progress by the end of the challenge.",
      image:
        "https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2F0ZWxsaXRlJTIwaW1hZ2VzfGVufDB8fDB8fHww",
      link: "https://google.com",
    },
    {
      content:
        "I just finished a coding challenge and I'm feeling super proud of myself. The challenge was to create a simple web page with a form that accepts user input and displays it on the page. It was a lot of fun and I learned a lot from it.",
      image:
        "https://images.unsplash.com/photo-1731337583916-ff5e392e6275?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "https://google.com",
    },
    {
      content:
        "I've been doing a coding challenge for a week now and I'm really starting to feel the benefits. My code is getting cleaner and more efficient, and I'm having a lot of fun with it.",
      image:
        "https://images.unsplash.com/photo-1726199029699-e314218e852d?q=80&w=1370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "https://google.com",
    },
    {
      content:
        "I'm doing a coding challenge to learn more about machine learning. I'm using a dataset to train a model and it's been really interesting to see how the model improves over time.",
      image:
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "https://google.com",
    },
    {
      content:
        "I'm doing a coding challenge to learn more about front-end development. I'm building a simple web page with a form that accepts user input and displays it on the page. It's been a lot of fun and I've learned a lot from it.",
      image:
        "https://images.unsplash.com/photo-1732740674513-63afb262a988?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "https://google.com",
    },
  ];
  return (
    <div className="flex-1 max-w-2xl mx-auto ">
      <div>
        {posts.map((post, idx) => (
          <PostCard
            key={idx}
            content={post.content}
            link={post.link}
            image={post.image}
          />
        ))}
      </div>
    </div>
  );
};

export default PostFeed;
